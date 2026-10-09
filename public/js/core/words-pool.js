/**
 * Typeshala Bench — Word Pool, Content Generation & Grapheme Segmenter
 * Powered by authentic Dantya Katha stories, fascinating facts, and logical difficulty tiers.
 */

import { state } from './state.js';
import { DATA } from '../data/typing-words.js';
import { EXAM_SPEECH_NEPALI, EXAM_SPEECH_ENGLISH } from '../data/speeches.js';
import { toPreeti } from '../utils/preeti-converter.js';
import { 
  getWeakKeysAnalysis, 
  generateAdaptiveWords, 
  generateDiagnosticWords,
  calculateTargetGoal 
} from '../utils/adaptive-engine.js';
import { 
  getRandomStory, 
  getNextStory, 
  getRandomWordsByDifficulty,
  ALL_NEPALI_WORDS,
  ALL_ENGLISH_WORDS
} from '../data/text-library.js';

// Intl.Segmenter instances for authentic Devanagari ligature splitting
const neSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('ne', { granularity: 'grapheme' }) : null;
const enSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null;

export function getGraphemes(text, lang) {
  if (!text) return [];
  if (lang === 'nepali_preeti') {
    return text.split('');
  }
  const seg = (lang === 'english' ? enSegmenter : neSegmenter);
  if (!seg) {
    return Array.from(text);
  }
  return Array.from(seg.segment(text), s => s.segment);
}

export function getWordsPool() {
  let list = [];

  // 1. EXAM MODE: Balen Shah's historic UN General Assembly address
  if (state.mode === 'exam') {
    const isEng = (state.lang === 'english');
    const text = isEng ? EXAM_SPEECH_ENGLISH : EXAM_SPEECH_NEPALI;
    list = text.split(/\s+/).filter(Boolean);
    if (state.lang === 'nepali_preeti') {
      list = list.map(w => toPreeti(w));
    }
    return list;
  }

  // 2. TIME MODE: Authentic Nepali Dantya Katha stories, folklore & fascinating facts
  if (state.mode === 'time') {
    const story = getRandomStory(state.lang);
    state.currentStoryId = story.id;
    state.currentStoryTitle = story.title;

    list = story.text.split(/\s+/).filter(Boolean);

    // If story is shorter than 120 words and duration is long, chain the next story immediately
    if (list.length < 150 && (state.duration >= 60 || state.duration === 0)) {
      const nextStory = getNextStory(state.lang, state.currentStoryId);
      if (nextStory && nextStory.id !== story.id) {
        const nextWords = nextStory.text.split(/\s+/).filter(Boolean);
        list.push(...nextWords);
      }
    }

    if (state.lang === 'nepali_preeti') {
      list = list.map(w => toPreeti(w));
    }
    return list;
  }

  // 3. ADAPTIVE DRILL MODE: Targeted high-density weak keys
  if (state.mode === 'adaptive') {
    const analysis = getWeakKeysAnalysis(state.lang, 3);
    const targetTags = document.getElementById('adaptive-target-tags');
    const metaPill = document.getElementById('adaptive-meta-pill');
    const accDisp = document.getElementById('adaptive-acc-display');
    const nextDisp = document.getElementById('adaptive-next-display');

    if (!analysis.hasEnoughData || analysis.keys.length === 0) {
      state.isAdaptiveDiagnostic = true;
      state.targetWeakKeys = [];
      state.adaptivePrimaryTarget = '';
      if (targetTags) {
        targetTags.innerHTML = '<span class="text-amber-400 font-medium">Diagnostic Baseline (Type to map weak keys)</span>';
      }
      if (metaPill) metaPill.classList.add('hidden');
      list = generateDiagnosticWords(state.lang, 35);
    } else {
      state.isAdaptiveDiagnostic = false;
      const primary = analysis.keys[0];
      const secondary = analysis.keys[1] || null;
      state.adaptivePrimaryTarget = primary.char;
      state.adaptiveSecondaryTarget = secondary ? secondary.char : '';
      state.targetWeakKeys = [primary.char, ...(secondary ? [secondary.char] : [])];

      const goal = calculateTargetGoal(primary.accuracy);
      state.adaptiveTargetGoal = goal;

      const badgeLabel = primary.accuracy >= 95 ? 'Perfection' : (primary.accuracy >= 88 ? 'Refinement' : 'Weak-Key');
      const badgeColor = primary.accuracy >= 95 ? 'text-teal-400 bg-teal-500/20' : (primary.accuracy >= 88 ? 'text-blue-400 bg-blue-500/20' : 'text-amber-400 bg-amber-500/20');

      if (targetTags) {
        targetTags.innerHTML = `<span class="${badgeColor} text-[10px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide">${badgeLabel}</span> Target: <b class="${badgeColor} font-mono text-xs uppercase px-1.5 py-0.5 rounded">${primary.char}</b> (Current: ${primary.accuracy}% ➔ Goal: ${goal}%)`;
      }
      if (metaPill) {
        metaPill.classList.remove('hidden');
        if (accDisp) accDisp.textContent = `${primary.accuracy}%`;
        const goalDisp = document.getElementById('adaptive-goal-display');
        if (goalDisp) goalDisp.textContent = `${goal}%`;
        if (nextDisp) nextDisp.textContent = secondary ? secondary.char.toUpperCase() : 'None';
      }

      list = generateAdaptiveWords({
        lang: state.lang,
        targetKeys: state.targetWeakKeys,
        targetCount: 35
      });
    }

    if (state.lang === 'nepali_preeti') {
      list = list.map(w => toPreeti(w));
    }
    return list;
  }

  // 4. WORDS MODE: Strict logical difficulty grouping across 2,100+ word library
  if (state.mode === 'words') {
    list = getRandomWordsByDifficulty(state.lang, state.difficulty, state.wordCount || 25);
    if (state.lang === 'nepali_preeti') {
      list = list.map(w => toPreeti(w));
    }
    return list;
  }

  // 5. SENTENCES MODE: Full literary and educational sentences
  const isEng = (state.lang === 'english');
  const langObj = isEng ? DATA.english : DATA.nepali;
  const diffObj = langObj[state.difficulty] || langObj.medium;

  if (state.mode === 'sentences') {
    const pCount = state.paragraphCount || 1;
    const pool = diffObj.sentences;
    let chosen = [];
    if (pCount >= 999) {
      chosen = pool;
    } else {
      const sh = [...pool].sort(() => 0.5 - Math.random());
      chosen = sh.slice(0, Math.min(pCount, sh.length));
    }
    const text = chosen.join(' ');
    list = text.split(/\s+/).filter(Boolean);
  } else if (state.mode === 'quotes') {
    const pCount = state.paragraphCount || 1;
    const pool = diffObj.quotes;
    let chosen = [];
    if (pCount >= 999) {
      chosen = pool;
    } else {
      const sh = [...pool].sort(() => 0.5 - Math.random());
      chosen = sh.slice(0, Math.min(pCount, sh.length));
    }
    const text = chosen.join(' ');
    list = text.split(/\s+/).filter(Boolean);
  } else {
    list = getRandomWordsByDifficulty(state.lang, state.difficulty, 50);
  }

  if (state.lang === 'nepali_preeti') {
    list = list.map(w => toPreeti(w));
  }

  return list;
}

/**
 * Refills words stream when the typist approaches the end of the current buffer.
 * For time mode: seamlessly chains the next ready story or fact set so typing never halts.
 */
export function refillWords() {
  if (state.mode === 'exam') return; // Sequential speech exam

  let extra = [];

  if (state.mode === 'time') {
    // Chain next story in sequence so typist stays immersed in continuous reading
    const nextStory = getNextStory(state.lang, state.currentStoryId);
    state.currentStoryId = nextStory.id;
    extra = nextStory.text.split(/\s+/).filter(Boolean);
  } else if (state.mode === 'words') {
    // Additional words matching chosen logical difficulty
    extra = getRandomWordsByDifficulty(state.lang, state.difficulty, 40);
  } else {
    // Fallback to random difficulty words
    extra = getRandomWordsByDifficulty(state.lang, state.difficulty, 40);
  }

  if (state.lang === 'nepali_preeti') {
    extra = extra.map(w => toPreeti(w));
  }

  const container = document.getElementById('words-container');
  const startIdx = state.words.length;
  state.words.push(...extra);

  if (container) {
    extra.forEach((w, i) => {
      const wIdx = startIdx + i;
      const wSpan = document.createElement('span');
      wSpan.className = 'word-node';
      wSpan.dataset.wordIndex = `${wIdx}`;
      const clusters = getGraphemes(w, state.lang);
      wSpan.innerHTML = clusters.map((cl, cI) => `<span class="char-node" data-char-index="${cI}">${cl}</span>`).join('');
      container.appendChild(wSpan);
    });
  }
}
