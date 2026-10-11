/**
 * TopNepali Typing PRO — Input Handling, Key Mapping, Transliteration & Shortcuts
 */

import { state, playBeep } from '../core/state.js';
import { KEY_CODE_MAP } from '../data/keyboards.js';
import { recordStrokeData, checkTargetKeyMastery } from '../utils/adaptive-engine.js';
import { refillWords } from '../core/words-pool.js';
import { 
  setupTest, 
  startTimer, 
  pauseTimer, 
  resumeTimer, 
  finishTest, 
  finishFreestyleTest, 
  triggerAdaptiveMastery 
} from '../core/engine.js';
import { 
  renderActiveWordHighlight, 
  adjust2LineScroll, 
  updateCaret, 
  updateLiveStats 
} from '../ui/workbench-view.js';
import { renderKeyboard, highlightTargetKey } from '../ui/keyboard-view.js';

export function requestReset() {
  const resetModal = document.getElementById('reset-confirm-modal');
  if (!state.isRunning) {
    // Session not started: instant direct reset without popup
    setupTest();
    return;
  }

  // Active session in progress: open in-app confirmation modal and pause timer
  if (resetModal) {
    pauseTimer();
    state.isResetModalOpen = true;
    resetModal.classList.add('is-open');
  } else {
    setupTest();
  }
}

export function cancelReset() {
  const resetModal = document.getElementById('reset-confirm-modal');
  if (resetModal) {
    resetModal.classList.remove('is-open');
  }
  state.isResetModalOpen = false;
  resumeTimer();

  // Restore focus to typing input
  if (state.mode === 'freestyle') {
    document.getElementById('freestyle-input')?.focus();
  } else {
    document.getElementById('typing-input')?.focus();
  }
}

export function confirmReset() {
  const resetModal = document.getElementById('reset-confirm-modal');
  if (resetModal) {
    resetModal.classList.remove('is-open');
  }
  state.isResetModalOpen = false;
  setupTest();
}

let lastAltShiftToggleTime = 0;
export function toggleInputMode() {
  if (state.lang === 'english') {
    // English QWERTY bench stays on QWERTY
    return;
  }

  state.isQwertyPassthrough = !state.isQwertyPassthrough;

  // If in freestyle mode and Preeti bench, adjust textarea font dynamically
  if (state.mode === 'freestyle' && state.lang === 'nepali_preeti') {
    const freestyleInput = document.getElementById('freestyle-input');
    if (freestyleInput) {
      freestyleInput.style.fontFamily = state.isQwertyPassthrough ? 'inherit' : 'Preeti, sans-serif';
    }
  }

  playBeep(520, 'sine', 0.04, 0.05);
  renderKeyboard();
  updateLiveStats();
}

export function getMappedChar(code, isShift, currentMode, expectedChar = '') {
  const matched = KEY_CODE_MAP[code];
  if (!matched) return '';

  if (currentMode === 'qwerty' || state.lang === 'english') {
    return matched.eng ? (isShift ? matched.eng[1] : matched.eng[0]) : '';
  }

  if (currentMode === 'traditional') {
    return matched.uni ? (isShift ? matched.uni[1] : matched.uni[0]) : '';
  }

  if (currentMode === 'romanized') {
    if (!matched.rom) return '';
    let ch = isShift ? matched.rom[1] : matched.rom[0];
    if (code === 'KeyQ' && !isShift) {
      ch = (expectedChar === '्' || expectedChar !== 'ट') ? '्' : 'ट';
    } else if (code === 'Slash' && !isShift) {
      ch = '्';
    } else if (code === 'KeyA' && !isShift && expectedChar === 'अ') {
      ch = 'अ';
    }
    return ch;
  }

  if (currentMode === 'preeti') {
    return matched.pre ? (isShift ? matched.pre[1] : matched.pre[0]) : (matched.eng ? (isShift ? matched.eng[1] : matched.eng[0]) : '');
  }

  return '';
}

export function normalizeLigatures(val) {
  if (!val) return '';
  return val
    .replace(/अा/g, 'आ')
    .replace(/ाे/g, 'ो')
    .replace(/ाै/g, 'ौ')
    .replace(/अो/g, 'ओ')
    .replace(/अौ/g, 'औ');
}

export function checkAndHandleAltShift(e) {
  // Support Alt+Shift, Shift+Alt, Ctrl+Alt, and Ctrl+Shift for website-level switching
  const isAltShiftCombo = 
    (e.altKey && (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight')) ||
    (e.shiftKey && (e.key === 'Alt' || e.code === 'AltLeft' || e.code === 'AltRight')) ||
    (e.ctrlKey && (e.key === 'Alt' || e.code === 'AltLeft' || e.code === 'AltRight')) ||
    (e.altKey && (e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight'));

  if (isAltShiftCombo) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const now = performance.now();
    if (now - lastAltShiftToggleTime > 250) {
      lastAltShiftToggleTime = now;
      toggleInputMode();
    }
    return true;
  }
  return false;
}

export function bindInputEvents() {
  const inputField = document.getElementById('typing-input');
  const workbench = document.getElementById('typing-workbench');

  // Input mode switcher button binding (Visualizer Header)
  document.getElementById('kb-input-mode-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleInputMode();
    inputField?.focus();
  });

  // Reset confirmation modal action bindings
  const resetModal = document.getElementById('reset-confirm-modal');
  const yesBtn = document.getElementById('confirm-reset-yes-btn');
  const noBtn = document.getElementById('confirm-reset-no-btn');

  yesBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    confirmReset();
  });

  noBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    cancelReset();
  });

  resetModal?.addEventListener('click', (e) => {
    // Backdrop click cancels reset and resumes
    if (e.target === resetModal) {
      cancelReset();
    }
  });

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
      const normalized = normalizeLigatures(val);
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
    if (checkAndHandleAltShift(e)) return;

    if (e.key === 'Alt' || e.code === 'AltLeft' || e.code === 'AltRight') {
      e.preventDefault();
      return;
    }

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

      state.totalKeystrokes++;
      if (isCorrect) {
        playBeep(480, 'sine', 0.05, 0.08);
        state.correctKeystrokes++;
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
        if (isCorrect) {
          curWordEl.querySelectorAll('.char-node:not(.is-extra-error)').forEach(span => {
            span.className = 'char-node is-correct';
          });
        }
      }

      state.wordIdx++;
      inputField.value = '';

      // Live adaptive mastery check (Seamless continuation: Do NOT return early!)
      if (state.mode === 'adaptive' && !state.isAdaptiveDiagnostic && state.adaptivePrimaryTarget) {
        const mastery = checkTargetKeyMastery(state.adaptivePrimaryTarget, state.adaptiveTargetGoal || 90);
        if (mastery.mastered) {
          triggerAdaptiveMastery(state.adaptivePrimaryTarget, mastery.recentAccuracy);
          // Let typist continue typing into the next word without being blocked!
        } else {
          const accDisp = document.getElementById('adaptive-acc-display');
          if (accDisp && mastery.recentAccuracy !== undefined) {
            accDisp.textContent = `${mastery.recentAccuracy}%`;
          }
        }
      }

      // Test completion checks
      if (state.mode === 'words' && state.wordIdx >= state.wordCount) {
        finishTest();
        return;
      }
      if ((state.mode === 'sentences' || state.mode === 'quotes') && state.wordIdx >= state.words.length) {
        finishTest();
        return;
      }
      if (state.mode === 'adaptive') {
        if (state.wordIdx >= state.words.length - 10) {
          refillWords();
        }
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

      if (inputField.value.length > 0) {
        const curPos = inputField.selectionStart ?? inputField.value.length;
        if (curPos > 0) {
          const charToDelete = inputField.value[curPos - 1];
          const expectedCharToDelete = curWord ? curWord[curPos - 1] : '';
          if (charToDelete === expectedCharToDelete) {
            state.correctKeystrokes = Math.max(0, state.correctKeystrokes - 1);
          } else {
            state.errorKeystrokes = Math.max(0, state.errorKeystrokes - 1);
            state.currentWordErrors = Math.max(0, state.currentWordErrors - 1);
          }
        }
      }

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
            state.correctKeystrokes = Math.max(0, state.correctKeystrokes - 1);
          } else {
            state.incorrectWords = Math.max(0, state.incorrectWords - 1);
            state.errorKeystrokes = Math.max(0, state.errorKeystrokes - 1);
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
      e.stopPropagation();
      requestReset();
      return;
    }

    if (e.key === 'Escape') {
      // Do NOT restart test on Escape (prevents accidental keystroke reset during typing)
      e.preventDefault();
      document.getElementById('stats-modal')?.classList.remove('is-open');
      document.getElementById('history-modal')?.classList.remove('is-open');
      return;
    }

    // True Hardware-Level Sandbox: map physical US keyboard scan code (e.code)
    // completely ignoring device OS input method or installed language layout!
    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
      if (e.key.length === 1 || KEY_CODE_MAP[e.code]) {
        if (state.isFinished) return;
        if (!state.isRunning) startTimer();

        const curPos = inputField.selectionStart ?? inputField.value.length;
        const expectedChar = curWord ? (curWord[curPos] || '') : '';
        const currentMode = state.activeInputMode;
        const isShift = (e.shiftKey || state.isShift);

        const ch = getMappedChar(e.code, isShift, currentMode, expectedChar) || (e.key.length === 1 ? e.key : '');
        if (!ch) return;

        e.preventDefault();

        const expectedSlice = curWord ? curWord.slice(curPos, curPos + ch.length) : '';
        const isCharCorrect = (ch === expectedSlice || ch === expectedChar);

        state.totalKeystrokes++;
        if (isCharCorrect) {
          state.correctKeystrokes++;
        } else {
          state.errorKeystrokes++;
          state.currentWordErrors++;
          state.errorMap[expectedSlice || expectedChar || ch] = (state.errorMap[expectedSlice || expectedChar || ch] || 0) + 1;
        }

        state.keystrokeLogs.push({
          timestamp: now,
          charExpected: expectedSlice || expectedChar,
          charTyped: ch,
          isCorrect: isCharCorrect,
          code: e.code,
          latencyMs: deltaMs
        });
        recordStrokeData(expectedSlice || expectedChar || ch, isCharCorrect, deltaMs);

        const start = inputField.selectionStart ?? inputField.value.length;
        const end = inputField.selectionEnd ?? inputField.value.length;
        inputField.setRangeText(ch, start, end, 'end');

        if (currentMode === 'traditional' || currentMode === 'romanized') {
          const val = inputField.value;
          const norm = normalizeLigatures(val);
          if (norm !== val) {
            inputField.value = norm;
          }
        }

        inputField.dispatchEvent(new Event('input'));
        return;
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
    const strokeWords = state.totalKeystrokes > 0 ? Math.max(0, state.totalKeystrokes - state.freestyleBackspaces) / 5 : val.length / 5;
    const currentWpm = Math.max(0, Math.round(Math.max(words.length, strokeWords) / m));

    const fWordEl = document.getElementById('freestyle-word-count');
    const fCharEl = document.getElementById('freestyle-char-count');
    const fBurstEl = document.getElementById('freestyle-burst-wpm');

    if (fWordEl) fWordEl.textContent = `${words.length}`;
    if (fCharEl) fCharEl.textContent = `${val.length}`;
    if (fBurstEl) fBurstEl.textContent = `${currentWpm} WPM`;

    updateLiveStats();
  });

  freestyleInput?.addEventListener('keydown', (e) => {
    if (checkAndHandleAltShift(e)) return;

    if (state.isFinished) return;
    if (!state.isRunning) startTimer();

    const now = performance.now();
    const deltaMs = state.lastStrokeTime > 0 ? Math.max(10, Math.min(3000, Math.round(now - state.lastStrokeTime))) : 150;
    state.lastStrokeTime = now;

    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      requestReset();
      return;
    }

    if (e.key === 'Backspace') {
      state.freestyleBackspaces++;
      state.totalKeystrokes++;
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

    if (e.key === 'Enter') {
      state.totalKeystrokes++;
      state.correctKeystrokes++;
      state.keystrokeLogs.push({
        timestamp: now,
        charExpected: '\n',
        charTyped: '\n',
        isCorrect: true,
        code: 'Enter',
        latencyMs: deltaMs
      });
      return; // allow normal textarea newline
    }

    // Suppress Alt menu focus during typing
    if (e.key === 'Alt' || e.code === 'AltLeft' || e.code === 'AltRight') {
      e.preventDefault();
      return;
    }

    // True Hardware-Level Sandbox for Free Style
    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
      if (e.key.length === 1 || KEY_CODE_MAP[e.code]) {
        const currentMode = state.activeInputMode;
        const isShift = (e.shiftKey || state.isShift);

        const ch = getMappedChar(e.code, isShift, currentMode) || (e.key.length === 1 ? e.key : '');
        if (!ch) return;

        e.preventDefault();

        state.totalKeystrokes++;
        state.correctKeystrokes++;
        state.keystrokeLogs.push({
          timestamp: now,
          charExpected: ch,
          charTyped: ch,
          isCorrect: true,
          code: e.code,
          latencyMs: deltaMs
        });

        const start = freestyleInput.selectionStart;
        const end = freestyleInput.selectionEnd;
        freestyleInput.setRangeText(ch, start, end, 'end');

        if (currentMode === 'traditional' || currentMode === 'romanized') {
          const val = freestyleInput.value;
          const norm = normalizeLigatures(val);
          if (norm !== val) {
            freestyleInput.value = norm;
          }
        }

        freestyleInput.dispatchEvent(new Event('input'));
        return;
      }
    }
  });

  // Block native IME composition events so device language doesn't hijack sandbox
  inputField?.addEventListener('compositionstart', (e) => {
    e.preventDefault();
  });
  freestyleInput?.addEventListener('compositionstart', (e) => {
    e.preventDefault();
  });

  finishFreestyleBtn?.addEventListener('click', () => {
    finishFreestyleTest();
  });

  window.addEventListener('keydown', (e) => {
    // 1. Strict Reset Confirmation Modal Key Handling
    if (state.isResetModalOpen) {
      if (e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        cancelReset();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        confirmReset();
        return;
      }
      // Suppress any background keystrokes while reset confirmation is active
      return;
    }

    // 2. Global Tab key handling for restarting tests
    if (e.key === 'Tab') {
      const activeEl = document.activeElement;
      const isOtherModalInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && activeEl.closest('.modal-backdrop:not(#reset-confirm-modal), #stats-modal');
      if (!isOtherModalInput) {
        e.preventDefault();
        e.stopPropagation();
        requestReset();
        return;
      }
    }

    // 3. Global Escape key handling (strictly closes overlay modals, NEVER restarts tests)
    if (e.key === 'Escape') {
      document.getElementById('stats-modal')?.classList.remove('is-open');
      document.getElementById('history-modal')?.classList.remove('is-open');
      return;
    }

    // Don't steal focus from modal inputs (e.g., certificate name)
    const modalOpen = document.querySelector('.modal-backdrop.is-open:not(#reset-confirm-modal), #stats-modal.is-open');
    const activeEl = document.activeElement;
    const isModalInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && activeEl.closest('.modal-backdrop, #stats-modal');
    
    if (modalOpen || isModalInput) {
      return; // Let the modal handle input natively
    }

    if (checkAndHandleAltShift(e)) return;

    if (e.key === 'Alt' || e.code === 'AltLeft' || e.code === 'AltRight') {
      e.preventDefault();
      return;
    }

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
  }, true);
}
