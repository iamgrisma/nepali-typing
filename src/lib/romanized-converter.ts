/**
 * Nepali Unicode Romanized Converter & Transliteration Engine
 * Supports standard phonetic mappings (Madan Puraskar Pustakalaya / MPP Standard)
 */

export const ROMAN_VOWELS: Record<string, string> = {
  'a': 'अ',
  'aa': 'आ',
  'A': 'आ',
  'i': 'इ',
  'ee': 'ई',
  'I': 'ई',
  'u': 'उ',
  'oo': 'ऊ',
  'U': 'ऊ',
  'e': 'ए',
  'ai': 'ऐ',
  'o': 'ओ',
  'au': 'औ',
  'am': 'अं',
  'ah': 'अः',
  'ri': 'ऋ',
  'Ri': 'ॠ'
};

export const ROMAN_MATRAS: Record<string, string> = {
  'a': '',
  'aa': 'ा',
  'A': 'ा',
  'i': 'ि',
  'ee': 'ी',
  'I': 'ी',
  'u': 'ु',
  'oo': 'ू',
  'U': 'ू',
  'e': 'े',
  'ai': 'ै',
  'o': 'ो',
  'au': 'ौ',
  'am': 'ं',
  'ah': 'ः'
};

export const ROMAN_CONSONANTS: Record<string, string> = {
  'k': 'क्',
  'kh': 'ख्',
  'K': 'ख्',
  'g': 'ग्',
  'gh': 'घ्',
  'G': 'घ्',
  'ng': 'ङ्',
  'ch': 'च्',
  'c': 'च्',
  'chh': 'छ्',
  'Ch': 'छ्',
  'C': 'छ्',
  'j': 'ज्',
  'jh': 'झ्',
  'J': 'झ्',
  'yn': 'ञ्',
  'T': 'ट्',
  'Th': 'ठ्',
  'W': 'ठ्',
  'D': 'ड्',
  'Dh': 'ढ्',
  'N': 'ण्',
  't': 'त्',
  'th': 'थ्',
  'd': 'द्',
  'dh': 'ध्',
  'n': 'न्',
  'p': 'प्',
  'ph': 'फ्',
  'P': 'फ्',
  'f': 'फ्',
  'b': 'ब्',
  'bh': 'भ्',
  'B': 'भ्',
  'm': 'म्',
  'y': 'य्',
  'r': 'र्',
  'l': 'ल्',
  'v': 'व्',
  'w': 'व्',
  'sh': 'श्',
  'S': 'श्',
  'Sh': 'ष्',
  's': 'स्',
  'h': 'ह्',
  'ksh': 'क्ष्',
  'X': 'क्ष्',
  'tr': 'त्र्',
  'gy': 'ज्ञ्',
  'Gy': 'ज्ञ्'
};

// Common dictionary words for instant accurate phonetic transliteration
export const COMMON_PHONETIC_DICT: Record<string, string> = {
  'nepal': 'नेपाल',
  'nepali': 'नेपाली',
  'namaste': 'नमस्ते',
  'namaskar': 'नमस्कार',
  'mero': 'मेरो',
  'timro': 'तिम्रो',
  'hamro': 'हाम्रो',
  'tapai': 'तपाईं',
  'tapaiko': 'तपाईंको',
  'ghar': 'घर',
  'pani': 'पानी',
  'dhanyabad': 'धन्यवाद',
  'shanti': 'शान्ति',
  'desh': 'देश',
  'samvidhan': 'संविधान',
  'swatantra': 'स्वतन्त्र',
  'janata': 'जनता',
  'sarkar': 'सरकार',
  'bikash': 'विकास',
  'shikshya': 'शिक्षा',
  'swasthya': 'स्वास्थ्य',
  'kathmandu': 'काठमाडौँ',
  'pokhara': 'पोखरा',
  'himal': 'हिमाल',
  'sagarmatha': 'सगरमाथा',
  'loksewa': 'लोकसेवा',
  'aayog': 'आयोग',
  'adhikar': 'अधिकार',
  'kartabya': 'कर्तव्य',
  'samaj': 'समाज',
  'rastriya': 'राष्ट्रिय',
  'ganatantra': 'गणतन्त्र'
};

/**
 * Phonetically transliterates Latin / English characters into Devanagari Unicode
 */
export function romanizedToUnicode(input: string): string {
  if (!input) return '';

  const lower = input.toLowerCase().trim();
  if (COMMON_PHONETIC_DICT[lower]) {
    return COMMON_PHONETIC_DICT[lower];
  }

  let output = '';
  let i = 0;
  const n = input.length;

  while (i < n) {
    // Check 3-letter clusters
    const c3 = input.slice(i, i + 3);
    if (ROMAN_CONSONANTS[c3]) {
      output += ROMAN_CONSONANTS[c3];
      i += 3;
      continue;
    }

    // Check 2-letter clusters
    const c2 = input.slice(i, i + 2);
    if (ROMAN_VOWELS[c2] && (i === 0 || input[i - 1] === ' ' || output.endsWith(' '))) {
      output += ROMAN_VOWELS[c2];
      i += 2;
      continue;
    }
    if (ROMAN_MATRAS[c2] && output.endsWith('्')) {
      output = output.slice(0, -1) + ROMAN_MATRAS[c2];
      i += 2;
      continue;
    }
    if (ROMAN_CONSONANTS[c2]) {
      output += ROMAN_CONSONANTS[c2];
      i += 2;
      continue;
    }

    // Single letters
    const c1 = input[i];
    if (ROMAN_VOWELS[c1] && (i === 0 || input[i - 1] === ' ' || output.endsWith(' '))) {
      output += ROMAN_VOWELS[c1];
      i += 1;
      continue;
    }
    if (ROMAN_MATRAS[c1] && output.endsWith('्')) {
      output = output.slice(0, -1) + ROMAN_MATRAS[c1];
      i += 1;
      continue;
    }
    if (ROMAN_CONSONANTS[c1]) {
      output += ROMAN_CONSONANTS[c1];
      i += 1;
      continue;
    }

    // Punctuation, spaces, digits
    if (c1 >= '0' && c1 <= '9') {
      const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      output += devanagariDigits[parseInt(c1, 10)];
      i += 1;
      continue;
    }
    if (c1 === '.') {
      output += '।';
      i += 1;
      continue;
    }

    output += c1;
    i += 1;
  }

  // Remove trailing virama if ended with a normal consonant
  return output.replace(/्$/, '');
}
