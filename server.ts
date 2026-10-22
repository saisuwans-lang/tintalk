import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

const app = express();
app.use(express.json());

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Region label lookup helper
function getRegionThaiName(region: string): string {
  switch (region) {
    case 'north':
      return 'ภาษาเหนือ (คำเมือง/ล้านนา)';
    case 'isan':
      return 'ภาษาอีสาน (ไท-ลาว)';
    case 'south':
      return 'ภาษาไทยถิ่นใต้ (ภาษาปักษ์ใต้)';
    default:
      return 'ภาษาถิ่นไทย';
  }
}

// Helper to call Gemini with timeout
async function generateTranslationWithTimeout(
  promptText: string,
  modelName: string,
  timeoutMs: number = 8000
): Promise<string> {
  if (!ai) throw new Error('AI client not initialized');

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('AI request timeout')), timeoutMs)
  );

  const apiPromise = ai.models.generateContent({
    model: modelName,
    contents: promptText,
    config: {
      systemInstruction:
        'คุณคือผู้เชี่ยวชาญภาษาถิ่นไทย ตอบเป็น JSON เท่านั้น ถ้าไม่แน่ใจให้บอกว่าไม่แน่ใจ ห้ามแต่งคำขึ้นเอง',
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const response = await Promise.race([apiPromise, timeoutPromise]);
  return response.text || '{}';
}

// API endpoint: /api/translate
app.post('/api/translate', async (req: Request, res: Response) => {
  const { text, region, direction } = req.body || {};
  const isThaiToDialect = direction === 'th_to_dialect';
  const regionName = getRegionThaiName(region || 'north');

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'กรุณาระบุข้อความที่ต้องการแปล' });
    return;
  }

  if (!ai) {
    // Graceful response if API key is not configured
    res.json({
      found: false,
      uncertain: true,
      thai: isThaiToDialect ? text : 'คำค้นหา',
      dialect: isThaiToDialect ? 'ไม่พบในคลัง' : text,
      pronunciation: '-',
      meaning: 'ระบบ AI ไม่ได้เปิดใช้งานในขณะนี้ กรุณาค้นหาคำในคลังคำศัพท์ Tin Talk หรือเลือกคำจากตัวอย่าง',
      example: '-',
      exampleThai: '-',
      notes: 'คลังข้อมูล Tin Talk มีคำศัพท์มาตรฐานพร้อมใช้งานกว่า 105 คำ',
      source: 'ai',
      isServiceBusy: false,
    });
    return;
  }

  const promptText = `แปลคำหรือข้อความต่อไปนี้: "${text}"
ทิศทางการแปล: ${isThaiToDialect ? 'ภาษาไทยมาตรฐาน (กลาง) -> ' + regionName : regionName + ' -> ภาษาไทยมาตรฐาน (กลาง)'}
ภาคเป้าหมาย: ${regionName}

ข้อกำหนดสำคัญ:
1. คุณคือผู้เชี่ยวชาญภาษาถิ่นไทย ตอบเป็น JSON เท่านั้น ถ้าไม่แน่ใจให้บอกว่าไม่แน่ใจ ห้ามแต่งคำขึ้นเอง
2. คืนผลลัพธ์เป็น JSON Object ที่มีฟิลด์ดังนี้:
{
  "found": true/false (พบคำแปลที่ถูกต้องจริงในภาษานั้นหรือไม่),
  "uncertain": true/false (ถ้าไม่แน่ใจให้ใส่ true),
  "thai": "คำภาษาไทยมาตรฐาน (กลาง)",
  "dialect": "คำภาษาถิ่นที่แปลได้",
  "pronunciation": "คำอ่านออกเสียงเขียนด้วยอักษรไทย พร้อมระบุสำเนียง/วรรณยุกต์",
  "meaning": "ความหมายภาษาไทยกลางที่ชัดเจน ละเอียด กระชับ",
  "example": "ตัวอย่างประโยคการใช้ในชีวิตประจำวัน (ภาษาถิ่น)",
  "exampleThai": "คำแปลของตัวอย่างประโยคเป็นภาษาไทยกลาง",
  "notes": "เกร็ดความรู้เพิ่มเติม คำเตือนเรื่องสำเนียง หรือบอกว่าไม่แน่ใจหากไม่มีคำนี้ตรงตัว"
}`;

  let responseText: string | null = null;
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

  for (const model of modelsToTry) {
    try {
      responseText = await generateTranslationWithTimeout(promptText, model, 7000);
      if (responseText) break;
    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err?.status || err?.message || err);
    }
  }

  if (responseText) {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      res.json({
        ...parsedData,
        source: 'ai',
      });
      return;
    } catch (parseError) {
      console.error('Failed to parse model JSON output:', parseError);
    }
  }

  // Graceful fallback response when AI service is busy (503/timeout)
  // Always return 200 with clear helpful information
  res.json({
    found: false,
    uncertain: true,
    thai: isThaiToDialect ? text : 'คำค้นหา',
    dialect: isThaiToDialect ? 'ไม่พบคำแปลตรงตัว' : text,
    pronunciation: '-',
    meaning: `ระบบ AI กำลังมีผู้ใช้งานหนาแน่นชั่วคราว จึงยังไม่สามารถประมวลผลคำว่า "${text}" ได้ในทันที คุณสามารถเลือกเรียนรู้คำศัพท์มาตรฐานในคลังข้อมูล Tin Talk ได้ทันที`,
    example: '-',
    exampleThai: '-',
    notes: 'แนะนำ: ทดลองค้นหาคำศัพท์จากตัวอย่าง เช่น "กิน", "อร่อย", "พูด", "คิดถึง", "กลับบ้าน"',
    source: 'ai',
    isServiceBusy: true,
  });
});

// Setup Vite or static serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tin Talk server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
