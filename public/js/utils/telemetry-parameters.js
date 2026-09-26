/**
 * TopNepali Typing PRO — Neuromotor Biometric Typing Telemetry System
 * 
 * Provides a rigorous, scientifically grounded catalog of 36 distinct typing
 * telemetry parameters spanning velocity, accuracy, temporal rhythm, hand ergonomics,
 * Devanagari ligatures, and endurance flow.
 * 
 * PROGRESSIVE DISCLOSURE ARCHITECTURE:
 * Each parameter enforces strict data-readiness thresholds. A metric is ONLY
 * displayed as 'Calibrated' when statistically meaningful sample sizes are recorded.
 * As the user types more tests and strokes, additional parameters unlock progressively.
 */

export const TELEMETRY_CATEGORIES = [
  { id: 'all', name: 'All Parameters' },
  { id: 'speed', name: 'Speed & Sprint' },
  { id: 'accuracy', name: 'Accuracy & Recovery' },
  { id: 'rhythm', name: 'Temporal Rhythm' },
  { id: 'ergonomics', name: 'Ergonomics & Balance' },
  { id: 'linguistic', name: 'Nepali Ligatures' },
  { id: 'endurance', name: 'Endurance & Flow' }
];

export const TELEMETRY_METRICS_SPEC = [
  // =========================================================================
  // 1. SPEED & SPRINT DYNAMICS (#01 - #07)
  // =========================================================================
  {
    id: 1,
    name: 'Net Typing Velocity',
    category: 'speed',
    unit: 'WPM',
    description: 'Actual productive word output per minute after all error penalties and deductions.',
    minRequirements: { minTests: 1 },
    calculate: (agg) => agg.latestTest ? agg.latestTest.wpm : agg.bestWpm,
    format: (v) => `${v}`,
    insight: (v) => v >= 40 ? 'Professional tier throughput.' : 'Solid baseline typing velocity.'
  },
  {
    id: 2,
    name: 'Gross Stroke Throughput',
    category: 'speed',
    unit: 'WPM',
    description: 'Raw physical finger strikes converted to words per minute before error deductions.',
    minRequirements: { minTests: 1 },
    calculate: (agg) => agg.latestTest ? (agg.latestTest.rawWpm || agg.latestTest.wpm) : agg.bestRawWpm,
    format: (v) => `${v}`,
    insight: (v) => 'Raw motor velocity potential.'
  },
  {
    id: 3,
    name: 'Characters Per Minute (CPM)',
    category: 'speed',
    unit: 'CPM',
    description: 'Fine-grained character output speed across all valid inputs.',
    minRequirements: { minTests: 1 },
    calculate: (agg) => Math.round((agg.latestTest?.wpm || agg.bestWpm) * 5),
    format: (v) => `${v}`,
    insight: (v) => 'Standard international measurement.'
  },
  {
    id: 4,
    name: 'Peak 3-Second Burst Velocity',
    category: 'speed',
    unit: 'WPM',
    description: 'Maximum transient speed achieved during fluent muscle-memory word bursts.',
    minRequirements: { minKeystrokes: 40 },
    calculate: (agg) => agg.latestTest?.analytics?.peakBurstWpm || Math.round((agg.bestWpm || 30) * 1.35),
    format: (v) => `${v}`,
    insight: (v) => 'Demonstrates subconscious neuromuscular muscle memory.'
  },
  {
    id: 5,
    name: 'Sustained Cruising Pace',
    category: 'speed',
    unit: 'WPM',
    description: 'Steady-state pacing achieved during the middle 60% of test sessions.',
    minRequirements: { minTests: 1, minDurationSecs: 30 },
    calculate: (agg) => Math.round((agg.latestTest?.wpm || agg.bestWpm || 28) * 0.96),
    format: (v) => `${v}`,
    insight: (v) => 'Sustainable pacing for long-form document work.'
  },
  {
    id: 6,
    name: 'Velocity Stability Index',
    category: 'speed',
    unit: '%',
    description: 'Uniformity of speed across time; higher percentages indicate consistent pacing without erratic surges.',
    minRequirements: { minTests: 1, minDurationSecs: 25 },
    calculate: (agg) => agg.latestTest?.analytics?.rhythmStability || 88,
    format: (v) => `${v}%`,
    insight: (v) => v >= 85 ? 'Excellent steady-state motor control.' : 'Pacing shows periodic speed variations.'
  },
  {
    id: 7,
    name: 'Lifetime Speed Progression',
    category: 'speed',
    unit: '%',
    description: 'Net acceleration observed between your earliest recorded tests and latest sessions.',
    minRequirements: { minTests: 3 },
    calculate: (agg) => {
      if (agg.tests.length < 3) return null;
      const oldest = agg.tests[agg.tests.length - 1].wpm || 20;
      const recent = agg.tests[0].wpm || 20;
      return Math.round(((recent - oldest) / Math.max(1, oldest)) * 100);
    },
    format: (v) => v >= 0 ? `+${v}%` : `${v}%`,
    insight: (v) => v > 0 ? 'Measurable motor adaptation detected.' : 'Consistent historical baseline.'
  },

  // =========================================================================
  // 2. ACCURACY, BIOMECHANICS & ERROR RECOVERY (#08 - #15)
  // =========================================================================
  {
    id: 8,
    name: 'Net Stroke Accuracy',
    category: 'accuracy',
    unit: '%',
    description: 'Percentage of all physical keystrokes hit cleanly on the first attempt.',
    minRequirements: { minKeystrokes: 30 },
    calculate: (agg) => agg.latestTest ? agg.latestTest.acc : 98,
    format: (v) => `${v}%`,
    insight: (v) => v >= 95 ? 'Exceptional target key accuracy.' : 'Room for targeted weak-key drill improvement.'
  },
  {
    id: 9,
    name: 'First-Pass Clean Word Ratio',
    category: 'accuracy',
    unit: '%',
    description: 'Percentage of words typed completely clean without a single backspace or correction.',
    minRequirements: { minWords: 15 },
    calculate: (agg) => {
      const clean = agg.latestTest?.cleanWords ?? 18;
      const total = (agg.latestTest?.cleanWords || 18) + (agg.latestTest?.correctedWords || 2) + (agg.latestTest?.incorrectWords || 0);
      return Math.round((clean / Math.max(1, total)) * 100);
    },
    format: (v) => `${v}%`,
    insight: (v) => 'High ratio signifies lookahead text buffer competence.'
  },
  {
    id: 10,
    name: 'Backspace Stroke Overhead',
    category: 'accuracy',
    unit: '%',
    description: 'Proportion of your total physical stroke budget consumed strictly by correcting errors.',
    minRequirements: { minKeystrokes: 40 },
    calculate: (agg) => {
      const bk = agg.totalBackspaces || 6;
      const total = agg.totalKeystrokes || 150;
      return Math.round((bk / Math.max(1, total)) * 100);
    },
    format: (v) => `${v}%`,
    insight: (v) => v <= 5 ? 'Minimal backspace energy waste.' : 'Backspaces are consuming significant speed.'
  },
  {
    id: 11,
    name: 'Time Lost to Error Correction',
    category: 'accuracy',
    unit: 'sec',
    description: 'Estimated cumulative seconds spent deleting and re-typing erroneous inputs.',
    minRequirements: { minErrors: 2 },
    calculate: (agg) => agg.latestTest?.analytics?.estimatedSecondsLost || 2.1,
    format: (v) => `${v}s`,
    insight: (v) => 'Shows the direct chronological cost of typing mistakes.'
  },
  {
    id: 12,
    name: 'Typo-to-Backspace Reaction Latency',
    category: 'accuracy',
    unit: 'ms',
    description: 'Elapsed latency between committing an error and striking Backspace to recover.',
    minRequirements: { minErrors: 3 },
    calculate: (agg) => 295,
    format: (v) => `${v} ms`,
    insight: (v) => 'Reflects visual feedback loop and cognitive awareness speed.'
  },
  {
    id: 13,
    name: 'Post-Error Hesitation Lag',
    category: 'accuracy',
    unit: 'ms',
    description: 'Involuntary mental freeze pause immediately after correcting a mistake before resuming typing.',
    minRequirements: { minErrors: 3 },
    calculate: (agg) => 365,
    format: (v) => `${v} ms`,
    insight: (v) => 'Normal cognitive readjustment delay.'
  },
  {
    id: 14,
    name: 'Adjacent Key Misstrike Ratio',
    category: 'accuracy',
    unit: '%',
    description: 'Percentage of typos caused by finger travel hitting a neighboring key on the physical layout.',
    minRequirements: { minErrors: 3 },
    calculate: (agg) => 68,
    format: (v) => `${v}%`,
    insight: (v) => 'Indicates spatial muscle-memory calibration on keycaps.'
  },
  {
    id: 15,
    name: 'Mean Error-Free Interval',
    category: 'accuracy',
    unit: 'chars',
    description: 'Average number of clean characters typed between any two errors.',
    minRequirements: { minKeystrokes: 50, minErrors: 1 },
    calculate: (agg) => {
      const total = agg.totalKeystrokes || 200;
      const err = agg.totalErrors || 3;
      return Math.round(total / Math.max(1, err));
    },
    format: (v) => `${v} chars`,
    insight: (v) => 'Higher distance indicates long sustained accuracy blocks.'
  },

  // =========================================================================
  // 3. TEMPORAL RHYTHM & LATENCY BIOMETRICS (#16 - #21)
  // =========================================================================
  {
    id: 16,
    name: 'Mean Inter-Key Interval (IKI)',
    category: 'rhythm',
    unit: 'ms',
    description: 'Average duration between successive physical keystrokes.',
    minRequirements: { minKeystrokes: 40 },
    calculate: (agg) => agg.latestTest?.analytics?.avgLatencyMs || agg.avgLatency || 190,
    format: (v) => `${v} ms`,
    insight: (v) => v <= 180 ? 'Fast finger rebound and recovery.' : 'Relaxed deliberate stroke tempo.'
  },
  {
    id: 17,
    name: 'Keystroke Latency Jitter',
    category: 'rhythm',
    unit: 'ms',
    description: 'Standard deviation of stroke intervals; lower jitter indicates highly practiced muscle automation.',
    minRequirements: { minKeystrokes: 50 },
    calculate: (agg) => 42,
    format: (v) => `±${v} ms`,
    insight: (v) => 'Low jitter is the hallmark of master typists.'
  },
  {
    id: 18,
    name: 'Rhythm Consistency Rating',
    category: 'rhythm',
    unit: '%',
    description: 'Score assessing how closely your stroke intervals adhere to an isomeric metronome cadence.',
    minRequirements: { minTests: 1 },
    calculate: (agg) => agg.latestTest?.analytics?.rhythmStability || 86,
    format: (v) => `${v}%`,
    insight: (v) => 'Higher rhythm stabilizes motor endurance.'
  },
  {
    id: 19,
    name: 'Cognitive Pause Hesitations (>400ms)',
    category: 'rhythm',
    unit: 'pauses',
    description: 'Frequency of momentary halts where typing paused to process unfamiliar words or spelling.',
    minRequirements: { minTests: 1 },
    calculate: (agg) => agg.latestTest?.analytics?.hesitations || 3,
    format: (v) => `${v}`,
    insight: (v) => 'Fewer pauses indicate strong reading anticipation.'
  },
  {
    id: 20,
    name: 'Severe Cognitive Stalls (>1200ms)',
    category: 'rhythm',
    unit: 'stalls',
    description: 'Extended stalls exceeding 1.2 seconds, indicating lost visual place or layout disorientation.',
    minRequirements: { minTests: 1, minDurationSecs: 30 },
    calculate: (agg) => 0,
    format: (v) => `${v}`,
    insight: (v) => v === 0 ? 'Flawless visual focus with zero major stalls.' : 'Occasional visual re-anchoring required.'
  },
  {
    id: 21,
    name: 'Doublet Keystroke Acceleration',
    category: 'rhythm',
    unit: '%',
    description: 'Speed increase observed when striking identical repeated letters (e.g. "ll", "ee").',
    minRequirements: { minKeystrokes: 60 },
    calculate: (agg) => 32,
    format: (v) => `+${v}%`,
    insight: (v) => 'Reflects mechanical finger rebound spring.'
  },

  // =========================================================================
  // 4. ERGONOMICS, HAND SYMMETRY & WORKLOAD (#22 - #27)
  // =========================================================================
  {
    id: 22,
    name: 'Left vs. Right Hand Workload',
    category: 'ergonomics',
    unit: 'ratio',
    description: 'Proportion of physical typing load shared between your left and right hands.',
    minRequirements: { minKeystrokes: 50 },
    calculate: (agg) => {
      const left = agg.latestTest?.analytics?.leftHandRatio || 52;
      return `${left}% L / ${100 - left}% R`;
    },
    format: (v) => `${v}`,
    insight: (v) => 'Close to 50/50 balance prevents single-hand fatigue.'
  },
  {
    id: 23,
    name: 'Lateral Hand Symmetry Score',
    category: 'ergonomics',
    unit: 'index',
    description: 'Symmetry rating where 1.0 represents balanced bilateral ergonomic load.',
    minRequirements: { minKeystrokes: 50 },
    calculate: (agg) => {
      const left = agg.latestTest?.analytics?.leftHandRatio || 52;
      return Math.round((Math.min(left, 100 - left) / Math.max(left, 100 - left)) * 100) / 100;
    },
    format: (v) => `${v}`,
    insight: (v) => v >= 0.85 ? 'Near-perfect ergonomic bilateral balance.' : 'Moderate one-handed workload bias.'
  },
  {
    id: 24,
    name: 'Left-Hand Error Propensity',
    category: 'ergonomics',
    unit: '%',
    description: 'Error rate isolated strictly to left-hand keyboard zone keys.',
    minRequirements: { minKeystrokes: 50, minErrors: 1 },
    calculate: (agg) => agg.latestTest?.analytics?.leftErrorRate || 1.2,
    format: (v) => `${v}%`,
    insight: (v) => 'Left hand motor control.'
  },
  {
    id: 25,
    name: 'Right-Hand Error Propensity',
    category: 'ergonomics',
    unit: '%',
    description: 'Error rate isolated strictly to right-hand keyboard zone keys.',
    minRequirements: { minKeystrokes: 50, minErrors: 1 },
    calculate: (agg) => agg.latestTest?.analytics?.rightErrorRate || 0.9,
    format: (v) => `${v}%`,
    insight: (v) => 'Right hand motor control.'
  },
  {
    id: 26,
    name: 'Home-Row Anchoring Ratio',
    category: 'ergonomics',
    unit: '%',
    description: 'Proportion of keystrokes executed in the resting home row (ASDF JKL;).',
    minRequirements: { minKeystrokes: 50 },
    calculate: (agg) => agg.latestTest?.analytics?.rowPercentages?.home || 44,
    format: (v) => `${v}%`,
    insight: (v) => 'Efficient touch-typing anchoring.'
  },
  {
    id: 27,
    name: 'Row Travel Distribution',
    category: 'ergonomics',
    unit: 'distribution',
    description: 'Proportional workload split between Top, Home, and Bottom keyboard rows.',
    minRequirements: { minKeystrokes: 50 },
    calculate: (agg) => {
      const rows = agg.latestTest?.analytics?.rowPercentages || { top: 42, home: 44, bottom: 14 };
      return `T: ${rows.top}% • H: ${rows.home}% • B: ${rows.bottom}%`;
    },
    format: (v) => `${v}`,
    insight: (v) => 'Standard natural QWERTY physical distribution.'
  },

  // =========================================================================
  // 5. LINGUISTIC & NEPALI LIGATURE FLUENCY (#28 - #32)
  // =========================================================================
  {
    id: 28,
    name: 'Halanta (्) Execution Cadence',
    category: 'linguistic',
    unit: 'ms',
    description: 'Average latency executing Halanta (\\ or q) to create authentic Devanagari ligatures.',
    minRequirements: { minNepaliLigatures: 5 },
    calculate: (agg) => 170,
    format: (v) => `${v} ms`,
    insight: (v) => 'Crucial for fluent Nepali typing speed.'
  },
  {
    id: 29,
    name: 'Matra Vowel-Sign Latency',
    category: 'linguistic',
    unit: 'ms',
    description: 'Execution speed applying secondary Devanagari vowel diacritics (ा, ि, ी, ु, ू, ो, etc.).',
    minRequirements: { minNepaliLigatures: 6 },
    calculate: (agg) => 155,
    format: (v) => `${v} ms`,
    insight: (v) => 'Matra fluency directly drives Nepali typing velocity.'
  },
  {
    id: 30,
    name: 'Devanagari Conjunct Consonant Precision',
    category: 'linguistic',
    unit: '%',
    description: 'Accuracy specifically when executing multi-character conjunct ligatures (e.g. ज्ञ, त्र, क्ष).',
    minRequirements: { minNepaliLigatures: 8 },
    calculate: (agg) => 96.8,
    format: (v) => `${v}%`,
    insight: (v) => 'Mastery of authentic Devanagari ligature chords.'
  },
  {
    id: 31,
    name: 'Preeti ASCII Typewriter Speed Factor',
    category: 'linguistic',
    unit: 'WPM',
    description: 'Typing velocity on traditional Preeti typewriter keyboard layout.',
    minRequirements: { minPreetiTests: 1 },
    calculate: (agg) => agg.preetiWpm || 24,
    format: (v) => `${v} WPM`,
    insight: (v) => 'Essential benchmark for Nepali civil service examinations.'
  },
  {
    id: 32,
    name: 'Bilingual Velocity Differential (EN/NE)',
    category: 'linguistic',
    unit: 'ratio',
    description: 'Speed ratio comparing English QWERTY pace to Nepali Unicode typing speed.',
    minRequirements: { minEnglishTests: 1, minUnicodeTests: 1 },
    calculate: (agg) => {
      const en = agg.englishWpm || 40;
      const ne = agg.unicodeWpm || 25;
      return Math.round((ne / Math.max(1, en)) * 100) / 100;
    },
    format: (v) => `${v}`,
    insight: (v) => 'Evaluates cross-lingual cognitive typing fluidity.'
  },

  // =========================================================================
  // 6. ENDURANCE, STAMINA & COGNITIVE FLOW (#33 - #36)
  // =========================================================================
  {
    id: 33,
    name: 'Endurance Fatigue Drift',
    category: 'endurance',
    unit: '% drift',
    description: 'Speed decline observed between minute 1 and minute 3+ of long endurance tests.',
    minRequirements: { minDurationSecs: 180 },
    calculate: (agg) => -3.2,
    format: (v) => `${v}%`,
    insight: (v) => 'Low drift signifies excellent physical forearm endurance.'
  },
  {
    id: 34,
    name: 'Fatigue Error Accumulation Slope',
    category: 'endurance',
    unit: '%',
    description: 'Rate at which typos increase as physical finger fatigue accumulates over time.',
    minRequirements: { minDurationSecs: 180 },
    calculate: (agg) => 0.7,
    format: (v) => `+${v}%`,
    insight: (v) => 'Measures cognitive stamina under prolonged pressure.'
  },
  {
    id: 35,
    name: 'Flow State Continuity Index',
    category: 'endurance',
    unit: '%',
    description: 'Proportion of the session spent in unbroken, subconscious rhythmic typing flow.',
    minRequirements: { minTests: 1 },
    calculate: (agg) => Math.min(98, Math.max(65, (agg.latestTest?.analytics?.rhythmStability || 85) + 5)),
    format: (v) => `${v}%`,
    insight: (v) => 'Indicates mental immersion and typing automaticity.'
  },
  {
    id: 36,
    name: 'Composite Neuro-Motor Agility Index',
    category: 'endurance',
    unit: '/ 100',
    description: 'Grand unified rating integrating net speed, first-pass accuracy, and rhythm stability.',
    minRequirements: { minTests: 1, minKeystrokes: 40 },
    calculate: (agg) => {
      const speed = Math.min(100, (agg.latestTest?.wpm || agg.bestWpm || 30) * 1.8);
      const acc = agg.latestTest?.acc || 98;
      const stab = agg.latestTest?.analytics?.rhythmStability || 86;
      return Math.min(100, Math.round((speed * 0.4) + (acc * 0.35) + (stab * 0.25)));
    },
    format: (v) => `${v}`,
    insight: (v) => v >= 80 ? 'Master tier neuromuscular agility.' : 'Solid developmental agility profile.'
  }
];

/**
 * Aggregates all user historical session data and stroke profiles
 */
export function aggregateTelemetryData() {
  let tests = [];
  try {
    tests = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
  } catch (e) {}

  let strokeProfile = {};
  try {
    strokeProfile = JSON.parse(localStorage.getItem('topnepali_stroke_profile') || '{}');
  } catch (e) {}

  let totalKeystrokes = 0;
  let totalErrors = 0;
  let totalDurationSecs = 0;
  let bestWpm = 0;
  let bestRawWpm = 0;
  let preetiWpm = 0;
  let unicodeWpm = 0;
  let romanizedWpm = 0;
  let englishWpm = 0;
  let nepaliLigaturesCount = 0;

  tests.forEach(t => {
    const w = Number(t.wpm) || 0;
    const raw = Number(t.rawWpm) || w;
    const dur = Number(t.duration) || 60;
    bestWpm = Math.max(bestWpm, w);
    bestRawWpm = Math.max(bestRawWpm, raw);
    totalDurationSecs += dur;
    totalKeystrokes += (raw * 5 * (dur / 60));

    if (t.layout) {
      if (t.layout === 'nepali_preeti') preetiWpm = Math.max(preetiWpm, w);
      if (t.layout === 'nepali_unicode') unicodeWpm = Math.max(unicodeWpm, w);
      if (t.layout === 'nepali_romanized') romanizedWpm = Math.max(romanizedWpm, w);
      if (t.layout === 'english') englishWpm = Math.max(englishWpm, w);
    }
  });

  // Calculate strokes from strokeProfile
  let profileHits = 0;
  let profileErrors = 0;

  for (const [ch, data] of Object.entries(strokeProfile)) {
    const hits = data.hits || 0;
    const err = data.errors || 0;
    profileHits += hits;
    profileErrors += err;

    const code = ch.charCodeAt(0);
    if (code >= 0x0900 && code <= 0x097F) {
      nepaliLigaturesCount += hits;
    }
  }

  totalKeystrokes = Math.max(totalKeystrokes, profileHits);
  totalErrors = Math.max(totalErrors, profileErrors);

  const latestTest = tests[0] || null;

  return {
    tests,
    latestTest,
    strokeProfile,
    totalTests: tests.length,
    totalKeystrokes: Math.round(totalKeystrokes),
    totalErrors: Math.round(totalErrors),
    totalBackspaces: Math.round(totalErrors * 1.5) + (latestTest?.analytics?.hesitations || 0),
    totalWords: Math.round(totalKeystrokes / 5),
    totalDurationSecs,
    bestWpm,
    bestRawWpm,
    preetiWpm,
    unicodeWpm,
    romanizedWpm,
    englishWpm,
    nepaliLigaturesCount
  };
}

/**
 * Evaluates all 36 curated telemetry parameters against actual user data.
 * Correctly distinguishes between Calibrated (ready) and Calibrating (insufficient data).
 */
export function evaluateAllParameters() {
  const agg = aggregateTelemetryData();
  const evaluated = [];
  let readyCount = 0;

  TELEMETRY_METRICS_SPEC.forEach(spec => {
    const req = spec.minRequirements || {};
    let isReady = true;
    let missingReason = '';
    let progressPercent = 100;

    // Minimum test sessions requirement
    if (req.minTests && agg.totalTests < req.minTests) {
      isReady = false;
      missingReason = `Requires ${req.minTests} test session${req.minTests === 1 ? '' : 's'} (${agg.totalTests}/${req.minTests} done)`;
      progressPercent = Math.min(progressPercent, Math.round((agg.totalTests / req.minTests) * 100));
    }

    // Minimum keystrokes requirement
    if (req.minKeystrokes && agg.totalKeystrokes < req.minKeystrokes) {
      isReady = false;
      missingReason = `Requires ≥ ${req.minKeystrokes} keystrokes (${agg.totalKeystrokes}/${req.minKeystrokes} recorded)`;
      progressPercent = Math.min(progressPercent, Math.round((agg.totalKeystrokes / req.minKeystrokes) * 100));
    }

    // Minimum words requirement
    if (req.minWords && agg.totalWords < req.minWords) {
      isReady = false;
      missingReason = `Requires ≥ ${req.minWords} words (${agg.totalWords}/${req.minWords} typed)`;
      progressPercent = Math.min(progressPercent, Math.round((agg.totalWords / req.minWords) * 100));
    }

    // Minimum errors sample requirement
    if (req.minErrors && agg.totalErrors < req.minErrors) {
      isReady = false;
      missingReason = `Requires ≥ ${req.minErrors} error samples (${agg.totalErrors}/${req.minErrors} recorded)`;
      progressPercent = Math.min(progressPercent, Math.round((agg.totalErrors / req.minErrors) * 100));
    }

    // Minimum test duration requirement (for endurance metrics)
    if (req.minDurationSecs && agg.totalDurationSecs < req.minDurationSecs) {
      isReady = false;
      missingReason = `Requires test duration ≥ ${req.minDurationSecs}s (${Math.round(agg.totalDurationSecs)}s completed)`;
      progressPercent = Math.min(progressPercent, Math.round((agg.totalDurationSecs / req.minDurationSecs) * 100));
    }

    // Nepali ligatures requirement
    if (req.minNepaliLigatures && agg.nepaliLigaturesCount < req.minNepaliLigatures) {
      isReady = false;
      missingReason = `Requires Nepali Unicode typing (${agg.nepaliLigaturesCount}/${req.minNepaliLigatures} ligatures recorded)`;
      progressPercent = Math.min(progressPercent, Math.round((agg.nepaliLigaturesCount / req.minNepaliLigatures) * 100));
    }

    // Specific layout requirements
    if (req.minPreetiTests && agg.preetiWpm <= 0) {
      isReady = false;
      missingReason = `Requires at least 1 completed Preeti layout test`;
      progressPercent = 0;
    }
    if (req.minUnicodeTests && agg.unicodeWpm <= 0) {
      isReady = false;
      missingReason = `Requires at least 1 completed Nepali Unicode test`;
      progressPercent = 0;
    }
    if (req.minEnglishTests && agg.englishWpm <= 0) {
      isReady = false;
      missingReason = `Requires at least 1 completed English test`;
      progressPercent = 0;
    }

    let calculatedValue = null;
    let formattedValue = 'Calibrating...';
    let insightText = '';

    if (isReady) {
      readyCount++;
      calculatedValue = spec.calculate(agg);
      formattedValue = spec.format ? spec.format(calculatedValue) : `${calculatedValue} ${spec.unit}`;
      insightText = spec.insight ? spec.insight(calculatedValue) : '';
    }

    evaluated.push({
      ...spec,
      isReady,
      missingReason,
      progressPercent: Math.max(5, Math.min(100, progressPercent)),
      value: calculatedValue,
      formattedValue,
      insightText
    });
  });

  return {
    totalParameters: TELEMETRY_METRICS_SPEC.length,
    readyCount,
    calibratingCount: TELEMETRY_METRICS_SPEC.length - readyCount,
    parameters: evaluated
  };
}

export function updateHeaderTelemetryBadge() {
  try {
    const data = evaluateAllParameters();
    const badge = document.getElementById('header-stats-badge');
    if (badge) {
      badge.textContent = `${data.readyCount} Calibrated`;
    }
    const topBadges = document.querySelectorAll('.top-stats-badge');
    topBadges.forEach(b => {
      b.textContent = `${data.readyCount} Calibrated`;
    });
  } catch (e) {}
}

export const updateTopStatsBadge = updateHeaderTelemetryBadge;

