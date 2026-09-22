/**
 * Professional Typing Speed & Accuracy Statistics Calculator
 * Implements international Monkeytype standard formulas and typing proficiency tier benchmarks.
 */

export interface TestKeystrokeLog {
  timestamp: number;
  charExpected: string;
  charTyped: string;
  isCorrect: boolean;
  code: string;
}

export interface WpmTimelinePoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface DetailedTestResult {
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  cpm: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  elapsedSeconds: number;
  consistency: number; // Percentage (100% = perfectly steady rhythm)
  timeline: WpmTimelinePoint[];
  errorMap: Record<string, number>; // Most frequent missed characters
  rankTitle: string; // e.g. Speed Demon, Master Typist, Proficient, Intermediate, Beginner
  rankBadgeColor: string;
  rankFeedback: string;
}

/**
 * Calculates complete detailed typing statistics from test run data
 */
export function calculateDetailedStats(options: {
  logs: TestKeystrokeLog[];
  elapsedSeconds: number;
  targetDurationSeconds?: number;
  isNepali?: boolean;
}): DetailedTestResult {
  const { logs, elapsedSeconds, isNepali = false } = options;

  const validSeconds = Math.max(1, elapsedSeconds);
  const minutes = validSeconds / 60;

  let correctCount = 0;
  let errorCount = 0;
  const errorMap: Record<string, number> = {};

  for (const log of logs) {
    if (log.isCorrect) {
      correctCount++;
    } else {
      errorCount++;
      const key = log.charExpected || log.charTyped || 'Space';
      errorMap[key] = (errorMap[key] || 0) + 1;
    }
  }

  const totalCount = correctCount + errorCount;

  // Standard Formula: 1 word = 5 keystrokes
  const standardWordLength = 5;

  // Raw WPM = (Total keystrokes / 5) / minutes
  const rawWpm = Math.round((totalCount / standardWordLength) / minutes);

  // Net WPM = (Correct keystrokes / 5) / minutes
  const netWpm = Math.max(0, Math.round((correctCount / standardWordLength) / minutes));

  // Characters Per Minute (CPM)
  const cpm = Math.round(correctCount / minutes);

  // Accuracy Percentage
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 1000) / 10 : 100;

  // Second-by-second timeline generation
  const timeline: WpmTimelinePoint[] = [];
  const secondBuckets: { correct: number; total: number; errors: number }[] = [];

  const startTime = logs.length > 0 ? logs[0].timestamp : 0;
  const totalSecs = Math.ceil(validSeconds);

  for (let s = 0; s <= totalSecs; s++) {
    secondBuckets.push({ correct: 0, total: 0, errors: 0 });
  }

  for (const log of logs) {
    const secOffset = Math.min(totalSecs, Math.max(0, Math.floor((log.timestamp - startTime) / 1000)));
    if (secondBuckets[secOffset]) {
      secondBuckets[secOffset].total++;
      if (log.isCorrect) {
        secondBuckets[secOffset].correct++;
      } else {
        secondBuckets[secOffset].errors++;
      }
    }
  }

  let cumulativeCorrect = 0;
  let cumulativeTotal = 0;
  const secondWpmList: number[] = [];

  for (let s = 1; s <= totalSecs; s++) {
    cumulativeCorrect += secondBuckets[s]?.correct || 0;
    cumulativeTotal += secondBuckets[s]?.total || 0;
    const m = s / 60;
    const curWpm = Math.round((cumulativeCorrect / standardWordLength) / m);
    const curRaw = Math.round((cumulativeTotal / standardWordLength) / m);

    timeline.push({
      second: s,
      wpm: curWpm,
      rawWpm: curRaw,
      errors: secondBuckets[s]?.errors || 0
    });

    secondWpmList.push(curWpm);
  }

  // Consistency Calculation: 100 - (Coefficient of Variation)
  let consistency = 100;
  if (secondWpmList.length > 2) {
    const mean = secondWpmList.reduce((a, b) => a + b, 0) / secondWpmList.length;
    if (mean > 0) {
      const variance = secondWpmList.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / secondWpmList.length;
      const stdDev = Math.sqrt(variance);
      const cv = (stdDev / mean) * 100;
      consistency = Math.max(0, Math.min(100, Math.round(100 - cv)));
    }
  }

  // Typist Rank Assessment
  let rankTitle = 'Beginner';
  let rankBadgeColor = 'emerald';
  let rankFeedback = 'नियमित अभ्यासले किबोर्डमा गति र आत्मविश्वास बढ्दै जान्छ।';

  if (netWpm >= 50 && accuracy >= 95) {
    rankTitle = '🚀 Speed Demon';
    rankBadgeColor = 'purple';
    rankFeedback = 'अविश्वसनीय गति! तपाईं प्रो स्तरको टाइपिस्ट हुनुहुन्छ।';
  } else if (netWpm >= 40 && accuracy >= 90) {
    rankTitle = '⚡ Master Typist';
    rankBadgeColor = 'amber';
    rankFeedback = 'उत्कृष्ट गति र शुद्धता! व्यावसायिक स्तरको लेखन क्षमता।';
  } else if (netWpm >= 30 && accuracy >= 88) {
    rankTitle = '🎯 Proficient';
    rankBadgeColor = 'blue';
    rankFeedback = 'धेरै राम्रो गति! दैनिक काम, पत्रकारिता र साहित्य लेखनका लागि उत्कृष्ट।';
  } else if (netWpm >= 20 && accuracy >= 80) {
    rankTitle = '🌱 Intermediate';
    rankBadgeColor = 'emerald';
    rankFeedback = 'सन्तोषजनक गति। औँलाको बसाइ र निरन्तरतामा अलिकति ध्यान दिनुहोस्।';
  } else {
    rankTitle = '🐣 Learner';
    rankBadgeColor = 'rose';
    rankFeedback = 'हतार नगरी शुद्धतामा ध्यान दिनुहोस्, गति आफैँ बढ्दै जानेछ।';
  }

  return {
    netWpm,
    rawWpm,
    accuracy,
    cpm,
    totalKeystrokes: totalCount,
    correctKeystrokes: correctCount,
    errorKeystrokes: errorCount,
    elapsedSeconds: Math.round(validSeconds * 10) / 10,
    consistency,
    timeline,
    errorMap,
    rankTitle,
    rankBadgeColor,
    rankFeedback
  };
}
