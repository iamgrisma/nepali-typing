/**
 * Comprehensive Unicode <-> Preeti Converter
 * Handles:
 * 1. Word-final halanta (e.g. 'श्रीमान्' -> '>Ldfg\', 'छन्' -> '5g\')
 * 2. Proper connecting half-consonants (e.g. 'कन्म' -> 'sGd', 'सज्जन' -> ';Hhg')
 * 3. Raswa Ikaar (ि) contextual reordering before consonant cluster
 * 4. Reph (र्) contextual placement as '{' after consonant cluster
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

/**
 * Converts Unicode Devanagari text to Preeti ASCII characters
 * Preserves proper word-final halantas (e.g. श्रीमान् -> >Ldfg\) and conjunct half-letters (कन्म -> sGd)
 */
export function toPreeti(text) {
  if (!text) return '';
  let s = text;

  // Step 1: Word-final halanta handling
  // Consonants followed by halanta ् at the end of a word or before non-devanagari characters
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
