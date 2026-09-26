/**
 * TopNepali Typing — Smart Adaptive Drill & Weak Key Correction Algorithm
 */

const PROFILE_STORAGE_KEY = 'topnepali_stroke_profile';

export const ADAPTIVE_ENGLISH_WORDS = [
  'own', 'owl', 'low', 'blow', 'slow', 'glow', 'flow', 'show', 'grow', 'snow',
  'crow', 'brow', 'down', 'town', 'gown', 'clown', 'drown', 'frown', 'brown',
  'bowl', 'howl', 'fowl', 'word', 'work', 'worm', 'worn', 'world', 'worth', 'worse',
  'wood', 'wool', 'wound', 'power', 'tower', 'flower', 'shower', 'powder', 'vowel',
  'towel', 'below', 'fellow', 'yellow', 'pillow', 'willow', 'window', 'shadow',
  'meadow', 'arrow', 'narrow', 'sparrow', 'sorrow', 'borrow', 'follow', 'hollow',
  'swallow', 'wallow', 'elbow', 'rainbow', 'owner', 'coworker', 'downward', 'outward',
  'network', 'workflow', 'workshop', 'clockwise', 'backward', 'forward', 'knowledge',
  'every', 'water', 'letter', 'better', 'street', 'winter', 'butter', 'pretty',
  'treat', 'retry', 'theory', 'thirty', 'energy', 'return', 'system', 'twenty',
  'yesterday', 'mystery', 'battery', 'lottery', 'pottery', 'territory', 'gravity',
  'glad', 'glass', 'grass', 'flag', 'flask', 'flash', 'salad', 'staff', 'half',
  'fall', 'fast', 'dash', 'safe', 'sage', 'fade', 'game', 'gate', 'shade', 'shaft',
  'cabin', 'cable', 'bacon', 'combine', 'common', 'carbon', 'banner', 'manner',
  'number', 'member', 'november', 'canyon', 'vacuum', 'vanilla', 'balance',
  'minimum', 'maximum', 'vibrate', 'vibrant', 'movement', 'monument',
  'quick', 'quiet', 'quite', 'quote', 'queen', 'quest', 'equal', 'liquid',
  'plaza', 'puzzle', 'blaze', 'breeze', 'freeze', 'bronze', 'citizen', 'horizon',
  'exact', 'extra', 'toxic', 'relax', 'expert', 'complex', 'oxygen',
  'judge', 'jump', 'juice', 'major', 'object', 'project', 'adjust', 'journey',
  'spark', 'speak', 'impact', 'package', 'pickup', 'jacket', 'blanket', 'pocket',
  'algorithm', 'keyboard', 'computer', 'software', 'hardware', 'developer',
  'interface', 'bandwidth', 'protocol', 'database', 'connection', 'execution',
  'responsive', 'framework', 'parameter', 'frequency', 'keystroke', 'rhythm',
  'accuracy', 'discipline', 'experience', 'confidence', 'milestone', 'perspective'
];

export const ADAPTIVE_NEPALI_WORDS = [
  'धर्म', 'धन्यवाद', 'प्रधान', 'संविधान', 'अधिकार', 'साधना', 'विधेयक', 'धार',
  'धनी', 'धर्ती', 'धनुष', 'ध्वनि', 'धैर्य', 'धमिलो', 'धुवाँ', 'धरातल',
  'भारत', 'भविष्य', 'भावना', 'अभियान', 'प्रभुत्व', 'सभ्यता', 'भवन', 'भरोसा',
  'भक्ति', 'भाग', 'भाग्य', 'भाषा', 'भारी', 'भुइँ', 'भूगोल', 'भ्रष्टाचार',
  'सम्बन्ध', 'सम्भव', 'वैभव', 'अनुभव', 'प्रभाव', 'स्वभाव', 'विभाजन', 'अभ्यास',
  'ज्ञान', 'विज्ञ', 'प्रज्ञा', 'जिज्ञासा', 'अज्ञात', 'वैज्ञानिक', 'कृतज्ञ',
  'मित्र', 'क्षेत्र', 'चरित्र', 'पत्र', 'छात्र', 'यात्रा', 'रात्री', 'चित्र',
  'शिक्षा', 'लक्षण', 'सुरक्षा', 'अध्यक्ष', 'परीक्षा', 'प्रतिक्षा', 'मोक्ष',
  'गङ्गा', 'सङ्घर्ष', 'सङ्गीत', 'अङ्क', 'पङ्क्ति', 'शङ्का', 'दङ्गा', 'रङ्ग',
  'बुद्धि', 'शुद्ध', 'प्रसिद्ध', 'सिद्धि', 'युद्ध', 'समृद्धि', 'विरुद्ध',
  'विद्या', 'विद्युत्', 'उद्यम', 'पद्य', 'गद्य', 'अद्यतन', 'मध्याह्न',
  'विशेष', 'आकर्षण', 'भूषण', 'दोष', 'वर्ष', 'हर्ष', 'धनुष', 'पुरुष', 'विषय',
  'शान्ति', 'देश', 'शिक्षा', 'प्रकाश', 'शिखर', 'शब्द', 'शक्ति', 'शासन',
  'संसार', 'समय', 'समाज', 'साहित्य', 'सुन्दर', 'सपना', 'सत्य', 'सद्भाव',
  'खोला', 'खुसी', 'खरायो', 'खोज', 'खुकुरी', 'लेखक', 'सुख', 'साख',
  'घर', 'घाम', 'घण्टी', 'घमण्ड', 'घरेलु', 'घटना', 'बाघ', 'ओघ',
  'छाया', 'छाना', 'छोरी', 'छोरा', 'छहारी', 'इच्छा', 'स्वच्छ', 'गुच्छा',
  'झरना', 'झ्याल', 'झण्डा', 'झरी', 'झुण्ड', 'झिमझिम', 'झुल्केघाम',
  'ठूलो', 'ठिक', 'ठमेल', 'पाठक', 'कण्ठ', 'ओठ', 'काठ', 'इँटा',
  'ढोका', 'ढुङ्गा', 'ढाका', 'बढुवा', 'असाढ', 'दृढ', 'प्रौढ',
  'नेपाल', 'काठमाडौँ', 'पोखरा', 'हिमाल', 'सगरमाथा', 'अन्नपूर्ण', 'गौतम', 'बुद्ध',
  'कम्प्युटर', 'इन्टरनेट', 'प्रविधि', 'सञ्चार', 'मोवाइल', 'डिजिटल', 'सञ्जाल',
  'किबोर्ड', 'टाइपिङ', 'गति', 'शुद्धता', 'अक्षर', 'वाक्य', 'किताब', 'कलम'
];

function buildInvertedIndex(wordList: string[]): Record<string, number[]> {
  const index: Record<string, number[]> = {};
  wordList.forEach((word, wIdx) => {
    const chars = new Set([...word.toLowerCase()]);
    chars.forEach(ch => {
      if (!index[ch]) index[ch] = [];
      index[ch].push(wIdx);
    });
  });
  return index;
}

const englishIndex = buildInvertedIndex(ADAPTIVE_ENGLISH_WORDS);
const nepaliIndex = buildInvertedIndex(ADAPTIVE_NEPALI_WORDS);

export function getStrokeProfile(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

export function recordStrokeData(char: string, isCorrect: boolean, latencyMs = 200) {
  if (typeof window === 'undefined' || !char || char === ' ') return;
  const profile = getStrokeProfile();
  const c = char.toLowerCase();

  if (!profile[c]) {
    profile[c] = { hits: 0, errors: 0, totalLatency: 0, latenciesCount: 0 };
  }

  profile[c].hits++;
  if (!isCorrect) {
    profile[c].errors++;
  }
  if (latencyMs > 0 && latencyMs < 4000) {
    profile[c].totalLatency += latencyMs;
    profile[c].latenciesCount++;
  }

  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {}
}

export function getWeakestKeys(lang = 'english', limit = 4) {
  const profile = getStrokeProfile();
  const scored: Array<{ char: string; score: number; errors: number; accuracy: number; avgLatencyMs: number }> = [];

  for (const [ch, data] of Object.entries(profile)) {
    const total = data.hits || 1;
    const errors = data.errors || 0;
    const errorRate = (errors / total);
    const avgLatency = data.latenciesCount > 0 ? (data.totalLatency / data.latenciesCount) : 250;

    const score = (errors * 4) + (errorRate * 25) + Math.max(0, (avgLatency - 350) / 40);

    if (errors > 0 || avgLatency > 400) {
      scored.push({
        char: ch,
        score,
        errors,
        accuracy: Math.round((1 - errorRate) * 100),
        avgLatencyMs: Math.round(avgLatency)
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    return scored.slice(0, limit);
  }

  if (lang === 'english') {
    return [
      { char: 'w', score: 10, errors: 2, accuracy: 80, avgLatencyMs: 320 },
      { char: 'o', score: 9, errors: 2, accuracy: 82, avgLatencyMs: 310 },
      { char: 'r', score: 7, errors: 1, accuracy: 88, avgLatencyMs: 290 },
      { char: 'p', score: 6, errors: 1, accuracy: 90, avgLatencyMs: 300 }
    ];
  } else {
    return [
      { char: 'ध', score: 10, errors: 2, accuracy: 78, avgLatencyMs: 350 },
      { char: '्', score: 9, errors: 2, accuracy: 80, avgLatencyMs: 340 },
      { char: 'भ', score: 8, errors: 2, accuracy: 82, avgLatencyMs: 320 },
      { char: 'ष', score: 7, errors: 1, accuracy: 85, avgLatencyMs: 310 }
    ];
  }
}

export function generateAdaptiveWords(options: {
  lang?: string;
  targetKeys?: string[] | null;
  targetCount?: number;
} = {}): string[] {
  const {
    lang = 'english',
    targetKeys = null,
    targetCount = 30
  } = options;

  const isEng = lang === 'english';
  const wordPool = isEng ? ADAPTIVE_ENGLISH_WORDS : ADAPTIVE_NEPALI_WORDS;

  let keys = targetKeys;
  if (!keys || keys.length === 0) {
    const weak = getWeakestKeys(lang, 3);
    keys = weak.map(w => w.char);
  }

  const normalizedKeys = keys.map(k => k.toLowerCase());
  const keyWeightMap: Record<string, number> = {};
  normalizedKeys.forEach((k, idx) => {
    keyWeightMap[k] = (normalizedKeys.length - idx) * 3;
  });

  const scoredWords: Array<{ word: string; score: number }> = [];

  wordPool.forEach((word) => {
    const lowerWord = word.toLowerCase();
    let hits = 0;
    let distinctHits = 0;
    let weightSum = 0;

    normalizedKeys.forEach(k => {
      let countInWord = 0;
      let pos = lowerWord.indexOf(k);
      while (pos !== -1) {
        countInWord++;
        pos = lowerWord.indexOf(k, pos + 1);
      }
      if (countInWord > 0) {
        distinctHits++;
        hits += countInWord;
        weightSum += (keyWeightMap[k] || 1) * countInWord;
      }
    });

    if (hits > 0) {
      const coOccurrenceMultiplier = Math.pow(distinctHits, 1.6);
      const densityScore = (weightSum * coOccurrenceMultiplier) / Math.sqrt(word.length);

      scoredWords.push({
        word,
        score: densityScore
      });
    }
  });

  scoredWords.sort((a, b) => b.score - a.score);

  const selectedWords: string[] = [];
  const topSlice = scoredWords.slice(0, Math.max(25, scoredWords.length));

  if (topSlice.length === 0) {
    return wordPool.slice(0, targetCount);
  }

  while (selectedWords.length < targetCount) {
    const pool = (Math.random() < 0.75) ? topSlice.slice(0, Math.ceil(topSlice.length * 0.4)) : topSlice;
    const picked = pool[Math.floor(Math.random() * pool.length)].word;
    selectedWords.push(picked);
  }

  return selectedWords;
}
