/**
 * TopNepali Typing PRO — Workbench Visual Presentation, Caret & 2-Line Scroll
 */

import { state } from '../core/state.js';
import { getGraphemes } from '../core/words-pool.js';

export function renderActiveWordHighlight() {
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

export function adjust2LineScroll() {
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

export function updateCaret() {
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

export function computeCurrentStats() {
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

export function formatMinutesSeconds(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function updateLiveStats() {
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
