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
import { cycleNextLayout, layoutShortcutState } from '../core/layout-switcher.js';

export function bindInputEvents() {
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

      // Live adaptive mastery check
      if (state.mode === 'adaptive' && !state.isAdaptiveDiagnostic && state.adaptivePrimaryTarget) {
        const mastery = checkTargetKeyMastery(state.adaptivePrimaryTarget, state.adaptiveTargetGoal || 90);
        if (mastery.mastered) {
          triggerAdaptiveMastery(state.adaptivePrimaryTarget, mastery.recentAccuracy);
          return;
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
      if (state.mode === 'adaptive' && state.wordIdx >= state.words.length) {
        if (!state.isAdaptiveDiagnostic && state.adaptivePrimaryTarget) {
          const mastery = checkTargetKeyMastery(state.adaptivePrimaryTarget, state.adaptiveTargetGoal || 90);
          if (mastery.mastered) {
            triggerAdaptiveMastery(state.adaptivePrimaryTarget, mastery.recentAccuracy);
            return;
          }
        }
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

  // Windows-style Left Alt + Left Shift layout switch capture listener
  window.addEventListener('keydown', (e) => {
    const isAlt = (e.code === 'AltLeft' || e.key === 'Alt');
    const isShift = (e.code === 'ShiftLeft' || e.key === 'Shift');
    const isRightMod = (e.code === 'AltRight' || e.code === 'ShiftRight' || e.code === 'AltGraph');

    if (isShift && !isRightMod) layoutShortcutState.leftShiftDown = true;
    if (isAlt && !isRightMod) layoutShortcutState.leftAltDown = true;

    if (!isRightMod && (
      (layoutShortcutState.leftShiftDown && layoutShortcutState.leftAltDown) ||
      (isShift && (e.altKey || layoutShortcutState.leftAltDown)) ||
      (isAlt && (e.shiftKey || layoutShortcutState.leftShiftDown)) ||
      (e.altKey && e.shiftKey && (isAlt || isShift))
    )) {
      e.preventDefault();
      e.stopPropagation();
      if (!layoutShortcutState.layoutSwitchTriggered) {
        layoutShortcutState.layoutSwitchTriggered = true;
        cycleNextLayout(() => setupTest());
      }
      return;
    }
  }, true);

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
    const isAlt = (e.code === 'AltLeft' || e.key === 'Alt');
    const isShift = (e.code === 'ShiftLeft' || e.key === 'Shift');
    if (isShift) layoutShortcutState.leftShiftDown = false;
    if (isAlt) layoutShortcutState.leftAltDown = false;
    if (isShift || isAlt) {
      layoutShortcutState.layoutSwitchTriggered = false;
    }

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
