/**
 * TopNepali Typing PRO — Global Application State & Audio Feedback
 */

export const state = {
  lang: 'nepali_unicode',
  mode: 'time',
  difficulty: 'medium',
  duration: 60,
  wordCount: 25,
  examType: 'full',
  words: [],
  typedWords: [],
  wordIdx: 0,
  isRunning: false,
  isFinished: false,
  startTime: 0,
  timer: null,
  secsLeft: 60,
  sound: true,
  isShift: false,
  totalKeystrokes: 0,
  correctKeystrokes: 0,
  errorKeystrokes: 0,
  errorMap: {},
  timeline: [],
  keystrokeLogs: [],
  lastStrokeTime: 0,
  targetWeakKeys: [],
  adaptivePrimaryTarget: '',
  adaptiveSecondaryTarget: '',
  isAdaptiveDiagnostic: false,
  paragraphCount: 1,

  // Two-Level Accuracy & Word Correction Tracking
  cleanWords: 0,
  correctedWords: 0,
  incorrectWords: 0,
  currentWordErrors: 0,
  currentWordBackspaces: 0,
  currentWordStartTime: 0,
  currentWordTotalStrokes: 0,
  wordsLog: [],

  // Free Style Zen Mode Tracking
  freestyleText: '',
  freestyleWords: 0,
  freestyleChars: 0,
  freestyleBackspaces: 0
};

// Web Audio Context for audio feedback
let audioCtx = null;
export function playBeep(freq, type, dur, gainVal) {
  if (!state.sound) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}
