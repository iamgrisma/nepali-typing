
const PROFILE_STORAGE_KEY = 'topnepali_stroke_profile';

// =========================================================================
// 1. COMPREHENSIVE VOCABULARY COVERING EVERY KEY (A-Z & DEVANAGARI)
// =========================================================================

export const ADAPTIVE_ENGLISH_WORDS = [
  // A
  'about', 'after', 'again', 'animal', 'answer', 'always', 'appear', 'awake', 'adapt', 'alarm', 'avatar', 'atlas', 'action', 'artist',
  // B
  'build', 'balance', 'better', 'become', 'believe', 'between', 'brother', 'object', 'public', 'bronze', 'habit', 'breeze', 'blanket',
  // C
  'circle', 'center', 'catch', 'notice', 'chance', 'voice', 'clean', 'space', 'decide', 'practice', 'focus', 'force', 'access', 'cancel',
  // D
  'decide', 'demand', 'different', 'middle', 'under', 'stand', 'order', 'direct', 'discover', 'ladder', 'divide', 'shadow', 'meadow',
  // E
  'every', 'enter', 'effect', 'energy', 'element', 'level', 'expect', 'secret', 'general', 'eleven', 'remember', 'letter', 'better',
  // F
  'first', 'family', 'figure', 'follow', 'force', 'field', 'flower', 'prefer', 'office', 'profit', 'factor', 'flight', 'effort', 'defeat',
  // G
  'great', 'group', 'govern', 'ground', 'organize', 'begin', 'degree', 'garden', 'bridge', 'guess', 'guard', 'energy', 'target',
  // H
  'house', 'hand', 'hold', 'happen', 'health', 'human', 'whole', 'rhythm', 'physical', 'method', 'history', 'honest', 'height', 'shadow',
  // I
  'imagine', 'inspire', 'inside', 'initial', 'limit', 'spirit', 'finish', 'citizen', 'listen', 'visual', 'silent', 'winter', 'liquid',
  // J
  'judge', 'journey', 'enjoy', 'project', 'major', 'object', 'inject', 'adjust', 'justice', 'jungle', 'jacket', 'junior', 'injury',
  // K
  'strike', 'market', 'make', 'break', 'skill', 'weak', 'know', 'quick', 'risk', 'block', 'shock', 'check', 'pocket', 'jacket', 'blanket',
  // L
  'little', 'letter', 'level', 'light', 'local', 'line', 'place', 'world', 'follow', 'simple', 'visual', 'balance', 'clown', 'yellow',
  // M
  'memory', 'moment', 'summer', 'commit', 'member', 'system', 'minimum', 'movement', 'measure', 'common', 'hammer', 'camera', 'sample',
  // N
  'nation', 'learn', 'remain', 'begin', 'number', 'sound', 'planet', 'person', 'define', 'natural', 'dinner', 'banner', 'manner',
  // O
  'order', 'power', 'world', 'point', 'control', 'story', 'moment', 'follow', 'notice', 'option', 'focus', 'smooth', 'shadow', 'meadow',
  // P
  'practice', 'people', 'person', 'problem', 'power', 'prepare', 'public', 'purpose', 'report', 'principle', 'prefer', 'pocket', 'paper',
  // Q
  'quick', 'quite', 'question', 'quiet', 'queen', 'quality', 'equal', 'liquid', 'request', 'require', 'square', 'sequence', 'unique',
  // R
  'return', 'rhythm', 'require', 'error', 'mirror', 'remember', 'order', 'strong', 'direct', 'reason', 'nature', 'record', 'carrier',
  // S
  'system', 'sense', 'status', 'season', 'assist', 'successful', 'silent', 'listen', 'state', 'stress', 'surface', 'lesson', 'tissue',
  // T
  'letter', 'street', 'total', 'little', 'rhythm', 'target', 'matter', 'settle', 'state', 'trust', 'attempt', 'future', 'thirty', 'twenty',
  // U
  'unique', 'usual', 'future', 'useful', 'nature', 'mutual', 'culture', 'pursue', 'visual', 'figure', 'status', 'puzzle', 'vacuum',
  // V
  'voice', 'visual', 'vibrant', 'value', 'resolve', 'heavy', 'reveal', 'drive', 'clever', 'provide', 'event', 'review', 'vowel', 'novel',
  // W
  'own', 'owl', 'power', 'world', 'write', 'wrong', 'answer', 'follow', 'window', 'between', 'flower', 'allow', 'switch', 'awake', 'glow', 'blow', 'slow', 'workflow',
  // X
  'exact', 'extra', 'expert', 'expect', 'complex', 'relax', 'toxic', 'fixed', 'oxygen', 'luxury', 'dynamic', 'index', 'matrix', 'maximum',
  // Y
  'rhythm', 'mystery', 'system', 'supply', 'dynamic', 'enjoy', 'symbol', 'policy', 'energy', 'verify', 'crystal', 'yellow', 'pretty',
  // Z
  'puzzle', 'bronze', 'horizon', 'breeze', 'frozen', 'hazard', 'citizen', 'zero', 'analyze', 'plaza', 'realize', 'blaze', 'blizzard'
];

export const ADAPTIVE_NEPALI_WORDS = [
  // क, ख, ग, घ, ङ
  'कलम', 'किताब', 'कमल', 'कठिन', 'कर्तव्य', 'कार्य', 'खोला', 'खुसी', 'खरायो', 'खोज', 'खुकुरी',
  'गाउँ', 'गीत', 'गफगाफ', 'गौतम', 'घर', 'घाम', 'घण्टी', 'घमण्ड', 'घरेलु', 'गङ्गा', 'दङ्गा', 'रङ्ग',
  // च, छ, ज, झ, ञ
  'चिया', 'चरा', 'चार', 'चाडपर्व', 'छाया', 'छाना', 'छोरी', 'छोरा', 'इच्छा', 'स्वच्छ',
  'जीवन', 'जनता', 'जल', 'जागृति', 'झरना', 'झ्याल', 'झण्डा', 'झरी', 'झुण्ड', 'अञ्चल', 'सञ्चार',
  // ट, ठ, ड, ढ, ण
  'टोपी', 'टुप्पो', 'टमटर', 'ठूलो', 'ठिक', 'ठमेल', 'ओठ', 'काठ', 'डर', 'डाँडा', 'डोरी',
  'ढोका', 'ढुङ्गा', 'ढाका', 'दृढ', 'कण्ठ', 'लक्षण', 'कारण', 'चरण', 'प्रमाण',
  // त, थ, द, ध, न
  'तातो', 'तारा', 'तिमी', 'तपस्या', 'थाली', 'थाहा', 'स्थान', 'साथी', 'दिन', 'दाल', 'देश', 'दही',
  'धर्म', 'धन्यवाद', 'प्रधान', 'संविधान', 'अधिकार', 'साधना', 'धनी', 'धर्ती', 'धनुष', 'ध्वनि', 'धैर्य',
  'नाम', 'नाच', 'नयाँ', 'नदी', 'नेपाल', 'नेपाली',
  // प, फ, ब, भ, म
  'पानी', 'पात', 'फूल', 'पहिरो', 'परीक्षा', 'फोन', 'फलफूल', 'फराकिलो', 'बाबा', 'बाटो', 'बहिनी', 'बुबा',
  'भारत', 'भविष्य', 'भावना', 'अभियान', 'प्रभुत्व', 'सभ्यता', 'भवन', 'भरोसा', 'भक्ति', 'भाग', 'भाग्य', 'भाषा',
  'मन', 'माटो', 'माया', 'मिठो', 'मेरो', 'मिहिनेत',
  // य, र, ल, व, श, ष, स, ह
  'यहाँ', 'यात्रा', 'योग्य', 'रात', 'रुख', 'रोटी', 'राम्रो', 'लाल', 'लामो', 'लोकतन्त्र', 'विकास', 'वातावरण',
  'शान्ति', 'शिक्षा', 'प्रकाश', 'शिखर', 'शब्द', 'विशेष', 'आकर्षण', 'भूषण', 'दोष', 'वर्ष', 'सपना', 'संसार', 'समय', 'समाज',
  'हाँसो', 'हिमाल', 'हिउँ', 'हावा', 'हाम्रो',
  // Conjuncts & Halanta
  'ज्ञान', 'विज्ञ', 'प्रज्ञा', 'मित्र', 'क्षेत्र', 'चरित्र', 'पत्र', 'छात्र', 'बुद्धि', 'शुद्ध', 'विद्या', 'विद्युत्'
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

// Pre-built inverted indexes
const englishIndex = buildInvertedIndex(ADAPTIVE_ENGLISH_WORDS);
const nepaliIndex = buildInvertedIndex(ADAPTIVE_NEPALI_WORDS);

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

// =========================================================================
// 2. STROKE RECORDING & REAL PROFILE ANALYSIS
// =========================================================================

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

/**
 * Analyzes genuine stroke profile for the selected language.
 * Returns { hasEnoughData: boolean, totalHits: number, totalErrors: number, keys: Array }
 * Returns NO fake defaults if the user has no recorded mistakes!
 */
export function getWeakKeysAnalysis(lang = 'english', limit = 4) {
  const profile = getStrokeProfile();
  const isEng = (lang === 'english');
  const scored = [];
  let totalHits = 0;
  let totalErrors = 0;

  for (const [ch, data] of Object.entries(profile)) {
    const code = ch.charCodeAt(0);
    const isAsciiLetter = (code >= 97 && code <= 122);
    if (isEng && !isAsciiLetter) continue;
    if (!isEng && isAsciiLetter) continue;

    const hits = data.hits || 0;
    const errors = data.errors || 0;
    totalHits += hits;
    totalErrors += errors;

    if (hits >= 2 && errors > 0) {
      const errorRate = errors / hits;
      const accuracy = Math.round((1 - errorRate) * 100);
      const avgLatency = data.latenciesCount > 0 ? (data.totalLatency / data.latenciesCount) : 250;

      // Recent accuracy in rolling window
      const recent = data.recent || [];
      const recentCorrect = recent.filter(r => r === 1).length;
      const recentAccuracy = recent.length > 0 ? Math.round((recentCorrect / recent.length) * 100) : accuracy;

      // Score formula: prioritizing highest error ratio + error count
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

  // Sort by score descending (worst error ratio at top)
  scored.sort((a, b) => b.score - a.score);

  const hasEnoughData = (totalHits >= 15 && totalErrors >= 1 && scored.length > 0);

  return {
    hasEnoughData,
    totalHits,
    totalErrors,
    keys: scored.slice(0, limit)
  };
}

// Backward-compatibility wrapper
export function getWeakestKeys(lang = 'english', limit = 3) {
  const analysis = getWeakKeysAnalysis(lang, limit);
  return analysis.keys;
}

// =========================================================================
// 3. TARGET KEY MASTERY & PROGRESSION LOGIC
// =========================================================================

/**
 * Checks if the current target key has reached mastery (>= 90% recent accuracy with >= 6 hits)
 */
export function checkTargetKeyMastery(targetKey) {
  if (!targetKey) return { mastered: false, recentAccuracy: 0, hits: 0 };
  const profile = getStrokeProfile();
  const c = targetKey.toLowerCase();
  const data = profile[c];
  if (!data) return { mastered: false, recentAccuracy: 0, hits: 0 };

  const recent = data.recent || [];
  if (recent.length < 6) {
    return { mastered: false, recentAccuracy: 0, hits: data.hits };
  }

  const recentCorrect = recent.filter(r => r === 1).length;
  const recentAccuracy = Math.round((recentCorrect / recent.length) * 100);

  // If recent accuracy is 90% or higher across at least 6 hits, key is mastered!
  const isMastered = (recentAccuracy >= 90);

  return {
    mastered: isMastered,
    recentAccuracy,
    hits: data.hits,
    errors: data.errors
  };
}

// =========================================================================
// 4. DYNAMIC WORD GENERATION (NO FAKE WORDS)
// =========================================================================

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
 */
export function generateAdaptiveWords(options = {}) {
  const {
    lang = 'english',
    targetKeys = null,
    targetCount = 35
  } = options;

  const isEng = (lang === 'english');
  const wordPool = isEng ? ADAPTIVE_ENGLISH_WORDS : ADAPTIVE_NEPALI_WORDS;
  const index = isEng ? englishIndex : nepaliIndex;

  // If no target keys supplied, check real analysis
  let keys = targetKeys;
  if (!keys || keys.length === 0) {
    const analysis = getWeakKeysAnalysis(lang, 2);
    if (!analysis.hasEnoughData || analysis.keys.length === 0) {
      // Serve diagnostic baseline set
      return generateDiagnosticWords(lang, targetCount);
    }
    keys = analysis.keys.map(k => k.char);
  }

  const normalizedKeys = keys.map(k => k.toLowerCase());
  const primaryKey = normalizedKeys[0];
  const secondaryKey = normalizedKeys[1] || null;

  // Retrieve words containing primary target key from inverted index
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
      // Density score: reward repeated occurrences of primary key + co-occurrence of secondary
      const baseScore = (primaryHits * 4) + (secondaryHits * 2.5);
      const density = baseScore / Math.sqrt(word.length);
      scoredWords.push({ word, score: density, primaryHits, secondaryHits });
    }
  });

  scoredWords.sort((a, b) => b.score - a.score);

  if (scoredWords.length === 0) {
    return generateDiagnosticWords(lang, targetCount);
  }

  // Pick top-density words with variety
  const topCandidates = scoredWords.slice(0, Math.min(30, scoredWords.length));
  const result = [];

  while (result.length < targetCount) {
    // 80% chance pick from top 50% densest candidates, 20% from broader pool
    const pool = (Math.random() < 0.8) ? topCandidates.slice(0, Math.ceil(topCandidates.length * 0.5)) : topCandidates;
    const picked = pool[Math.floor(Math.random() * pool.length)].word;
    result.push(picked);
  }

  return result;
}
