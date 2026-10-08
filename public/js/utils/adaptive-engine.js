import { DATA } from '../data/typing-words.js';
import { EXAM_SPEECH_NEPALI, EXAM_SPEECH_ENGLISH } from '../data/speeches.js';

const PROFILE_STORAGE_KEY = 'topnepali_stroke_profile';

// Curated high-yield vocabulary lists
export const ADAPTIVE_ENGLISH_WORDS = [
  // A
  'about', 'after', 'again', 'animal', 'answer', 'always', 'appear', 'awake', 'adapt', 'alarm', 'avatar', 'atlas', 'action', 'artist', 'altitude', 'attitude', 'aspect',
  // B
  'build', 'balance', 'better', 'become', 'believe', 'between', 'brother', 'object', 'public', 'bronze', 'habit', 'breeze', 'blanket', 'benefit', 'barrier', 'boundary',
  // C
  'circle', 'center', 'catch', 'notice', 'chance', 'voice', 'clean', 'space', 'decide', 'practice', 'focus', 'force', 'access', 'cancel', 'crucial', 'complex', 'custom',
  // D
  'decide', 'demand', 'different', 'middle', 'under', 'stand', 'order', 'direct', 'discover', 'ladder', 'divide', 'shadow', 'meadow', 'degree', 'dynamic', 'device',
  // E
  'every', 'enter', 'effect', 'energy', 'element', 'level', 'expect', 'secret', 'general', 'eleven', 'remember', 'letter', 'better', 'effort', 'evolve', 'expand',
  // F
  'first', 'family', 'figure', 'follow', 'force', 'field', 'flower', 'prefer', 'office', 'profit', 'factor', 'flight', 'effort', 'defeat', 'fluent', 'foster', 'future',
  // G
  'great', 'group', 'govern', 'ground', 'organize', 'begin', 'degree', 'garden', 'bridge', 'guess', 'guard', 'energy', 'target', 'gentle', 'global', 'growth',
  // H
  'house', 'hand', 'hold', 'happen', 'health', 'human', 'whole', 'rhythm', 'physical', 'method', 'history', 'honest', 'height', 'shadow', 'harbor', 'hazard', 'hybrid',
  // I
  'imagine', 'inspire', 'inside', 'initial', 'limit', 'spirit', 'finish', 'citizen', 'listen', 'visual', 'silent', 'winter', 'liquid', 'impact', 'intent', 'invest',
  // J
  'judge', 'journey', 'enjoy', 'project', 'major', 'object', 'inject', 'adjust', 'justice', 'jungle', 'jacket', 'junior', 'injury', 'jovial', 'junction', 'jargon',
  // K
  'strike', 'market', 'make', 'break', 'skill', 'weak', 'know', 'quick', 'risk', 'block', 'shock', 'check', 'pocket', 'jacket', 'blanket', 'knight', 'kernel',
  // L
  'little', 'letter', 'level', 'light', 'local', 'line', 'place', 'world', 'follow', 'simple', 'visual', 'balance', 'clown', 'yellow', 'legacy', 'linear', 'logic',
  // M
  'memory', 'moment', 'summer', 'commit', 'member', 'system', 'minimum', 'movement', 'measure', 'common', 'hammer', 'camera', 'sample', 'modern', 'motion', 'matrix',
  // N
  'nation', 'learn', 'remain', 'begin', 'number', 'sound', 'planet', 'person', 'define', 'natural', 'dinner', 'banner', 'manner', 'native', 'neural', 'notice',
  // O
  'order', 'power', 'world', 'point', 'control', 'story', 'moment', 'follow', 'notice', 'option', 'focus', 'smooth', 'shadow', 'meadow', 'online', 'output', 'origin',
  // P
  'practice', 'people', 'person', 'problem', 'power', 'prepare', 'public', 'purpose', 'report', 'principle', 'prefer', 'pocket', 'paper', 'patent', 'policy', 'prompt',
  // Q
  'quick', 'quite', 'question', 'quiet', 'queen', 'quality', 'equal', 'liquid', 'request', 'require', 'square', 'sequence', 'unique', 'quota', 'quarry', 'quantum',
  // R
  'return', 'rhythm', 'require', 'error', 'mirror', 'remember', 'order', 'strong', 'direct', 'reason', 'nature', 'record', 'carrier', 'reward', 'robust', 'render',
  // S
  'system', 'sense', 'status', 'season', 'assist', 'successful', 'silent', 'listen', 'state', 'stress', 'surface', 'lesson', 'tissue', 'symbol', 'source', 'sample',
  // T
  'letter', 'street', 'total', 'little', 'rhythm', 'target', 'matter', 'settle', 'state', 'trust', 'attempt', 'future', 'thirty', 'twenty', 'talent', 'thread', 'timely',
  // U
  'unique', 'usual', 'future', 'useful', 'nature', 'mutual', 'culture', 'pursue', 'visual', 'figure', 'status', 'puzzle', 'vacuum', 'update', 'urgent', 'unison',
  // V
  'voice', 'visual', 'vibrant', 'value', 'resolve', 'heavy', 'reveal', 'drive', 'clever', 'provide', 'event', 'review', 'vowel', 'novel', 'vector', 'vertex', 'volume',
  // W
  'own', 'owl', 'power', 'world', 'write', 'wrong', 'answer', 'follow', 'window', 'between', 'flower', 'allow', 'switch', 'awake', 'glow', 'blow', 'slow', 'workflow',
  // X
  'exact', 'extra', 'expert', 'expect', 'complex', 'relax', 'toxic', 'fixed', 'oxygen', 'luxury', 'dynamic', 'index', 'matrix', 'maximum', 'syntax', 'prefix', 'nexus',
  // Y
  'rhythm', 'mystery', 'system', 'supply', 'dynamic', 'enjoy', 'symbol', 'policy', 'energy', 'verify', 'crystal', 'yellow', 'pretty', 'yield', 'yearly', 'hybrid',
  // Z
  'puzzle', 'bronze', 'horizon', 'breeze', 'frozen', 'hazard', 'citizen', 'zero', 'analyze', 'plaza', 'realize', 'blaze', 'blizzard', 'zone', 'zeal', 'zinc', 'zenith'
];

export const ADAPTIVE_NEPALI_WORDS = [
  // क, ख, ग, घ, ङ
  'कलम', 'किताब', 'कमल', 'कठिन', 'कर्तव्य', 'कार्य', 'कपडा', 'कानून', 'कारण', 'कविता', 'किरण', 'क्रम',
  'खोला', 'खुसी', 'खरायो', 'खोज', 'खुकुरी', 'खेत', 'खबर', 'खर्च', 'खास', 'खेल', 'खजाना', 'खतरा', 'खण्ड', 'खरिद',
  'गाउँ', 'गीत', 'गफगाफ', 'गौतम', 'गति', 'गहिरो', 'गरिब', 'गौरव', 'गुण', 'गुरु', 'गगन', 'गन्तव्य', 'गुलाब', 'गाई',
  'घर', 'घाम', 'घण्टी', 'घमण्ड', 'घरेलु', 'घडी', 'घाउ', 'घटना', 'घनिष्ठ', 'घामछायाँ', 'घाँस', 'घुमफिर',
  'गङ्गा', 'दङ्गा', 'रङ्ग', 'अङ्ग', 'पङ्क्ति', 'भुइँचालो', 'सिङ्गो', 'सङ्घीय', 'सङ्कट', 'मङ्गलबार', 'लिङ्ग', 'सङ्ख्या', 'बङ्गाल', 'प्रसङ्ग', 'सङ्गीत', 'उमङ्ग', 'सङ्केत',
  // च, छ, ज, झ, ञ
  'चिया', 'चरा', 'चार', 'चाडपर्व', 'चलाख', 'चाँदी', 'चमक', 'चित्र', 'चिन्तन', 'चाहना', 'चरण', 'चुनौती', 'चुनाव',
  'छाया', 'छाना', 'छोरी', 'छोरा', 'इच्छा', 'स्वच्छ', 'छाती', 'छोटो', 'छिटो', 'छन्द', 'छलफल', 'छनोट', 'छक्का',
  'जीवन', 'जनता', 'जल', 'जागृति', 'जमिन', 'जंगल', 'जात', 'ज्ञान', 'जीत', 'जवाफ', 'ज्योति', 'जन्म', 'जागरण',
  'झरना', 'झ्याल', 'झण्डा', 'झरी', 'झुण्ड', 'झोला', 'झार', 'झिलिमिली', 'झन्झट', 'झुट', 'झटपट', 'झ्याउ', 'झिल्को',
  'अञ्चल', 'सञ्चार', 'पञ्चायत', 'चञ्चल', 'पञ्च', 'मञ्च', 'व्यञ्जन', 'सञ्जीवनी', 'किञ्चित', 'सञ्चय', 'कुञ्ज',
  // ट, ठ, ड, ढ, ण
  'टोपी', 'टुप्पो', 'टमटर', 'टिकट', 'टहरो', 'टपरी', 'टिमुर', 'टुक्रा', 'टिप्पणी', 'टोल', 'टल्किने',
  'ठूलो', 'ठिक', 'ठमेल', 'ओठ', 'काठ', 'ठट्टा', 'ठेगाना', 'ठोक', 'ठहर', 'ठाउँ', 'ठेक्का',
  'डर', 'डाँडा', 'डोरी', 'डबली', 'डढेलो', 'डम्बर', 'डिब्बा', 'डाक्टर', 'डुलुवा', 'डाँक',
  'ढोका', 'ढुङ्गा', 'ढाका', 'दृढ', 'ढिला', 'ढुकुटी', 'ढाँचा', 'ढाल', 'ढकमक्क',
  'कण्ठ', 'लक्षण', 'कारण', 'चरण', 'प्रमाण', 'बाण', 'गुण', 'ऋण', 'क्षण', 'कृष्ण', 'दर्पण', 'प्रणाम', 'किरण',
  // त, थ, द, ध, न
  'तातो', 'तारा', 'तिमी', 'तपस्या', 'ताल', 'तर्क', 'तयार', 'तरङ्ग', 'तुलना', 'तस्विर', 'तृष्णा', 'त्याग',
  'थाली', 'थाहा', 'स्थान', 'साथी', 'थलो', 'थोपा', 'थकाइ', 'थुप्रो', 'थिति', 'थाम', 'थोरै',
  'दिन', 'दाल', 'देश', 'दही', 'दया', 'दान', 'दाँत', 'दृष्टि', 'दिशा', 'दूत', 'दल', 'दर्ता', 'दावा',
  'धर्म', 'धन्यवाद', 'प्रधान', 'संविधान', 'अधिकार', 'साधना', 'धनी', 'धर्ती', 'धनुष', 'ध्वनि', 'धैर्य', 'धूलो', 'ध्यान', 'ध्रुव',
  'नाम', 'नाच', 'नयाँ', 'नदी', 'नेपाल', 'नेपाली', 'न्याय', 'नियम', 'नगर', 'नाता', 'नेता', 'नमुना', 'न्यानो',
  // प, फ, ब, भ, म
  'पानी', 'पात', 'फूल', 'पहिरो', 'परीक्षा', 'फोन', 'फलफूल', 'फराकिलो', 'बाबा', 'बाटो', 'बहिनी', 'बुबा', 'प्रेम', 'प्रकाश',
  'फल', 'फरक', 'फाइदा', 'फुर्सद', 'फैसला', 'फेरि', 'फोटो', 'फलाम', 'फूर्ति', 'फोहोर',
  'बजार', 'बाटो', 'बादल', 'बालक', 'बन्द', 'बलियो', 'बुद्धि', 'बगैँचा', 'बचत', 'बन', 'बहस',
  'भारत', 'भविष्य', 'भावना', 'अभियान', 'प्रभुत्व', 'सभ्यता', 'भवन', 'भरोसा', 'भक्ति', 'भाग', 'भाग्य', 'भाषा', 'भाइ', 'भालु', 'भोक', 'भिड', 'भलो', 'भेट',
  'मन', 'माटो', 'माया', 'मिठो', 'मेरो', 'मिहिनेत', 'मानव', 'मुक्ति', 'मूल', 'मौसम', 'मित्र', 'मन्दिर',
  // य, र, ल, व, श, ष, स, ह
  'यहाँ', 'यात्रा', 'योग्य', 'योजना', 'युग', 'यथार्थ', 'यत्न', 'यश', 'यम', 'युद्ध',
  'रात', 'रुख', 'रोटी', 'राम्रो', 'रक्त', 'राज्य', 'रूप', 'रस', 'रेखा', 'रोग',
  'लाल', 'लामो', 'लोकतन्त्र', 'लक्ष्य', 'लहर', 'लेख', 'लाभ', 'लज्जा', 'लोक', 'लगन',
  'विकास', 'वातावरण', 'विचार', 'विजय', 'वचन', 'वन', 'वर्ष', 'व्यक्ति', 'व्यवस्था', 'विधा', 'विद्या',
  'शान्ति', 'शिक्षा', 'प्रकाश', 'शिखर', 'शब्द', 'शक्ति', 'शासन', 'शत्रु', 'शरीर', 'शोभा', 'शङ्का',
  'विशेष', 'आकर्षण', 'भूषण', 'दोष', 'वर्ष', 'भाषा', 'षड्यन्त्र', 'पुरुष', 'धनुष', 'सन्तोष', 'पोषण',
  'सपना', 'संसार', 'समय', 'समाज', 'सत्य', 'सूर्य', 'साथी', 'सेवा', 'सङ्घ', 'सुन्दर', 'सुख', 'सन्तुलन',
  'हाँसो', 'हिमाल', 'हिउँ', 'हावा', 'हाम्रो', 'हात', 'हृदय', 'हित', 'हरियो', 'हुरी', 'हौसला',
  // Conjuncts & Ligatures
  'क्षेत्र', 'क्षमता', 'क्षण', 'क्षमा', 'क्षति', 'क्षितिज', 'रक्षक', 'निक्षेप', 'प्रत्यक्ष', 'सूक्ष्म',
  'मित्र', 'चरित्र', 'पत्र', 'छात्र', 'यात्रा', 'त्रिभुज', 'त्रिशूल', 'रात्रि', 'चित्र', 'मन्त्र',
  'ज्ञान', 'विज्ञ', 'प्रज्ञा', 'अज्ञात', 'जिज्ञासा', 'प्रतिज्ञा', 'संज्ञा', 'आज्ञा', 'वैज्ञानिक',
  'बुद्धि', 'शुद्ध', 'विद्या', 'विद्युत्', 'प्रसिद्धि', 'उद्देश्य', 'द्वन्द्व', 'विद्वान्', 'द्वारा'
];

export const DIAGNOSTIC_ENGLISH_WORDS = [
  'flask', 'salad', 'dash', 'glad', 'half', 'safe', 'fast', 'fall',
  'quite', 'power', 'write', 'tree', 'route', 'young', 'input', 'water',
  'cabin', 'bacon', 'vibrant', 'member', 'noble', 'clean', 'voice',
  'quick', 'jumps', 'brown', 'judge', 'pack', 'freeze', 'extra', 'relax'
];

export const DIAGNOSTIC_NEPALI_WORDS = [
  'घर', 'पानी', 'माया', 'चिया', 'नेपाल', 'हिमाल', 'रुख', 'फूल',
  'किताब', 'कलम', 'मिठो', 'दिन', 'रात', 'गाउँ', 'शहर', 'आकाश',
  'धर्म', 'शान्ति', 'समय', 'समाज', 'ज्ञान', 'शिक्षा', 'मित्र', 'कार्य'
];

function extractUniqueCleanWords(text, isNepali = true) {
  if (!text) return [];
  const regex = isNepali 
    ? /[।,\.?!;:«»“”‘’—–\(\)\[\]\{\}\/\\\"\'0-9०-९]/g 
    : /[\.,?!;:«»“”‘’—–\(\)\[\]\{\}\/\\\"\'0-9]/g;
  return Array.from(new Set(
    text.replace(regex, ' ')
      .split(/\s+/)
      .map(w => isNepali ? w.trim() : w.trim().toLowerCase())
      .filter(w => w.length > 1)
  ));
}

// Extract speech vocabulary
const speechWordsNe = extractUniqueCleanWords(EXAM_SPEECH_NEPALI, true);
const speechWordsEn = extractUniqueCleanWords(EXAM_SPEECH_ENGLISH, false);

// Extract sentence & quote vocabulary from typing words data
const sentenceWordsNe = extractUniqueCleanWords([
  ...DATA.nepali.easy.sentences,
  ...DATA.nepali.medium.sentences,
  ...DATA.nepali.hard.sentences,
  ...DATA.nepali.easy.quotes,
  ...DATA.nepali.medium.quotes,
  ...DATA.nepali.hard.quotes
].join(' '), true);

const sentenceWordsEn = extractUniqueCleanWords([
  ...DATA.english.easy.sentences,
  ...DATA.english.medium.sentences,
  ...DATA.english.hard.sentences,
  ...DATA.english.easy.quotes,
  ...DATA.english.medium.quotes,
  ...DATA.english.hard.quotes
].join(' '), false);

// Comprehensive Master Lexicon for Adaptive Drill Training (1,300+ NE, 1,100+ EN)
export const MASTER_NEPALI_WORDS = Array.from(new Set([
  ...ADAPTIVE_NEPALI_WORDS,
  ...DATA.nepali.easy.words,
  ...DATA.nepali.medium.words,
  ...DATA.nepali.hard.words,
  ...speechWordsNe,
  ...sentenceWordsNe
]));

export const MASTER_ENGLISH_WORDS = Array.from(new Set([
  ...ADAPTIVE_ENGLISH_WORDS,
  ...DATA.english.easy.words,
  ...DATA.english.medium.words,
  ...DATA.english.hard.words,
  ...speechWordsEn,
  ...sentenceWordsEn
]));

function buildInvertedIndex(wordList) {
  const index = {};
  wordList.forEach((word, wIdx) => {
    const chars = new Set([...word.toLowerCase()]);
    chars.forEach(ch => {
      if (!index[ch]) index[ch] = [];
      index[ch].push(wIdx);
    });
  });
  return index;
}

// Inverted indexes built across the complete master corpora
const englishIndex = buildInvertedIndex(MASTER_ENGLISH_WORDS);
const nepaliIndex = buildInvertedIndex(MASTER_NEPALI_WORDS);

// Stroke Recording & Profile Analysis
export function getStrokeProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

export function resetStrokeProfile() {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (e) { }
}

export function recordStrokeData(char, isCorrect, latencyMs = 200) {
  if (!char || char === ' ') return;
  const profile = getStrokeProfile();
  const c = char.toLowerCase();

  if (!profile[c]) {
    profile[c] = { hits: 0, errors: 0, totalLatency: 0, latenciesCount: 0, recent: [] };
  }

  profile[c].hits++;
  if (!isCorrect) {
    profile[c].errors++;
  }
  if (latencyMs > 0 && latencyMs < 4000) {
    profile[c].totalLatency += latencyMs;
    profile[c].latenciesCount++;
  }

  // Rolling window of last 15 attempts (1 = correct, 0 = error)
  if (!Array.isArray(profile[c].recent)) profile[c].recent = [];
  profile[c].recent.push(isCorrect ? 1 : 0);
  if (profile[c].recent.length > 15) {
    profile[c].recent.shift();
  }

  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) { }
}

export function getWeakKeysAnalysis(lang = 'english', limit = 4) {
  const profile = getStrokeProfile();
  const isEng = (lang === 'english');
  const scored = [];
  let totalHits = 0;
  let totalErrors = 0;

  for (const [ch, data] of Object.entries(profile)) {
    const code = ch.charCodeAt(0);
    const isNeChar = (code >= 0x0900 && code <= 0x097F);

    if (isEng && isNeChar) continue;
    if (!isEng && !isNeChar) continue;

    const hits = data.hits || 0;
    const errors = data.errors || 0;
    totalHits += hits;
    totalErrors += errors;

    if (hits >= 2 && errors > 0) {
      const errorRate = errors / hits;
      const accuracy = Math.round((1 - errorRate) * 100);
      const avgLatency = data.latenciesCount > 0 ? (data.totalLatency / data.latenciesCount) : 250;

      const recent = data.recent || [];
      const recentCorrect = recent.filter(r => r === 1).length;
      const recentAccuracy = recent.length > 0 ? Math.round((recentCorrect / recent.length) * 100) : accuracy;

      const score = (errorRate * 90) + (errors * 6) + Math.max(0, (avgLatency - 320) / 20);

      scored.push({
        char: ch,
        score,
        errors,
        hits,
        errorRate,
        accuracy,
        recentAccuracy,
        recentCount: recent.length,
        avgLatencyMs: Math.round(avgLatency)
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  const hasEnoughData = (totalHits >= 15 && totalErrors >= 1 && scored.length > 0);

  return {
    hasEnoughData,
    totalHits,
    totalErrors,
    keys: scored.slice(0, limit)
  };
}

export function getWeakestKeys(lang = 'english', limit = 3) {
  const analysis = getWeakKeysAnalysis(lang, limit);
  return analysis.keys;
}

export function calculateTargetGoal(currentAccuracy) {
  const acc = Math.round(Number(currentAccuracy) || 0);
  if (acc < 75) return 85;
  if (acc < 88) return 90;
  if (acc < 95) return 95;
  return 100;
}

export function checkTargetKeyMastery(targetKey, targetGoal = 90) {
  if (!targetKey) return { mastered: false, recentAccuracy: 0, hits: 0 };
  const profile = getStrokeProfile();
  const c = targetKey.toLowerCase();
  const data = profile[c];
  if (!data) return { mastered: false, recentAccuracy: 0, hits: 0 };

  const recent = data.recent || [];
  if (recent.length < 5) {
    return { mastered: false, recentAccuracy: 0, hits: data.hits };
  }

  const recentCorrect = recent.filter(r => r === 1).length;
  const recentAccuracy = Math.round((recentCorrect / recent.length) * 100);
  const isMastered = (recentAccuracy >= targetGoal);

  return {
    mastered: isMastered,
    recentAccuracy,
    hits: data.hits,
    errors: data.errors
  };
}

export function generateDiagnosticWords(lang = 'english', count = 30) {
  const pool = (lang === 'english') ? DIAGNOSTIC_ENGLISH_WORDS : DIAGNOSTIC_NEPALI_WORDS;
  const out = [];
  while (out.length < count) {
    const sh = [...pool].sort(() => 0.5 - Math.random());
    out.push(...sh);
  }
  return out.slice(0, count);
}

/**
 * Generates drill words specifically targeted at the user's real weak key(s)
 * Drawn from the massive 1,300+ word master corpora
 */
export function generateAdaptiveWords(options = {}) {
  const {
    lang = 'english',
    targetKeys = null,
    targetCount = 35
  } = options;

  const isEng = (lang === 'english');
  const wordPool = isEng ? MASTER_ENGLISH_WORDS : MASTER_NEPALI_WORDS;
  const index = isEng ? englishIndex : nepaliIndex;

  let keys = targetKeys;
  if (!keys || keys.length === 0) {
    const analysis = getWeakKeysAnalysis(lang, 2);
    if (!analysis.hasEnoughData || analysis.keys.length === 0) {
      return generateDiagnosticWords(lang, targetCount);
    }
    keys = analysis.keys.map(k => k.char);
  }

  const normalizedKeys = keys.map(k => k.toLowerCase());
  const primaryKey = normalizedKeys[0];
  const secondaryKey = normalizedKeys[1] || null;

  const matchingIndices = index[primaryKey] || [];
  const candidateIndices = new Set(matchingIndices);

  if (secondaryKey && index[secondaryKey]) {
    index[secondaryKey].forEach(idx => candidateIndices.add(idx));
  }

  const scoredWords = [];

  candidateIndices.forEach(idx => {
    const word = wordPool[idx];
    if (!word) return;
    const lowerWord = word.toLowerCase();

    let primaryHits = 0;
    let pPos = lowerWord.indexOf(primaryKey);
    while (pPos !== -1) {
      primaryHits++;
      pPos = lowerWord.indexOf(primaryKey, pPos + 1);
    }

    let secondaryHits = 0;
    if (secondaryKey) {
      let sPos = lowerWord.indexOf(secondaryKey);
      while (sPos !== -1) {
        secondaryHits++;
        sPos = lowerWord.indexOf(secondaryKey, sPos + 1);
      }
    }

    if (primaryHits > 0 || secondaryHits > 0) {
      const baseScore = (primaryHits * 4) + (secondaryHits * 2.5);
      const density = baseScore / Math.sqrt(word.length);
      scoredWords.push({ word, score: density, primaryHits, secondaryHits });
    }
  });

  scoredWords.sort((a, b) => b.score - a.score);

  if (scoredWords.length === 0) {
    return generateDiagnosticWords(lang, targetCount);
  }

  // Pick top-density words with variety (from up to top 60 matches)
  const topCandidates = scoredWords.slice(0, Math.min(60, scoredWords.length));
  const result = [];

  // Shuffle candidate pool to ensure variety across tests
  const shuffledCandidates = [...topCandidates].sort(() => 0.5 - Math.random());

  while (result.length < targetCount) {
    const pool = (Math.random() < 0.75) 
      ? topCandidates.slice(0, Math.ceil(topCandidates.length * 0.6)) 
      : topCandidates;
    const picked = pool[Math.floor(Math.random() * pool.length)].word;
    result.push(picked);
  }

  return result;
}
