/**
 * Rich Multi-Layout Nepali & English Typing Test Dataset
 * Features authentic Nepali literature, poetry, proverbs, daily life, travel, and modern technology.
 */

import { unicodeToPreeti } from './preeti-converter';

export interface DifficultyDataset {
  words: string[];
  sentences: string[];
  special: string[];
  quotes: string[];
}

export interface LanguageData {
  easy: DifficultyDataset;
  medium: DifficultyDataset;
  hard: DifficultyDataset;
}

// =========================================================================
// 1. RICH NEPALI UNICODE (DEVANAGARI) DATASET — POETRY, STORIES, LIFE, TECH
// =========================================================================
export const NEPALI_DATA: LanguageData = {
  easy: {
    words: [
      'घर', 'माया', 'साथी', 'पानी', 'चिया', 'गाउँ', 'शहर', 'हिमाल', 'खोला', 'रुख',
      'पात', 'फूल', 'घाम', 'जून', 'तारा', 'सपना', 'आकाश', 'माटो', 'दिन', 'रात',
      'बिहान', 'साँझ', 'हाँसो', 'खुसी', 'आँखा', 'मन', 'गीत', 'नाच', 'रङ', 'बाटो',
      'किताब', 'कलम', 'कापी', 'खाना', 'मिठो', 'दही', 'दूध', 'रोटी', 'दाल', 'भात',
      'आमा', 'बाबा', 'दाइ', 'दिदी', 'भाइ', 'बहिनी', 'काठमाडौँ', 'पोखरा', 'धरान', 'इलाम',
      'नेपाल', 'नेपाली', 'हाम्रो', 'तिम्रो', 'मेरो', 'यहाँ', 'त्यहाँ', 'सबै', 'राम्रो', 'सुन्दर',
      'चरा', 'गाई', 'कुकुर', 'घोडा', 'माछा', 'हिउँ', 'हावा', 'बतास', 'मायालु', 'संसार'
    ],
    sentences: [
      'बिहानको एक कप तातो चियाले मन नै प्रफुल्ल बनाउँछ।',
      'नेपाल प्रकृतिको अनुपम वरदान पाएको एउटा स्वर्ग जस्तै देश हो।',
      'साथीभाइसँग बसेर गफगाफ गर्नुको मज्जा नै बेग्लै हुन्छ।',
      'आफ्नो गाउँ र प्रकृतिको काखमा बिताएका पलहरू सधैँ अविस्मरणीय रहन्छन्।',
      'मिहिनेत र धैर्यता नै जीवनमा सफलता हासिल गर्ने मूल मन्त्र हुन्।',
      'सधैँ सकारात्मक सोच राखौँ र अरूको भलो चिताऔँ।',
      'साँझपख हिमालको काखमा डुब्दै गरेको घाम हेर्न निकै मनमोहक देखिन्छ।',
      'पुस्तक पढ्ने बानीले हाम्रो सोच र दृष्टिकोणलाई फराकिलो बनाउँछ।'
    ],
    quotes: [
      'हुने बिरुवाको चिल्लो पात, नहुने बिरुवाको खस्रो पात।',
      'आफू भलो त जगत भलो।',
      'घाँटी हेरी हाड निल्नु, समय हेरी पाइला चाल्नु।',
      'नबोल्नेको चामल बिक्दैन, बोल्नेको पिठो पनि बिक्छ।',
      'कागलाई बेल पाक्यो हर्ष न विस्मात।'
    ],
    special: [
      '१, २, ३, ४, ५, ६, ७, ८, ९, ०',
      'काठमाडौँ — पोखरा (दूरी: २०० कि.मी.)',
      'चिया-खाजा, दिन-रात, सुख-दुःख, माया-प्रेम',
      'नेपाल (Nepal): "शान्ति र सौन्दर्यको देश!"'
    ]
  },
  medium: {
    words: [
      'साहित्य', 'संस्कृति', 'सभ्यता', 'प्रकृति', 'सङ्गीत', 'सिर्जना', 'कल्पना', 'यात्रा', 'अनुभूति', 'भावना',
      'सञ्चार', 'प्रविधि', 'इन्टरनेट', 'कम्प्युटर', 'डिजिटल', 'सफ्टवेयर', 'आधुनिक', 'सिनेमा', 'नाटक', 'उपन्यास',
      'पर्यटन', 'अन्नपूर्ण', 'सगरमाथा', 'मुस्ताङ', 'मनाङ', 'राराताल', 'चितवन', 'लुम्बिनी', 'पाटन', 'भक्तपुर',
      'दसैँ', 'तिहार', 'छठ', 'होली', 'ल्होसार', 'माघी', 'इन्द्रजात्रा', 'रोधीघर', 'देउडा', 'मादल',
      'मित्रता', 'इमानदारी', 'परिश्रम', 'उत्साह', 'प्रेरणा', 'सहानुभूति', 'एकता', 'स्वाभिमान', 'पहिचान', 'सौन्दर्य',
      'जिन्दगी', 'सम्बन्ध', 'चुनौती', 'सम्भावना', 'परिवर्तन', 'विकास', 'अवसर', 'गन्तव्य', 'प्रयास', 'सफलता'
    ],
    sentences: [
      'पोखराको फेवातालमा माछापुच्छ्रेको छायाँ नाचेको दृश्यले हरकसैलाई मन्त्रमुग्ध बनाउँछ।',
      'दसैँ र तिहारको आगमनसँगै गाउँघरमा पिङ खेल्ने र रमाइलो गर्ने उल्लास छाउँछ।',
      'सूचना प्रविधिको विकासले आज संसारलाई एउटा सानो विश्वग्राममा रूपान्तरण गरिदिएको छ।',
      'साहित्य समाजको ऐना हो, जसले मानिसका गहिरा भावना, पीडा र सपनाहरूलाई अभिव्यक्त गर्छ।',
      'रारा तालको निलो कञ्चन पानी र वरपरका सल्लाका रुखहरूले स्वर्गको अनुभूति दिलाउँछन्।',
      'कफी सपमा बसेर साथीहरूसँग नयाँ आइडिया र स्टार्टअपका बारेमा छलफल गर्नु युवाहरूको नयाँ संस्कृति बनेको छ।',
      'आफ्नो मातृभाषामा आफ्ना विचारहरू निर्धक्क र शुद्ध रूपमा टाइप गर्न सक्नु एउटा महत्त्वपूर्ण कला हो।'
    ],
    quotes: [
      'मानिस ठूलो दिलले हुन्छ जातले हुँदैन। — महाकवि लक्ष्मीप्रसाद देवकोटा',
      'घाँसी दरिद्र घरको तर बुद्धि कस्तो, म भानुभक्त भईकन आज यस्तो। — आदिकवि भानुभक्त आचार्य',
      'नेपाली हामी रहूँला कहाँ नेपालै नरहे, उचाइ हाम्रो कहाँ पुग्ला हिमालै नरहे। — राष्ट्रकवि माधवप्रसाद घिमिरे',
      'ज्ञान मर्दछ हाँसेर, रोए विज्ञान मर्दछ। — नाट्यसम्राट बालकृष्ण सम',
      'हामी वीर छौं तर बुद्धू छौं, हामी बुद्धू छौं र त वीर छौं। — भूपि शेरचन'
    ],
    special: [
      'हाइकिङ रुट: सुन्दरीजल — चिसापानी — नगरकोट (३२ कि.मी.)',
      'मूल्य सूची: म:म (प्रति प्लेट) रु. १८०/- | कफी रु. १२०/-',
      'सम्पर्क: contact@nepalityping.com (सधैँ खुला)',
      'छन्द: "पिँजडाको सुगा" — कवि शिरोमणि लेखनाथ पौड्याल।'
    ]
  },
  hard: {
    words: [
      'सौन्दर्यानुभूति', 'विश्वव्यापीकरण', 'अन्तर्राष्ट्रिय', 'दृष्टिकोण', 'काव्यात्मक', 'दार्शनिक', 'आत्मगौरव', 'सहअस्तित्व',
      'पुनर्जागरण', 'उत्तरआधुनिकता', 'नवप्रवर्तन', 'पारिस्थितिक', 'पर्यावरण', 'जैविकविविधता', 'आलोचनात्मक', 'प्रतिविम्बित',
      'रूपान्तरण', 'सहानुभूतिमूलक', 'दूरगामी', 'संवर्धन', 'प्रतिबद्धता', 'सङ्गीतमय', 'अनुसन्धान', 'बौद्धिक', 'अविस्मरणीय',
      'अभिव्यक्ति', 'चेतनाप्रवाह', 'मनोवैज्ञानिक', 'संवेदनशील', 'अस्तित्ववादी', 'सृजनशीलता', 'कल्पनाशक्ति', 'प्रज्ञावान्'
    ],
    sentences: [
      'महाकवि देवकोटाको "मुनामदन" केवल एउटा खण्डकाव्य मात्र नभएर नेपाली समाजको गहिरो सामाजिक यथार्थ र मानवीय वेदनाको अमर गाथा हो।',
      'पारिजातको "शिरीषको फूल" ले नेपाली आख्यान जगतमा अस्तित्ववादी र विसङ्गतिवादी चिन्तनको एउटा नयाँ युगको सूत्रपात गरेको थियो।',
      'कला र साहित्यको मूल उद्देश्य मानवीय संवेदनालाई परिष्कृत गर्दै समाजमा प्रेम, न्याय र करुणाको ज्योति फैलाउनु हो।',
      'विश्वव्यापीकरण र डिजिटल युगको तीव्र लहरमा हाम्रो मौलिक भाषा, संस्कृति र रैथाने ज्ञान प्रणालीको संरक्षण गर्नु अपरिहार्य भएको छ।',
      'हिमालको मौन गाम्भीर्य, नदीहरूको अविरल यात्रा र हरियाली पहाडहरूले मानिसलाई जीवनको नश्वरता र अनन्तताको बोध गराउँछन्।',
      'सङ्घर्ष र चुनौतीहरूबाट नभागी धैर्य र सृजनशीलताका साथ अघि बढ्ने व्यक्तिले नै इतिहासमा आफ्नो अमिट छाप छोड्न सक्छ।'
    ],
    quotes: [
      'के नेपाल सानो छ? विशाल छ, विराट छ, यो त विश्वको मुटु हो जहाँ सगरमाथाले आकाश छुन्छ। — लक्ष्मीप्रसाद देवकोटा',
      'समय कसैको लागि पर्खँदैन, बगेको खोला र बितेको समय कहिल्यै फर्किएर आउँदैन।',
      'अगुल्टोले हानेको कुकुर बिजुली चम्कँदा तर्सन्छ, विगतका अनुभवले मानिसलाई सतर्क र परिपक्व बनाउँछ।',
      'हिँड्ने मान्छे नै लड्छ, लडेपछि उठेर फेरि आफ्ना पाइलाहरू अगाडि बढाउनु नै जीवनको गतिशीलता हो।'
    ],
    special: [
      'कृति: "दोषी चश्मा" (कथा संग्रह) — लेखक: बी.पी. कोइराला [वि.सं. २००६]',
      'तापक्रम: -५°C देखि २५°C सम्म (उच्च हिमाली भेग, ४,२०० मि.)',
      'अनुपात: [φ = (१ + √५) / २ ≈ १.६१८] — सुनौलो अनुपात (Golden Ratio)'
    ]
  }
};

// =========================================================================
// 2. ENGLISH DATASET — MINDFULNESS, LITERATURE, CODE, TECHNOLOGY, NATURE
// =========================================================================
export const ENGLISH_DATA: LanguageData = {
  easy: {
    words: [
      'mountain', 'river', 'forest', 'morning', 'coffee', 'friend', 'smile', 'peace', 'journey', 'dream',
      'light', 'cloud', 'sunshine', 'music', 'story', 'window', 'nature', 'spring', 'winter', 'autumn',
      'valley', 'garden', 'ocean', 'breeze', 'star', 'planet', 'silence', 'laughter', 'simple', 'happy'
    ],
    sentences: [
      'The morning sun paints the snow-capped mountain peaks in golden hues.',
      'A warm cup of coffee and a great book make the quietest afternoons memorable.',
      'Kindness is a universal language that the deaf can hear and the blind can see.',
      'Walking beneath the green canopy of the forest fills the heart with pure calm.',
      'True friendship multiplies the good in life and divides its troubles.'
    ],
    quotes: [
      'The journey of a thousand miles begins with a single step. - Lao Tzu',
      'In the middle of difficulty lies opportunity. - Albert Einstein',
      'Simplicity is the ultimate sophistication. - Leonardo da Vinci'
    ],
    special: [
      'Day & Night | Coffee & Tea | Peace & Harmony',
      'Elevation: 8,848.86 m (Mount Everest / Sagarmatha)',
      'Score: 100/100 [Level: Easy]'
    ]
  },
  medium: {
    words: [
      'creativity', 'discovery', 'innovation', 'philosophy', 'adventure', 'curiosity', 'resilience', 'reflection',
      'atmosphere', 'constellation', 'harmony', 'imagination', 'perspective', 'tranquility', 'architecture',
      'serendipity', 'wanderlust', 'compassion', 'mindfulness', 'equilibrium', 'authenticity', 'inspiration'
    ],
    sentences: [
      'Travel teaches us that the world is far richer, kinder, and more astonishing than we ever dared to imagine.',
      'Writing by hand or typing effortlessly on a keyboard allows our deepest thoughts to flow into reality without friction.',
      'The sound of raindrops tapping gently on window panes creates an intimate soundtrack for quiet contemplation.',
      'Mastering touch typing transforms your keyboard from an obstacle into a direct extension of your thoughts.'
    ],
    quotes: [
      'Not all those who wander are lost. - J.R.R. Tolkien',
      'We do not see things as they are, we see them as we are. - Anais Nin',
      'The only true wisdom is in knowing you know nothing. - Socrates'
    ],
    special: [
      'Latitude: 27 deg 42 min N, Longitude: 85 deg 19 min E (Kathmandu Valley)',
      'API endpoint: https://typing.topnepali.com/api/v1/ping [200 OK]',
      'Ratio: {width: 16, height: 9} | Bitrate: 4.5 Mbps'
    ]
  },
  hard: {
    words: [
      'consciousness', 'ephemeral', 'juxtaposition', 'quintessential', 'solitude', 'magnificent', 'ineffable',
      'contemplation', 'metamorphosis', 'crystallization', 'biodiversity', 'synchronicity', 'philosophical',
      'transcendence', 'kaleidoscope', 'subterranean', 'unprecedented', 'enlightenment', 'renaissance'
    ],
    sentences: [
      'The Himalayan ridgeline stands as an ancient testament to geological epochs, weathering timeless winds with majestic indifference.',
      'Profound literature does not merely reflect existing reality; it constructs an entirely new emotional sanctuary for the wandering soul.',
      'Cultivating effortless keystroke rhythm requires harmonizing sensory feedback, cognitive muscle memory, and disciplined breathing.',
      'Technological innovation reaches its highest zenith when it genuinely elevates human empathy, dignity, and global understanding.'
    ],
    quotes: [
      'Two things awe me most: the starry sky above me and the moral law within me. - Immanuel Kant',
      'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. - Ralph Waldo Emerson'
    ],
    special: [
      'Formula: E = m*c^2 | Limits: lim (1 + 1/x)^x = e = 2.71828',
      'Unicode range: [U+0900 - U+097F] Devanagari Script Specification',
      'Coordinates: (x: 1024, y: 768, z: 0.95); Hash: #0xDEVA_NEPALI'
    ]
  }
};

// =========================================================================
// 3. PREETI ASCII DATASET (LEGACY TYPEWRITER)
// =========================================================================
export function getPreetiDataset(difficulty: 'easy' | 'medium' | 'hard'): DifficultyDataset {
  const nepali = NEPALI_DATA[difficulty];
  return {
    words: nepali.words.map(w => unicodeToPreeti(w)),
    sentences: nepali.sentences.map(s => unicodeToPreeti(s)),
    quotes: nepali.quotes.map(q => unicodeToPreeti(q)),
    special: nepali.special.map(sp => unicodeToPreeti(sp))
  };
}

/**
 * Returns a randomized test prompt based on user settings
 */
export function generateTestText(options: {
  language: 'english' | 'nepali_unicode' | 'nepali_romanized' | 'nepali_preeti';
  mode: 'words' | 'sentences' | 'quotes' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  targetCount?: number;
}): { promptText: string; wordsList: string[]; displayFont: string } {
  const { language, mode, difficulty, targetCount = 30 } = options;

  let dataset: DifficultyDataset;
  let displayFont = 'sans-serif';

  if (language === 'english') {
    dataset = ENGLISH_DATA[difficulty];
    displayFont = "'Inter', system-ui, sans-serif";
  } else if (language === 'nepali_preeti') {
    dataset = getPreetiDataset(difficulty);
    displayFont = "'Font_preeti', 'Preeti', sans-serif";
  } else {
    dataset = NEPALI_DATA[difficulty];
    displayFont = "'Font_kokila', 'Mukta', 'Kalimati', sans-serif";
  }

  let wordsList: string[] = [];

  if (mode === 'words') {
    const pool = [...dataset.words];
    while (wordsList.length < targetCount) {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      wordsList.push(...shuffled);
    }
    wordsList = wordsList.slice(0, targetCount);
  } else if (mode === 'sentences') {
    const sentences = [...dataset.sentences].sort(() => 0.5 - Math.random());
    const combined = sentences.join(' ');
    wordsList = combined.split(/\s+/).filter(Boolean);
    if (wordsList.length > targetCount * 1.5) {
      wordsList = wordsList.slice(0, Math.max(targetCount, 35));
    }
  } else if (mode === 'quotes') {
    const quotes = [...dataset.quotes].sort(() => 0.5 - Math.random());
    const combined = quotes.join(' ');
    wordsList = combined.split(/\s+/).filter(Boolean);
    if (wordsList.length > targetCount * 1.5) {
      wordsList = wordsList.slice(0, Math.max(targetCount, 35));
    }
  } else if (mode === 'special') {
    const pool = [...dataset.special, ...dataset.words.slice(0, 15)];
    while (wordsList.length < targetCount) {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      wordsList.push(...shuffled);
    }
    wordsList = wordsList.slice(0, targetCount);
  }

  return {
    promptText: wordsList.join(' '),
    wordsList,
    displayFont
  };
}
