/**
 * Comprehensive Bidirectional Preeti <-> Unicode Converter
 * Handles:
 * 1. Preeti to Unicode (95%+ of user demand) with contextual reph '{' and raswa ikaar 'l' reordering
 * 2. Unicode to Preeti with word-final halanta handling (श्रीमान् -> >Ldfg\) and conjunct mappings
 * 3. HTML / Rich Text formatting preservation (preserves <b>, <i>, <u>, <h1>, <p>, <ul>, etc.)
 */

export const CONTEXTUAL_RULES = [
  // 1. Raswa Ikaar (ि): In Unicode it comes AFTER the consonant, but in Preeti 'l' comes BEFORE the consonant cluster
  ["((?:.्)*.)ि", "l$1"],
  // 2. Reph (र्): In Unicode it is typed first (r + halant), but in Preeti '{' is placed after the consonant cluster
  ["र्((?:.्)*.)", "$1{"]
];

export const END_HALANT_CONSONANTS = [
  ['क', 's'], ['ख', 'v'], ['ग', 'u'], ['घ', '3'],
  ['च', 'r'], ['छ', '5'], ['ज', 'h'], ['झ', '´'],
  ['ञ', '`'], ['ट', '6'], ['ठ', '7'], ['ड', '8'], ['ढ', '9'], ['ण', '0f'],
  ['त', 't'], ['थ', 'y'], ['द', 'b'], ['ध', 'w'], ['न', 'g'],
  ['प', 'k'], ['फ', 'km'], ['ब', 'a'], ['भ', 'e'], ['म', 'd'],
  ['य', 'o'], ['र', '/'], ['ल', 'n'], ['व', 'j'],
  ['श', 'z'], ['ष', 'if'], ['स', ';'], ['ह', 'x']
];

export const PREETI_CHAR_MAP = [
  ["❨", "-"], ["❩", "_"], ["‘", "…"], ["?", "<"],
  ["ॐ", "ç"], ["ऽ", "˜"], ["।", "."],
  ["m'", "'m"], ["m]", "]m"], ["mfF", "Fmf"], ["mF", "Fm"],
  ["०", ")"], ["१", "!"], ["२", "@"], ["३", "#"], ["४", "$"],
  ["५", "%"], ["६", "^"], ["७", "&"], ["८", "*"], ["९", "("],

  // Special multi-character ligatures & keyboard-typable conjuncts
  ["फ्र", "k|m"], ["झ", "em"], ["फ", "km"], ["क्त", "Qm"], ["क्र", "qm"],
  ["ज्ञ्", "¡"], ["द्घ", "¢"], ["ज्ञ", "1"], ["द्द", "2"], ["द्ध", "4"],
  ["श्र", ">"], ["रु", "?"], ["द्य", "B"], ["क्ष्", "I"], ["क्ष", "If"],
  ["त्त", "Q"], ["द्म", "b\\d"], ["त्र", "q"], ["ध्र", "w|"], ["ङ्घ", "‹"],
  ["ड्ड", "8\\8"], ["द्र", "b|"], ["ट्ट", "6\\6"], ["ड्ढ", "°"], ["ठ्ठ", "7\\7"],
  ["रू", "/\""], ["हृ", "x["], ["ङ्ग", "+u"], ["ङ्क", "+s"], ["ङ्ख", "+v"],
  ["ट्ठ", "7\\7"], ["द्व", "b\\j"], ["ट्र", "6|"], ["ठ्र", "7|"], ["ड्र", "8|"],
  ["ढ्र", "9|"], ["्र", "|"], ["ड़", "8Þ"], ["ढ़", "9Þ"],

  // Half Consonants (when connecting to another consonant, like in 'कन्म' -> 'sGd')
  ["क्", "S"], ["क", "s"],
  ["ख्", "V"], ["ख", "v"],
  ["ग्", "U"], ["ग", "u"],
  ["घ्", "£"], ["घ", "3"],
  ["ङ", "ª"],
  ["च्", "R"], ["च", "r"],
  ["छ", "5"],
  ["ज्", "H"], ["ज", "h"],
  ["झ्", "‰"], ["झ", "´"],
  ["ञ्", "~"], ["ञ", "`"],
  ["ट", "6"], ["ठ", "7"], ["ड", "8"], ["ढ", "9"],
  ["ण्", "0"], ["ण", "0f"],
  ["त्", "T"], ["त", "t"],
  ["थ्", "Y"], ["थ", "y"],
  ["द", "b"],
  ["ध्", "W"], ["ध", "w"],
  ["न्", "G"], ["न", "g"],
  ["प्", "K"], ["प", "k"],
  ["फ्", "ˆ"],
  ["ब्", "A"], ["ब", "a"],
  ["भ्", "E"], ["भ", "e"],
  ["म्", "D"], ["म", "d"],
  ["य", "o"], ["र", "/"],
  ["ल्", "N"], ["ल", "n"],
  ["व्", "J"], ["व", "j"],
  ["श्", "Z"], ["श", "z"],
  ["ष्", "i"], ["ष", "if"],
  ["स्", ":"], ["स", ";"],
  ["ह्", "X"], ["ह", "x"],
  ["्य", "Ø"],

  // Independent Vowels
  ["औ", "cf}"], ["ओ", "cf]"], ["आ", "cf"], ["अ", "c"],
  ["ई", "O{"], ["इ", "O"], ["ऊ", "pm"], ["उ", "p"],
  ["ऋ", "C"], ["ऐ", "P]"], ["ए", "P"],

  // Matras & Diacritics
  ["ू", "\""], ["ु", "'"], ["ं", "+"], ["ा", "f"], ["ृ", "["],
  ["्", "\\"], ["े", "]"], ["ै", "}"], ["ँ", "F"], ["ी", "L"],
  ["ः", "M"], ["ो", "f]"], ["ौ", "f}"]
];

// Preeti-to-Unicode master mapping table
const PREETI_TO_UNICODE_MAP = [
  // 3+ Character Compounds & Ligatures
  ["k|m", "फ्र"],
  ["cf}F", "औँ"],
  ["cf}+", "औँ"],
  ["cf}", "औ"],
  ["cf]", "ओ"],
  ["cf", "आ"],
  ["pm", "ऊ"],
  ["P]", "ऐ"],
  ["8Þ", "ड़"],
  ["9Þ", "ढ़"],
  ["6«", "ट्र"],
  ["7«", "ठ्र"],
  ["8«", "ड्र"],
  ["9«", "ढ्र"],
  ["6|", "ट्र"],
  ["7|", "ठ्र"],
  ["8|", "ड्र"],
  ["9|", "ढ्र"],
  ["If", "क्ष"],
  ["0f", "ण"],
  ["if", "ष"],
  ["f}F", "ौँ"],
  ["f}+", "ौँ"],
  ["f]F", "ों"],
  ["f]+", "ों"],
  ["f}", "ौ"],
  ["f]", "ो"],
  ["k|", "प्र"],
  ["km", "फ"],
  ["Qm", "क्त"],
  ["qm", "क्र"],
  ["em", "झ"],

  // Special Conjuncts & Ligatures
  ["1", "ज्ञ"],
  ["2", "द्द"],
  ["4", "द्ध"],
  ["Q", "त्त"],
  [">", "श्र"],
  ["?", "रु"],
  ["¿", "रू"],
  ["B", "द्य"],
  ["I", "क्ष्"],
  ["q", "त्र"],
  ["å", "द्व"],
  ["§", "ट्ट"],
  ["•", "ड्ड"],
  ["°", "ड्ढ"],
  ["¶", "ठ्ठ"],
  ["Ý", "ट्ठ"],
  ["ß", "द्म"],
  ["¡", "ज्ञ्"],
  ["¢", "द्घ"],
  ["„", "ध्र"],
  ["›", "द्र"],
  ["‹", "ङ्घ"],
  ["Ë", "ङ्ग"],
  ["Í", "ङ्क"],
  ["Î", "ङ्ख"],
  ["Å", "हृ"],

  // Numerals
  ["!", "१"], ["@", "२"], ["#", "३"], ["$", "४"], ["%", "५"],
  ["^", "६"], ["&", "७"], ["*", "८"], ["(", "९"], [")", "०"],

  // Punctuation & Classical Symbols
  ["ç", "ॐ"], ["˜", "ऽ"], [".", "।"], ["<", "?"],

  // Independent Vowels
  ["c", "अ"], ["O", "इ"], ["p", "उ"], ["P", "ए"], ["C", "ऋ"],

  // Consonants (Half consonants & full consonants)
  ["S", "क्"], ["s", "क"],
  ["V", "ख्"], ["v", "ख"],
  ["U", "ग्"], ["u", "ग"],
  ["£", "घ्"], ["3", "घ"],
  ["ª", "ङ"],
  ["R", "च्"], ["r", "च"],
  ["5", "छ"],
  ["H", "ज्"], ["h", "ज"],
  ["‰", "झ्"], ["´", "झ"],
  ["~", "ञ्"], ["`", "ञ"],
  ["6", "ट"], ["7", "ठ"], ["8", "ड"], ["9", "ढ"],
  ["0", "ण्"],
  ["T", "त्"], ["t", "त"],
  ["Y", "थ्"], ["y", "थ"],
  ["b", "द"],
  ["W", "ध्"], ["w", "ध"],
  ["G", "न्"], ["g", "न"],
  ["K", "प्"], ["k", "प"],
  ["ˆ", "फ्"], ["m", "फ"],
  ["A", "ब्"], ["a", "ब"],
  ["E", "भ्"], ["e", "भ"],
  ["D", "म्"], ["d", "म"],
  ["o", "य"],
  ["/", "र"],
  ["N", "ल्"], ["n", "ल"],
  ["J", "व्"], ["j", "व"],
  ["Z", "श्"], ["z", "श"],
  ["i", "ष्"],
  [":", "स्"], [";", "स"],
  ["X", "ह्"], ["x", "ह"],

  // Matras & Diacritics
  ["f", "ा"],
  ["l", "ि"],
  ["L", "ी"],
  ["]", "े"],
  ["}", "ै"],
  ["'", "ु"],
  ['"', "ू"],
  ["[", "ृ"],
  ["+", "ं"],
  ["F", "ँ"],
  ["M", "ः"],
  ["\\", "्"],
  ["|", "्र"],
  ["Ø", "्य"],
  ["{", "र्"]
];

const PREETI_HALF_CONS = '(?:[SVU£R~TYWGKˆAEDNJZ:X]|i(?![fF])|[svu3r5h´`67890tybwgkmaedonjzx]\\\\)';
const PREETI_FULL_CONS = '(?:k\\|m|k\\||km|Qm|qm|em|If|if|6«|7«|8«|9«|6\\||7\\||8\\||9\\||8Þ|9Þ|1|2|4|Q|>|\\?|¿|B|I|q|å|§|•|°|¶|Ý|ß|¡|¢|„|›|‹|Ë|Í|Î|Å|[svu3r5h´`67890tybwgkmaedonjzx0cOpPC])';
const PREETI_MATRAS = '[fL\\]}\'\"\\[+FM]';

/**
 * Converts standard Unicode Devanagari text to Preeti ASCII characters.
 */
export function toPreeti(text) {
  if (!text) return '';
  let s = text;

  // Step 1: Word-final halanta handling
  for (const [c, p] of END_HALANT_CONSONANTS) {
    const re = new RegExp(`${c}्(?=$|[^\\u0900-\\u097F])`, 'g');
    s = s.replace(re, `${p}\\`);
  }

  // Step 2: Contextual rules (raswa ikaar and reph)
  for (const [pattern, replacement] of CONTEXTUAL_RULES) {
    s = s.replace(new RegExp(pattern, 'g'), replacement);
  }

  // Step 3: Master character and compound replacement
  for (const [u, p] of PREETI_CHAR_MAP) {
    s = s.replaceAll(u, p);
  }

  return s;
}

/**
 * Converts Preeti ASCII text to standard Unicode Devanagari.
 */
export function preetiToUnicode(input) {
  if (!input) return '';

  let text = input;

  // Pre-pass: Handle independent vowels with composite reph/shapes
  text = text.replaceAll('O{', 'ई');

  // Step 1: Reph '{' handling (Preeti places reph after consonant/matra, Unicode requires र् before consonant cluster)
  const rephPattern = new RegExp(`(${PREETI_HALF_CONS}*${PREETI_FULL_CONS}${PREETI_MATRAS}*)\\{`, 'g');
  text = text.replace(rephPattern, '{$1');

  // Step 2: Raswa Ikaar 'l' handling (Preeti places 'l' before consonant cluster, Unicode requires ि after)
  const ikaarPattern = new RegExp(`l(${PREETI_HALF_CONS}*${PREETI_FULL_CONS})`, 'g');
  text = text.replace(ikaarPattern, '$1l');

  // Step 3: Master Character & Ligature Replacements
  for (const [p, u] of PREETI_TO_UNICODE_MAP) {
    text = text.replaceAll(p, u);
  }

  return text;
}

/**
 * Bidirectional conversion function.
 * @param {string} text - Input text
 * @param {'toUnicode' | 'toPreeti'} direction - Conversion mode
 */
export function convertText(text, direction = 'toUnicode') {
  if (!text) return '';
  return direction === 'toPreeti' ? toPreeti(text) : preetiToUnicode(text);
}

/**
 * Formatted HTML converter. Preserves all markup (<b>, <i>, <u>, <h1>, <p>, <ul>, etc.)
 * and converts only inner text nodes.
 * @param {string} html - HTML string
 * @param {'toUnicode' | 'toPreeti'} direction - Conversion mode
 */
export function convertHtml(html, direction = 'toUnicode') {
  if (!html) return '';
  const converterFn = direction === 'toPreeti' ? toPreeti : preetiToUnicode;
  return html.replace(/(<[^>]+>|&[a-zA-Z0-9#]+;)|([^<>&]+)/g, (match, tagOrEntity, text) => {
    if (tagOrEntity) return tagOrEntity;
    if (text) return converterFn(text);
    return match;
  });
}

/**
 * Detects whether the given string contains Devanagari Unicode characters.
 */
export function hasDevanagari(text) {
  return /[\u0900-\u097F]/.test(text);
}
