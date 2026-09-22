/**
 * Comprehensive Multi-Layout Typing Test Dataset
 * Contains 100s of verified words, authentic sentences, numbers, and special characters
 * categorized across Easy, Medium, and Hard difficulties for English, Nepali Unicode, and Preeti ASCII.
 */

import { unicodeToPreeti } from './preeti-converter';

export interface DifficultyDataset {
  words: string[];
  sentences: string[];
  special: string[];
}

export interface LanguageData {
  easy: DifficultyDataset;
  medium: DifficultyDataset;
  hard: DifficultyDataset;
}

// ==========================================
// 1. NEPALI UNICODE (DEVANAGARI) DATASET
// ==========================================
export const NEPALI_DATA: LanguageData = {
  easy: {
    words: [
      'घर', 'वन', 'मन', 'जल', 'कल', 'फल', 'हल', 'कमल', 'सरल', 'महल',
      'समय', 'शहर', 'सडक', 'नदी', 'आमा', 'बाबा', 'दाइ', 'दिदी', 'भाइ', 'बहिनी',
      'खाना', 'पानी', 'हावा', 'घाम', 'दिन', 'रात', 'गाउँ', 'बाटो', 'हात', 'खुट्टा',
      'आँखा', 'नाक', 'कान', 'मुख', 'रुख', 'पात', 'फूल', 'माटो', 'ढुङ्गा', 'चरा',
      'गाई', 'बाख्रा', 'कुकुर', 'बिरालो', 'घोडा', 'माछा', 'किताब', 'कलम', 'कापी', 'विद्यालय',
      'साथी', 'माया', 'खुसी', 'शान्ति', 'गीत', 'नाच', 'चित्र', 'रङ', 'कपडा', 'जुत्ता',
      'बिहान', 'दिउँसो', 'साँझ', 'वर्ष', 'महिना', 'हप्ता', 'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार',
      'काठमाडौँ', 'पोखरा', 'धरान', 'बुटवल', 'झापा', 'इलाम', 'पाल्पा', 'हेटौँडा', 'नेपाल', 'नेपाली',
      'हाम्रो', 'तिम्रो', 'मेरो', 'उनी', 'हामी', 'तिमी', 'तपाईं', 'यहाँ', 'त्यहाँ', 'कहाँ'
    ],
    sentences: [
      'नेपाल एउटा सुन्दर र शान्त देश हो।',
      'सगरमाथा संसारको सबैभन्दा अग्लो शिखर हो।',
      'हामी सबै नेपाली मिलेर बस्नुपर्छ।',
      'बिहानको घाम स्वास्थ्यका लागि धेरै राम्रो हुन्छ।',
      'किताब पढ्नाले ज्ञान र बुद्धि बढ्छ।',
      'आफ्नो गाउँ र समाजलाई सफा राख्नुपर्छ।',
      'गुरु र आमाबुबाको सधैँ आदर सम्मान गर्नुपर्छ।',
      'समय निकै अमूल्य छ, यसको सदुपयोग गरौँ।',
      'सत्य बोल्नु र असल काम गर्नु जीवनको धर्म हो।',
      'रूख रोपौँ, वातावरण सफा र हरियाली बनाऔँ।'
    ],
    special: [
      '१२३', '४५६', '७८९', '१०', '२०', '५०', '१००', '५००', '१०००',
      'घर-आँगन', 'दिन-रात', 'सफा-सुग्घर', 'सुख-दुःख', 'आमा-बुबा', 'भाइ-बहिनी',
      'क, ख, ग, घ', '१. नेपाल', '२. भाषा', '३. संस्कृति'
    ]
  },
  medium: {
    words: [
      'संस्कृति', 'इतिहास', 'प्रकृति', 'सभ्यता', 'हिमाल', 'पहाड', 'तराई', 'पर्यटन', 'वातावरण', 'प्रणाली',
      'अर्थतन्त्र', 'व्यापार', 'उद्योग', 'कृषि', 'सिँचाइ', 'जलविद्युत', 'यातायात', 'सञ्चार', 'प्रविधि', 'विकास',
      'नागरिक', 'अधिकार', 'कर्तव्य', 'कानुन', 'न्याय', 'अदालत', 'प्रशासन', 'सुरक्षा', 'शान्ति', 'प्रहरी',
      'विद्यार्थी', 'शिक्षक', 'अस्पताल', 'डाक्टर', 'औषधि', 'उपचार', 'स्वास्थ्य', 'पोषण', 'सरसफाइ', 'पुस्तकालय',
      'साहित्य', 'कविता', 'कथा', 'उपन्यास', 'नाटक', 'संगीत', 'चलचित्र', 'खेलकुद', 'फुटबल', 'क्रिकेट',
      'राष्ट्रिय', 'सार्वजनिक', 'सम्पत्ति', 'संरक्षण', 'संवर्धन', 'सद्भाव', 'एकता', 'स्वाभिमान', 'स्वतन्त्रता', 'समानता',
      'उत्पादन', 'रोजगारी', 'परिश्रम', 'इमानदारी', 'नैतिकता', 'सहानुभूति', 'सहयोग', 'सद्भावना', 'नेतृत्व', 'सफलता',
      'निर्णय', 'योजना', 'परियोजना', 'अनुसन्धान', 'अध्ययन', 'अवलोकन', 'मूल्यांकन', 'प्रगति', 'उन्नति', 'समृद्धि'
    ],
    sentences: [
      'नेपाल प्राकृतिक स्रोत र जैविक विविधताले भरिपूर्ण एक सुन्दर भूपरिवेष्ठित राष्ट्र हो।',
      'लोकतन्त्रको सुदृढीकरणका लागि सचेत र जिम्मेवार नागरिकको भूमिका अपरिहार्य हुन्छ।',
      'जलस्रोतको समुचित विकास गरी देशलाई आर्थिक रूपमा आत्मनिर्भर बनाउन सकिन्छ।',
      'सूचना प्रविधिको सही उपयोगले प्रशासनिक सेवा प्रवाहलाई छिटो, छरितो र पारदर्शी बनाउँछ।',
      'गुणस्तरीय शिक्षा र सुलभ स्वास्थ्य सेवा प्रत्येक नागरिकको मौलिक अधिकार हो।',
      'हाम्रो मौलिक कला, संस्कृति र सम्पदाको संरक्षण गर्नु हामी सबैको साझा दायित्व हो।',
      'इमानदारी र कडा परिश्रम नै कुनै पनि राष्ट्रको समग्र विकास र प्रगतिको मूल आधार हो।',
      'कृषि क्षेत्रको आधुनिकीकरण र व्यवसायीकरणले देशको रोजगारी र उत्पादनमा उल्लेखनीय वृद्धि गर्छ।'
    ],
    special: [
      'नेपालको क्षेत्रफल १,४७,५१६ वर्ग किलोमिटर छ।',
      'काठमाडौँ (बागमती प्रदेश) — नेपालको संघीय राजधानी।',
      'दूरसञ्चार प्राधिकरण: फोन नं. ०१-५३५५९०० / इमेल: info@nta.gov.np',
      'वार्षिक बजेट: रु. १८,६०,३०,००,०००/- (२०८१/०८२)',
      'प्रतिशत दर: १२.५% देखि १८.७५% सम्म।'
    ]
  },
  hard: {
    words: [
      'संविधानसभा', 'सार्वभौमसत्ता', 'धर्मनिरपेक्षता', 'सङ्घीयता', 'अन्तर्राष्ट्रिय', 'प्रजातन्त्र', 'लोकतन्त्र', 'उत्तरदायित्व', 'जवाफदेहिता', 'पारदर्शिता',
      'संवैधानिक', 'न्यायपालिका', 'व्यवस्थापिका', 'कार्यपालिका', 'सर्वोच्चादालत', 'महान्यायाधिवक्ता', 'अख्तियार', 'दुरुपयोग', 'अनुसन्धान', 'पुनरावलोकन',
      'प्रत्यायोजित', 'विधायन', 'सार्वभौम', 'अखण्डता', 'राष्ट्रियता', 'आत्मनिर्णय', 'समावेशी', 'समानुपातिक', 'सङ्घीय', 'प्रादेशिक',
      'महानिर्देशक', 'उपमहानिर्देशक', 'प्रमुखसचिव', 'शाखाअधिकृत', 'कर्मचारीतन्त्र', 'सुशासन', 'सदाचार', 'निष्ठा', 'प्रतिबद्धता', 'रूपान्तरण',
      'दृष्टिकोण', 'दूरदृष्टि', 'रणनीतिक', 'कार्ययोजना', 'कार्यान्वयन', 'मूल्याङ्कन', 'प्रतिवेदन', 'विश्लेषण', 'सिंहावलोकन', 'पुनर्संरचना',
      'जैविकविविधता', 'जलवायुपरिवर्तन', 'पारिस्थितिक', 'पुनरुत्थान', 'दीगोपना', 'उद्योगधन्दा', 'औद्योगिकीकरण', 'आधुनिकीकरण', 'विश्वव्यापीकरण', 'उदारीकरण'
    ],
    sentences: [
      'नेपालको संविधानले जनतामा निहित सार्वभौमसत्ता, नागरिक स्वतन्त्रता, मौलिक अधिकार, मानव अधिकार, र विधिको शासनको प्रत्याभूति गरेको छ।',
      'सार्वजनिक प्रशासनलाई स्वच्छ, सक्षम, निष्पक्ष, पारदर्शी, भ्रष्टाचारमुक्त, जनउत्तरदायी र सहभागितामूलक बनाउँदै राज्यबाट प्राप्त हुने प्रतिफलको समन्यायिक वितरण सुनिश्चित गर्नुपर्छ।',
      'अन्तर्राष्ट्रिय सम्बन्धको सञ्चालन सार्वभौमिक समानता, अहस्तक्षेप, पारस्परिक हित र संयुक्त राष्ट्रसंघको बडापत्रका सिद्धान्तका आधारमा निर्देशित हुनेछ।',
      'वित्तीय अनुशासन, स्रोतसाधनको मितव्ययी परिचालन तथा सार्वजनिक खरिद प्रक्रियाको पारदर्शिता नै आर्थिक सुशासन र स्थायित्वका आधारशीला हुन्।',
      'जलवायु परिवर्तनका प्रतिकूल असरहरूको न्यूनीकरण र अनुकूलन क्षमता अभिवृद्धि गरी दिगो वातावरणीय सन्तुलन कायम राख्नु आजको विश्वव्यापी चुनौती हो।',
      'लोकसेवा आयोगद्वारा सञ्चालित कम्प्युटर सीप परीक्षणमा शुद्धता, गति र विन्यासको उचित संयोजनबाट मात्र उच्चतम प्राप्ताङ्क हासिल गर्न सकिन्छ।'
    ],
    special: [
      'धारा १६(१): प्रत्येक व्यक्तिलाई सम्मानपूर्वक बाँच्न पाउने हक हुनेछ; कानुन बमोजिम बाहेक कसैको ज्यान लिइने छैन।',
      'ऐनको दफा २८(क) बमोजिम रु. ५०,०००/- (अक्षरेपी पचास हजार रुपैयाँ मात्र) जरिवाना र ६ (छ) महिना कैद हुनेछ।',
      'मिति: २०८१/०५/१५ गते (आइतबार), समय: बिहान ११:०० बजेदेखि दिउँसो २:३० बजेसम्म।',
      'सूचकहरू: [GDP = C + I + G + (X - M)]; मुद्रास्फीति दर ≤ ५.२% कायम राख्ने लक्ष्य।'
    ]
  }
};

// ==========================================
// 2. ENGLISH QWERTY DATASET
// ==========================================
export const ENGLISH_DATA: LanguageData = {
  easy: {
    words: [
      'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'pack', 'my',
      'box', 'with', 'five', 'dozen', 'liquor', 'jugs', 'bright', 'blue', 'sky', 'sun',
      'cat', 'fish', 'bird', 'tree', 'book', 'pen', 'desk', 'room', 'door', 'home',
      'time', 'year', 'hand', 'life', 'part', 'child', 'eye', 'woman', 'place', 'work',
      'week', 'case', 'point', 'city', 'water', 'road', 'river', 'stone', 'hill', 'green',
      'light', 'sound', 'wind', 'star', 'night', 'apple', 'bread', 'milk', 'rain', 'fire'
    ],
    sentences: [
      'The quick brown fox jumps over the lazy dog.',
      'A warm breeze whispered softly through the quiet autumn forest.',
      'Practice makes a person confident, swift, and steady.',
      'The morning sun brings a fresh start to every new day.',
      'Books are windows opening to vast worlds of imagination.',
      'Kind words can warm three cold winter months.',
      'Keep your eyes on the stars and your feet on the ground.'
    ],
    special: [
      '1, 2, 3, 4, 5, 6, 7, 8, 9, 10',
      'cats & dogs; bread & butter; day & night.',
      'Price: $45.00 | Qty: 12 units | Total: $540.00',
      'user_name@service.org (#123)'
    ]
  },
  medium: {
    words: [
      'keyboard', 'accuracy', 'discipline', 'education', 'knowledge', 'development', 'technology', 'experience', 'creativity', 'performance',
      'efficiency', 'communication', 'sustainable', 'achievement', 'leadership', 'collaboration', 'responsibility', 'determination', 'perspective', 'environment',
      'exploration', 'opportunity', 'generation', 'application', 'organization', 'foundation', 'celebration', 'imagination', 'confidence', 'inspiration'
    ],
    sentences: [
      'Consistent daily practice is the true secret behind achieving exceptional typing speed and flawless accuracy.',
      'Modern digital technology continues to transform how communities communicate, collaborate, and innovate globally.',
      'Sustainable development balances economic progress with environmental stewardship and equitable social opportunities.',
      'Clear writing and rapid keyboard input significantly elevate personal productivity in competitive professional careers.'
    ],
    special: [
      'Section 14.2(b): Review items [A-1], [B-2], and [C-3] before deployment.',
      'Contact: support@typing.topnepali.com | Tel: +977-1-4200100',
      'Growth rate projected at 7.85% (Q3 2026 vs Q3 2025).'
    ]
  },
  hard: {
    words: [
      'constitutionality', 'characterization', 'counterproductive', 'disproportionate', 'electromechanical', 'incomprehensibility', 'internationalization', 'interdisciplinary', 'institutionalization', 'micromanagement',
      'multidimensional', 'neurodegenerative', 'oversimplification', 'philosophical', 'quintessential', 'reconnaissance', 'synchronization', 'telecommunication', 'unprecedented', 'vulnerability'
    ],
    sentences: [
      'The rapid proliferation of sophisticated algorithmic automation necessitates comprehensive regulatory oversight to preserve democratic integrity.',
      'Constitutional jurisprudence fundamentally mandates stringent adherence to procedural due process, institutional equilibrium, and statutory accountability.',
      'Quantitative empirical analysis corroborates that ergonomic keyboard configurations mitigate repetitive strain injuries while optimizing neuromuscular cadence.'
    ],
    special: [
      'REGEX pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$/i (Score: 99.4%)',
      'UUID: {e3b0c442-98fc-1c14-9afb-f4c8996fb924} | Hash: #0x89AB_CDEF_0123_4567',
      'Theorem: [f(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}]; \\forall x \\in \\mathbb{R}^+'
    ]
  }
};

// ==========================================
// 3. PREETI ASCII DATASET (LEGACY KEYBOARD)
// ==========================================
// In Preeti ASCII, characters are typed with specific Latin keys
// Here we pre-convert the authentic Nepali text using our converter
export function getPreetiDataset(difficulty: 'easy' | 'medium' | 'hard'): DifficultyDataset {
  const nepali = NEPALI_DATA[difficulty];
  return {
    words: nepali.words.map(w => unicodeToPreeti(w)),
    sentences: nepali.sentences.map(s => unicodeToPreeti(s)),
    special: nepali.special.map(sp => unicodeToPreeti(sp))
  };
}

/**
 * Returns a randomized test prompt based on user settings
 */
export function generateTestText(options: {
  language: 'english' | 'nepali_unicode' | 'nepali_romanized' | 'nepali_preeti';
  mode: 'words' | 'sentences' | 'numbers' | 'special' | 'loksewa';
  difficulty: 'easy' | 'medium' | 'hard';
  targetCount?: number;
}): { promptText: string; wordsList: string[]; displayFont: string } {
  const { language, mode, difficulty, targetCount = 30 } = options;

  let dataset: DifficultyDataset;
  let displayFont = 'sans-serif';

  if (language === 'english') {
    dataset = ENGLISH_DATA[difficulty];
    displayFont = 'Inter, system-ui, sans-serif';
  } else if (language === 'nepali_preeti') {
    dataset = getPreetiDataset(difficulty);
    displayFont = "'Font_preeti', 'Preeti', sans-serif";
  } else {
    dataset = NEPALI_DATA[difficulty];
    displayFont = "'Font_kokila', 'Kokila', 'Mukta', 'Kalimati', sans-serif";
  }

  let wordsList: string[] = [];

  if (mode === 'words') {
    const pool = [...dataset.words];
    // Shuffle pool and generate target count
    while (wordsList.length < targetCount) {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      wordsList.push(...shuffled);
    }
    wordsList = wordsList.slice(0, targetCount);
  } else if (mode === 'sentences' || mode === 'loksewa') {
    const sentences = [...dataset.sentences].sort(() => 0.5 - Math.random());
    const combined = sentences.join(' ');
    wordsList = combined.split(/\s+/).filter(Boolean);
    if (wordsList.length > targetCount * 1.5) {
      wordsList = wordsList.slice(0, Math.max(targetCount, 40));
    }
  } else if (mode === 'numbers' || mode === 'special') {
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

// Loksewa Official Speed Standards (Characters Per Minute & Words Per Minute)
export const LOKSEWA_STANDARDS = {
  examDurationSeconds: 300, // 5 Minutes standard exam
  passWpmNepali: 20,
  goodWpmNepali: 30,
  excellentWpmNepali: 40,
  passWpmEnglish: 25,
  goodWpmEnglish: 35,
  excellentWpmEnglish: 50,
  errorPenaltyPercent: 5 // Loksewa error deduction guidelines
};
