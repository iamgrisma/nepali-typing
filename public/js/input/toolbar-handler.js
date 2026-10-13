/**
 * TopNepali Typing PRO — Toolbar, Mode Tabs, Custom Limits & Action Modals
 */

import { state } from '../core/state.js';
import { setupTest, getLastFinishedResult } from '../core/engine.js';
import { requestReset } from './input-handler.js';
import { saveCertificate } from '../utils/certificate-db.js';
import { resetStrokeProfile } from '../utils/adaptive-engine.js';
import { renderKeyboard } from '../ui/keyboard-view.js';
import { updatePersonalBestsCards } from '../ui/stats-modal-view.js';

export function bindToolbarEvents() {
  // Language Tabs (Links to dedicated test pages)
  document.querySelectorAll('.lang-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('active')) {
        e.preventDefault();
        setupTest();
        return;
      }
      if (btn.tagName === 'A' && btn.getAttribute('href')) {
        return; // Allow browser to navigate to dedicated URL with its own SEO body
      }
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
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A' && btn.getAttribute('href')) {
        if (btn.classList.contains('active')) {
          e.preventDefault();
          setupTest();
          return;
        }
        return; // Allow browser to navigate to dedicated mode page (/loksewa-typing-test, /drills)
      }
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

  // Sync initial active state on time-btn matching state.duration
  document.querySelectorAll('.time-btn[data-seconds]').forEach(b => {
    const s = parseInt(b.dataset.seconds, 10);
    if (s === state.duration) {
      b.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      b.classList.remove('text-[var(--text-muted)]');
    } else {
      b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
      b.classList.add('text-[var(--text-muted)]');
    }
  });

  // --- In-App Custom Input Modal for Time & Word Count ---
  let customModalMode = 'time'; // 'time' | 'words'
  let customTimeUnit = 'seconds'; // 'seconds' | 'minutes'

  const customModal = document.getElementById('custom-input-modal');
  const modalValInput = document.getElementById('custom-modal-val');
  const modalErrorEl = document.getElementById('custom-modal-error');
  const modalTitleEl = document.getElementById('custom-modal-title');
  const modalLabelEl = document.getElementById('custom-modal-label');
  const modalUnitTagEl = document.getElementById('custom-modal-unit-tag');
  const modalHintEl = document.getElementById('custom-modal-hint');
  const timeUnitGroup = document.getElementById('custom-time-unit-group');
  const unitSecBtn = document.getElementById('unit-seconds-btn');
  const unitMinBtn = document.getElementById('unit-minutes-btn');
  const timeIcon = document.getElementById('custom-modal-icon-time');
  const wordsIcon = document.getElementById('custom-modal-icon-words');
  const presetChipsEl = document.getElementById('custom-preset-chips');

  function renderCustomPresets(presets) {
    if (!presetChipsEl) return;
    presetChipsEl.innerHTML = '';
    presets.forEach(p => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'px-2.5 py-1 rounded-lg text-xs font-mono font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--accent-primary)]/10 hover:border-[var(--accent-primary)]/40 hover:text-[var(--accent-primary)] text-[var(--text-secondary)] transition-all cursor-pointer';
      chip.textContent = typeof p === 'object' ? p.label : `${p} w`;
      chip.addEventListener('click', () => {
        if (customModalMode === 'time') {
          if (p.unit && p.unit !== customTimeUnit) {
            setTimeUnit(p.unit, p.val);
          } else if (modalValInput) {
            modalValInput.value = p.val;
          }
        } else if (modalValInput) {
          modalValInput.value = typeof p === 'object' ? p.val : p;
        }
        applyCustomModalValue();
      });
      presetChipsEl.appendChild(chip);
    });
  }

  function setTimeUnit(unit, targetVal) {
    customTimeUnit = unit;
    if (modalErrorEl) modalErrorEl.classList.add('hidden');

    if (unit === 'seconds') {
      unitSecBtn?.classList.add('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-primary)]', 'shadow-xs');
      unitSecBtn?.classList.remove('text-[var(--text-muted)]');
      unitMinBtn?.classList.remove('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-primary)]', 'shadow-xs');
      unitMinBtn?.classList.add('text-[var(--text-muted)]');

      if (modalLabelEl) modalLabelEl.textContent = 'Enter duration in seconds (सेकेन्ड):';
      if (modalUnitTagEl) modalUnitTagEl.textContent = 'sec';
      if (modalHintEl) modalHintEl.textContent = 'Allowed range: 5 to 3600 seconds';
      if (modalValInput) {
        modalValInput.min = '5';
        modalValInput.max = '3600';
        modalValInput.step = '1';
        modalValInput.placeholder = '45';
        if (targetVal !== undefined) {
          modalValInput.value = targetVal;
        }
      }
      renderCustomPresets([
        { label: '45s', val: 45, unit: 'seconds' },
        { label: '90s', val: 90, unit: 'seconds' },
        { label: '150s', val: 150, unit: 'seconds' },
        { label: '2 min', val: 2, unit: 'minutes' },
        { label: '3 min', val: 3, unit: 'minutes' },
        { label: '5 min', val: 5, unit: 'minutes' }
      ]);
    } else {
      unitMinBtn?.classList.add('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-primary)]', 'shadow-xs');
      unitMinBtn?.classList.remove('text-[var(--text-muted)]');
      unitSecBtn?.classList.remove('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-primary)]', 'shadow-xs');
      unitSecBtn?.classList.add('text-[var(--text-muted)]');

      if (modalLabelEl) modalLabelEl.textContent = 'Enter duration in minutes (मिनेट):';
      if (modalUnitTagEl) modalUnitTagEl.textContent = 'min';
      if (modalHintEl) modalHintEl.textContent = 'Allowed range: 0.2 to 60 minutes';
      if (modalValInput) {
        modalValInput.min = '0.2';
        modalValInput.max = '60';
        modalValInput.step = '0.5';
        modalValInput.placeholder = '2';
        if (targetVal !== undefined) {
          modalValInput.value = targetVal;
        }
      }
      renderCustomPresets([
        { label: '1 min', val: 1, unit: 'minutes' },
        { label: '2 min', val: 2, unit: 'minutes' },
        { label: '3 min', val: 3, unit: 'minutes' },
        { label: '5 min', val: 5, unit: 'minutes' },
        { label: '10 min', val: 10, unit: 'minutes' },
        { label: '15 min', val: 15, unit: 'minutes' }
      ]);
    }
  }

  function openCustomModal(mode) {
    customModalMode = mode;
    if (modalErrorEl) modalErrorEl.classList.add('hidden');

    if (mode === 'time') {
      timeIcon?.classList.remove('hidden');
      wordsIcon?.classList.add('hidden');
      if (modalTitleEl) modalTitleEl.textContent = 'Custom Duration';
      timeUnitGroup?.classList.remove('hidden');

      const curSec = state.duration || 60;
      if (curSec >= 60 && curSec % 60 === 0) {
        setTimeUnit('minutes', curSec / 60);
      } else {
        setTimeUnit('seconds', curSec);
      }
    } else {
      timeIcon?.classList.add('hidden');
      wordsIcon?.classList.remove('hidden');
      if (modalTitleEl) modalTitleEl.textContent = 'Custom Word Count';
      timeUnitGroup?.classList.add('hidden');

      if (modalLabelEl) modalLabelEl.textContent = 'Enter target word count (शब्द संख्या):';
      if (modalUnitTagEl) modalUnitTagEl.textContent = 'words';
      if (modalHintEl) modalHintEl.textContent = 'Allowed range: 5 to 2000 words';
      if (modalValInput) {
        modalValInput.min = '5';
        modalValInput.max = '2000';
        modalValInput.step = '1';
        modalValInput.placeholder = '75';
        modalValInput.value = state.wordCount || 75;
      }
      renderCustomPresets([15, 35, 50, 75, 150, 250, 500]);
    }

    customModal?.classList.add('is-open');
    setTimeout(() => {
      modalValInput?.focus();
      modalValInput?.select();
    }, 40);
  }

  function closeCustomModal() {
    customModal?.classList.remove('is-open');
    if (modalErrorEl) modalErrorEl.classList.add('hidden');
    document.getElementById('typing-input')?.focus();
  }

  function applyCustomModalValue() {
    const rawVal = modalValInput?.value?.trim();
    const showErr = (msg) => {
      if (modalErrorEl) {
        modalErrorEl.textContent = msg;
        modalErrorEl.classList.remove('hidden');
      }
      modalValInput?.focus();
    };

    if (customModalMode === 'time') {
      const num = parseFloat(rawVal);
      if (isNaN(num) || num <= 0) {
        showErr('Please enter a valid positive number.');
        return;
      }
      const totalSec = customTimeUnit === 'minutes' ? Math.round(num * 60) : Math.round(num);
      if (totalSec < 5 || totalSec > 3600) {
        showErr('Duration must be between 5 and 3600 seconds (max 60 minutes).');
        return;
      }

      state.duration = totalSec;

      document.querySelectorAll('.time-btn').forEach(b => {
        b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
        b.classList.add('text-[var(--text-muted)]');
      });

      const customBtn = document.getElementById('time-custom-btn');
      if (customBtn) {
        const label = (customTimeUnit === 'minutes' || (totalSec >= 60 && totalSec % 60 === 0))
          ? `${totalSec / 60}m`
          : `${totalSec}s`;
        customBtn.textContent = label;
        customBtn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
        customBtn.classList.remove('text-[var(--text-muted)]');
      }

      closeCustomModal();
      setupTest();
    } else {
      const cnt = parseInt(rawVal, 10);
      if (isNaN(cnt) || cnt < 5 || cnt > 2000) {
        showErr('Please enter a word count between 5 and 2000.');
        return;
      }

      state.wordCount = cnt;

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

      closeCustomModal();
      setupTest();
    }
  }

  // Attach Custom Modal Controls
  unitSecBtn?.addEventListener('click', () => {
    if (customTimeUnit !== 'seconds') {
      const cur = parseFloat(modalValInput?.value);
      const converted = !isNaN(cur) && cur > 0 ? Math.round(cur * 60) : 60;
      setTimeUnit('seconds', converted);
    }
  });

  unitMinBtn?.addEventListener('click', () => {
    if (customTimeUnit !== 'minutes') {
      const cur = parseFloat(modalValInput?.value);
      const converted = !isNaN(cur) && cur > 0 ? +(cur / 60).toFixed(1) : 1;
      setTimeUnit('minutes', converted);
    }
  });

  document.getElementById('custom-modal-close-btn')?.addEventListener('click', closeCustomModal);
  document.getElementById('custom-modal-cancel-btn')?.addEventListener('click', closeCustomModal);
  document.getElementById('custom-modal-submit-btn')?.addEventListener('click', applyCustomModalValue);

  customModal?.addEventListener('click', (e) => {
    if (e.target === customModal) {
      closeCustomModal();
    }
  });

  modalValInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyCustomModalValue();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeCustomModal();
    }
  });

  // Custom Time & Words Open Buttons
  document.getElementById('time-custom-btn')?.addEventListener('click', () => {
    openCustomModal('time');
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
    openCustomModal('words');
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
  document.getElementById('manual-restart-btn')?.addEventListener('click', requestReset);
  document.getElementById('restart-from-modal-btn')?.addEventListener('click', () => {
    document.getElementById('stats-modal')?.classList.remove('is-open');
    setupTest();
  });
  document.getElementById('close-modal-btn')?.addEventListener('click', () => {
    document.getElementById('stats-modal')?.classList.remove('is-open');
  });

  // Retype & Compete: restart same words with previous WPM stored for comparison
  document.getElementById('retest-same-btn')?.addEventListener('click', () => {
    const lastResult = getLastFinishedResult();
    if (lastResult) {
      state.previousRunWpm = lastResult.netWpm;
      state.previousRunAcc = lastResult.acc;
      // Keep the same words for retesting
      state.retestWords = [...state.words];
    }
    document.getElementById('stats-modal')?.classList.remove('is-open');
    // Setup test with same words
    if (state.retestWords && state.retestWords.length > 0) {
      state.words = [...state.retestWords];
      // Import and call the retest setup
      import('../core/engine.js').then(mod => {
        mod.setupTestWithWords(state.words);
      });
    } else {
      setupTest();
    }
  });

  // Claim & View Certificate Button in Modal
  document.getElementById('modal-claim-cert-btn')?.addEventListener('click', async () => {
    const lastResult = getLastFinishedResult();
    if (!lastResult) return;
    const nameInput = document.getElementById('modal-candidate-name-input');
    const name = (nameInput?.value || '').trim() || 'Qualified Candidate';
    localStorage.setItem('topnepali_candidate_name', name);

    const btn = document.getElementById('modal-claim-cert-btn');
    if (btn) btn.textContent = 'Generating Certificate...';

    const cert = await saveCertificate({
      candidateName: name,
      layout: lastResult.layout,
      mode: lastResult.mode,
      durationSeconds: lastResult.elapsed,
      netWpm: lastResult.netWpm,
      rawWpm: lastResult.rawWpm,
      accuracy: lastResult.acc,
      consistency: lastResult.strokeAnalytics?.rhythmStability || 95,
      cpm: lastResult.cpm,
      totalKeystrokes: state.totalKeystrokes,
      correctKeystrokes: state.correctKeystrokes,
      errorKeystrokes: state.errorKeystrokes,
      analytics: lastResult.strokeAnalytics
    });

    // Navigate to Certificate View page
    window.location.href = `/certificate/view?id=${encodeURIComponent(cert.id)}`;
  });

  // Candidate Name Input Events (ensure focus is preserved & Enter submits)
  const candidateNameInput = document.getElementById('modal-candidate-name-input');
  if (candidateNameInput) {
    candidateNameInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('modal-claim-cert-btn')?.click();
      }
    });
    candidateNameInput.addEventListener('focus', (e) => {
      e.stopPropagation();
    });
  }

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

  // Reset Adaptive History Button
  document.getElementById('adaptive-reset-btn')?.addEventListener('click', () => {
    if (confirm('Reset your recorded stroke error history to start a clean diagnostic baseline?')) {
      resetStrokeProfile();
      setupTest();
    }
  });

  // Sound toggle with localStorage persistence
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  const soundToggleTxt = document.getElementById('sound-toggle-text');

  // Load user sound preference from localStorage (defaults to true)
  const storedSound = localStorage.getItem('typeshala_sound');
  if (storedSound !== null) {
    state.sound = (storedSound === '1');
  }
  if (soundIconOn && soundIconOff) {
    soundIconOn.classList.toggle('hidden', !state.sound);
    soundIconOff.classList.toggle('hidden', state.sound);
  }
  if (soundToggleTxt) {
    soundToggleTxt.textContent = state.sound ? 'Sound' : 'Mute';
  }

  soundBtn?.addEventListener('click', () => {
    state.sound = !state.sound;
    localStorage.setItem('typeshala_sound', state.sound ? '1' : '0');
    if (soundIconOn && soundIconOff) {
      soundIconOn.classList.toggle('hidden', !state.sound);
      soundIconOff.classList.toggle('hidden', state.sound);
    }
    if (soundToggleTxt) {
      soundToggleTxt.textContent = state.sound ? 'Sound' : 'Mute';
    }
    soundBtn.classList.toggle('bg-[var(--bg-surface-subtle)]', state.sound);
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

  // URL Query Parameters & Workbench Dataset Initializer
  try {
    const params = new URLSearchParams(window.location.search);
    const wb = document.getElementById('typing-workbench');
    const qLang = params.get('lang') || wb?.dataset.defaultLang;
    const qMode = params.get('mode') || wb?.dataset.defaultMode;
    const qExam = params.get('exam');
    const qDuration = params.get('duration') || wb?.dataset.defaultDuration;
    const qKeys = params.get('keys');

    if (qKeys) {
      const parsedKeys = qKeys.split(/[\s,]+/).map(k => k.trim().toLowerCase()).filter(Boolean);
      if (parsedKeys.length > 0) {
        state.targetWeakKeys = parsedKeys;
        state.adaptivePrimaryTarget = parsedKeys[0];
        state.adaptiveSecondaryTarget = parsedKeys[1] || '';
        state.isAdaptiveDiagnostic = false;
      }
    }

    if (qLang && ['nepali_unicode', 'nepali_romanized', 'nepali_preeti', 'english'].includes(qLang)) {
      state.lang = qLang;
      document.querySelectorAll('.lang-tab-btn').forEach(b => {
        const isTarget = b.dataset.lang === qLang;
        b.classList.toggle('active', isTarget);
        b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
        b.classList.toggle('text-[var(--accent-primary)]', isTarget);
        b.classList.toggle('text-[var(--text-secondary)]', !isTarget);
      });
    }

    if (qDuration) {
      const durVal = parseInt(qDuration, 10);
      if (!isNaN(durVal) && durVal > 0) {
        state.duration = durVal;
        state.secsLeft = durVal;
        document.querySelectorAll('.time-btn').forEach(b => {
          const isTarget = b.dataset.seconds === String(durVal);
          b.classList.toggle('active', isTarget);
          b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
          b.classList.toggle('text-[var(--accent-primary)]', isTarget);
          b.classList.toggle('font-bold', isTarget);
        });
        const timerDisplay = document.getElementById('live-timer-display');
        if (timerDisplay) timerDisplay.textContent = `${durVal}s`;
      }
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
