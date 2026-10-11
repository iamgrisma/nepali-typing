/**
 * Typeshala Bench — Unified Master Text Library & Logical Difficulty Classifier
 * Categorizes all words across stories, folklore, facts, speeches, and curated sets.
 */

import { NEPALI_STORIES, ENGLISH_STORIES } from './stories.js';
import { DATA } from './typing-words.js';
import { EXAM_SPEECH_NEPALI, EXAM_SPEECH_ENGLISH } from './speeches.js';

/**
 * Logical Difficulty Classifier for Nepali Words:
 * Defined by halanta count, chandra bindu, ligatures, and length.
 * - Easy: short words (len <= 4), 0 halanta, no chandra bindu.
 * - Medium: len 5-7, or 1 halanta, or chandra bindu/anusvara.
 * - Hard: more than 2 halants, or (len >= 8), or complex conjunct combinations.
 */
export function classifyNepaliWordDifficulty(word) {
  if (!word || word.length === 0) return 'easy';
  const halantaCount = (word.match(/्/g) || []).length;
  const hasChandraBindu = word.includes('ँ');
  const hasAnusvara = word.includes('ं') || word.includes('ः');
  const graphemeLen = Array.from(word).length;

  // Hard: > 2 halanta, OR length >= 8, OR halanta >= 2
  if (halantaCount >= 2 || graphemeLen >= 8 || (hasChandraBindu && halantaCount >= 1)) {
    return 'hard';
  }
  // Medium: 1 halanta, chandra bindu, anusvara, or length 5 to 7
  if (halantaCount === 1 || hasChandraBindu || hasAnusvara || graphemeLen >= 5) {
    return 'medium';
  }
  // Easy: short clean words
  return 'easy';
}

export function classifyEnglishWordDifficulty(word) {
  if (!word) return 'easy';
  const len = word.length;
  if (len >= 9 || /[jqzxy]{2,}/i.test(word)) return 'hard';
  if (len >= 5) return 'medium';
  return 'easy';
}

function cleanTokens(text, isNepali = true) {
  if (!text) return [];
  const regex = isNepali 
    ? /[।,\.?!;:«»“”‘’—–\(\)\[\]\{\}\/\\\"\'0-9०-९\-_+=<>]/g 
    : /[\.,?!;:«»“”‘’—–\(\)\[\]\{\}\/\\\"\'0-9\-_+=<>]/g;
  return text.replace(regex, ' ')
    .split(/\s+/)
    .map(w => isNepali ? w.trim() : w.trim().toLowerCase())
    .filter(w => w.length > 1);
}

// Compile master pool of clean tokens from all stories, speeches, sentences, and words
const allNepaliTokens = Array.from(new Set([
  ...cleanTokens(NEPALI_STORIES.map(s => s.text).join(' '), true),
  ...cleanTokens(EXAM_SPEECH_NEPALI, true),
  ...DATA.nepali.easy.words,
  ...DATA.nepali.medium.words,
  ...DATA.nepali.hard.words,
  ...cleanTokens(DATA.nepali.easy.sentences.join(' '), true),
  ...cleanTokens(DATA.nepali.medium.sentences.join(' '), true),
  ...cleanTokens(DATA.nepali.hard.sentences.join(' '), true),
  ...cleanTokens(DATA.nepali.easy.quotes.join(' '), true),
  ...cleanTokens(DATA.nepali.medium.quotes.join(' '), true),
  ...cleanTokens(DATA.nepali.hard.quotes.join(' '), true)
]));

const allEnglishTokens = Array.from(new Set([
  ...cleanTokens(ENGLISH_STORIES.map(s => s.text).join(' '), false),
  ...cleanTokens(EXAM_SPEECH_ENGLISH, false),
  ...DATA.english.easy.words,
  ...DATA.english.medium.words,
  ...DATA.english.hard.words,
  ...cleanTokens(DATA.english.easy.sentences.join(' '), false),
  ...cleanTokens(DATA.english.medium.sentences.join(' '), false),
  ...cleanTokens(DATA.english.hard.sentences.join(' '), false),
  ...cleanTokens(DATA.english.easy.quotes.join(' '), false),
  ...cleanTokens(DATA.english.medium.quotes.join(' '), false),
  ...cleanTokens(DATA.english.hard.quotes.join(' '), false)
]));

// Segment all unique tokens into logical difficulty tiers
export const NEPALI_DIFFICULTY_TIERS = {
  easy: allNepaliTokens.filter(w => classifyNepaliWordDifficulty(w) === 'easy'),
  medium: allNepaliTokens.filter(w => classifyNepaliWordDifficulty(w) === 'medium'),
  hard: allNepaliTokens.filter(w => classifyNepaliWordDifficulty(w) === 'hard')
};

export const ENGLISH_DIFFICULTY_TIERS = {
  easy: allEnglishTokens.filter(w => classifyEnglishWordDifficulty(w) === 'easy'),
  medium: allEnglishTokens.filter(w => classifyEnglishWordDifficulty(w) === 'medium'),
  hard: allEnglishTokens.filter(w => classifyEnglishWordDifficulty(w) === 'hard')
};

export { allNepaliTokens as ALL_NEPALI_WORDS, allEnglishTokens as ALL_ENGLISH_WORDS };

/**
 * Returns a random engaging story or fact set for time-based typing tests,
 * guaranteed not to repeat across reloads until the entire catalog is exhausted.
 */
export function getRandomStory(lang = 'nepali_unicode') {
  const isEng = (lang === 'english');
  const pool = isEng ? ENGLISH_STORIES : NEPALI_STORIES;
  const storageKey = isEng ? 'topnepali_seen_stories_en' : 'topnepali_seen_stories_ne';

  let seenIds = [];
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw) seenIds = JSON.parse(raw);
    if (!Array.isArray(seenIds)) seenIds = [];
  } catch (e) {
    seenIds = [];
  }

  // Filter pool to candidates that have not been seen yet
  let candidates = pool.filter(s => !seenIds.includes(s.id));

  // If all stories have been seen, recycle the deck and start fresh
  if (candidates.length === 0) {
    seenIds = [];
    candidates = pool;
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];

  seenIds.push(picked.id);
  // Keep seen buffer up to pool.length - 1 so the last one never repeats immediately
  if (seenIds.length >= pool.length) {
    seenIds = [picked.id];
  }

  try {
    sessionStorage.setItem(storageKey, JSON.stringify(seenIds));
  } catch (e) { }

  return picked;
}

/**
 * Returns the next ready story/fact set in the sequence so typists never halt
 */
export function getNextStory(lang = 'nepali_unicode', currentId = null) {
  const isEng = (lang === 'english');
  const pool = isEng ? ENGLISH_STORIES : NEPALI_STORIES;
  const curIdx = pool.findIndex(s => s.id === currentId);
  const nextIdx = (curIdx >= 0) ? ((curIdx + 1) % pool.length) : Math.floor(Math.random() * pool.length);
  return pool[nextIdx];
}

/**
 * Selects random words strictly adhering to logical difficulty classification
 */
export function getRandomWordsByDifficulty(lang = 'nepali_unicode', difficulty = 'medium', targetCount = 30) {
  const isEng = (lang === 'english');
  const tiers = isEng ? ENGLISH_DIFFICULTY_TIERS : NEPALI_DIFFICULTY_TIERS;
  const pool = tiers[difficulty] || tiers.medium;

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const result = [];
  while (result.length < targetCount) {
    result.push(...shuffled);
  }
  return result.slice(0, targetCount);
}
