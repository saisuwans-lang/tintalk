/**
 * Web Speech API speech synthesis utility for Thai pronunciation.
 */

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function speakThai(text: string, onEnd?: () => void, onError?: () => void): boolean {
  if (!isSpeechSupported()) return false;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.rate = 0.85; // slightly slower for language learners
    utterance.pitch = 1.0;

    // Try finding a Thai voice
    const voices = window.speechSynthesis.getVoices();
    const thaiVoice = voices.find((v) => v.lang.includes('th') || v.lang.includes('TH'));
    if (thaiVoice) {
      utterance.voice = thaiVoice;
    }

    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onError) onError();
    return false;
  }
}
