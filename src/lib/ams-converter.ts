/**
 * AMS IndiaFont Calligraphy Layout Converter
 * Maps Devanagari Unicode (UTF-8) <-> IndiaFont AMS ASCII Keystroke Encoding.
 * Compatible with AMS Mantra, AMS Kirti, AMS Aaditya, AMS Leafy, AMS Hastkala, etc.
 */

// Consonants mapping
export const CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'Ka', 'ग': 'ga', 'घ': 'Ga', 'ङ': 'ङ',
  'च': 'ca', 'छ': 'C', 'ज': 'ja', 'झ': 'Ja', 'ञ': 'ञ',
  'ट': 'o', 'ठ': 'O', 'ड': 'D', 'ढ': 'Z', 'ण': 'Na',
  'त': 'ta', 'थ': 'Ta', 'द': 'd', 'ध': 'Ya', 'न': 'na',
  'प': 'pa', 'फ': 'f', 'ब': 'ba', 'भ': 'Ba', 'म': 'ma',
  'य': 'ya', 'र': 'r', 'ल': 'la', 'व': 'va', 'श': 'Sa',
  'ष': 'Va', 'स': 'sa', 'ह': 'h', 'क्ष': 'Ha', 'त्र': 'Pa', 'ज्ञ': 'za',
  'श्र': 'SaX'
};

// Halanta / Half-consonants mapping
export const HALF_CONSONANTS: Record<string, string> = {
  'क्': '|', 'ख्': 'K', 'ग्': 'g', 'घ्': 'G', 'ङ्': 'ङ्',
  'च्': 'c', 'ज्': 'j', 'त्': 't', 'थ्': 'T', 'द्': 'dx',
  'ध्': 'Y', 'न्': 'n', 'प्': 'p', 'फ्': '♣', 'ब्': 'b',
  'भ्': 'B', 'म्': 'm', 'ल्': 'l', 'व्': 'v', 'स्': 's',
  'ह्': 'hx', 'श्': 'S', 'झ्': 'J', 'ण्': 'N', 'य्': 'y',
  'ष्': 'V', 'ड्': 'Dx', 'ट्': 'ox', 'क्ष्': 'H', 'त्र्': 'P', 'ज्ञ्': 'z'
};

// Independent vowels
export const INDEPENDENT_VOWELS: Record<string, string> = {
  'अ': 'A', 'आ': 'Aa', 'इ': 'q', 'ई': 'qQ', 'उ': 'w',
  'ऊ': 'W', 'ऋ': 'R', 'ए': 'F', 'ऐ': 'Fe', 'ओ': 'Aae', 'औ': 'AaE'
};

// Dependent vowel matras & modifiers
export const MATRAS: Record<string, string> = {
  'ा': 'a', 'ि': 'i', 'ी': 'I', 'ु': 'u', 'ू': 'U',
  'ृ': '&', 'े': 'e', 'ै': 'E', 'ो': 'ae', 'ौ': 'aE',
  'ं': '/', 'ः': ':', 'ँ': '~'
};

// Conjunct ligatures
export const LIGATURES: Record<string, string> = {
  'श्री': 'SaXI', 'रु': '@', 'रू': '@',
  'द्ध': '♥', 'द्व': '☺', 'द्य': '♦'
};

// Numerals
export const NUMERALS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

/**
 * Checks if a string contains Devanagari characters.
 */
export function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Converts Devanagari Unicode string to AMS ASCII keystrokes for Indiafont AMS typefaces.
 */
export function unicodeToAms(unicodeText: string): string {
  if (!unicodeText) return '';

  let str = unicodeText;
  // Normalize nasal glyphs
  str = str.replace(/ङ्([कखगघ])/g, 'ं$1').replace(/ञ्([चछजझ])/g, 'ं$1');

  // Replace multi-char ligatures
  for (const [orig, repl] of Object.entries(LIGATURES)) {
    str = str.split(orig).join(repl);
  }

  let result = '';
  const chars = Array.from(str);

  for (let idx = 0; idx < chars.length; idx++) {
    const char = chars[idx];
    const next = chars[idx + 1] || '';
    const nnext = chars[idx + 2] || '';

    // Reph handling: 'र' + '्' + consonant -> consonant + 'Q'
    if (char === 'र' && next === '्' && idx + 2 < chars.length) {
      let aIdx = idx + 2;
      let acc = '';
      if (chars[aIdx + 1] === '्' && HALF_CONSONANTS[chars[aIdx] + chars[aIdx + 1]]) {
        acc += HALF_CONSONANTS[chars[aIdx] + chars[aIdx + 1]];
        aIdx += 2;
      }
      if (CONSONANTS[chars[aIdx]]) {
        acc += CONSONANTS[chars[aIdx]];
        if (++aIdx < chars.length && MATRAS[chars[aIdx]]) {
          acc += MATRAS[chars[aIdx]];
          aIdx++;
        }
        result += acc + 'Q';
        idx = aIdx - 1;
        continue;
      }
    }

    // Ra-kars and half-consonants with ikaar
    if (CONSONANTS[char] || HALF_CONSONANTS[char + next]) {
      let aIdx = idx;
      let acc = '';
      let hasI = false;
      while (aIdx < chars.length) {
        const cur = chars[aIdx];
        const curNext = chars[aIdx + 1];
        const curNnext = chars[aIdx + 2];
        if (curNext === '्' && curNnext === 'र') {
          acc += (CONSONANTS[cur] || cur) + 'X';
          aIdx += 3;
          if (chars[aIdx] === 'ि') {
            hasI = true;
            aIdx++;
          }
          break;
        }
        if (curNext === '्') {
          acc += HALF_CONSONANTS[cur + curNext] || cur;
          aIdx += 2;
        } else {
          acc += CONSONANTS[cur] || cur;
          aIdx++;
          if (chars[aIdx] === 'ि') {
            hasI = true;
            aIdx++;
          }
          break;
        }
      }
      if (hasI) {
        result += 'i' + acc;
        idx = aIdx - 1;
        continue;
      }
    }

    if (next === '्' && nnext === 'र') {
      result += (CONSONANTS[char] || char) + 'X';
      idx += 2;
      continue;
    }

    if (next === '्') {
      const pair = char + next;
      result += HALF_CONSONANTS[pair] || char;
      idx++;
      continue;
    }

    if (CONSONANTS[char]) result += CONSONANTS[char];
    else if (INDEPENDENT_VOWELS[char]) result += INDEPENDENT_VOWELS[char];
    else if (MATRAS[char]) result += MATRAS[char];
    else if (NUMERALS[char]) result += NUMERALS[char];
    else result += char;
  }

  return result;
}

// Reverse mapping cache
let REVERSE_MAP: Record<string, string> | null = null;
let SORTED_KEYS: string[] | null = null;

function initReverseMap(): void {
  if (REVERSE_MAP) return;
  REVERSE_MAP = {};
  const add = (tbl: Record<string, string>) => {
    for (const [k, v] of Object.entries(tbl)) {
      REVERSE_MAP![v] = k;
    }
  };
  add(LIGATURES);
  add(CONSONANTS);
  add(HALF_CONSONANTS);
  add(INDEPENDENT_VOWELS);
  add(MATRAS);
  add(NUMERALS);
  REVERSE_MAP['X'] = '्र';
  SORTED_KEYS = Object.keys(REVERSE_MAP).sort((a, b) => b.length - a.length);
}

/**
 * Converts AMS ASCII text back to standard Devanagari Unicode (UTF-8).
 */
export function amsToUnicode(amsText: string): string {
  if (!amsText) return '';
  initReverseMap();

  let text = amsText.replace(/ax/g, '्');
  let result = '';
  let ptr = 0;
  let pendingI = false;
  let lastChar = '';

  while (ptr < text.length) {
    let matchedUnicode: string | null = null;
    let matchedKey = '';

    for (const key of SORTED_KEYS!) {
      if (text.startsWith(key, ptr)) {
        matchedUnicode = REVERSE_MAP![key];
        matchedKey = key;
        break;
      }
    }

    const cur = text[ptr];
    if (cur === 'Q') {
      if (lastChar) {
        result = result.slice(0, result.length - lastChar.length) + 'र्' + lastChar;
        lastChar = 'र्' + lastChar;
      } else {
        result += 'र्';
      }
      ptr++;
      continue;
    }

    if (matchedKey) {
      if (matchedKey === 'i') {
        if (text[ptr + matchedKey.length] === 'Q') {
          result += 'ि';
          lastChar = 'ि';
          ptr += matchedKey.length;
          continue;
        }
        pendingI = true;
        ptr += matchedKey.length;
        continue;
      }

      let glyph = matchedUnicode!;
      ptr += matchedKey.length;

      // If followed by ra-kar X (e.g. kX in ikX)
      if (text.startsWith('X', ptr)) {
        glyph += '्र';
        ptr += 1;
      }

      if (pendingI) {
        glyph += 'ि';
        pendingI = false;
      }
      result += glyph;
      lastChar = glyph;
    } else {
      result += cur;
      lastChar = cur;
      ptr++;
    }
  }

  return result
    .replace(/([0-9०-९])ं([0-9०-९])/g, '$1/$2')
    .replace(/([0-9०-९])ः([0-9०-९])/g, '$1:$2');
}
