/**
 * Comprehensive Unicode <-> Preeti Converter
 * Correctly transforms Devanagari Unicode codepoints into legacy Preeti ASCII font glyphs,
 * including complex conjuncts (e.g. च्च, क्क, न्न, त्त), halanta, reph, and raswa ikaar positioning.
 */

// Regex transformations for contextual positioning:
// 1. Raswa Ikaar (ि): In Unicode it comes AFTER the consonant, but in Preeti 'l' comes BEFORE the consonant cluster
// 2. Reph (र्): In Unicode it is typed first (r + halant), but in Preeti '{' is placed after the consonant cluster
const CONTEXTUAL_RULES: [string, string][] = [
  ["((?:.्)*.)ि", "l$1"],
  ["र्((?:.्)*.)", "$1{"]
];

// Master character and compound mapping table
const PREETI_CHAR_MAP: [string, string][] = [
  ["❨", "-"], ["❩", "_"], ["‘", "…"], ["?", "<"],
  ["ॐ", "ç"], ["ऽ", "˜"], ["।", "."],
  ["m'", "'m"], ["m]", "]m"], ["mfF", "Fmf"], ["mF", "Fm"],
  ["०", ")"], ["१", "!"], ["२", "@"], ["३", "#"], ["४", "$"],
  ["५", "%"], ["६", "^"], ["७", "&"], ["८", "*"], ["९", "("],

  // Special multi-character ligatures & conjuncts
  ["फ्र", "k|m"], ["झ", "em"], ["फ", "km"], ["क्त", "Qm"], ["क्र", "qm"],
  ["ज्ञ्", "¡"], ["द्घ", "¢"], ["ज्ञ", "1"], ["द्द", "2"], ["द्ध", "4"],
  ["श्र", ">"], ["रु", "?"], ["द्य", "B"], ["क्ष्", "I"], ["क्ष", "If"],
  ["त्त", "Q"], ["द्म", "ß"], ["त्र", "q"], ["ध्र", "„"], ["ङ्घ", "‹"],
  ["ड्ड", "•"], ["द्र", "›"], ["ट्ट", "§"], ["ड्ढ", "°"], ["ठ्ठ", "¶"],
  ["रू", "¿"], ["हृ", "Å"], ["ङ्ग", "Ë"], ["ङ्क", "Í"], ["ङ्ख", "Î"],
  ["ट्ठ", "Ý"], ["द्व", "å"], ["ट्र", "6«"], ["ठ्र", "7«"], ["ड्र", "8«"],
  ["ढ्र", "9«"], ["्र", "|"], ["ड़", "8Þ"], ["ढ़", "9Þ"],

  // Consonants (Half and Full)
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

  // Dependent Matras & Diacritics
  ["ू", "\""], ["ु", "'"], ["ं", "+"], ["ा", "f"], ["ृ", "["],
  ["्", "\\"], ["े", "]"], ["ै", "}"], ["ँ", "F"], ["ी", "L"],
  ["ः", "M"], ["ो", "f]"], ["ौ", "f}"]
];

/**
 * Checks if a string contains any Devanagari Unicode characters (U+0900 - U+097F)
 */
export function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Converts standard Unicode Devanagari text to Preeti ASCII characters
 * for accurate legacy font rendering in browsers.
 */
export function unicodeToPreeti(text: string): string {
  if (!text) return '';

  let s = text;

  // Step 1: Apply contextual rules (raswa ikaar and reph)
  for (const [pattern, replacement] of CONTEXTUAL_RULES) {
    s = s.replace(new RegExp(pattern, 'g'), replacement);
  }

  // Step 2: Apply master character and compound replacement
  for (const [u, p] of PREETI_CHAR_MAP) {
    s = s.replaceAll(u, p);
  }

  return s;
}

/**
 * Converts Preeti ASCII glyphs back to Unicode Devanagari
 */
export function preetiToUnicode(text: string): string {
  if (!text) return '';
  let s = text;

  // Sort compounds longest first
  const sortedPairs = [...PREETI_CHAR_MAP].sort((a, b) => b[1].length - a[1].length);

  for (const [u, p] of sortedPairs) {
    if (p.length > 0) {
      s = s.replaceAll(p, u);
    }
  }

  // Fix reph contextual: character + { -> र् + character
  s = s.replace(/([क-ह]्?[क-ह]?)\{/g, 'र्$1');
  // Fix ikaar contextual: l + consonant cluster -> cluster + ि
  s = s.replace(/l((?:[क-ह]्)*[क-ह])/g, '$1ि');

  return s;
}
