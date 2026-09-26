/**
 * TopNepali Typing PRO — Enterprise Client Application Engine
 * 
 * Features:
 * - Full UN General Assembly Speech typing test (Balen Shah's speech)
 * - 5-min & 10-min official certification benchmarks
 * - Dual-layer Certificate DB (Local & Cloudflare D1 sync)
 * - AI-Driven Adaptive Weak-Key Drill Algorithm with inverted indexing
 * - "Unimagined" Stroke Biomechanics: latency heatmap, hand bias, pause stalls, backspace loss
 * - Intl.Segmenter-based grapheme cluster handling for authentic Devanagari ligatures
 */

import { EXAM_SPEECH_NEPALI, EXAM_SPEECH_ENGLISH } from './data/speeches.js';
import { DATA } from './data/typing-words.js';
import { KEY_ROWS, KEY_CODE_MAP } from './data/keyboards.js';
import { toPreeti } from './utils/preeti-converter.js';
import { saveCertificate, checkCertificationPass, getSpeedRank } from './utils/certificate-db.js';
import { generateAdaptiveWords, getWeakestKeys, recordStrokeData } from './utils/adaptive-engine.js';
import { analyzeTypingRun } from './utils/stroke-analytics.js';

// --- 1. SEGMENTER & GRAPHEME UTILITIES ---
const neSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('ne', { granularity: 'grapheme' }) : null;
const enSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null;

function getGraphemes(text, lang) {
  if (!text) return [];
  if (lang === 'nepali_preeti') {
    return text.split('');
  }
  const seg = (lang === 'english' ? enSegmenter : neSegmenter);
  if (seg) {
    return [...seg.segment(text)].map(s => s.segment);
  }
  return text.split('');
}

// --- 2. APPLICATION STATE ---
let state = {
  lang: 'nepali_unicode',
  mode: 'time', // 'time' | 'words' | 'sentences' | 'quotes' | 'exam' | 'adaptive' | 'freestyle'
  examType: 'full', // 'full' | '5m' | '10m'
  duration: 60,
  wordCount: 25,
  difficulty: 'medium',
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
function playBeep(freq, type, dur, gainVal) {
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

// --- 3. WORDS POOL & CONTENT SELECTION ---
function getWordsPool() {
  let list = [];

  // EXAM MODE: Balen Shah's historic address to the UN General Assembly
  if (state.mode === 'exam') {
    const isEng = state.lang === 'english';
    const text = isEng ? EXAM_SPEECH_ENGLISH : EXAM_SPEECH_NEPALI;
    list = text.split(/\s+/).filter(Boolean);
    if (state.lang === 'nepali_preeti') {
      list = list.map(w => toPreeti(w));
    }
    return list;
  }

  // ADAPTIVE DRILL MODE: Targeted high-density weak keys
  if (state.mode === 'adaptive') {
    const weak = getWeakestKeys(state.lang, 3);
    state.targetWeakKeys = weak.map(w => w.char);
    const targetTags = document.getElementById('adaptive-target-tags');
    if (targetTags) {
      targetTags.textContent = state.targetWeakKeys.join(', ').toUpperCase();
    }
    list = generateAdaptiveWords({
      lang: state.lang,
      targetKeys: state.targetWeakKeys,
      targetCount: 45
    });
    if (state.lang === 'nepali_preeti') {
      list = list.map(w => toPreeti(w));
    }
    return list;
  }

  const isEng = state.lang === 'english';
  const langObj = isEng ? DATA.english : DATA.nepali;
  const diffObj = langObj[state.difficulty] || langObj.medium;

  if (state.mode === 'words' || state.mode === 'time') {
    const baseWords = diffObj.words;
    const targetCount = state.mode === 'words' ? state.wordCount : 150;
    while (list.length < targetCount) {
      const sh = [...baseWords].sort(() => 0.5 - Math.random());
      list.push(...sh);
    }
    list = list.slice(0, targetCount);
  } else if (state.mode === 'sentences') {
    const pCount = state.paragraphCount || 1;
    const pool = diffObj.sentences;
    let chosen = [];
    if (pCount >= 999) {
      chosen = pool;
    } else {
      const sh = [...pool].sort(() => 0.5 - Math.random());
      chosen = sh.slice(0, Math.min(pCount, sh.length));
    }
    const text = chosen.join(' ');
    list = text.split(/\s+/).filter(Boolean);
  } else if (state.mode === 'quotes') {
    const pCount = state.paragraphCount || 1;
    const pool = diffObj.quotes;
    let chosen = [];
    if (pCount >= 999) {
      chosen = pool;
    } else {
      const sh = [...pool].sort(() => 0.5 - Math.random());
      chosen = sh.slice(0, Math.min(pCount, sh.length));
    }
    const text = chosen.join(' ');
    list = text.split(/\s+/).filter(Boolean);
  } else {
    list = diffObj.words;
  }

  if (state.lang === 'nepali_preeti') {
    list = list.map(w => toPreeti(w));
  }

  return list;
}

function refillWords() {
  if (state.mode === 'exam') return; // Sequential speech text

  const isEng = state.lang === 'english';
  const langObj = isEng ? DATA.english : DATA.nepali;
  const diffObj = langObj[state.difficulty] || langObj.medium;
  let extra = [...diffObj.words].sort(() => 0.5 - Math.random()).slice(0, 50);
  if (state.lang === 'nepali_preeti') {
    extra = extra.map(w => toPreeti(w));
  }
  const container = document.getElementById('words-container');
  const startIdx = state.words.length;
  state.words.push(...extra);

  if (container) {
    extra.forEach((w, i) => {
      const wIdx = startIdx + i;
      const wSpan = document.createElement('span');
      wSpan.className = 'word-node';
      wSpan.dataset.wordIndex = `${wIdx}`;
      const clusters = getGraphemes(w, state.lang);
      wSpan.innerHTML = clusters.map((cl, cI) => `<span class="char-node" data-char-index="${cI}">${cl}</span>`).join('');
      container.appendChild(wSpan);
    });
  }
}

// --- 4. TEST SETUP & RESET ---
function setupTest() {
  clearInterval(state.timer);
  state.timer = null;
  state.isRunning = false;
  state.isFinished = false;
  state.wordIdx = 0;
  state.typedWords = [];
  state.timeline = [];
  state.keystrokeLogs = [];
  state.lastStrokeTime = 0;
  state.totalKeystrokes = 0;
  state.correctKeystrokes = 0;
  state.errorKeystrokes = 0;
  state.errorMap = {};

  // Reset Two-Level Accuracy & Word Logging
  state.cleanWords = 0;
  state.correctedWords = 0;
  state.incorrectWords = 0;
  state.currentWordErrors = 0;
  state.currentWordBackspaces = 0;
  state.currentWordStartTime = performance.now();
  state.currentWordTotalStrokes = 0;
  state.wordsLog = [];

  // Reset Free Style State
  state.freestyleText = '';
  state.freestyleWords = 0;
  state.freestyleChars = 0;
  state.freestyleBackspaces = 0;

  if (state.mode === 'exam') {
    if (state.examType === 'full') {
      state.duration = 0; // count up
      state.secsLeft = 0;
    } else if (state.examType === '5m') {
      state.duration = 300;
      state.secsLeft = 300;
    } else if (state.examType === '10m') {
      state.duration = 600;
      state.secsLeft = 600;
    }
  } else if (state.mode === 'freestyle') {
    state.duration = 0; // open-ended or timed
    state.secsLeft = 0;
  } else {
    state.secsLeft = state.duration;
  }

  const timerDisp = document.getElementById('live-timer-display');
  const progDisp = document.getElementById('live-progress-display');
  const wpmDisp = document.getElementById('live-wpm-display');
  const accDisp = document.getElementById('live-acc-display');
  const wordAccDisp = document.getElementById('live-word-acc-display');
  const strokeAccDisp = document.getElementById('live-stroke-acc-display');
  const inputField = document.getElementById('typing-input');

  const typingWorkbench = document.getElementById('typing-workbench');
  const freestyleWorkbench = document.getElementById('freestyle-workbench');
  const freestyleInput = document.getElementById('freestyle-input');

  if (timerDisp) {
    if (state.mode === 'exam' && state.examType === 'full') {
      timerDisp.textContent = '00:00';
    } else if (state.mode === 'freestyle') {
      timerDisp.textContent = '00:00';
    } else if (state.mode === 'time' || state.mode === 'exam') {
      timerDisp.textContent = `${state.secsLeft}s`;
    } else {
      timerDisp.textContent = '0s';
    }
  }

  if (progDisp) {
    if (state.mode === 'freestyle') {
      progDisp.textContent = '0 words • 0 chars';
    } else {
      progDisp.textContent = `0 / ${state.mode === 'words' ? state.wordCount : state.words.length || 25} words`;
    }
  }

  if (wpmDisp) wpmDisp.textContent = '0';
  if (accDisp) accDisp.textContent = '100%';
  if (wordAccDisp) wordAccDisp.textContent = '100%';
  if (strokeAccDisp) strokeAccDisp.textContent = '100%';

  // Mode Toggle: Free Style Workbench vs Standard Word Stream
  if (state.mode === 'freestyle') {
    if (typingWorkbench) typingWorkbench.classList.add('hidden');
    if (freestyleWorkbench) {
      freestyleWorkbench.classList.remove('hidden');
      freestyleWorkbench.classList.add('flex');
    }
    if (freestyleInput) {
      freestyleInput.value = '';
      freestyleInput.focus();
    }
    const fWordEl = document.getElementById('freestyle-word-count');
    const fCharEl = document.getElementById('freestyle-char-count');
    const fBurstEl = document.getElementById('freestyle-burst-wpm');
    if (fWordEl) fWordEl.textContent = '0';
    if (fCharEl) fCharEl.textContent = '0';
    if (fBurstEl) fBurstEl.textContent = '0 WPM';

    renderKeyboard();
    updatePersonalBestsCards();
    return;
  } else {
    if (typingWorkbench) typingWorkbench.classList.remove('hidden');
    if (freestyleWorkbench) {
      freestyleWorkbench.classList.add('hidden');
      freestyleWorkbench.classList.remove('flex');
    }
  }

  state.words = getWordsPool();

  if (inputField) {
    inputField.value = '';
    inputField.removeAttribute('placeholder');
    inputField.focus();
  }

  const container = document.getElementById('words-container');
  if (container) {
    container.innerHTML = '';
    if (state.lang === 'nepali_preeti') {
      container.style.fontFamily = "'Font_preeti', 'Preeti', sans-serif";
    } else if (state.lang === 'english') {
      container.style.fontFamily = "'Inter', sans-serif";
    } else {
      container.style.fontFamily = "'Font_kokila', 'Mukta', 'Kalimati', sans-serif";
    }

    const caretDiv = document.createElement('div');
    caretDiv.id = 'typing-caret';
    caretDiv.className = 'typing-caret';
    container.appendChild(caretDiv);

    state.words.forEach((w, wI) => {
      const wSpan = document.createElement('span');
      wSpan.className = 'word-node' + (wI === 0 ? ' is-active-word' : '');
      wSpan.dataset.wordIndex = `${wI}`;
      const clusters = getGraphemes(w, state.lang);
      wSpan.innerHTML = clusters.map((cl, cI) => `<span class="char-node" data-char-index="${cI}">${cl}</span>`).join('');
      container.appendChild(wSpan);
    });
    container.scrollTop = 0;
  }

  renderKeyboard();
  highlightTargetKey();
  updateCaret();
  updatePersonalBestsCards();
}

// --- 5. ACTIVE WORD HIGHLIGHT & CARET ---
function renderActiveWordHighlight() {
  const curWord = state.words[state.wordIdx];
  const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
  const inputField = document.getElementById('typing-input');
  if (!curWord || !curWordEl || !inputField) return;

  const typed = inputField.value;
  const clusters = getGraphemes(curWord, state.lang);
  const charSpans = curWordEl.querySelectorAll('.char-node:not(.is-extra-error)');

  curWordEl.querySelectorAll('.is-extra-error').forEach(el => el.remove());

  let typedOffset = 0;
  let hasError = false;

  for (let i = 0; i < clusters.length; i++) {
    const cl = clusters[i];
    const span = charSpans[i];
    if (!span) continue;

    span.className = 'char-node';

    if (typedOffset >= typed.length) {
      continue;
    }

    const remainingTyped = typed.slice(typedOffset);

    if (remainingTyped.startsWith(cl)) {
      span.classList.add('is-correct');
      typedOffset += cl.length;
    } else if (cl.startsWith(remainingTyped)) {
      span.classList.add('is-partial');
      typedOffset += remainingTyped.length;
    } else {
      span.classList.add('is-error');
      hasError = true;
      typedOffset += Math.min(cl.length, remainingTyped.length);
      state.errorMap[cl] = (state.errorMap[cl] || 0) + 1;
    }
  }

  if (typed.length > typedOffset) {
    hasError = true;
    const extra = typed.slice(typedOffset);
    const extraSpan = document.createElement('span');
    extraSpan.className = 'char-node is-extra-error';
    extraSpan.textContent = extra;
    curWordEl.appendChild(extraSpan);
  }

  curWordEl.classList.toggle('is-word-error', hasError);
}

function adjust2LineScroll() {
  const container = document.getElementById('words-container');
  if (!container) return;
  const curWordEl = container.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
  if (!curWordEl) return;

  const wordTop = curWordEl.offsetTop;
  if (Math.abs(container.scrollTop - wordTop) > 2) {
    container.scrollTo({
      top: wordTop,
      behavior: 'smooth'
    });
  }
}

function updateCaret() {
  const caret = document.getElementById('typing-caret');
  const container = document.getElementById('words-container');
  if (!caret || !container) return;

  const curWordEl = container.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
  if (!curWordEl) {
    caret.classList.add('hidden');
    return;
  }

  caret.classList.remove('hidden');
  const cRect = container.getBoundingClientRect();
  const inputField = document.getElementById('typing-input');
  const typed = inputField ? inputField.value : '';

  const charSpans = curWordEl.querySelectorAll('.char-node');
  let targetSpan = null;
  let placeAtRight = false;

  if (typed.length === 0) {
    targetSpan = charSpans[0] || curWordEl;
    placeAtRight = false;
  } else {
    const touchedSpans = curWordEl.querySelectorAll('.char-node.is-correct, .char-node.is-partial, .char-node.is-error, .char-node.is-extra-error');
    if (touchedSpans.length > 0) {
      targetSpan = touchedSpans[touchedSpans.length - 1];
      placeAtRight = true;
    } else {
      targetSpan = charSpans[0] || curWordEl;
      placeAtRight = false;
    }
  }

  if (targetSpan) {
    const sRect = targetSpan.getBoundingClientRect();
    const leftPos = placeAtRight ? (sRect.right - cRect.left) : (sRect.left - cRect.left);
    const topPos = (sRect.top - cRect.top + container.scrollTop);

    caret.style.left = `${leftPos}px`;
    caret.style.top = `${topPos}px`;
    caret.style.height = `${Math.max(22, sRect.height - 4)}px`;
  }
}

// --- 6. KEYBOARD VISUALIZER ENGINE ---
function renderKeyboard() {
  KEY_ROWS.forEach((row, rI) => {
    const rowEl = document.querySelector(`.kb-row[data-row="${rI + 1}"]`);
    if (!rowEl) return;

    const existingKeycaps = rowEl.children;
    const canReuse = (existingKeycaps.length === row.length);

    if (!canReuse) {
      rowEl.innerHTML = '';
    }

    row.forEach((k, kI) => {
      let topLbl = '';
      let mainLbl = '';
      let fontFam = 'var(--font-sans)';

      if (!k.special && !k.shell) {
        if (state.lang === 'english') {
          topLbl = k.eng[1] !== k.eng[0].toUpperCase() ? k.eng[1] : '';
          mainLbl = state.isShift ? k.eng[1] : k.eng[0];
        } else if (state.lang === 'nepali_unicode') {
          topLbl = k.uni[1];
          mainLbl = state.isShift ? k.uni[1] : k.uni[0];
          fontFam = 'var(--font-nepali)';
        } else if (state.lang === 'nepali_romanized') {
          topLbl = k.rom[1];
          mainLbl = state.isShift ? k.rom[1] : k.rom[0];
          fontFam = 'var(--font-nepali)';
        } else if (state.lang === 'nepali_preeti') {
          topLbl = state.isShift ? k.pre[1] : k.pre[0];
          mainLbl = state.isShift ? k.pre[3] : k.pre[2];
          fontFam = 'var(--font-nepali)';
        }
      }

      if (canReuse) {
        const keyDiv = existingKeycaps[kI];
        if (k.shell) {
          keyDiv.className = 'keycap special-key shell-key';
          keyDiv.textContent = k.label || k.key;
        } else if (k.special) {
          keyDiv.className = 'keycap special-key';
          keyDiv.textContent = k.label || k.key;
        } else {
          keyDiv.className = 'keycap';
          const topSpan = keyDiv.querySelector('.keycap-shift-label');
          const mainSpan = keyDiv.querySelector('.keycap-main-label');
          if (topSpan) topSpan.textContent = topLbl;
          if (mainSpan) {
            mainSpan.textContent = mainLbl;
            mainSpan.style.fontFamily = fontFam;
          }
        }
      } else {
        const keyDiv = document.createElement('div');
        const extraCls = k.shell ? 'special-key shell-key' : (k.special ? 'special-key' : '');
        keyDiv.className = `keycap ${extraCls}`.trim();
        keyDiv.dataset.code = k.code;
        keyDiv.style.flex = `${k.flex} 1 0%`;

        if (k.shell || k.special) {
          keyDiv.textContent = k.label || k.key;
        } else {
          const topSpan = document.createElement('span');
          topSpan.className = 'keycap-shift-label';
          topSpan.textContent = topLbl;

          const mainSpan = document.createElement('span');
          mainSpan.className = 'keycap-main-label';
          mainSpan.style.fontFamily = fontFam;
          mainSpan.textContent = mainLbl;

          keyDiv.appendChild(topSpan);
          keyDiv.appendChild(mainSpan);
        }

        rowEl.appendChild(keyDiv);
      }
    });
  });

  const titleEl = document.getElementById('kb-current-layout-name');
  const pillEl = document.getElementById('kb-layout-pill');
  const titles = {
    english: 'English QWERTY Layout',
    nepali_unicode: 'Nepali Unicode (Traditional MPP) Layout',
    nepali_romanized: 'Nepali Unicode (Romanized Phonetic) Layout',
    nepali_preeti: 'Preeti (ASCII Typewriter) Layout'
  };
  const pills = {
    english: 'QWERTY',
    nepali_unicode: 'MPP TRADITIONAL',
    nepali_romanized: 'PHONETIC QWERTY',
    nepali_preeti: 'PREETI TYPEWRITER'
  };
  if (titleEl) titleEl.textContent = titles[state.lang] || '';
  if (pillEl) pillEl.textContent = pills[state.lang] || '';

  highlightTargetKey();
}

function highlightTargetKey() {
  document.querySelectorAll('.keycap.is-target').forEach(el => el.classList.remove('is-target'));
  const curWord = state.words[state.wordIdx];
  const inputField = document.getElementById('typing-input');
  if (!curWord) return;

  const typed = inputField ? inputField.value : '';
  let targetCh = '';
  if (typed.length < curWord.length) {
    targetCh = curWord[typed.length];
  } else {
    targetCh = ' ';
  }

  const targetDisp = document.getElementById('kb-target-char');
  if (targetDisp) {
    if (targetCh === ' ') {
      targetDisp.textContent = '␣ Space';
    } else if (state.lang === 'nepali_unicode' && targetCh === '्') {
      targetDisp.textContent = '् (halanta \\)';
    } else if (state.lang === 'nepali_unicode' && targetCh === 'आ') {
      targetDisp.textContent = 'आ (Shift + A or अ + ा)';
    } else if (state.lang === 'nepali_romanized' && targetCh === '्') {
      targetDisp.textContent = '् (q or /)';
    } else {
      targetDisp.textContent = targetCh;
    }
  }

  if (targetCh === ' ') {
    document.querySelector('.keycap[data-code="Space"]')?.classList.add('is-target');
    return;
  }

  let needsShift = false;
  let targetCode = null;

  for (let r = 0; r < KEY_ROWS.length; r++) {
    for (let k = 0; k < KEY_ROWS[r].length; k++) {
      const item = KEY_ROWS[r][k];
      if (item.special) continue;

      if (state.lang === 'english') {
        if (item.eng[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.eng[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
      } else if (state.lang === 'nepali_unicode') {
        if (item.uni[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.uni[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
      } else if (state.lang === 'nepali_romanized') {
        if (item.rom[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.rom[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
      } else if (state.lang === 'nepali_preeti') {
        if (item.pre[0] === targetCh || item.pre[2] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.pre[1] === targetCh || item.pre[3] === targetCh) { targetCode = item.code; needsShift = true; break; }
      }
    }
    if (targetCode) break;
  }

  if (targetCode) {
    document.querySelector(`.keycap[data-code="${targetCode}"]`)?.classList.add('is-target');
    if (needsShift) {
      document.querySelector('.keycap[data-code="ShiftLeft"]')?.classList.add('is-target');
    }
  }
}

// --- 7. REAL-TIME STATS & WALL-CLOCK TIMER ---
function computeCurrentStats() {
  const elapsed = Math.max(1, (performance.now() - state.startTime) / 1000);
  const m = elapsed / 60;

  if (state.mode === 'freestyle') {
    const chars = state.freestyleChars || 0;
    const words = state.freestyleWords || 0;
    const rawWpm = Math.round((chars / 5) / m);
    const wpm = rawWpm;
    const strokeAcc = state.totalKeystrokes > 0
      ? Math.max(0, Math.min(100, Math.round(((state.totalKeystrokes - state.freestyleBackspaces) / state.totalKeystrokes) * 1000) / 10))
      : 100;
    const wordAcc = 100;
    return { wpm, rawWpm, acc: wordAcc, wordAcc, strokeAcc, elapsed };
  }

  const wpm = Math.max(0, Math.round((state.correctKeystrokes / 5) / m));
  const rawWpm = Math.round((state.totalKeystrokes / 5) / m);

  // Two-Level Accuracy Calculations:
  // Level 1: Keystroke / Stroke Accuracy (includes mistypes, backspaces and corrections)
  const strokeAcc = state.totalKeystrokes > 0 
    ? Math.max(0, Math.min(100, Math.round((state.correctKeystrokes / state.totalKeystrokes) * 1000) / 10)) 
    : 100;

  // Level 2: Word Accuracy (all successfully submitted words including corrected ones)
  const totalSubmittedWords = state.cleanWords + state.correctedWords + state.incorrectWords;
  const correctSubmittedWords = state.cleanWords + state.correctedWords;
  const wordAcc = totalSubmittedWords > 0 
    ? Math.max(0, Math.min(100, Math.round((correctSubmittedWords / totalSubmittedWords) * 1000) / 10)) 
    : 100;

  return { wpm, rawWpm, acc: wordAcc, wordAcc, strokeAcc, elapsed };
}

function formatMinutesSeconds(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (state.isRunning) return;
  state.isRunning = true;
  state.startTime = performance.now();
  state.timeline = [];
  state.keystrokeLogs = [];
  state.lastStrokeTime = performance.now();

  state.timer = setInterval(() => {
    const now = performance.now();
    const elapsed = Math.floor((now - state.startTime) / 1000);
    const tDisp = document.getElementById('live-timer-display');

    if (state.mode === 'exam' && state.examType === 'full') {
      // FULL UN SPEECH: count upwards with format MM:SS
      if (tDisp) tDisp.textContent = formatMinutesSeconds(elapsed);
    } else if (state.mode === 'freestyle') {
      if (tDisp) tDisp.textContent = formatMinutesSeconds(elapsed);
    } else if (state.mode === 'time' || state.mode === 'exam') {
      state.secsLeft = Math.max(0, state.duration - elapsed);
      if (tDisp) tDisp.textContent = `${state.secsLeft}s`;
      if (state.secsLeft <= 0) {
        finishTest();
        return;
      }
    } else {
      if (tDisp) tDisp.textContent = `${elapsed}s`;
    }

    updateLiveStats();

    const cur = computeCurrentStats();
    state.timeline.push({
      second: elapsed,
      wpm: cur.wpm,
      rawWpm: cur.rawWpm,
      errors: state.errorKeystrokes
    });
  }, 1000);
}

function updateLiveStats() {
  if (!state.isRunning) return;
  const stats = computeCurrentStats();

  const wpmDisp = document.getElementById('live-wpm-display');
  const accDisp = document.getElementById('live-acc-display');
  const wordAccDisp = document.getElementById('live-word-acc-display');
  const strokeAccDisp = document.getElementById('live-stroke-acc-display');
  const progDisp = document.getElementById('live-progress-display');

  if (wpmDisp) wpmDisp.textContent = `${stats.wpm}`;
  if (accDisp) accDisp.textContent = `${Math.round(stats.acc)}%`;
  if (wordAccDisp) wordAccDisp.textContent = `${Math.round(stats.wordAcc)}%`;
  if (strokeAccDisp) strokeAccDisp.textContent = `${stats.strokeAcc}%`;

  if (state.mode === 'freestyle') {
    if (progDisp) progDisp.textContent = `${state.freestyleWords} words • ${state.freestyleChars} chars`;
  } else {
    if (progDisp) progDisp.textContent = `${state.wordIdx} / ${state.mode === 'words' ? state.wordCount : state.words.length} words`;
  }
}

// --- 8. SVG TIMELINE GRAPH GENERATOR ---
function renderTimelineChart(timeline) {
  const svg = document.getElementById('timeline-chart-svg');
  if (!svg) return;

  if (!timeline || timeline.length === 0) {
    svg.innerHTML = '<text x="250" y="60" text-anchor="middle" fill="var(--text-muted)" font-size="12">No speed timeline data recorded</text>';
    return;
  }

  const maxWpm = Math.max(40, ...timeline.map(p => Math.max(p.wpm, p.rawWpm)));
  const roundedMax = Math.ceil(maxWpm / 20) * 20;
  const w = 500;
  const h = 120;
  const padL = 30;
  const padR = 20;
  const padT = 15;
  const padB = 25;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const n = Math.max(1, timeline.length - 1);
  const getX = (i) => padL + (i / n) * innerW;
  const getY = (val) => padT + innerH - (Math.min(val, roundedMax) / roundedMax) * innerH;

  let svgHtml = `
    <defs>
      <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
  `;

  const gridSteps = [0, 0.5, 1];
  gridSteps.forEach(ratio => {
    const yVal = padT + innerH * (1 - ratio);
    const labelVal = Math.round(roundedMax * ratio);
    svgHtml += `<line x1="${padL}" y1="${yVal}" x2="${w - padR}" y2="${yVal}" stroke="var(--border-subtle)" stroke-dasharray="3,3" stroke-width="1" />`;
    svgHtml += `<text x="${padL - 6}" y="${yVal + 3}" text-anchor="end" fill="var(--text-muted)" font-size="9" font-family="monospace">${labelVal}</text>`;
  });

  const rawPoints = timeline.map((p, i) => `${getX(i)},${getY(p.rawWpm)}`).join(' ');
  const netPoints = timeline.map((p, i) => `${getX(i)},${getY(p.wpm)}`).join(' ');

  const areaPoints = `${getX(0)},${padT + innerH} ` + netPoints + ` ${getX(timeline.length - 1)},${padT + innerH}`;
  svgHtml += `<polygon points="${areaPoints}" fill="url(#wpmGradient)" />`;
  svgHtml += `<polyline points="${rawPoints}" fill="none" stroke="#60a5fa" stroke-width="1.75" stroke-linecap="round" opacity="0.8" />`;
  svgHtml += `<polyline points="${netPoints}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" stroke-linecap="round" />`;

  timeline.forEach((p, i) => {
    if (p.errors > 0) {
      svgHtml += `<circle cx="${getX(i)}" cy="${getY(p.wpm)}" r="3.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" />`;
    }
  });

  svg.innerHTML = svgHtml;
}

// --- 9. FINISH TEST & DEEP ANALYTICS REPORT ---
let lastFinishedResult = null;

function finishTest() {
  if (state.isFinished) return;
  clearInterval(state.timer);
  state.timer = null;
  state.isRunning = false;
  state.isFinished = true;
  playBeep(880, 'triangle', 0.45, 0.15);

  const stats = computeCurrentStats();
  const netWpm = stats.wpm;
  const rawWpm = stats.rawWpm;
  const acc = stats.acc;
  const cpm = Math.round(state.correctKeystrokes / (stats.elapsed / 60));

  // Run Unimagined Stroke Biomechanics Analytics
  const strokeAnalytics = analyzeTypingRun(state.keystrokeLogs, stats.elapsed, netWpm, rawWpm, acc);

  // Speed Rank Classification
  const rank = getSpeedRank(state.lang, netWpm);

  // Check Official Certification Qualification
  const certPass = checkCertificationPass(state.lang, netWpm, acc);

  lastFinishedResult = {
    netWpm,
    rawWpm,
    acc,
    cpm,
    elapsed: Math.round(stats.elapsed),
    layout: state.lang,
    mode: state.mode,
    examType: state.examType,
    rank,
    certPass,
    strokeAnalytics
  };

  // Populate Base Numbers
  const mNet = document.getElementById('modal-net-wpm');
  const mWordAcc = document.getElementById('modal-word-accuracy');
  const mStrokeAcc = document.getElementById('modal-stroke-accuracy');
  const mCorrectedCount = document.getElementById('modal-corrected-words-count');
  const mAcc = document.getElementById('modal-accuracy');
  const mAccDetail = document.getElementById('modal-acc-detail');
  const mRaw = document.getElementById('modal-raw-wpm');
  const mCpm = document.getElementById('modal-cpm-label');
  const mConsistency = document.getElementById('modal-consistency');
  const mRankPill = document.getElementById('modal-rank-pill');
  const mMeta = document.getElementById('modal-test-metadata');

  const langNames = {
    nepali_unicode: 'Nepali Traditional (MPP)',
    nepali_romanized: 'Nepali Romanized (Phonetic)',
    nepali_preeti: 'Preeti (ASCII Typewriter)',
    english: 'English US QWERTY'
  };

  let modeDesc = '';
  if (state.mode === 'exam') {
    modeDesc = state.examType === 'full' ? '🎓 Full UN Speech Exam' : `🎓 ${Math.round(state.duration / 60)} Min Official Exam`;
  } else if (state.mode === 'adaptive') {
    modeDesc = '⚡ Smart Adaptive Drill';
  } else if (state.mode === 'time') {
    modeDesc = `${state.duration} Seconds`;
  } else {
    modeDesc = `${state.wordCount} Words`;
  }

  const diffDesc = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);

  if (mNet) mNet.textContent = `${netWpm}`;
  if (mWordAcc) mWordAcc.textContent = `${stats.wordAcc}%`;
  if (mStrokeAcc) mStrokeAcc.textContent = `${stats.strokeAcc}%`;
  if (mCorrectedCount) {
    mCorrectedCount.textContent = `${state.correctedWords} fixed`;
    mCorrectedCount.title = `${state.cleanWords} clean words, ${state.correctedWords} corrected with backspace, ${state.incorrectWords} incorrect words`;
  }
  if (mAcc) mAcc.textContent = `${stats.wordAcc}%`;
  if (mAccDetail) mAccDetail.textContent = `${state.errorKeystrokes} errors`;
  if (mRaw) mRaw.textContent = `${rawWpm}`;
  if (mCpm) mCpm.textContent = `${cpm} CPM`;
  if (mConsistency) mConsistency.textContent = `${strokeAnalytics.rhythmStability}%`;
  if (mRankPill) {
    mRankPill.textContent = rank.title;
    mRankPill.style.color = rank.color;
  }
  if (mMeta) mMeta.textContent = `${langNames[state.lang] || state.lang} • ${modeDesc} • ${diffDesc}`;

  // Populate Word-by-Word Typing Log & Correction Audit
  const wordsLogTbody = document.getElementById('modal-words-log-tbody');
  if (wordsLogTbody) {
    if (state.wordsLog.length === 0) {
      wordsLogTbody.innerHTML = '<tr><td colspan="6" class="py-3 text-center text-muted">No word entries submitted</td></tr>';
    } else {
      wordsLogTbody.innerHTML = state.wordsLog.map(w => {
        let statusBadge = '';
        if (w.isCorrect && !w.hadCorrections) {
          statusBadge = '<span class="text-emerald-500 font-semibold">✓ Clean</span>';
        } else if (w.isCorrect && w.hadCorrections) {
          statusBadge = `<span class="text-amber-500 font-semibold">⟲ Fixed (${w.errorsCount + w.backspacesCount} err)</span>`;
        } else {
          statusBadge = '<span class="text-red-500 font-semibold">✗ Error</span>';
        }
        return `
          <tr class="hover:bg-[var(--bg-surface)] transition-colors">
            <td class="py-1.5 pr-2 text-muted">${w.index}</td>
            <td class="py-1.5 pr-3 font-semibold text-[var(--text-primary)]">${w.targetWord}</td>
            <td class="py-1.5 pr-3 ${w.isCorrect ? 'text-[var(--text-secondary)]' : 'text-red-500'}">${w.typedWord}</td>
            <td class="py-1.5 pr-3">${statusBadge}</td>
            <td class="py-1.5 pr-3 text-muted text-[11px]">${w.strokesCount} st (${w.backspacesCount} bk)</td>
            <td class="py-1.5 text-muted text-[11px]">${w.durationMs}ms</td>
          </tr>
        `;
      }).join('');
    }
  }

  // Populate Unimagined Biomechanics Cards
  const elHandBias = document.getElementById('analytics-hand-bias');
  const elLeftBar = document.getElementById('analytics-left-bar');
  const elRightBar = document.getElementById('analytics-right-bar');
  const elLeftErr = document.getElementById('analytics-left-err');
  const elRightErr = document.getElementById('analytics-right-err');
  const elRowDist = document.getElementById('analytics-row-dist');
  const elAvgLatency = document.getElementById('analytics-avg-latency');
  const elSlowest = document.getElementById('analytics-slowest-keys');
  const elFastest = document.getElementById('analytics-fastest-keys');
  const elHesitation = document.getElementById('analytics-hesitation-count');
  const elBurst = document.getElementById('analytics-peak-burst');
  const elCleanStreak = document.getElementById('analytics-clean-streak');
  const elTimeLost = document.getElementById('analytics-time-lost');
  const elStrokeRatio = document.getElementById('analytics-stroke-ratio');

  if (elHandBias) elHandBias.textContent = `${strokeAnalytics.leftHandRatio}% L / ${strokeAnalytics.rightHandRatio}% R`;
  if (elLeftBar) elLeftBar.style.width = `${strokeAnalytics.leftHandRatio}%`;
  if (elRightBar) elRightBar.style.width = `${strokeAnalytics.rightHandRatio}%`;
  if (elLeftErr) elLeftErr.textContent = `${strokeAnalytics.leftErrorRate}%`;
  if (elRightErr) elRightErr.textContent = `${strokeAnalytics.rightErrorRate}%`;
  if (elRowDist) elRowDist.textContent = `H: ${strokeAnalytics.rowPercentages.home}% • T: ${strokeAnalytics.rowPercentages.top}%`;
  if (elAvgLatency) elAvgLatency.textContent = `${strokeAnalytics.avgLatencyMs} ms avg`;

  if (elSlowest) {
    elSlowest.textContent = strokeAnalytics.slowestKeys.length > 0 
      ? strokeAnalytics.slowestKeys.slice(0, 3).map(k => `${k.char} (${k.avgMs}ms)`).join(', ')
      : 'None (Smooth)';
  }
  if (elFastest) {
    elFastest.textContent = strokeAnalytics.fastestKeys.length > 0
      ? strokeAnalytics.fastestKeys.slice(0, 3).map(k => `${k.char}`).join(', ')
      : 'Standard';
  }
  if (elHesitation) elHesitation.textContent = `${strokeAnalytics.hesitations} pauses`;
  if (elBurst) elBurst.textContent = `${strokeAnalytics.peakBurstWpm} WPM burst`;
  if (elCleanStreak) elCleanStreak.textContent = `${strokeAnalytics.maxCleanStreak} chars`;
  if (elTimeLost) elTimeLost.textContent = `${strokeAnalytics.estimatedSecondsLost} sec lost`;
  if (elStrokeRatio) elStrokeRatio.textContent = `${state.correctKeystrokes} / ${state.errorKeystrokes}`;

  // Populate Certification Banner
  const certBanner = document.getElementById('modal-cert-banner');
  const certTitle = document.getElementById('modal-cert-status-title');
  const certDesc = document.getElementById('modal-cert-status-desc');
  const certNameInput = document.getElementById('modal-candidate-name-input');

  if (certBanner) {
    if (certPass.passed) {
      certBanner.classList.remove('hidden');
      if (certTitle) certTitle.textContent = `🏆 Certified Benchmark Passed: ${rank.title}!`;
      if (certDesc) certDesc.textContent = `Net Speed: ${netWpm} WPM (Exceeds >${certPass.minWpm} WPM requirement with ${acc}% accuracy). Enter your name to generate your verifiable certificate:`;
      if (certNameInput) {
        certNameInput.value = localStorage.getItem('topnepali_candidate_name') || '';
      }
    } else if (state.mode === 'exam') {
      certBanner.classList.remove('hidden');
      if (certTitle) certTitle.textContent = `Official Typing Benchmark: Did Not Yet Qualify`;
      if (certDesc) certDesc.textContent = `Required: >${certPass.minWpm} WPM (Your speed: ${netWpm} WPM). Practice weak-stroke drills below to qualify!`;
    } else {
      certBanner.classList.add('hidden');
    }
  }

  // Populate Adaptive Recommendation Callout
  const adaptiveCallout = document.getElementById('modal-adaptive-callout');
  const adaptiveKeysLbl = document.getElementById('modal-adaptive-keys-label');
  const topMissed = Object.entries(state.errorMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  const weakKeys = topMissed.length > 0 ? topMissed : (strokeAnalytics.slowestKeys.slice(0, 2).map(k => k.char));

  if (adaptiveCallout && weakKeys.length > 0) {
    adaptiveCallout.classList.remove('hidden');
    if (adaptiveKeysLbl) adaptiveKeysLbl.textContent = `[${weakKeys.join(', ').toUpperCase()}]`;
  }

  renderTimelineChart(state.timeline);
  document.getElementById('stats-modal')?.classList.add('is-open');

  // Save record to LocalStorage
  try {
    const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
    hist.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      layout: state.lang,
      mode: modeDesc,
      wpm: netWpm,
      rawWpm: rawWpm,
      acc: acc,
      duration: Math.round(stats.elapsed)
    });
    localStorage.setItem('nepali_typing_history', JSON.stringify(hist.slice(0, 50)));
    updatePersonalBestsCards();
  } catch (e) {}
}

function finishFreestyleTest() {
  if (state.isFinished) return;
  clearInterval(state.timer);
  state.timer = null;
  state.isRunning = false;
  state.isFinished = true;
  playBeep(880, 'triangle', 0.45, 0.15);

  const freestyleInput = document.getElementById('freestyle-input');
  const val = freestyleInput ? freestyleInput.value : state.freestyleText || '';
  const elapsed = Math.max(1, (performance.now() - state.startTime) / 1000);
  const m = elapsed / 60;
  const words = val.trim().split(/\s+/).filter(Boolean);
  const totalChars = val.length;

  const rawWpm = Math.round((totalChars / 5) / m);
  const netWpm = rawWpm;
  const strokeAcc = state.totalKeystrokes > 0
    ? Math.max(0, Math.min(100, Math.round(((state.totalKeystrokes - state.freestyleBackspaces) / state.totalKeystrokes) * 1000) / 10))
    : 100;
  const wordAcc = 100;
  const cpm = Math.round(totalChars / m);

  const strokeAnalytics = analyzeTypingRun(state.keystrokeLogs, elapsed, netWpm, rawWpm, strokeAcc);
  const rank = getSpeedRank('english', netWpm);

  lastFinishedResult = {
    netWpm,
    rawWpm,
    acc: strokeAcc,
    wordAcc,
    strokeAcc,
    cpm,
    elapsed: Math.round(elapsed),
    layout: 'english',
    mode: 'freestyle',
    examType: '',
    rank,
    certPass: { passed: false, minWpm: 25 },
    strokeAnalytics
  };

  // Populate Base Numbers
  const mNet = document.getElementById('modal-net-wpm');
  const mWordAcc = document.getElementById('modal-word-accuracy');
  const mStrokeAcc = document.getElementById('modal-stroke-accuracy');
  const mCorrectedCount = document.getElementById('modal-corrected-words-count');
  const mAcc = document.getElementById('modal-accuracy');
  const mRaw = document.getElementById('modal-raw-wpm');
  const mCpm = document.getElementById('modal-cpm-label');
  const mConsistency = document.getElementById('modal-consistency');
  const mRankPill = document.getElementById('modal-rank-pill');
  const mMeta = document.getElementById('modal-test-metadata');

  if (mNet) mNet.textContent = `${netWpm}`;
  if (mWordAcc) mWordAcc.textContent = '100%';
  if (mStrokeAcc) mStrokeAcc.textContent = `${strokeAcc}%`;
  if (mCorrectedCount) mCorrectedCount.textContent = `${state.freestyleBackspaces} backspaces`;
  if (mAcc) mAcc.textContent = `${strokeAcc}%`;
  if (mRaw) mRaw.textContent = `${rawWpm}`;
  if (mCpm) mCpm.textContent = `${cpm} CPM`;
  if (mConsistency) mConsistency.textContent = `${strokeAnalytics.rhythmStability}%`;
  if (mRankPill) {
    mRankPill.textContent = rank.title;
    mRankPill.style.color = rank.color;
  }
  if (mMeta) mMeta.textContent = `English Free Style • Raw Typing Velocity • ${Math.round(elapsed)}s Elapsed`;

  // Populate Unimagined Biomechanics Cards
  const elHandBias = document.getElementById('analytics-hand-bias');
  const elLeftBar = document.getElementById('analytics-left-bar');
  const elRightBar = document.getElementById('analytics-right-bar');
  const elLeftErr = document.getElementById('analytics-left-err');
  const elRightErr = document.getElementById('analytics-right-err');
  const elRowDist = document.getElementById('analytics-row-dist');
  const elAvgLatency = document.getElementById('analytics-avg-latency');
  const elSlowest = document.getElementById('analytics-slowest-keys');
  const elFastest = document.getElementById('analytics-fastest-keys');
  const elHesitation = document.getElementById('analytics-hesitation-count');
  const elBurst = document.getElementById('analytics-peak-burst');
  const elCleanStreak = document.getElementById('analytics-clean-streak');
  const elTimeLost = document.getElementById('analytics-time-lost');
  const elStrokeRatio = document.getElementById('analytics-stroke-ratio');

  if (elHandBias) elHandBias.textContent = `${strokeAnalytics.leftHandRatio}% L / ${strokeAnalytics.rightHandRatio}% R`;
  if (elLeftBar) elLeftBar.style.width = `${strokeAnalytics.leftHandRatio}%`;
  if (elRightBar) elRightBar.style.width = `${strokeAnalytics.rightHandRatio}%`;
  if (elLeftErr) elLeftErr.textContent = `${strokeAnalytics.leftErrorRate}%`;
  if (elRightErr) elRightErr.textContent = `${strokeAnalytics.rightErrorRate}%`;
  if (elRowDist) elRowDist.textContent = `H: ${strokeAnalytics.rowPercentages.home}% • T: ${strokeAnalytics.rowPercentages.top}%`;
  if (elAvgLatency) elAvgLatency.textContent = `${strokeAnalytics.avgLatencyMs} ms avg`;
  if (elSlowest) {
    elSlowest.textContent = strokeAnalytics.slowestKeys.length > 0 
      ? strokeAnalytics.slowestKeys.slice(0, 3).map(k => `${k.char} (${k.avgMs}ms)`).join(', ')
      : 'None (Smooth)';
  }
  if (elFastest) {
    elFastest.textContent = strokeAnalytics.fastestKeys.length > 0
      ? strokeAnalytics.fastestKeys.slice(0, 3).map(k => `${k.char}`).join(', ')
      : 'Standard';
  }
  if (elHesitation) elHesitation.textContent = `${strokeAnalytics.hesitations} pauses`;
  if (elBurst) elBurst.textContent = `${strokeAnalytics.peakBurstWpm} WPM burst`;
  if (elCleanStreak) elCleanStreak.textContent = `${strokeAnalytics.maxCleanStreak} chars`;
  if (elTimeLost) elTimeLost.textContent = `${strokeAnalytics.estimatedSecondsLost} sec lost`;
  if (elStrokeRatio) elStrokeRatio.textContent = `${state.totalKeystrokes - state.freestyleBackspaces} / ${state.freestyleBackspaces}`;

  // Hide cert banner & adaptive callout for free style
  const certBanner = document.getElementById('modal-cert-banner');
  if (certBanner) certBanner.classList.add('hidden');
  const adaptiveCallout = document.getElementById('modal-adaptive-callout');
  if (adaptiveCallout) adaptiveCallout.classList.add('hidden');

  // Word breakdown log for freestyle: show typed words
  const wordsLogTbody = document.getElementById('modal-words-log-tbody');
  if (wordsLogTbody) {
    if (words.length === 0) {
      wordsLogTbody.innerHTML = '<tr><td colspan="6" class="py-3 text-center text-muted">No freestyle words typed yet.</td></tr>';
    } else {
      wordsLogTbody.innerHTML = words.slice(0, 50).map((w, idx) => `
        <tr class="hover:bg-[var(--bg-surface)] transition-colors">
          <td class="py-1.5 pr-2 text-muted">${idx + 1}</td>
          <td class="py-1.5 pr-3 font-semibold text-[var(--text-primary)]">${w}</td>
          <td class="py-1.5 pr-3 text-[var(--text-secondary)]">${w}</td>
          <td class="py-1.5 pr-3"><span class="text-teal-500 font-semibold">✍ Free Style</span></td>
          <td class="py-1.5 pr-3 text-muted text-[11px]">${w.length} chars</td>
          <td class="py-1.5 text-muted text-[11px]">Free Pace</td>
        </tr>
      `).join('');
    }
  }

  renderTimelineChart(state.timeline);
  document.getElementById('stats-modal')?.classList.add('is-open');

  // Save record to LocalStorage
  try {
    const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
    hist.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      layout: 'english',
      mode: 'Free Style Typing',
      wpm: netWpm,
      rawWpm: rawWpm,
      acc: strokeAcc,
      duration: Math.round(elapsed)
    });
    localStorage.setItem('nepali_typing_history', JSON.stringify(hist.slice(0, 50)));
    updatePersonalBestsCards();
  } catch (e) {}
}

// --- 10. PERSONAL BESTS & HISTORY UPDATER ---
function updatePersonalBestsCards() {
  try {
    const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
    let pbEng = 0;
    let pbUni = 0;
    let pbRom = 0;
    let pbPre = 0;

    hist.forEach(r => {
      const w = Number(r.wpm) || 0;
      if (r.layout === 'english') pbEng = Math.max(pbEng, w);
      if (r.layout === 'nepali_unicode') pbUni = Math.max(pbUni, w);
      if (r.layout === 'nepali_romanized') pbRom = Math.max(pbRom, w);
      if (r.layout === 'nepali_preeti') pbPre = Math.max(pbPre, w);
    });

    const elEng = document.getElementById('pb-english');
    const elUni = document.getElementById('pb-unicode');
    const elRom = document.getElementById('pb-romanized');
    const elPre = document.getElementById('pb-preeti');
    const elTotal = document.getElementById('total-tests-count');

    if (elEng) elEng.textContent = `${pbEng} WPM`;
    if (elUni) elUni.textContent = `${pbUni} WPM`;
    if (elRom) elRom.textContent = `${pbRom} WPM`;
    if (elPre) elPre.textContent = `${pbPre} WPM`;
    if (elTotal) elTotal.textContent = `${hist.length} test${hist.length === 1 ? '' : 's'} recorded`;
  } catch (e) {}
}

// --- 11. INPUT & KEY EVENT HANDLING ---
function bindInputEvents() {
  const inputField = document.getElementById('typing-input');
  const workbench = document.getElementById('typing-workbench');

  workbench?.addEventListener('click', () => {
    inputField?.focus();
  });

  inputField?.addEventListener('focus', () => {
    workbench?.classList.add('is-active');
  });

  inputField?.addEventListener('blur', () => {
    workbench?.classList.remove('is-active');
  });

  inputField?.addEventListener('input', () => {
    if (state.isFinished) return;
    if (!state.isRunning && inputField.value.length > 0) startTimer();

    // Auto-normalize traditional ligatures
    if (state.lang === 'nepali_unicode' || state.lang === 'nepali_romanized') {
      const val = inputField.value;
      const normalized = val
        .replace(/अा/g, 'आ')
        .replace(/ाे/g, 'ो')
        .replace(/ाै/g, 'ौ')
        .replace(/अो/g, 'ओ')
        .replace(/अौ/g, 'औ');
      if (normalized !== val) {
        inputField.value = normalized;
      }
    }

    renderActiveWordHighlight();
    highlightTargetKey();
    updateCaret();
    updateLiveStats();
  });

  inputField?.addEventListener('keydown', (e) => {
    const curWord = state.words[state.wordIdx];
    const now = performance.now();
    const deltaMs = state.lastStrokeTime > 0 ? Math.max(10, Math.min(3000, Math.round(now - state.lastStrokeTime))) : 150;
    state.lastStrokeTime = now;

    // PREVENT SPACE SCROLLING AND ADVANCE WORD
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();

      if (state.isFinished) return;
      if (!state.isRunning) startTimer();

      const typed = inputField.value.trim();
      if (!curWord) return;

      const isCorrect = (typed === curWord);
      const hadCorrections = (state.currentWordErrors > 0 || state.currentWordBackspaces > 0);
      const wordDuration = Math.round(now - (state.currentWordStartTime || now));

      if (isCorrect) {
        playBeep(480, 'sine', 0.05, 0.08);
        state.correctKeystrokes += curWord.length + 1;
        if (hadCorrections) {
          state.correctedWords++;
        } else {
          state.cleanWords++;
        }
      } else {
        playBeep(160, 'sawtooth', 0.1, 0.1);
        state.errorKeystrokes++;
        state.incorrectWords++;
      }
      state.totalKeystrokes += (typed.length || 1) + 1;

      // Detailed word-by-word audit logging
      state.wordsLog.push({
        index: state.wordIdx + 1,
        targetWord: curWord,
        typedWord: typed || '—',
        isCorrect,
        hadCorrections,
        errorsCount: state.currentWordErrors,
        backspacesCount: state.currentWordBackspaces,
        strokesCount: (typed.length || 0) + state.currentWordBackspaces + 1,
        durationMs: wordDuration
      });

      // Reset tracking for next word
      state.currentWordErrors = 0;
      state.currentWordBackspaces = 0;
      state.currentWordStartTime = performance.now();

      state.keystrokeLogs.push({
        timestamp: now,
        charExpected: ' ',
        charTyped: ' ',
        isCorrect,
        code: 'Space',
        latencyMs: deltaMs
      });

      state.typedWords[state.wordIdx] = typed;

      const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
      if (curWordEl) {
        curWordEl.classList.remove('is-active-word');
        curWordEl.classList.add(isCorrect ? 'is-word-correct' : 'is-word-error');
      }

      state.wordIdx++;
      inputField.value = '';

      // Test completion checks
      if (state.mode === 'words' && state.wordIdx >= state.wordCount) {
        finishTest();
        return;
      }
      if ((state.mode === 'sentences' || state.mode === 'quotes' || state.mode === 'adaptive') && state.wordIdx >= state.words.length) {
        finishTest();
        return;
      }
      if (state.mode === 'exam' && state.wordIdx >= state.words.length) {
        // Complete UN Speech Finished!
        finishTest();
        return;
      }
      if (state.mode === 'time') {
        if (state.wordIdx >= state.words.length - 15) {
          refillWords();
        }
      }

      const nextWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
      if (nextWordEl) {
        nextWordEl.classList.add('is-active-word');
      }

      adjust2LineScroll();
      renderActiveWordHighlight();
      highlightTargetKey();
      updateCaret();
      updateLiveStats();
      return;
    }

    // BACKSPACE SUPPORT
    if (e.key === 'Backspace') {
      state.currentWordBackspaces++;
      state.totalKeystrokes++;

      state.keystrokeLogs.push({
        timestamp: now,
        charExpected: 'Backspace',
        charTyped: 'Backspace',
        isCorrect: false,
        code: 'Backspace',
        latencyMs: deltaMs
      });

      if (inputField.value.length === 0 && state.wordIdx > 0) {
        e.preventDefault();

        // Revert last word record from stats
        if (state.wordsLog.length > 0) {
          const lastLogged = state.wordsLog.pop();
          if (lastLogged.isCorrect) {
            if (lastLogged.hadCorrections) {
              state.correctedWords = Math.max(0, state.correctedWords - 1);
            } else {
              state.cleanWords = Math.max(0, state.cleanWords - 1);
            }
          } else {
            state.incorrectWords = Math.max(0, state.incorrectWords - 1);
          }
          state.currentWordErrors = lastLogged.errorsCount || 0;
          state.currentWordBackspaces = lastLogged.backspacesCount || 0;
        }

        const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
        if (curWordEl) {
          curWordEl.classList.remove('is-active-word', 'is-word-error');
        }

        state.wordIdx--;
        const prevWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
        if (prevWordEl) {
          prevWordEl.classList.remove('is-word-correct', 'is-word-error');
          prevWordEl.classList.add('is-active-word');
        }

        inputField.value = state.typedWords[state.wordIdx] || '';

        adjust2LineScroll();
        renderActiveWordHighlight();
        highlightTargetKey();
        updateCaret();
        updateLiveStats();
        return;
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      setupTest();
      return;
    }

    if (e.key === 'Escape') {
      document.getElementById('stats-modal')?.classList.remove('is-open');
      document.getElementById('history-modal')?.classList.remove('is-open');
      setupTest();
      return;
    }

    // Hardware layout keystroke mapping on US physical keyboard
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (state.isFinished) return;
      if (!state.isRunning) startTimer();

      const isAscii = e.key.charCodeAt(0) < 128;
      const curPos = inputField.selectionStart ?? inputField.value.length;
      const expectedChar = curWord ? (curWord[curPos] || '') : '';

      if (state.lang === 'nepali_unicode' && isAscii) {
        const matched = KEY_CODE_MAP[e.code];
        if (matched && matched.uni) {
          e.preventDefault();
          const ch = (e.shiftKey || state.isShift) ? matched.uni[1] : matched.uni[0];
          const isCharCorrect = (ch === expectedChar);

          state.totalKeystrokes++;
          if (isCharCorrect) {
            state.correctKeystrokes++;
          } else {
            state.errorKeystrokes++;
            state.currentWordErrors++;
            state.errorMap[expectedChar || ch] = (state.errorMap[expectedChar || ch] || 0) + 1;
          }

          state.keystrokeLogs.push({
            timestamp: now,
            charExpected: expectedChar,
            charTyped: ch,
            isCorrect: isCharCorrect,
            code: e.code,
            latencyMs: deltaMs
          });
          recordStrokeData(expectedChar, isCharCorrect, deltaMs);

          const start = inputField.selectionStart ?? inputField.value.length;
          const end = inputField.selectionEnd ?? inputField.value.length;
          inputField.setRangeText(ch, start, end, 'end');

          let val = inputField.value;
          val = val
            .replace(/अा/g, 'आ')
            .replace(/ाे/g, 'ो')
            .replace(/ाै/g, 'ौ')
            .replace(/अो/g, 'ओ')
            .replace(/अौ/g, 'औ');
          inputField.value = val;

          inputField.dispatchEvent(new Event('input'));
          return;
        }
      } else if (state.lang === 'nepali_romanized' && isAscii) {
        const matched = KEY_CODE_MAP[e.code];
        if (matched && matched.rom) {
          e.preventDefault();
          let ch = (e.shiftKey || state.isShift) ? matched.rom[1] : matched.rom[0];

          if (e.code === 'KeyQ' && !e.shiftKey && !state.isShift) {
            if (expectedChar === '्' || expectedChar !== 'ट') {
              ch = '्';
            } else {
              ch = 'ट';
            }
          } else if (e.code === 'Slash' && !e.shiftKey && !state.isShift) {
            ch = '्';
          }

          if (e.code === 'KeyA' && !e.shiftKey && !state.isShift) {
            if (expectedChar === 'अ') {
              ch = 'अ';
            }
          }

          const isCharCorrect = (ch === expectedChar);
          state.totalKeystrokes++;
          if (isCharCorrect) {
            state.correctKeystrokes++;
          } else {
            state.errorKeystrokes++;
            state.currentWordErrors++;
            state.errorMap[expectedChar || ch] = (state.errorMap[expectedChar || ch] || 0) + 1;
          }

          state.keystrokeLogs.push({
            timestamp: now,
            charExpected: expectedChar,
            charTyped: ch,
            isCorrect: isCharCorrect,
            code: e.code,
            latencyMs: deltaMs
          });
          recordStrokeData(expectedChar, isCharCorrect, deltaMs);

          const start = inputField.selectionStart ?? inputField.value.length;
          const end = inputField.selectionEnd ?? inputField.value.length;
          inputField.setRangeText(ch, start, end, 'end');

          let val = inputField.value;
          val = val
            .replace(/अा/g, 'आ')
            .replace(/ाे/g, 'ो')
            .replace(/ाै/g, 'ौ')
            .replace(/अो/g, 'ओ')
            .replace(/अौ/g, 'औ');
          inputField.value = val;

          inputField.dispatchEvent(new Event('input'));
          return;
        }
      } else {
        // English or Preeti native input
        const isCharCorrect = (e.key === expectedChar);
        state.totalKeystrokes++;
        if (isCharCorrect) {
          state.correctKeystrokes++;
        } else {
          state.errorKeystrokes++;
          state.currentWordErrors++;
          state.errorMap[expectedChar || e.key] = (state.errorMap[expectedChar || e.key] || 0) + 1;
        }

        state.keystrokeLogs.push({
          timestamp: now,
          charExpected: expectedChar,
          charTyped: e.key,
          isCorrect: isCharCorrect,
          code: e.code,
          latencyMs: deltaMs
        });
        recordStrokeData(expectedChar, isCharCorrect, deltaMs);
      }
    }
  });

  // FREE STYLE CANVAS BINDINGS
  const freestyleInput = document.getElementById('freestyle-input');
  const finishFreestyleBtn = document.getElementById('finish-freestyle-btn');

  freestyleInput?.addEventListener('input', () => {
    if (state.isFinished) return;
    if (!state.isRunning && freestyleInput.value.length > 0) startTimer();

    const val = freestyleInput.value;
    state.freestyleText = val;
    state.freestyleChars = val.length;
    const words = val.trim().split(/\s+/).filter(Boolean);
    state.freestyleWords = words.length;

    const elapsed = Math.max(1, (performance.now() - state.startTime) / 1000);
    const m = elapsed / 60;
    const currentWpm = Math.round((val.length / 5) / m);

    const fWordEl = document.getElementById('freestyle-word-count');
    const fCharEl = document.getElementById('freestyle-char-count');
    const fBurstEl = document.getElementById('freestyle-burst-wpm');

    if (fWordEl) fWordEl.textContent = `${words.length}`;
    if (fCharEl) fCharEl.textContent = `${val.length}`;
    if (fBurstEl) fBurstEl.textContent = `${currentWpm} WPM`;

    updateLiveStats();
  });

  freestyleInput?.addEventListener('keydown', (e) => {
    if (state.isFinished) return;
    if (!state.isRunning) startTimer();

    const now = performance.now();
    const deltaMs = state.lastStrokeTime > 0 ? Math.max(10, Math.min(3000, Math.round(now - state.lastStrokeTime))) : 150;
    state.lastStrokeTime = now;
    state.totalKeystrokes++;

    if (e.key === 'Backspace') {
      state.freestyleBackspaces++;
      state.keystrokeLogs.push({
        timestamp: now,
        charExpected: 'Backspace',
        charTyped: 'Backspace',
        isCorrect: false,
        code: 'Backspace',
        latencyMs: deltaMs
      });
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      state.correctKeystrokes++;
      state.keystrokeLogs.push({
        timestamp: now,
        charExpected: e.key,
        charTyped: e.key,
        isCorrect: true,
        code: e.code,
        latencyMs: deltaMs
      });
    }
  });

  finishFreestyleBtn?.addEventListener('click', () => {
    finishFreestyleTest();
  });

  window.addEventListener('keydown', (e) => {
    if (state.mode === 'freestyle') {
      if (document.activeElement !== freestyleInput && !e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
        freestyleInput?.focus();
      }
      return;
    }

    if (document.activeElement !== inputField && !e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
      inputField?.focus();
    }

    if (e.key === 'Shift') {
      if (!state.isShift) {
        state.isShift = true;
        renderKeyboard();
      }
    }
    const kc = document.querySelector(`.keycap[data-code="${e.code}"]`);
    if (kc) kc.classList.add('is-pressed');

    const activeDisp = document.getElementById('kb-active-char');
    if (activeDisp) activeDisp.textContent = e.key === ' ' ? 'Space' : e.key;
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
      if (state.isShift) {
        state.isShift = false;
        renderKeyboard();
      }
    }
    const kc = document.querySelector(`.keycap[data-code="${e.code}"]`);
    if (kc) kc.classList.remove('is-pressed');
  });
}

// --- 12. TOOLBAR, MODAL & BUTTON LISTENERS ---
function bindToolbarEvents() {
  // Language Tabs
  document.querySelectorAll('.lang-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-tab-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-primary)]', 'shadow-sm');
        b.classList.add('text-[var(--text-secondary)]');
      });
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-primary)]', 'shadow-sm');
      btn.classList.remove('text-[var(--text-secondary)]');
      state.lang = btn.dataset.lang;
      setupTest();
    });
  });

  // Mode Tabs
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-tab-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-blue)]');
        b.classList.add('text-[var(--text-muted)]');
      });
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-blue)]');
      btn.classList.remove('text-[var(--text-muted)]');
      state.mode = btn.dataset.mode;

      const timeOpts = document.getElementById('time-options');
      const wordsOpts = document.getElementById('words-options');
      const parasOpts = document.getElementById('paragraphs-options');
      const examOpts = document.getElementById('exam-options');
      const adaptiveOpts = document.getElementById('adaptive-options');
      const diffOpts = document.getElementById('diff-options');
      const freestyleOpts = document.getElementById('freestyle-options');

      if (timeOpts) timeOpts.classList.toggle('hidden', state.mode !== 'time');
      if (wordsOpts) wordsOpts.classList.toggle('hidden', state.mode !== 'words');
      if (parasOpts) parasOpts.classList.toggle('hidden', state.mode !== 'sentences' && state.mode !== 'quotes');
      if (examOpts) examOpts.classList.toggle('hidden', state.mode !== 'exam');
      if (adaptiveOpts) adaptiveOpts.classList.toggle('hidden', state.mode !== 'adaptive');
      if (diffOpts) diffOpts.classList.toggle('hidden', state.mode === 'exam' || state.mode === 'adaptive' || state.mode === 'freestyle');
      if (freestyleOpts) freestyleOpts.classList.toggle('hidden', state.mode !== 'freestyle');

      if (state.mode === 'freestyle') {
        state.lang = 'english';
        document.querySelectorAll('.lang-tab-btn').forEach(b => {
          const isTarget = b.dataset.lang === 'english';
          b.classList.toggle('active', isTarget);
          b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
          b.classList.toggle('text-[var(--accent-primary)]', isTarget);
          b.classList.toggle('text-[var(--text-secondary)]', !isTarget);
        });
      }

      setupTest();
    });
  });

  // Time Duration Buttons
  document.querySelectorAll('.time-btn[data-seconds]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
        b.classList.add('text-[var(--text-muted)]');
      });
      const customTimeBtn = document.getElementById('time-custom-btn');
      if (customTimeBtn) customTimeBtn.textContent = 'Custom';
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      btn.classList.remove('text-[var(--text-muted)]');
      state.duration = parseInt(btn.dataset.seconds, 10);
      setupTest();
    });
  });

  // Custom Time Button
  document.getElementById('time-custom-btn')?.addEventListener('click', () => {
    const input = prompt('Enter custom time limit in seconds (5 - 3600):', '45');
    if (!input) return;
    const sec = parseInt(input.trim(), 10);
    if (isNaN(sec) || sec < 5 || sec > 3600) {
      alert('Please enter a valid duration between 5 and 3600 seconds.');
      return;
    }
    document.querySelectorAll('.time-btn').forEach(b => {
      b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      b.classList.add('text-[var(--text-muted)]');
    });
    const customBtn = document.getElementById('time-custom-btn');
    if (customBtn) {
      customBtn.textContent = `${sec}s`;
      customBtn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      customBtn.classList.remove('text-[var(--text-muted)]');
    }
    state.duration = sec;
    setupTest();
  });

  // Word Count Buttons
  document.querySelectorAll('.word-count-btn[data-words]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.word-count-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
        b.classList.add('text-[var(--text-muted)]');
      });
      const customWordBtn = document.getElementById('word-custom-btn');
      if (customWordBtn) customWordBtn.textContent = 'Custom';
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      btn.classList.remove('text-[var(--text-muted)]');
      state.wordCount = parseInt(btn.dataset.words, 10);
      setupTest();
    });
  });

  // Custom Word Count Button
  document.getElementById('word-custom-btn')?.addEventListener('click', () => {
    const input = prompt('Enter custom word count (5 - 2000):', '75');
    if (!input) return;
    const cnt = parseInt(input.trim(), 10);
    if (isNaN(cnt) || cnt < 5 || cnt > 2000) {
      alert('Please enter a valid word count between 5 and 2000.');
      return;
    }
    document.querySelectorAll('.word-count-btn').forEach(b => {
      b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      b.classList.add('text-[var(--text-muted)]');
    });
    const customBtn = document.getElementById('word-custom-btn');
    if (customBtn) {
      customBtn.textContent = `${cnt}w`;
      customBtn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      customBtn.classList.remove('text-[var(--text-muted)]');
    }
    state.wordCount = cnt;
    setupTest();
  });

  // Paragraph Count Buttons
  document.querySelectorAll('.para-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.para-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
        b.classList.add('text-[var(--text-muted)]');
      });
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      btn.classList.remove('text-[var(--text-muted)]');
      state.paragraphCount = parseInt(btn.dataset.paras, 10) || 1;
      setupTest();
    });
  });

  // Exam Options (Full, 5m, 10m)
  document.querySelectorAll('.exam-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.exam-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-purple-600');
        b.classList.add('text-[var(--text-muted)]');
      });
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-purple-600');
      btn.classList.remove('text-[var(--text-muted)]');
      state.examType = btn.dataset.modeType || 'full';
      if (btn.dataset.seconds) {
        state.duration = parseInt(btn.dataset.seconds, 10);
      } else {
        state.duration = 0;
      }
      setupTest();
    });
  });

  // Difficulty Buttons
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-amber-500');
        b.classList.add('text-[var(--text-muted)]');
      });
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-amber-500');
      btn.classList.remove('text-[var(--text-muted)]');
      state.difficulty = btn.dataset.diff;
      setupTest();
    });
  });

  // Restart buttons
  document.getElementById('manual-restart-btn')?.addEventListener('click', setupTest);
  document.getElementById('restart-from-modal-btn')?.addEventListener('click', () => {
    document.getElementById('stats-modal')?.classList.remove('is-open');
    setupTest();
  });
  document.getElementById('close-modal-btn')?.addEventListener('click', () => {
    document.getElementById('stats-modal')?.classList.remove('is-open');
  });

  // Claim & View Certificate Button in Modal
  document.getElementById('modal-claim-cert-btn')?.addEventListener('click', async () => {
    if (!lastFinishedResult) return;
    const nameInput = document.getElementById('modal-candidate-name-input');
    const name = (nameInput?.value || '').trim() || 'Qualified Candidate';
    localStorage.setItem('topnepali_candidate_name', name);

    const btn = document.getElementById('modal-claim-cert-btn');
    if (btn) btn.textContent = 'Generating Certificate...';

    const cert = await saveCertificate({
      candidateName: name,
      layout: lastFinishedResult.layout,
      mode: lastFinishedResult.mode,
      durationSeconds: lastFinishedResult.elapsed,
      netWpm: lastFinishedResult.netWpm,
      rawWpm: lastFinishedResult.rawWpm,
      accuracy: lastFinishedResult.acc,
      consistency: lastFinishedResult.strokeAnalytics?.rhythmStability || 95,
      cpm: lastFinishedResult.cpm,
      totalKeystrokes: state.totalKeystrokes,
      correctKeystrokes: state.correctKeystrokes,
      errorKeystrokes: state.errorKeystrokes,
      analytics: lastFinishedResult.strokeAnalytics
    });

    // Navigate to Certificate View page
    window.location.href = `/certificate/view?id=${encodeURIComponent(cert.id)}`;
  });

  // Launch Adaptive Drill Button in Modal
  document.getElementById('modal-launch-drill-btn')?.addEventListener('click', () => {
    document.getElementById('stats-modal')?.classList.remove('is-open');

    // Switch mode to adaptive
    state.mode = 'adaptive';
    document.querySelectorAll('.mode-tab-btn').forEach(b => {
      const isAdaptive = b.dataset.mode === 'adaptive';
      b.classList.toggle('active', isAdaptive);
      b.classList.toggle('bg-[var(--bg-surface)]', isAdaptive);
      b.classList.toggle('text-[var(--accent-blue)]', isAdaptive);
      b.classList.toggle('text-[var(--text-muted)]', !isAdaptive);
    });

    const timeOpts = document.getElementById('time-options');
    const wordsOpts = document.getElementById('words-options');
    const parasOpts = document.getElementById('paragraphs-options');
    const examOpts = document.getElementById('exam-options');
    const adaptiveOpts = document.getElementById('adaptive-options');
    const diffOpts = document.getElementById('diff-options');
    const freestyleOpts = document.getElementById('freestyle-options');

    if (timeOpts) timeOpts.classList.add('hidden');
    if (wordsOpts) wordsOpts.classList.add('hidden');
    if (parasOpts) parasOpts.classList.add('hidden');
    if (examOpts) examOpts.classList.add('hidden');
    if (adaptiveOpts) adaptiveOpts.classList.remove('hidden');
    if (diffOpts) diffOpts.classList.add('hidden');
    if (freestyleOpts) freestyleOpts.classList.add('hidden');

    setupTest();
  });

  // Sound toggle
  document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
    state.sound = !state.sound;
    document.getElementById('sound-icon-on')?.classList.toggle('hidden', !state.sound);
    document.getElementById('sound-icon-off')?.classList.toggle('hidden', state.sound);
  });

  // Toggle Keyboard Visualizer
  const kbToggleBtn = document.getElementById('toggle-keyboard-btn');
  const kbContainer = document.getElementById('keyboard-visualizer-container');
  const kbToggleTxt = document.getElementById('toggle-keyboard-text');

  kbToggleBtn?.addEventListener('click', () => {
    if (!kbContainer) return;
    const isHidden = kbContainer.classList.contains('hidden');
    kbContainer.classList.toggle('hidden', !isHidden);
    if (kbToggleTxt) kbToggleTxt.textContent = !isHidden ? 'Show Keys' : 'Hide Keys';
    kbToggleBtn.classList.toggle('bg-[var(--bg-surface-subtle)]', isHidden);
    if (isHidden) {
      kbContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Toggle Shift on Keyboard Visualizer
  document.getElementById('kb-shift-toggle')?.addEventListener('click', () => {
    state.isShift = !state.isShift;
    const ind = document.getElementById('kb-shift-indicator');
    if (ind) ind.className = state.isShift ? 'w-2 h-2 rounded-full bg-red-500 inline-block' : 'w-2 h-2 rounded-full bg-neutral-400 inline-block';
    renderKeyboard();
  });

  // Copy Results Summary
  document.getElementById('copy-result-btn')?.addEventListener('click', () => {
    const netWpm = document.getElementById('modal-net-wpm')?.textContent || '0';
    const acc = document.getElementById('modal-accuracy')?.textContent || '100%';
    const rawWpm = document.getElementById('modal-raw-wpm')?.textContent || '0';
    const rank = document.getElementById('modal-rank-pill')?.textContent || 'Master Typist';
    const meta = document.getElementById('modal-test-metadata')?.textContent || '';

    const summary = `🏆 TopNepali Typing PRO Results:\nLayout: ${meta}\nSpeed: ${netWpm} Net WPM (${rawWpm} Raw WPM)\nAccuracy: ${acc}\nRank: ${rank}\nBenchmark & Certify your typing: https://typing.topnepali.com`;

    navigator.clipboard?.writeText(summary).then(() => {
      const copyTxt = document.getElementById('copy-result-text');
      if (copyTxt) {
        const oldTxt = copyTxt.textContent;
        copyTxt.textContent = '✓ Copied!';
        setTimeout(() => { copyTxt.textContent = oldTxt; }, 2000);
      }
    }).catch(() => {});
  });

  // History Modal
  document.getElementById('open-history-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('history-modal');
    const table = document.getElementById('history-table-body');
    const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
    updatePersonalBestsCards();

    if (table) {
      if (hist.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-muted">No test records yet. Complete a test to record your stats!</td></tr>';
      } else {
        table.innerHTML = hist.map(r => `
          <tr>
            <td class="p-2.5 font-mono">${r.date}</td>
            <td class="p-2.5 uppercase font-medium">${(r.layout || '').replace('nepali_', '')}</td>
            <td class="p-2.5">${r.mode || `${r.duration}s`}</td>
            <td class="p-2.5 font-bold font-mono text-red-500">${r.wpm} WPM</td>
            <td class="p-2.5 font-mono text-emerald-500">${r.acc}%</td>
          </tr>
        `).join('');
      }
    }
    modal?.classList.add('is-open');
  });

  document.getElementById('close-history-btn')?.addEventListener('click', () => {
    document.getElementById('history-modal')?.classList.remove('is-open');
  });

  document.getElementById('clear-history-btn')?.addEventListener('click', () => {
    if (confirm('Clear all history records?')) {
      localStorage.removeItem('nepali_typing_history');
      updatePersonalBestsCards();
      document.getElementById('open-history-btn')?.click();
    }
  });

  // URL Query Parameters Initializer (e.g. ?mode=exam&exam=5m&lang=english)
  try {
    const params = new URLSearchParams(window.location.search);
    const qLang = params.get('lang');
    const qMode = params.get('mode');
    const qExam = params.get('exam');

    if (qLang && ['nepali_unicode', 'nepali_romanized', 'nepali_preeti', 'english'].includes(qLang)) {
      state.lang = qLang;
      document.querySelectorAll('.lang-tab-btn').forEach(b => {
        const isTarget = b.dataset.lang === qLang;
        b.classList.toggle('active', isTarget);
        b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
        b.classList.toggle('text-[var(--accent-primary)]', isTarget);
      });
    }

    if (qMode && ['time', 'words', 'sentences', 'quotes', 'exam', 'adaptive', 'freestyle'].includes(qMode)) {
      state.mode = qMode;
      document.querySelectorAll('.mode-tab-btn').forEach(b => {
        const isTarget = b.dataset.mode === qMode;
        b.classList.toggle('active', isTarget);
        b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
        b.classList.toggle('text-[var(--accent-blue)]', isTarget);
      });

      const timeOpts = document.getElementById('time-options');
      const wordsOpts = document.getElementById('words-options');
      const examOpts = document.getElementById('exam-options');
      const adaptiveOpts = document.getElementById('adaptive-options');
      const diffOpts = document.getElementById('diff-options');
      const freestyleOpts = document.getElementById('freestyle-options');

      if (timeOpts) timeOpts.classList.toggle('hidden', state.mode !== 'time');
      if (wordsOpts) wordsOpts.classList.toggle('hidden', state.mode !== 'words');
      if (examOpts) examOpts.classList.toggle('hidden', state.mode !== 'exam');
      if (adaptiveOpts) adaptiveOpts.classList.toggle('hidden', state.mode !== 'adaptive');
      if (diffOpts) diffOpts.classList.toggle('hidden', state.mode === 'exam' || state.mode === 'adaptive' || state.mode === 'freestyle');
      if (freestyleOpts) freestyleOpts.classList.toggle('hidden', state.mode !== 'freestyle');

      if (state.mode === 'freestyle') {
        state.lang = 'english';
        document.querySelectorAll('.lang-tab-btn').forEach(b => {
          const isTarget = b.dataset.lang === 'english';
          b.classList.toggle('active', isTarget);
          b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
          b.classList.toggle('text-[var(--accent-primary)]', isTarget);
          b.classList.toggle('text-[var(--text-secondary)]', !isTarget);
        });
      }

      if (qExam && ['full', '5m', '10m'].includes(qExam)) {
        state.examType = qExam;
        document.querySelectorAll('.exam-btn').forEach(b => {
          const isTarget = b.dataset.modeType === qExam;
          b.classList.toggle('active', isTarget);
          b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
          b.classList.toggle('font-bold', isTarget);
          b.classList.toggle('text-purple-600', isTarget);
        });
      }
    }
  } catch (e) {}
}

// --- 13. INITIALIZE ON DOM READY ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    bindInputEvents();
    bindToolbarEvents();
    setupTest();
  });
} else {
  bindInputEvents();
  bindToolbarEvents();
  setupTest();
}
