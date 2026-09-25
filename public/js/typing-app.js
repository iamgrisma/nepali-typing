/**
 * Nepali Typing PRO — Complete Client Application Engine
 * Modular Architecture:
 * - Data: /data/speeches.js, /data/typing-words.js, /data/keyboards.js
 * - Utils: /utils/preeti-converter.js
 * - Segmenter: Intl.Segmenter-based grapheme cluster handling
 */

import { EXAM_SPEECH_NEPALI, EXAM_SPEECH_ENGLISH } from './data/speeches.js';
import { DATA } from './data/typing-words.js';
import { KEY_ROWS, KEY_CODE_MAP } from './data/keyboards.js';
import { toPreeti } from './utils/preeti-converter.js';

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

// --- 6. APPLICATION STATE ---
let state = {
  lang: 'nepali_unicode',
  mode: 'time',
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
  timeline: []
};

// Web Audio Context for keystroke and completion sounds
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

// --- 7. WORDS POOL & CONTENT SELECTION ---
function getWordsPool() {
  let list = [];

  if (state.mode === 'exam') {
    const isEng = state.lang === 'english';
    const text = isEng ? EXAM_SPEECH_ENGLISH : EXAM_SPEECH_NEPALI;
    list = text.split(/\s+/).filter(Boolean);
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
    const shSentences = [...diffObj.sentences].sort(() => 0.5 - Math.random());
    const text = shSentences.join(' ');
    list = text.split(/\s+/).filter(Boolean);
  } else if (state.mode === 'quotes') {
    const shQuotes = [...diffObj.quotes].sort(() => 0.5 - Math.random());
    const text = shQuotes.join(' ');
    list = text.split(/\s+/).filter(Boolean);
  } else if (state.mode === 'special') {
    const text = diffObj.special.join(' ');
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
  if (state.mode === 'exam') return; // Exam mode uses entire sequential speech text

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

// --- 8. TEST SETUP & RESET ---
function setupTest() {
  clearInterval(state.timer);
  state.timer = null;
  state.isRunning = false;
  state.isFinished = false;
  state.wordIdx = 0;
  state.typedWords = [];
  state.timeline = [];
  state.totalKeystrokes = 0;
  state.correctKeystrokes = 0;
  state.errorKeystrokes = 0;
  state.errorMap = {};
  state.secsLeft = state.duration;

  const timerDisp = document.getElementById('live-timer-display');
  const progDisp = document.getElementById('live-progress-display');
  const wpmDisp = document.getElementById('live-wpm-display');
  const accDisp = document.getElementById('live-acc-display');
  const inputField = document.getElementById('typing-input');

  if (timerDisp) timerDisp.textContent = (state.mode === 'time' || state.mode === 'exam') ? `${state.secsLeft}` : '0s';
  if (progDisp) progDisp.textContent = `0 / ${state.mode === 'words' ? state.wordCount : state.words.length || 25} words`;
  if (wpmDisp) wpmDisp.textContent = '0';
  if (accDisp) accDisp.textContent = '100%';

  if (inputField) {
    inputField.value = '';
    inputField.removeAttribute('placeholder');
    inputField.focus();
  }

  state.words = getWordsPool();

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

    // Pre-insert caret inside words-container for 100% stable coordinate space
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

// --- 9. ACTIVE WORD HIGHLIGHT & ACCURATE CARET ---
function renderActiveWordHighlight() {
  const curWord = state.words[state.wordIdx];
  const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
  const inputField = document.getElementById('typing-input');
  if (!curWord || !curWordEl || !inputField) return;

  const typed = inputField.value;
  const clusters = getGraphemes(curWord, state.lang);
  const charSpans = curWordEl.querySelectorAll('.char-node:not(.is-extra-error)');

  // Remove any previously appended extra error spans
  curWordEl.querySelectorAll('.is-extra-error').forEach(el => el.remove());

  let typedOffset = 0;
  let hasError = false;

  for (let i = 0; i < clusters.length; i++) {
    const cl = clusters[i];
    const span = charSpans[i];
    if (!span) continue;

    span.className = 'char-node';

    if (typedOffset >= typed.length) {
      // Untouched
      continue;
    }

    const remainingTyped = typed.slice(typedOffset);

    if (remainingTyped.startsWith(cl)) {
      // Fully correct grapheme cluster
      span.classList.add('is-correct');
      typedOffset += cl.length;
    } else if (cl.startsWith(remainingTyped)) {
      // In-progress cluster (e.g. typed base consonant before matra)
      span.classList.add('is-partial');
      typedOffset += remainingTyped.length;
    } else {
      // Mismatched error cluster
      span.classList.add('is-error');
      hasError = true;
      typedOffset += Math.min(cl.length, remainingTyped.length);
      const expected = cl;
      state.errorMap[expected] = (state.errorMap[expected] || 0) + 1;
    }
  }

  // If user typed beyond the word length, render extra characters
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

    // Smooth auto-scroll when passing line boundary in 2-line container
    if (sRect.top - cRect.top > 38) {
      container.scrollTop += 38;
    }
  }
}

// --- 10. KEYBOARD VISUALIZER ENGINE ---
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

      if (!k.special) {
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
        if (k.special) {
          keyDiv.textContent = k.label || k.key;
        } else {
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
        keyDiv.className = `keycap ${k.special ? 'special-key' : ''}`;
        keyDiv.dataset.code = k.code;
        keyDiv.style.flex = `${k.flex} 1 0%`;

        if (k.special) {
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
    nepali_unicode: 'नेपाली युनिकोड (Traditional) Keyboard Layout',
    nepali_romanized: 'नेपाली युनिकोड (Romanized) Phonetic Layout',
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

  // Crucial: keep target key highlighted and synced across Shift and layout states
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
    } else if (state.lang === 'nepali_unicode' && targetCh === 'ऐ') {
      targetDisp.textContent = 'ऐ (Shift + E)';
    } else if (state.lang === 'nepali_unicode' && targetCh === 'ऊ') {
      targetDisp.textContent = 'ऊ (Shift + U)';
    } else if (state.lang === 'nepali_unicode' && targetCh === 'झ') {
      targetDisp.textContent = 'झ (Shift + H)';
    } else if (state.lang === 'nepali_unicode' && targetCh === 'ॐ') {
      targetDisp.textContent = 'ॐ (Shift + V)';
    } else if (state.lang === 'nepali_unicode' && targetCh === 'फ') {
      targetDisp.textContent = 'फ (Shift + K)';
    } else if (state.lang === 'nepali_romanized' && targetCh === '्') {
      targetDisp.textContent = '् (q or /)';
    } else if (state.lang === 'nepali_romanized' && targetCh === 'अ') {
      targetDisp.textContent = 'अ (Shift + H or a)';
    } else if (state.lang === 'nepali_preeti') {
      let desc = targetCh;
      for (const row of KEY_ROWS) {
        for (const k of row) {
          if (k.special || !k.pre) continue;
          if (k.pre[0] === targetCh) {
            desc = `${k.pre[2]} (${targetCh})`;
            break;
          } else if (k.pre[1] === targetCh) {
            desc = `${k.pre[3]} (${targetCh}) [Shift + ${k.key.toUpperCase()}]`;
            break;
          }
        }
        if (desc !== targetCh) break;
      }
      targetDisp.textContent = desc;
    } else {
      targetDisp.textContent = targetCh;
    }

    // In Traditional layout, show informative hints for multi-char ligatures
    if (state.lang === 'nepali_unicode') {
      const remaining = curWord.slice(typed.length);
      const tradLigatures = [
        ['क्ष', 'क्ष (Shift + I or क+्+ष)'],
        ['ज्ञ', 'ज्ञ (Shift + 1 or ज+्+ञ)'],
        ['त्र', 'त्र (q or त+्+र)'],
        ['श्र', 'श्र (Shift + . or श+्+र)'],
        ['रु', 'रु (Shift + / or र+ु)'],
        ['द्ध', 'द्ध (Shift + 4 or द+्+ध)'],
        ['द्द', 'द्द (Shift + G or द+्+द)'],
        ['त्त', 'त्त (Shift + Q or त+्+त)'],
        ['ट्ट', 'ट्ट (Shift + T or ट+्+ट)'],
        ['ठ्ठ', 'ठ्ठ (Shift + Y or ठ+्+ठ)'],
        ['ड्ढ', 'ड्ढ (Shift + W or ड+्+ढ)'],
        ['ड्ड', 'ड्ड (Shift + M or ड+्+ड)'],
        ['ट्ठ', 'ट्ठ (Shift + ; or ट+्+ठ)'],
        ['ङ्ग', 'ङ्ग (Shift + D or ङ+्+ग)'],
        ['ङ्क', 'ङ्क (Shift + S or ङ+्+क)'],
        ['क्क', 'क्क (Shift + Z or क+्+क)'],
        ['ह्य', 'ह्य (Shift + X or ह+्+य)'],
        ['द्य', 'द्य (Shift + N or द+्+य)'],
        ['द्ब', 'द्ब (Shift + R or द+्+ब)']
      ];
      for (const [lig, desc] of tradLigatures) {
        if (remaining.startsWith(lig)) {
          targetDisp.textContent = desc;
          break;
        }
      }
    }
  }

  if (targetCh === ' ') {
    document.querySelector('.keycap[data-code="Space"]')?.classList.add('is-target');
    return;
  }

  // Special halanta highlighting for Romanized: highlight both Slash and KeyQ
  if (state.lang === 'nepali_romanized' && targetCh === '्') {
    document.querySelector('.keycap[data-code="Slash"]')?.classList.add('is-target');
    document.querySelector('.keycap[data-code="KeyQ"]')?.classList.add('is-target');
    return;
  }

  // Special independent 'अ' highlighting for Romanized: highlight KeyH, ShiftLeft, and KeyA
  if (state.lang === 'nepali_romanized' && targetCh === 'अ') {
    document.querySelector('.keycap[data-code="KeyH"]')?.classList.add('is-target');
    document.querySelector('.keycap[data-code="ShiftLeft"]')?.classList.add('is-target');
    document.querySelector('.keycap[data-code="KeyA"]')?.classList.add('is-target');
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

  // Special fallbacks for independent characters in Romanized:
  // e.g. 'अ' is Shift+H (KeyH shifted)
  if (!targetCode && state.lang === 'nepali_romanized' && targetCh === 'अ') {
    targetCode = 'KeyH';
    needsShift = true;
  }

  if (targetCode) {
    document.querySelector(`.keycap[data-code="${targetCode}"]`)?.classList.add('is-target');
    if (needsShift) {
      document.querySelector('.keycap[data-code="ShiftLeft"]')?.classList.add('is-target');
    }
  }
}

// --- 11. REAL-TIME STATS & WALL-CLOCK TIMER ---
function computeCurrentStats() {
  const elapsed = Math.max(1, (performance.now() - state.startTime) / 1000);
  const m = elapsed / 60;
  const wpm = Math.max(0, Math.round((state.correctKeystrokes / 5) / m));
  const rawWpm = Math.round((state.totalKeystrokes / 5) / m);
  const acc = state.totalKeystrokes > 0 ? Math.min(100, Math.round((state.correctKeystrokes / state.totalKeystrokes) * 1000) / 10) : 100;
  return { wpm, rawWpm, acc, elapsed };
}

function startTimer() {
  if (state.isRunning) return;
  state.isRunning = true;
  state.startTime = performance.now();
  state.timeline = [];

  state.timer = setInterval(() => {
    const now = performance.now();
    const elapsed = Math.floor((now - state.startTime) / 1000);

    if (state.mode === 'time' || state.mode === 'exam') {
      state.secsLeft = Math.max(0, state.duration - elapsed);
      const tDisp = document.getElementById('live-timer-display');
      if (tDisp) tDisp.textContent = `${state.secsLeft}`;
      if (state.secsLeft <= 0) {
        finishTest();
        return;
      }
    } else {
      const tDisp = document.getElementById('live-timer-display');
      if (tDisp) tDisp.textContent = `${elapsed}s`;
    }

    updateLiveStats();

    // Record second snapshot for timeline chart
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
  const progDisp = document.getElementById('live-progress-display');

  if (wpmDisp) wpmDisp.textContent = `${stats.wpm}`;
  if (accDisp) accDisp.textContent = `${Math.round(stats.acc)}%`;
  if (progDisp) progDisp.textContent = `${state.wordIdx} / ${state.mode === 'words' ? state.wordCount : state.words.length} words`;
}

// --- 12. SVG TIMELINE GRAPH GENERATOR ---
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

  // Horizontal Grid Lines & Scale
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

  // Raw WPM line (Blue)
  svgHtml += `<polyline points="${rawPoints}" fill="none" stroke="#60a5fa" stroke-width="1.75" stroke-linecap="round" opacity="0.8" />`;

  // Net WPM line (Accent Red)
  svgHtml += `<polyline points="${netPoints}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" stroke-linecap="round" />`;

  // Errors (Red dots)
  timeline.forEach((p, i) => {
    if (p.errors > 0) {
      svgHtml += `<circle cx="${getX(i)}" cy="${getY(p.wpm)}" r="3.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" />`;
    }
  });

  svg.innerHTML = svgHtml;
}

// --- 13. FINISH TEST & DETAILED REPORT ---
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

  // Calculate Consistency % (Monkeytype standard CV)
  let consistency = 95;
  if (state.timeline.length > 2) {
    const wpms = state.timeline.map(p => p.wpm);
    const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    if (mean > 0) {
      const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      const cv = (stdDev / mean) * 100;
      consistency = Math.max(0, Math.min(100, Math.round(100 - cv)));
    }
  }

  // Typist Proficiency Ranking
  let rank = '🌱 Intermediate';
  let feedback = 'नियमित अभ्यासले किबोर्डमा गति र आत्मविश्वास बढ्दै जान्छ।';
  if (netWpm >= 50 && acc >= 95) {
    rank = '🚀 Speed Demon';
    feedback = 'अविश्वसनीय गति! तपाईं प्रो स्तरको टाइपिस्ट हुनुहुन्छ।';
  } else if (netWpm >= 40 && acc >= 90) {
    rank = '⚡ Master Typist';
    feedback = 'उत्कृष्ट गति र शुद्धता! व्यावसायिक स्तरको लेखन क्षमता।';
  } else if (netWpm >= 30 && acc >= 88) {
    rank = '🎯 Proficient';
    feedback = 'धेरै राम्रो गति! दैनिक काम, परीक्षा र साहित्य लेखनका लागि उपयुक्त।';
  } else if (netWpm < 20) {
    rank = '🐣 Learner';
    feedback = 'हतार नगरी शुद्धतामा ध्यान दिनुहोस्, गति आफैँ बढ्दै जानेछ।';
  }

  // Most frequent missed keys
  const missedSorted = Object.entries(state.errorMap).sort((a, b) => b[1] - a[1]);
  const topMissed = missedSorted.slice(0, 3).map(([k, c]) => `${k} (${c})`).join(', ') || 'None';

  // Populate Detailed Stats Modal
  const mNet = document.getElementById('modal-net-wpm');
  const mAcc = document.getElementById('modal-accuracy');
  const mAccDetail = document.getElementById('modal-acc-detail');
  const mRaw = document.getElementById('modal-raw-wpm');
  const mConsistency = document.getElementById('modal-consistency');
  const mCpm = document.getElementById('modal-cpm');
  const mRankPill = document.getElementById('modal-rank-pill');
  const mRankLbl = document.getElementById('modal-rank-label');
  const mRankFeed = document.getElementById('modal-rank-feedback');
  const mCorrect = document.getElementById('modal-strokes-correct');
  const mError = document.getElementById('modal-strokes-error');
  const mMissed = document.getElementById('modal-missed-keys');
  const mErrorRate = document.getElementById('modal-error-rate');
  const mMeta = document.getElementById('modal-test-metadata');

  const langNames = {
    nepali_unicode: 'नेपाली Traditional',
    nepali_romanized: 'नेपाली Romanized',
    nepali_preeti: 'Preeti (ASCII)',
    english: 'English QWERTY'
  };

  let modeDesc = '';
  if (state.mode === 'exam') {
    modeDesc = `🎓 Exam (${Math.round(state.duration / 60)} Min)`;
  } else if (state.mode === 'time') {
    modeDesc = `${state.duration} Seconds`;
  } else {
    modeDesc = `${state.wordCount} Words`;
  }

  const diffDesc = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);

  if (mNet) mNet.textContent = `${netWpm}`;
  if (mAcc) mAcc.textContent = `${acc}%`;
  if (mAccDetail) mAccDetail.textContent = `${state.errorKeystrokes} errors`;
  if (mRaw) mRaw.textContent = `${rawWpm}`;
  if (mConsistency) mConsistency.textContent = `${consistency}%`;
  if (mCpm) mCpm.textContent = `${cpm} CPM`;
  if (mRankPill) mRankPill.textContent = rank;
  if (mRankLbl) mRankLbl.textContent = rank;
  if (mRankFeed) mRankFeed.textContent = feedback;
  if (mCorrect) mCorrect.textContent = `${state.correctKeystrokes}`;
  if (mError) mError.textContent = `${state.errorKeystrokes}`;
  if (mMissed) mMissed.textContent = topMissed;
  if (mErrorRate) mErrorRate.textContent = `${(100 - acc).toFixed(1)}%`;
  if (mMeta) mMeta.textContent = `${langNames[state.lang] || state.lang} • ${modeDesc} • ${diffDesc}`;

  renderTimelineChart(state.timeline);
  document.getElementById('stats-modal')?.classList.add('is-open');

  // Save record to LocalStorage
  try {
    const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
    hist.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString(),
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

// --- 14. PERSONAL BESTS & HISTORY UPDATER ---
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
    if (elTotal) elTotal.textContent = `${hist.length} test${hist.length === 1 ? '' : 's'} completed`;
  } catch (e) {}
}

// --- 15. INPUT & KEY EVENT HANDLING ---
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

  // Real-time Keystroke Input Handler
  inputField?.addEventListener('input', () => {
    if (state.isFinished) return;
    if (!state.isRunning && inputField.value.length > 0) startTimer();

    // Normalize combined traditional & romanized Devanagari ligatures
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
    // PREVENT SPACE SCROLLING AND ADVANCE WORD
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();

      if (state.isFinished) return;
      if (!state.isRunning) startTimer();

      const curWord = state.words[state.wordIdx];
      const typed = inputField.value.trim();
      if (!curWord) return;

      const isCorrect = (typed === curWord);
      if (isCorrect) {
        playBeep(480, 'sine', 0.05, 0.08);
        state.correctKeystrokes += curWord.length + 1;
      } else {
        playBeep(160, 'sawtooth', 0.1, 0.1);
        state.errorKeystrokes++;
      }
      state.totalKeystrokes += (typed.length || 1) + 1;

      state.typedWords[state.wordIdx] = typed;

      const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
      if (curWordEl) {
        curWordEl.classList.remove('is-active-word');
        curWordEl.classList.add(isCorrect ? 'is-word-correct' : 'is-word-error');
      }

      state.wordIdx++;
      inputField.value = '';

      // Check test completion criteria
      if (state.mode === 'words' && state.wordIdx >= state.wordCount) {
        finishTest();
        return;
      }
      if ((state.mode === 'sentences' || state.mode === 'quotes' || state.mode === 'special') && state.wordIdx >= state.words.length) {
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
        const container = document.getElementById('words-container');
        if (container) {
          const wRect = nextWordEl.getBoundingClientRect();
          const cRect = container.getBoundingClientRect();
          if (wRect.top - cRect.top > 38) {
            container.scrollTop += 38;
          }
        }
      }

      renderActiveWordHighlight();
      highlightTargetKey();
      updateCaret();
      updateLiveStats();
      return;
    }

    // FREEDOM BACKSPACE: jump back to previous word for instant correction!
    if (e.key === 'Backspace') {
      if (inputField.value.length === 0 && state.wordIdx > 0) {
        e.preventDefault();

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
      if (state.lang === 'nepali_unicode' && isAscii) {
        const matched = KEY_CODE_MAP[e.code];
        if (matched && matched.uni) {
          e.preventDefault();
          const ch = (e.shiftKey || state.isShift) ? matched.uni[1] : matched.uni[0];
          const start = inputField.selectionStart ?? inputField.value.length;
          const end = inputField.selectionEnd ?? inputField.value.length;
          inputField.setRangeText(ch, start, end, 'end');

          // Auto-merge traditional ligatures
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
          const curWord = state.words[state.wordIdx];
          const curPos = inputField.selectionStart ?? inputField.value.length;
          const targetChar = curWord ? curWord[curPos] : '';
          let ch = (e.shiftKey || state.isShift) ? matched.rom[1] : matched.rom[0];

          // Halanta handling: TopNepali/MPP phonetic standard allows 'q' for halanta '्'
          if (e.code === 'KeyQ' && !e.shiftKey && !state.isShift) {
            if (targetChar === '्' || targetChar !== 'ट') {
              ch = '्';
            } else {
              ch = 'ट';
            }
          } else if (e.code === 'Slash' && !e.shiftKey && !state.isShift) {
            ch = '्';
          }

          // Word-initial / standalone 'a' handling for independent 'अ' vs 'ा'
          if (e.code === 'KeyA' && !e.shiftKey && !state.isShift) {
            if (targetChar === 'अ') {
              ch = 'अ';
            }
          }

          const start = inputField.selectionStart ?? inputField.value.length;
          const end = inputField.selectionEnd ?? inputField.value.length;
          inputField.setRangeText(ch, start, end, 'end');

          // Auto-merge ligatures like अा -> आ, ाे -> ो, ाै -> ौ
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
      }
    }
  });

  // Auto-focus input on printable key if user clicked away
  window.addEventListener('keydown', (e) => {
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

// --- 16. TOOLBAR, MODAL & BUTTON LISTENERS ---
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
      const examOpts = document.getElementById('exam-options');

      if (timeOpts) timeOpts.classList.toggle('hidden', state.mode !== 'time');
      if (wordsOpts) wordsOpts.classList.toggle('hidden', state.mode !== 'words');
      if (examOpts) examOpts.classList.toggle('hidden', state.mode !== 'exam');

      if (state.mode === 'exam') {
        state.duration = 300; // 5 min official exam standard
        document.querySelectorAll('.exam-btn').forEach(b => {
          const is300 = b.dataset.seconds === '300';
          b.classList.toggle('active', is300);
          b.classList.toggle('bg-[var(--bg-surface)]', is300);
          b.classList.toggle('font-bold', is300);
          b.classList.toggle('text-purple-600', is300);
          b.classList.toggle('text-[var(--text-muted)]', !is300);
        });
      }

      setupTest();
    });
  });

  // Time Duration Buttons
  document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
        b.classList.add('text-[var(--text-muted)]');
      });
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      btn.classList.remove('text-[var(--text-muted)]');
      state.duration = parseInt(btn.dataset.seconds, 10);
      setupTest();
    });
  });

  // Word Count Buttons
  document.querySelectorAll('.word-count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.word-count-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
        b.classList.add('text-[var(--text-muted)]');
      });
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      btn.classList.remove('text-[var(--text-muted)]');
      state.wordCount = parseInt(btn.dataset.words, 10);
      setupTest();
    });
  });

  // Exam Duration Buttons
  document.querySelectorAll('.exam-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.exam-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-purple-600');
        b.classList.add('text-[var(--text-muted)]');
      });
      btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-purple-600');
      btn.classList.remove('text-[var(--text-muted)]');
      state.duration = parseInt(btn.dataset.seconds, 10);
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

  // Quick Quotes / Literature Button in Header
  document.getElementById('quick-quotes-btn')?.addEventListener('click', () => {
    state.lang = 'nepali_unicode';
    state.mode = 'quotes';
    state.difficulty = 'medium';

    document.querySelectorAll('.lang-tab-btn').forEach(b => {
      const isTarget = b.dataset.lang === 'nepali_unicode';
      b.classList.toggle('active', isTarget);
      b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
      b.classList.toggle('text-[var(--accent-primary)]', isTarget);
    });
    document.querySelectorAll('.mode-tab-btn').forEach(b => {
      const isTarget = b.dataset.mode === 'quotes';
      b.classList.toggle('active', isTarget);
      b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
      b.classList.toggle('text-[var(--accent-blue)]', isTarget);
    });
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

    const summary = `🇳🇵 Nepali Typing PRO Results:\nLayout: ${meta}\nSpeed: ${netWpm} Net WPM (${rawWpm} Raw WPM)\nAccuracy: ${acc}\nRank: ${rank}\nPractice your Nepali typing: https://typing.topnepali.com`;

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
}

// --- 17. INITIALIZE ON DOM READY ---
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
