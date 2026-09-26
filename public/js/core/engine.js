/**
 * TopNepali Typing PRO — Core Typing Test Engine, Timer & Session Controller
 */

import { state, playBeep } from './state.js';
import { getWordsPool, getGraphemes, refillWords } from './words-pool.js';
import { KEY_CODE_MAP } from '../data/keyboards.js';
import { getWeakKeysAnalysis, generateAdaptiveWords, calculateTargetGoal } from '../utils/adaptive-engine.js';
import { analyzeTypingRun } from '../utils/stroke-analytics.js';
import { getSpeedRank, checkCertificationPass } from '../utils/certificate-db.js';
import { renderKeyboard, highlightTargetKey } from '../ui/keyboard-view.js';
import { 
  renderActiveWordHighlight, 
  adjust2LineScroll, 
  updateCaret, 
  computeCurrentStats, 
  formatMinutesSeconds, 
  updateLiveStats 
} from '../ui/workbench-view.js';
import { renderTimelineChart, updatePersonalBestsCards } from '../ui/stats-modal-view.js';

let lastFinishedResult = null;

export function getLastFinishedResult() {
  return lastFinishedResult;
}

export function setLastFinishedResult(res) {
  lastFinishedResult = res;
}

export function setupTest() {
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

let isMasteryTransitioning = false;
export function triggerAdaptiveMastery(masteredKey, achievedAcc) {
  if (isMasteryTransitioning) return;
  isMasteryTransitioning = true;

  const targetTags = document.getElementById('adaptive-target-tags');
  if (targetTags) {
    targetTags.innerHTML = `<span class="text-emerald-400 font-bold">🎉 Key '${masteredKey.toUpperCase()}' Mastered (${achievedAcc}%)!</span>`;
  }

  // Flash the target keycap green if visible
  const keyObj = Object.values(KEY_CODE_MAP).find(k => {
    if (state.lang === 'english') {
      return (k.eng && k.eng[0].toLowerCase() === masteredKey.toLowerCase());
    }
    return (k.uni && k.uni[0] === masteredKey) || (k.rom && k.rom[0] === masteredKey);
  });
  if (keyObj && keyObj.code) {
    const kc = document.querySelector(`.keycap[data-code="${keyObj.code}"]`);
    if (kc) {
      kc.classList.add('is-mastered-flash');
      setTimeout(() => kc.classList.remove('is-mastered-flash'), 1800);
    }
  }

  // After a brief celebratory moment, advance to the next weakest key
  setTimeout(() => {
    isMasteryTransitioning = false;
    if (state.mode !== 'adaptive') return;

    const analysis = getWeakKeysAnalysis(state.lang, 4);
    // Find next key with highest error ratio that is not the just-mastered key
    const remaining = analysis.keys.filter(k => k.char.toLowerCase() !== masteredKey.toLowerCase());

    if (remaining.length > 0) {
      const nextWeak = remaining[0];
      const secondWeak = remaining[1] || null;
      state.adaptivePrimaryTarget = nextWeak.char;
      state.adaptiveSecondaryTarget = secondWeak ? secondWeak.char : '';
      state.targetWeakKeys = [nextWeak.char, ...(secondWeak ? [secondWeak.char] : [])];

      const goal = calculateTargetGoal(nextWeak.accuracy);
      state.adaptiveTargetGoal = goal;

      const badgeLabel = nextWeak.accuracy >= 95 ? 'Perfection' : (nextWeak.accuracy >= 88 ? 'Refinement' : 'Weak-Key');
      const badgeColor = nextWeak.accuracy >= 95 ? 'text-teal-400 bg-teal-500/20' : (nextWeak.accuracy >= 88 ? 'text-blue-400 bg-blue-500/20' : 'text-amber-400 bg-amber-500/20');

      if (targetTags) {
        targetTags.innerHTML = `<span class="${badgeColor} text-[10px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide">${badgeLabel}</span> Target: <b class="${badgeColor} font-mono text-xs uppercase px-1.5 py-0.5 rounded">${nextWeak.char}</b> (Current: ${nextWeak.accuracy}% ➔ Goal: ${goal}%)`;
      }
      const accDisp = document.getElementById('adaptive-acc-display');
      const goalDisp = document.getElementById('adaptive-goal-display');
      const nextDisp = document.getElementById('adaptive-next-display');
      if (accDisp) accDisp.textContent = `${nextWeak.accuracy}%`;
      if (goalDisp) goalDisp.textContent = `${goal}%`;
      if (nextDisp) nextDisp.textContent = secondWeak ? secondWeak.char.toUpperCase() : 'None';

      // Generate new drill words targeting the new weak key
      const newWords = generateAdaptiveWords({
        lang: state.lang,
        targetKeys: state.targetWeakKeys,
        targetCount: 35
      });
      state.words = newWords;
      state.wordIdx = 0;
      state.typedWords = [];

      // Re-populate words container
      const container = document.getElementById('words-container');
      const inputField = document.getElementById('typing-input');
      if (inputField) inputField.value = '';

      if (container) {
        container.innerHTML = '';
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
      highlightTargetKey();
      updateCaret();
    } else {
      if (targetTags) {
        targetTags.innerHTML = `<span class="text-emerald-400 font-bold">🏆 All weak keys mastered (>90%)! Great work!</span>`;
      }
      const metaPill = document.getElementById('adaptive-meta-pill');
      if (metaPill) metaPill.classList.add('hidden');
    }
  }, 1200);
}

export function startTimer() {
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

export function finishTest() {
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
  const topMissed = Object.entries(state.errorMap)
    .filter(([k, count]) => count > 0 && k.trim().length > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  if (adaptiveCallout) {
    if (topMissed.length > 0) {
      adaptiveCallout.classList.remove('hidden');
      if (adaptiveKeysLbl) adaptiveKeysLbl.textContent = `[${topMissed.map(k => k.toUpperCase()).join(', ')}]`;
    } else {
      adaptiveCallout.classList.add('hidden');
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

export function finishFreestyleTest() {
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
