/**
 * Nepali Typing PRO — Complete Client Application
 * Self-contained, robust, works on all browsers without bundler issues
 */

(function () {
  'use strict';

  // --- 1. DATASETS ---
  const DATA = {
    nepali: {
      easy: {
        words: [
          'घर', 'माया', 'साथी', 'पानी', 'चिया', 'गाउँ', 'शहर', 'हिमाल', 'खोला', 'रुख',
          'पात', 'फूल', 'घाम', 'जून', 'तारा', 'सपना', 'आकाश', 'माटो', 'दिन', 'रात',
          'बिहान', 'साँझ', 'हाँसो', 'खुसी', 'आँखा', 'मन', 'गीत', 'नाच', 'रङ', 'बाटो',
          'किताब', 'कलम', 'कापी', 'खाना', 'मिठो', 'दही', 'दूध', 'रोटी', 'दाल', 'भात',
          'आमा', 'बाबा', 'दाइ', 'दिदी', 'भाइ', 'बहिनी', 'काठमाडौँ', 'पोखरा', 'धरान', 'इलाम',
          'नेपाल', 'नेपाली', 'हाम्रो', 'तिम्रो', 'मेरो', 'यहाँ', 'त्यहाँ', 'सबै', 'राम्रो', 'सुन्दर'
        ],
        sentences: [
          'बिहानको एक कप तातो चियाले मन नै प्रफुल्ल बनाउँछ।',
          'नेपाल प्रकृतिको अनुपम वरदान पाएको एउटा सुन्दर देश हो।',
          'साथीभाइसँग बसेर गफगाफ गर्नुको मज्जा नै बेग्लै हुन्छ।',
          'आफ्नो गाउँ र प्रकृतिको काखमा बिताएका पलहरू सधैँ अविस्मरणीय रहन्छन्।',
          'मिहिनेत र धैर्यता नै जीवनमा सफलता हासिल गर्ने मूल मन्त्र हुन्।',
          'सधैँ सकारात्मक सोच राखौँ र अरूको भलो चिताऔँ।'
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
          'मित्रता', 'इमानदारी', 'परिश्रम', 'उत्साह', 'प्रेरणा', 'सहानुभूति', 'एकता', 'स्वाभिमान', 'पहिचान'
        ],
        sentences: [
          'पोखराको फेवातालमा माछापुच्छ्रेको छायाँ नाचेको दृश्यले हरकसैलाई मन्त्रमुग्ध बनाउँछ।',
          'दसैँ र तिहारको आगमनसँगै गाउँघरमा पिङ खेल्ने र रमाइलो गर्ने उल्लास छाउँछ।',
          'सूचना प्रविधिको विकासले आज संसारलाई एउटा सानो विश्वग्राममा रूपान्तरण गरिदिएको छ।',
          'साहित्य समाजको ऐना हो, जसले मानिसका गहिरा भावना र सपनाहरूलाई अभिव्यक्त गर्छ।',
          'कफी सपमा बसेर साथीहरूसँग नयाँ आइडिया र स्टार्टअपका बारेमा छलफल गर्नु युवाहरूको संस्कृति बनेको छ।'
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
          'रूपान्तरण', 'सहानुभूतिमूलक', 'दूरगामी', 'संवर्धन', 'प्रतिबद्धता', 'सङ्गीतमय', 'अनुसन्धान', 'बौद्धिक', 'अविस्मरणीय'
        ],
        sentences: [
          'महाकवि देवकोटाको "मुनामदन" केवल खण्डकाव्य मात्र नभएर नेपाली समाजको गहिरो सामाजिक यथार्थ र मानवीय वेदनाको अमर गाथा हो।',
          'पारिजातको "शिरीषको फूल" ले नेपाली आख्यान जगतमा अस्तित्ववादी र विसङ्गतिवादी चिन्तनको एउटा नयाँ युगको सूत्रपात गरेको थियो।',
          'कला र साहित्यको मूल उद्देश्य मानवीय संवेदनालाई परिष्कृत गर्दै समाजमा प्रेम, न्याय र करुणाको ज्योति फैलाउनु हो।',
          'सङ्घर्ष र चुनौतीहरूबाट नभागी धैर्य र सृजनशीलताका साथ अघि बढ्ने व्यक्तिले नै इतिहासमा आफ्नो अमिट छाप छोड्न सक्छ।'
        ],
        quotes: [
          'के नेपाल सानो छ? विशाल छ, विराट छ, यो त विश्वको मुटु हो जहाँ सगरमाथाले आकाश छुन्छ। — लक्ष्मीप्रसाद देवकोटा',
          'समय कसैको लागि पर्खँदैन, बगेको खोला र बितेको समय कहिल्यै फर्किएर आउँदैन।',
          'अगुल्टोले हानेको कुकुर बिजुली चम्कँदा तर्सन्छ, विगतका अनुभवले मानिसलाई सतर्क र परिपक्व बनाउँछ।'
        ],
        special: [
          'कृति: "दोषी चश्मा" (कथा संग्रह) — लेखक: बी.पी. कोइराला [वि.सं. २००६]',
          'तापक्रम: -५°C देखि २५°C सम्म (उच्च हिमाली भेग, ४,२०० मि.)',
          'अनुपात: [φ = (१ + √५) / २ ≈ १.६१८] — सुनौलो अनुपात (Golden Ratio)'
        ]
      }
    },
    english: {
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
          'Walking beneath the green canopy of the forest fills the heart with pure calm.'
        ],
        quotes: [
          'The journey of a thousand miles begins with a single step. — Lao Tzu',
          'In the middle of difficulty lies opportunity. — Albert Einstein',
          'Simplicity is the ultimate sophistication. — Leonardo da Vinci'
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
          'Mastering touch typing transforms your keyboard from an obstacle into a direct extension of your thoughts.'
        ],
        quotes: [
          'Not all those who wander are lost. — J.R.R. Tolkien',
          'We do not see things as they are, we see them as we are. — Anaïs Nin',
          'The only true wisdom is in knowing you know nothing. — Socrates'
        ],
        special: [
          'Latitude: 27°42\'N, Longitude: 85°19\'E (Kathmandu Valley)',
          'API endpoint: https://typing.topnepali.com/api/v1/ping [200 OK]'
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
          'Cultivating effortless keystroke rhythm requires harmonizing sensory feedback, cognitive muscle memory, and disciplined breathing.'
        ],
        quotes: [
          'Two things awe me most: the starry sky above me and the moral law within me. — Immanuel Kant',
          'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. — Ralph Waldo Emerson'
        ],
        special: [
          'Formula: E = mc² | Limits: lim_{x -> ∞} (1 + 1/x)^x = e ≈ 2.71828',
          'Unicode range: [U+0900 - U+097F] Devanagari Script Specification'
        ]
      }
    }
  };

  // --- 2. PREETI CONVERTER ---
  const PREETI_MAP = [
    ["❨", "-"], ["❩", "_"], ["‘", "…"], ["?", "<"], ["ॐ", "ç"], ["ऽ", "˜"], ["।", "."],
    ["०", ")"], ["१", "!"], ["२", "@"], ["३", "#"], ["४", "$"], ["५", "%"], ["६", "^"], ["७", "&"], ["८", "*"], ["९", "("],
    ["फ्र", "k|m"], ["झ", "em"], ["फ", "km"], ["क्त", "Qm"], ["क्र", "qm"], ["ज्ञ्", "¡"], ["द्घ", "¢"], ["ज्ञ", "1"], ["द्द", "2"], ["द्ध", "4"],
    ["श्र", ">"], ["रु", "?"], ["द्य", "B"], ["क्ष्", "I"], ["क्ष", "If"], ["त्त", "Q"], ["द्म", "ß"], ["त्र", "q"], ["ध्र", "„"], ["ङ्घ", "‹"],
    ["ड्ड", "•"], ["द्र", "›"], ["ट्ट", "§"], ["ड्ढ", "°"], ["ठ्ठ", "¶"], ["रू", "¿"], ["हृ", "Å"], ["ङ्ग", "Ë"], ["ङ्क", "Í"], ["ङ्ख", "Î"],
    ["ट्ठ", "Ý"], ["द्व", "å"], ["ट्र", "6«"], ["ठ्र", "7«"], ["ड्र", "8«"], ["ढ्र", "9«"], ["्र", "|"],
    ["क्", "S"], ["क", "s"], ["ख्", "V"], ["ख", "v"], ["ग्", "U"], ["ग", "u"], ["घ्", "£"], ["घ", "3"], ["ङ", "ª"],
    ["च्", "R"], ["च", "r"], ["छ", "5"], ["ज्", "H"], ["ज", "h"], ["झ्", "‰"], ["झ", "´"], ["ञ्", "~"], ["ञ", "`"],
    ["ट", "6"], ["ठ", "7"], ["ड", "8"], ["ढ", "9"], ["ण्", "0"], ["ण", "0f"],
    ["त्", "T"], ["त", "t"], ["थ्", "Y"], ["थ", "y"], ["द", "b"], ["ध्", "W"], ["ध", "w"], ["न्", "G"], ["न", "g"],
    ["प्", "K"], ["प", "k"], ["फ्", "ˆ"], ["ब्", "A"], ["ब", "a"], ["भ्", "E"], ["भ", "e"], ["म्", "D"], ["म", "d"],
    ["य", "o"], ["र", "/"], ["ल्", "N"], ["ल", "n"], ["व्", "J"], ["व", "j"], ["श्", "Z"], ["श", "z"], ["ष्", "i"], ["ष", "if"],
    ["स्", ":"], ["स", ";"], ["ह्", "X"], ["ह", "x"],
    ["औ", "cf}"], ["ओ", "cf]"], ["आ", "cf"], ["अ", "c"], ["ई", "O{"], ["इ", "O"], ["ऊ", "pm"], ["उ", "p"], ["ऋ", "C"], ["ऐ", "P]"], ["ए", "P"],
    ["ू", "\""], ["ु", "'"], ["ं", "+"], ["ा", "f"], ["ृ", "["], ["्", "\\"], ["े", "]"], ["ै", "}"], ["ँ", "F"], ["ी", "L"], ["ः", "M"]
  ];

  function toPreeti(text) {
    if (!text) return '';
    let s = text;
    s = s.replace(/((?:.्)*.)ि/g, "l$1");
    s = s.replace(/र्((?:.्)*.)/g, "$1{");
    for (let i = 0; i < PREETI_MAP.length; i++) {
      s = s.replaceAll(PREETI_MAP[i][0], PREETI_MAP[i][1]);
    }
    return s;
  }

  // --- 3. HARDWARE KEYBOARD MATRIX ---
  const KEY_ROWS = [
    // Row 1
    [
      { code: 'Backquote', key: '`', eng: ['`', '~'], uni: ['ञ', '॥'], rom: ['`', '~'], pre: ['`', 'ञ'], flex: '1' },
      { code: 'Digit1', key: '1', eng: ['1', '!'], uni: ['१', 'ज्ञ'], rom: ['१', '!'], pre: ['1', 'ज्ञ'], flex: '1' },
      { code: 'Digit2', key: '2', eng: ['2', '@'], uni: ['२', 'ई'], rom: ['२', '@'], pre: ['2', 'द्द'], flex: '1' },
      { code: 'Digit3', key: '3', eng: ['3', '#'], uni: ['३', 'घ'], rom: ['३', '#'], pre: ['3', 'घ'], flex: '1' },
      { code: 'Digit4', key: '4', eng: ['4', '$'], uni: ['४', 'द्ध'], rom: ['४', '$'], pre: ['4', 'द्ध'], flex: '1' },
      { code: 'Digit5', key: '5', eng: ['5', '%'], uni: ['५', 'छ'], rom: ['५', '%'], pre: ['5', 'छ'], flex: '1' },
      { code: 'Digit6', key: '6', eng: ['6', '^'], uni: ['६', 'ट'], rom: ['६', '^'], pre: ['6', 'ट'], flex: '1' },
      { code: 'Digit7', key: '7', eng: ['7', '&'], uni: ['७', 'ठ'], rom: ['७', '&'], pre: ['7', 'ठ'], flex: '1' },
      { code: 'Digit8', key: '8', eng: ['8', '*'], uni: ['८', 'ड'], rom: ['८', '*'], pre: ['8', 'ड'], flex: '1' },
      { code: 'Digit9', key: '9', eng: ['9', '('], uni: ['९', 'ढ'], rom: ['९', '('], pre: ['9', 'ढ'], flex: '1' },
      { code: 'Digit0', key: '0', eng: ['0', ')'], uni: ['०', 'ण'], rom: ['०', ')'], pre: ['0', 'ण'], flex: '1' },
      { code: 'Minus', key: '-', eng: ['-', '_'], uni: ['औ', 'ओ'], rom: ['-', '_'], pre: ['-', '('], flex: '1' },
      { code: 'Equal', key: '=', eng: ['=', '+'], uni: ['‍', '‌'], rom: ['=', '+'], pre: ['.', '.'], flex: '1' },
      { code: 'Backspace', key: 'Backspace', flex: '2', special: true, label: 'Backspace ⌫' }
    ],
    // Row 2
    [
      { code: 'Tab', key: 'Tab', flex: '1.5', special: true, label: 'Tab ⇥' },
      { code: 'KeyQ', key: 'q', eng: ['q', 'Q'], uni: ['त्र', 'त्त'], rom: ['ौ', 'ऒ'], pre: ['q', 'त्र'], flex: '1' },
      { code: 'KeyW', key: 'w', eng: ['w', 'W'], uni: ['ध', 'ध्'], rom: ['ो', 'ऒ'], pre: ['w', 'ध'], flex: '1' },
      { code: 'KeyE', key: 'e', eng: ['e', 'E'], uni: ['भ', 'भ्'], rom: ['े', 'ऐ'], pre: ['e', 'भ'], flex: '1' },
      { code: 'KeyR', key: 'r', eng: ['r', 'R'], uni: ['च', 'च्'], rom: ['र', 'ऋ'], pre: ['r', 'च'], flex: '1' },
      { code: 'KeyT', key: 't', eng: ['t', 'T'], uni: ['त', 'त्'], rom: ['त', 'ट'], pre: ['t', 'त'], flex: '1' },
      { code: 'KeyY', key: 'y', eng: ['y', 'Y'], uni: ['थ', 'थ्'], rom: ['य', 'ञ'], pre: ['y', 'थ'], flex: '1' },
      { code: 'KeyU', key: 'u', eng: ['u', 'U'], uni: ['ग', 'ग्'], rom: ['ु', 'ू'], pre: ['u', 'ग'], flex: '1' },
      { code: 'KeyI', key: 'i', eng: ['i', 'I'], uni: ['ष', 'क्ष्'], rom: ['ि', 'ी'], pre: ['i', 'ष'], flex: '1' },
      { code: 'KeyO', key: 'o', eng: ['o', 'O'], uni: ['य', 'इ'], rom: ['ओ', 'ऒ'], pre: ['o', 'य'], flex: '1' },
      { code: 'KeyP', key: 'p', eng: ['p', 'P'], uni: ['उ', 'ए'], rom: ['प', 'फ'], pre: ['p', 'उ'], flex: '1' },
      { code: 'BracketLeft', key: '[', eng: ['[', '{'], uni: ['र्', 'ृ'], rom: ['[', '{'], pre: ['[', 'ृ'], flex: '1' },
      { code: 'BracketRight', key: ']', eng: [']', '}'], uni: ['े', 'ै'], rom: [']', '}'], pre: [']', 'े'], flex: '1' },
      { code: 'Backslash', key: '\\', eng: ['\\', '|'], uni: ['्', 'ं'], rom: ['्र', 'ृ'], pre: ['\\', '्'], flex: '1.5' }
    ],
    // Row 3
    [
      { code: 'CapsLock', key: 'CapsLock', flex: '1.75', special: true, label: 'Caps ⇪' },
      { code: 'KeyA', key: 'a', eng: ['a', 'A'], uni: ['ब', 'ब्'], rom: ['ा', 'आ'], pre: ['a', 'ब'], flex: '1' },
      { code: 'KeyS', key: 's', eng: ['s', 'S'], uni: ['क', 'क्'], rom: ['स', 'श'], pre: ['s', 'क'], flex: '1' },
      { code: 'KeyD', key: 'd', eng: ['d', 'D'], uni: ['म', 'म्'], rom: ['द', 'ड'], pre: ['d', 'म'], flex: '1' },
      { code: 'KeyF', key: 'f', eng: ['f', 'F'], uni: ['ा', 'ँ'], rom: ['फ', 'ँ'], pre: ['f', 'ा'], flex: '1' },
      { code: 'KeyG', key: 'g', eng: ['g', 'G'], uni: ['न', 'न्'], rom: ['ग', 'घ'], pre: ['g', 'न'], flex: '1' },
      { code: 'KeyH', key: 'h', eng: ['h', 'H'], uni: ['ज', 'ज्'], rom: ['ह', 'ः'], pre: ['h', 'ज'], flex: '1' },
      { code: 'KeyJ', key: 'j', eng: ['j', 'J'], uni: ['व', 'व्'], rom: ['ज', 'झ'], pre: ['j', 'व'], flex: '1' },
      { code: 'KeyK', key: 'k', eng: ['k', 'K'], uni: ['प', 'फ्'], rom: ['क', 'ख'], pre: ['k', 'प'], flex: '1' },
      { code: 'KeyL', key: 'l', eng: ['l', 'L'], uni: ['ि', 'ी'], rom: ['ल', 'ळ'], pre: ['l', 'ि'], flex: '1' },
      { code: 'Semicolon', key: ';', eng: [';', ':'], uni: ['स', 'स्'], rom: [';', ':'], pre: [';', 'स'], flex: '1' },
      { code: 'Quote', key: '\'', eng: ['\'', '"'], uni: ['ु', 'ू'], rom: ['\'', '"'], pre: ['\'', 'ु'], flex: '1' },
      { code: 'Enter', key: 'Enter', flex: '2.25', special: true, label: 'Enter ↵' }
    ],
    // Row 4
    [
      { code: 'ShiftLeft', key: 'Shift', flex: '2.25', special: true, label: 'Shift ⇧' },
      { code: 'KeyZ', key: 'z', eng: ['z', 'Z'], uni: ['श', 'श्'], rom: ['श', 'ष'], pre: ['z', 'श'], flex: '1' },
      { code: 'KeyX', key: 'x', eng: ['x', 'X'], uni: ['ह', 'ह्'], rom: ['क्ष', 'ज्ञ'], pre: ['x', 'ह'], flex: '1' },
      { code: 'KeyC', key: 'c', eng: ['c', 'C'], uni: ['अ', 'ऋ'], rom: ['च', 'छ'], pre: ['c', 'अ'], flex: '1' },
      { code: 'KeyV', key: 'v', eng: ['v', 'V'], uni: ['ख', 'ख्'], rom: ['व', 'ॐ'], pre: ['v', 'ख'], flex: '1' },
      { code: 'KeyB', key: 'b', eng: ['b', 'B'], uni: ['द', 'द्य'], rom: ['ब', 'भ'], pre: ['b', 'द'], flex: '1' },
      { code: 'KeyN', key: 'n', eng: ['n', 'N'], uni: ['ल', 'ल्'], rom: ['न', 'ण'], pre: ['n', 'ल'], flex: '1' },
      { code: 'KeyM', key: 'm', eng: ['m', 'M'], uni: ['ः', 'ड्ड'], rom: ['म', 'ङ'], pre: ['m', 'फ'], flex: '1' },
      { code: 'Comma', key: ',', eng: [',', '<'], uni: ['ऽ', 'ङ'], rom: [',', 'ङ'], pre: [',', ','], flex: '1' },
      { code: 'Period', key: '.', eng: ['.', '>'], uni: ['।', 'श्र'], rom: ['।', '॥'], pre: ['.', '।'], flex: '1' },
      { code: 'Slash', key: '/', eng: ['/', '?'], uni: ['र', 'रु'], rom: ['्', '?'], pre: ['/', 'र'], flex: '1' },
      { code: 'ShiftRight', key: 'Shift', flex: '2.75', special: true, label: 'Shift ⇧' }
    ],
    // Row 5
    [
      { code: 'Space', key: ' ', flex: '8', special: true, label: 'Space Bar' }
    ]
  ];

  const KEY_CODE_MAP = {};
  KEY_ROWS.forEach(row => {
    row.forEach(k => {
      if (k.code) KEY_CODE_MAP[k.code] = k;
    });
  });

  // --- 4. APP STATE ---
  let state = {
    lang: 'nepali_unicode',
    mode: 'time',
    duration: 60,
    wordCount: 25,
    difficulty: 'medium',
    words: [],
    wordIdx: 0,
    charIdx: 0,
    isRunning: false,
    isFinished: false,
    startTime: 0,
    timer: null,
    secsLeft: 60,
    sound: true,
    isShift: false,
    logs: [],
    activeKey: '-'
  };

  // Audio Context
  let audioCtx = null;
  function playBeep(freq, type, dur, gainVal) {
    if (!state.sound) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }

  // --- 5. RENDER WORDS ON SCREEN ---
  function getWordsPool() {
    const isEng = state.lang === 'english';
    const langObj = isEng ? DATA.english : DATA.nepali;
    const diffObj = langObj[state.difficulty] || langObj.medium;

    let pool = [];
    if (state.mode === 'words') pool = diffObj.words;
    else if (state.mode === 'sentences') pool = diffObj.sentences.join(' ').split(/\s+/);
    else if (state.mode === 'quotes') pool = diffObj.quotes.join(' ').split(/\s+/);
    else pool = diffObj.special.join(' ').split(/\s+/);

    if (state.lang === 'nepali_preeti') {
      pool = pool.map(w => toPreeti(w));
    }

    // Shuffle and pick target count
    const target = state.mode === 'words' ? state.wordCount : 40;
    const result = [];
    while (result.length < target) {
      const sh = [...pool].sort(() => 0.5 - Math.random());
      result.push(...sh);
    }
    return result.slice(0, target);
  }

  function setupTest() {
    clearInterval(state.timer);
    state.isRunning = false;
    state.isFinished = false;
    state.wordIdx = 0;
    state.charIdx = 0;
    state.logs = [];
    state.secsLeft = state.duration;

    const timerDisp = document.getElementById('live-timer-display');
    const progDisp = document.getElementById('live-progress-display');
    const wpmDisp = document.getElementById('live-wpm-display');
    const accDisp = document.getElementById('live-acc-display');
    const inputField = document.getElementById('typing-input');

    if (timerDisp) timerDisp.textContent = state.mode === 'time' ? `${state.secsLeft}` : '0s';
    if (progDisp) progDisp.textContent = `0 / ${state.wordCount} words`;
    if (wpmDisp) wpmDisp.textContent = '0';
    if (accDisp) accDisp.textContent = '100%';
    if (inputField) {
      inputField.value = '';
      if (state.lang === 'nepali_preeti') {
        inputField.style.fontFamily = "'Font_preeti', 'Preeti', sans-serif";
        inputField.placeholder = "यहाँ टाइप गर्नुहोस्... (Preeti layout, Space थिच्नुहोस्)";
      } else if (state.lang === 'english') {
        inputField.style.fontFamily = "'Inter', sans-serif";
        inputField.placeholder = "Type here... (Press Space for next word)";
      } else if (state.lang === 'nepali_romanized') {
        inputField.style.fontFamily = "'Font_kokila', 'Mukta', 'Kalimati', sans-serif";
        inputField.placeholder = "यहाँ टाइप गर्नुहोस्... (Romanized phonetic layout, Space थिच्नुहोस्)";
      } else {
        inputField.style.fontFamily = "'Font_kokila', 'Mukta', 'Kalimati', sans-serif";
        inputField.placeholder = "यहाँ टाइप गर्नुहोस्... (Traditional Unicode layout, Space थिच्नुहोस्)";
      }
      inputField.focus();
    }

    state.words = getWordsPool();

    const container = document.getElementById('words-container');
    if (container) {
      container.innerHTML = '';
      if (state.lang === 'nepali_preeti') {
        container.style.fontFamily = "'Font_preeti', 'Preeti', sans-serif";
      } else if (state.lang === 'english') {
        container.style.fontFamily = "'Inter', sans-serif";
      } else {
        container.style.fontFamily = "'Font_kokila', 'Mukta', 'Kalimati', sans-serif";
      }

      state.words.forEach((w, wI) => {
        const wSpan = document.createElement('span');
        wSpan.className = 'word-node' + (wI === 0 ? ' is-active-word' : '');
        wSpan.dataset.wordIndex = `${wI}`;

        Array.from(w).forEach((ch, cI) => {
          const cSpan = document.createElement('span');
          cSpan.className = 'char-node';
          cSpan.dataset.charIndex = `${cI}`;
          cSpan.textContent = ch;
          wSpan.appendChild(cSpan);
        });

        container.appendChild(wSpan);
      });
      container.scrollTop = 0;
    }

    renderKeyboard();
    highlightTargetKey();
    updateCaret();
  }

  // --- 6. CARET POSITION ---
  function updateCaret() {
    const caret = document.getElementById('typing-caret');
    const container = document.getElementById('words-container');
    if (!caret || !container) return;

    const curWordEl = container.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
    if (!curWordEl) {
      caret.classList.add('hidden');
      return;
    }

    caret.classList.remove('hidden');
    const curCharEl = curWordEl.querySelector(`.char-node[data-char-index="${state.charIdx}"]`);
    const cRect = container.getBoundingClientRect();

    if (curCharEl) {
      const r = curCharEl.getBoundingClientRect();
      caret.style.left = `${r.left - cRect.left}px`;
      caret.style.top = `${r.top - cRect.top + 4}px`;
    } else {
      const lastEl = curWordEl.lastElementChild;
      if (lastEl) {
        const r = lastEl.getBoundingClientRect();
        caret.style.left = `${r.right - cRect.left}px`;
        caret.style.top = `${r.top - cRect.top + 4}px`;
      }
    }

    if (curWordEl) {
      const wRect = curWordEl.getBoundingClientRect();
      if (wRect.top - cRect.top > 80) {
        container.scrollTop += 45;
      }
    }
  }

  // --- 7. KEYBOARD VISUALIZER RENDER ---
  function renderKeyboard() {
    KEY_ROWS.forEach((row, rI) => {
      const rowEl = document.querySelector(`.kb-row[data-row="${rI + 1}"]`);
      if (!rowEl) return;
      rowEl.innerHTML = '';

      row.forEach(k => {
        const keyDiv = document.createElement('div');
        keyDiv.className = `keycap ${k.special ? 'special-key' : ''}`;
        keyDiv.dataset.code = k.code;
        keyDiv.style.flex = `${k.flex} 1 0%`;

        if (k.special) {
          keyDiv.textContent = k.label || k.key;
        } else {
          let topLbl = '';
          let mainLbl = '';
          let fontFam = 'var(--font-sans)';

          if (state.lang === 'english') {
            topLbl = k.eng[1] !== k.eng[0].toUpperCase() ? k.eng[1] : '';
            mainLbl = state.isShift ? k.eng[1] : k.eng[0];
          } else if (state.lang === 'nepali_unicode') {
            topLbl = k.uni[1];
            mainLbl = state.isShift ? k.uni[1] : k.uni[0];
            fontFam = 'var(--font-nepali)';
          } else if (state.lang === 'nepali_romanized') {
            topLbl = k.rom[1];
            mainLbl = state.isShift ? k.rom[1] : k.rom[0];
            fontFam = 'var(--font-nepali)';
          } else if (state.lang === 'nepali_preeti') {
            topLbl = k.pre[1];
            mainLbl = state.isShift ? k.eng[1] : k.pre[0];
            fontFam = 'var(--font-preeti)';
          }

          const topSpan = document.createElement('span');
          topSpan.className = 'keycap-shift-label';
          topSpan.textContent = topLbl;

          const mainSpan = document.createElement('span');
          mainSpan.className = 'keycap-main-label';
          mainSpan.style.fontFamily = fontFam;
          mainSpan.textContent = mainLbl;

          keyDiv.appendChild(topSpan);
          keyDiv.appendChild(mainSpan);
        }

        rowEl.appendChild(keyDiv);
      });
    });

    const titleEl = document.getElementById('kb-current-layout-name');
    const pillEl = document.getElementById('kb-layout-pill');
    const titles = {
      english: 'English QWERTY Layout',
      nepali_unicode: 'नेपाली युनिकोड (Traditional) Keyboard Layout',
      nepali_romanized: 'नेपाली युनिकोड (Romanized) Phonetic Layout',
      nepali_preeti: 'Preeti (ASCII Typewriter) Layout'
    };
    const pills = {
      english: 'QWERTY',
      nepali_unicode: 'MPP TRADITIONAL',
      nepali_romanized: 'PHONETIC QWERTY',
      nepali_preeti: 'PREETI TYPEWRITER'
    };
    if (titleEl) titleEl.textContent = titles[state.lang] || '';
    if (pillEl) pillEl.textContent = pills[state.lang] || '';
  }

  function highlightTargetKey() {
    document.querySelectorAll('.keycap.is-target').forEach(el => el.classList.remove('is-target'));
    const curWord = state.words[state.wordIdx];
    if (!curWord) return;

    const chars = Array.from(curWord);
    let targetCh = '';
    if (state.charIdx < chars.length) {
      targetCh = chars[state.charIdx];
    } else {
      targetCh = ' ';
    }

    const targetDisp = document.getElementById('kb-target-char');
    if (targetDisp) targetDisp.textContent = targetCh === ' ' ? '␣ Space' : targetCh;

    if (targetCh === ' ') {
      document.querySelector('.keycap[data-code="Space"]')?.classList.add('is-target');
      return;
    }

    // Find key with targetCh
    for (let r = 0; r < KEY_ROWS.length; r++) {
      for (let k = 0; k < KEY_ROWS[r].length; k++) {
        const item = KEY_ROWS[r][k];
        if (item.special) continue;
        let match = false;
        if (state.lang === 'english' && (item.eng[0] === targetCh || item.eng[1] === targetCh)) match = true;
        if (state.lang === 'nepali_unicode' && (item.uni[0] === targetCh || item.uni[1] === targetCh)) match = true;
        if (state.lang === 'nepali_romanized' && (item.rom[0] === targetCh || item.rom[1] === targetCh)) match = true;
        if (state.lang === 'nepali_preeti' && (item.pre[0] === targetCh || item.pre[1] === targetCh)) match = true;

        if (match) {
          document.querySelector(`.keycap[data-code="${item.code}"]`)?.classList.add('is-target');
          return;
        }
      }
    }
  }

  // --- 8. TEST TIMER & FINISH LOGIC ---
  function startTimer() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.startTime = performance.now();

    state.timer = setInterval(() => {
      if (state.mode === 'time') {
        state.secsLeft--;
        const tDisp = document.getElementById('live-timer-display');
        if (tDisp) tDisp.textContent = `${state.secsLeft}`;
        if (state.secsLeft <= 0) {
          finishTest();
        }
      } else {
        const elap = Math.floor((performance.now() - state.startTime) / 1000);
        const tDisp = document.getElementById('live-timer-display');
        if (tDisp) tDisp.textContent = `${elap}s`;
      }
      updateLiveStats();
    }, 1000);
  }

  function updateLiveStats() {
    if (!state.isRunning || state.logs.length === 0) return;
    const elapsed = Math.max(1, (performance.now() - state.startTime) / 1000);
    const correct = state.logs.filter(l => l.ok).length;
    const wpm = Math.round((correct / 5) / (elapsed / 60));
    const acc = Math.round((correct / state.logs.length) * 100);

    const wpmDisp = document.getElementById('live-wpm-display');
    const accDisp = document.getElementById('live-acc-display');
    const progDisp = document.getElementById('live-progress-display');

    if (wpmDisp) wpmDisp.textContent = `${wpm}`;
    if (accDisp) accDisp.textContent = `${acc}%`;
    if (progDisp) progDisp.textContent = `${state.wordIdx} / ${state.words.length} words`;
  }

  function finishTest() {
    if (state.isFinished) return;
    clearInterval(state.timer);
    state.isRunning = false;
    state.isFinished = true;
    playBeep(880, 'triangle', 0.5, 0.15);

    const elapsed = Math.max(1, (performance.now() - state.startTime) / 1000);
    const correct = state.logs.filter(l => l.ok).length;
    const total = state.logs.length;
    const netWpm = Math.max(0, Math.round((correct / 5) / (elapsed / 60)));
    const rawWpm = Math.round((total / 5) / (elapsed / 60));
    const acc = total > 0 ? Math.round((correct / total) * 1000) / 10 : 100;
    const cpm = Math.round(correct / (elapsed / 60));

    // Typist Ranking
    let rank = '🌱 Intermediate';
    let feedback = 'नियमित अभ्यासले गति र आत्मविश्वास बढ्दै जान्छ।';
    if (netWpm >= 50 && acc >= 95) {
      rank = '🚀 Speed Demon';
      feedback = 'अविश्वसनीय गति! तपाईं प्रो स्तरको टाइपिस्ट हुनुहुन्छ।';
    } else if (netWpm >= 40 && acc >= 90) {
      rank = '⚡ Master Typist';
      feedback = 'उत्कृष्ट गति र शुद्धता! व्यावसायिक स्तरको लेखन क्षमता।';
    } else if (netWpm >= 30 && acc >= 88) {
      rank = '🎯 Proficient';
      feedback = 'धेरै राम्रो गति! दैनिक काम र साहित्य लेखनका लागि उपयुक्त।';
    } else if (netWpm < 20) {
      rank = '🐣 Learner';
      feedback = 'हतार नगरी शुद्धतामा ध्यान दिनुहोस्, गति आफैँ बढ्दै जानेछ।';
    }

    // Populate Modal
    const mNet = document.getElementById('modal-net-wpm');
    const mAcc = document.getElementById('modal-accuracy');
    const mRaw = document.getElementById('modal-raw-wpm');
    const mCpm = document.getElementById('modal-cpm');
    const mRankPill = document.getElementById('modal-rank-pill');
    const mRankLbl = document.getElementById('modal-rank-label');
    const mRankFeed = document.getElementById('modal-rank-feedback');
    const mCorrect = document.getElementById('modal-strokes-correct');
    const mError = document.getElementById('modal-strokes-error');

    if (mNet) mNet.textContent = `${netWpm}`;
    if (mAcc) mAcc.textContent = `${acc}%`;
    if (mRaw) mRaw.textContent = `${rawWpm}`;
    if (mCpm) mCpm.textContent = `${cpm} CPM`;
    if (mRankPill) mRankPill.textContent = rank;
    if (mRankLbl) mRankLbl.textContent = rank;
    if (mRankFeed) mRankFeed.textContent = feedback;
    if (mCorrect) mCorrect.textContent = `${correct}`;
    if (mError) mError.textContent = `${total - correct}`;

    document.getElementById('stats-modal')?.classList.add('is-open');

    // Save record
    try {
      const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
      hist.unshift({
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        layout: state.lang,
        wpm: netWpm,
        acc: acc,
        duration: Math.round(elapsed)
      });
      localStorage.setItem('nepali_typing_history', JSON.stringify(hist.slice(0, 50)));
    } catch (e) {}
  }

  // --- 9. INPUT & KEY EVENT HANDLING ---
  function bindInputEvents() {
    const inputField = document.getElementById('typing-input');
    const workbench = document.getElementById('typing-workbench');

    workbench?.addEventListener('click', () => {
      inputField?.focus();
      document.getElementById('focus-overlay')?.classList.add('opacity-0', 'pointer-events-none');
    });

    inputField?.addEventListener('focus', () => {
      workbench?.classList.add('is-active');
      document.getElementById('focus-overlay')?.classList.add('opacity-0', 'pointer-events-none');
    });

    inputField?.addEventListener('blur', () => {
      workbench?.classList.remove('is-active');
      if (!state.isRunning) {
        document.getElementById('focus-overlay')?.classList.remove('opacity-0', 'pointer-events-none');
      }
    });

    inputField?.addEventListener('keydown', (e) => {
      // PREVENT SPACE SCROLLING THE ENTIRE BROWSER WINDOW!
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();

        if (state.isFinished) return;
        if (!state.isRunning) startTimer();
        playBeep(450, 'sine', 0.05, 0.08);

        // Advance to next word
        const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
        if (curWordEl) curWordEl.classList.remove('is-active-word');

        state.wordIdx++;
        state.charIdx = 0;
        inputField.value = '';

        if (state.mode === 'words' && state.wordIdx >= state.wordCount) {
          finishTest();
          return;
        }

        if (state.wordIdx >= state.words.length) {
          finishTest();
          return;
        }

        const nextWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
        if (nextWordEl) nextWordEl.classList.add('is-active-word');

        updateCaret();
        highlightTargetKey();
        return;
      }

      // Backspace handling
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (state.charIdx > 0) {
          state.charIdx--;
          inputField.value = Array.from(inputField.value).slice(0, -1).join('');
          const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
          const extraEl = curWordEl?.querySelector('.char-node.is-extra:last-child');
          if (extraEl) {
            extraEl.remove();
          } else {
            const charEl = curWordEl?.querySelector(`.char-node[data-char-index="${state.charIdx}"]`);
            if (charEl) charEl.className = 'char-node';
          }
          if (state.logs.length > 0) state.logs.pop();
          updateCaret();
          highlightTargetKey();
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        setupTest();
        return;
      }

      if (e.key === 'Escape') {
        document.getElementById('stats-modal')?.classList.remove('is-open');
        document.getElementById('history-modal')?.classList.remove('is-open');
        setupTest();
        return;
      }

      // Normal single keypress
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (state.isFinished) return;
        if (!state.isRunning) startTimer();

        const curWord = state.words[state.wordIdx];
        if (!curWord) return;

        const chars = Array.from(curWord);
        const expectedCh = chars[state.charIdx] || '';
        let typedCh = e.key;

        // Intelligent Hardware Key Mapping when typing on physical US QWERTY keyboard
        const isAscii = e.key.charCodeAt(0) < 128;
        if (state.lang === 'nepali_unicode' && isAscii) {
          const matched = KEY_CODE_MAP[e.code];
          if (matched && matched.uni) {
            typedCh = (e.shiftKey || state.isShift) ? matched.uni[1] : matched.uni[0];
            e.preventDefault();
            inputField.value += typedCh;
          }
        } else if (state.lang === 'nepali_romanized' && isAscii) {
          const matched = KEY_CODE_MAP[e.code];
          if (matched && matched.rom) {
            typedCh = (e.shiftKey || state.isShift) ? matched.rom[1] : matched.rom[0];
            e.preventDefault();
            inputField.value += typedCh;
          }
        }

        // Handle typing past the end of the word
        if (state.charIdx >= chars.length) {
          playBeep(160, 'sawtooth', 0.1, 0.1);
          state.logs.push({
            time: performance.now(),
            ok: false,
            expected: ' ',
            typed: typedCh
          });
          const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
          if (curWordEl) {
            const extraSpan = document.createElement('span');
            extraSpan.className = 'char-node is-error is-extra';
            extraSpan.textContent = typedCh;
            curWordEl.appendChild(extraSpan);
          }
          state.charIdx++;
          updateCaret();
          return;
        }

        const isOk = (typedCh === expectedCh);
        if (isOk) {
          playBeep(480, 'sine', 0.05, 0.08);
        } else {
          playBeep(160, 'sawtooth', 0.1, 0.1);
        }

        state.logs.push({
          time: performance.now(),
          ok: isOk,
          expected: expectedCh,
          typed: typedCh
        });

        const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
        const charEl = curWordEl?.querySelector(`.char-node[data-char-index="${state.charIdx}"]`);
        if (charEl) {
          charEl.className = isOk ? 'char-node is-correct' : 'char-node is-error';
        }

        state.charIdx++;
        updateCaret();
        highlightTargetKey();
      }
    });

    // Hardware Keyboard Visualizer sync on window
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') {
        state.isShift = true;
        renderKeyboard();
      }
      const kc = document.querySelector(`.keycap[data-code="${e.code}"]`);
      if (kc) kc.classList.add('is-pressed');

      const activeDisp = document.getElementById('kb-active-char');
      if (activeDisp) activeDisp.textContent = e.key === ' ' ? 'Space' : e.key;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') {
        state.isShift = false;
        renderKeyboard();
      }
      const kc = document.querySelector(`.keycap[data-code="${e.code}"]`);
      if (kc) kc.classList.remove('is-pressed');
    });
  }

  // --- 10. TOOLBAR & BUTTON LISTENERS ---
  function bindToolbarEvents() {
    // Language Tabs
    document.querySelectorAll('.lang-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.lang-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.lang = btn.dataset.lang;
        setupTest();
      });
    });

    // Mode Tabs
    document.querySelectorAll('.mode-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mode = btn.dataset.mode;

        const timeOpts = document.getElementById('time-options');
        const wordsOpts = document.getElementById('words-options');
        if (timeOpts) timeOpts.classList.toggle('hidden', state.mode !== 'time');
        if (wordsOpts) wordsOpts.classList.toggle('hidden', state.mode !== 'words');

        setupTest();
      });
    });

    // Time Buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.duration = parseInt(btn.dataset.seconds, 10);
        setupTest();
      });
    });

    // Word Count Buttons
    document.querySelectorAll('.word-count-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.word-count-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.wordCount = parseInt(btn.dataset.words, 10);
        setupTest();
      });
    });

    // Difficulty Buttons
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.difficulty = btn.dataset.diff;
        setupTest();
      });
    });

    // Restart buttons
    document.getElementById('manual-restart-btn')?.addEventListener('click', setupTest);
    document.getElementById('restart-from-modal-btn')?.addEventListener('click', () => {
      document.getElementById('stats-modal')?.classList.remove('is-open');
      setupTest();
    });
    document.getElementById('close-modal-btn')?.addEventListener('click', () => {
      document.getElementById('stats-modal')?.classList.remove('is-open');
    });

    // Quick Quotes Button in Header
    document.getElementById('quick-quotes-btn')?.addEventListener('click', () => {
      state.lang = 'nepali_unicode';
      state.mode = 'quotes';
      state.difficulty = 'medium';

      document.querySelectorAll('.lang-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === 'nepali_unicode'));
      document.querySelectorAll('.mode-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === 'quotes'));
      setupTest();
    });

    // Sound toggle
    document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
      state.sound = !state.sound;
      document.getElementById('sound-icon-on')?.classList.toggle('hidden', !state.sound);
      document.getElementById('sound-icon-off')?.classList.toggle('hidden', state.sound);
    });

    // Toggle Keyboard
    document.getElementById('toggle-keyboard-btn')?.addEventListener('click', () => {
      const kb = document.getElementById('keyboard-visualizer-container');
      if (kb) {
        const isH = kb.classList.contains('hidden');
        kb.classList.toggle('hidden', !isH);
        const txt = document.getElementById('toggle-keyboard-text');
        if (txt) txt.textContent = isH ? 'Hide Keys' : 'Keyboard';
      }
    });

    // Toggle Shift on Keyboard Visualizer
    document.getElementById('kb-shift-toggle')?.addEventListener('click', () => {
      state.isShift = !state.isShift;
      const ind = document.getElementById('kb-shift-indicator');
      if (ind) ind.className = state.isShift ? 'w-2 h-2 rounded-full bg-red-500 inline-block' : 'w-2 h-2 rounded-full bg-neutral-400 inline-block';
      renderKeyboard();
    });

    // History Modal
    document.getElementById('open-history-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('history-modal');
      const table = document.getElementById('history-table-body');
      const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
      if (table) {
        if (hist.length === 0) {
          table.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-muted">No test records yet.</td></tr>';
        } else {
          table.innerHTML = hist.map(r => `
            <tr>
              <td class="p-2.5 font-mono">${r.date}</td>
              <td class="p-2.5 uppercase font-medium">${r.layout.replace('nepali_', '')}</td>
              <td class="p-2.5">${r.duration}s</td>
              <td class="p-2.5 font-bold font-mono text-red-500">${r.wpm} WPM</td>
              <td class="p-2.5 font-mono text-emerald-500">${r.acc}%</td>
            </tr>
          `).join('');
        }
      }
      modal?.classList.add('is-open');
    });

    document.getElementById('close-history-btn')?.addEventListener('click', () => {
      document.getElementById('history-modal')?.classList.remove('is-open');
    });

    document.getElementById('clear-history-btn')?.addEventListener('click', () => {
      if (confirm('Clear all history records?')) {
        localStorage.removeItem('nepali_typing_history');
        document.getElementById('open-history-btn')?.click();
      }
    });
  }

  // --- INITIALIZE ON DOM READY ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindInputEvents();
      bindToolbarEvents();
      setupTest();
    });
  } else {
    bindInputEvents();
    bindToolbarEvents();
    setupTest();
  }

})();
