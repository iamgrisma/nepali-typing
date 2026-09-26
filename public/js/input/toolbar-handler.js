/**
 * TopNepali Typing PRO — Toolbar, Mode Tabs, Custom Limits & Action Modals
 */

import { state } from '../core/state.js';
import { setupTest, getLastFinishedResult } from '../core/engine.js';
import { saveCertificate } from '../utils/certificate-db.js';
import { resetStrokeProfile } from '../utils/adaptive-engine.js';
import { renderKeyboard } from '../ui/keyboard-view.js';
import { updatePersonalBestsCards } from '../ui/stats-modal-view.js';

export function bindToolbarEvents() {
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
