/**
 * Nepali Typing PRO — Complete Client Application Engine
 * Comprehensive Audit & Fix:
 * 1. Intl.Segmenter-based Devanagari grapheme cluster handling (no detached matras/broken ligatures).
 * 2. True wall-clock performance.now() timer (no acceleration or drift).
 * 3. Complete Preeti ASCII mapping (including o-kaar 'f]', au-kaar 'f}', conjuncts, inversions).
 * 4. Exact pixel-aligned Monkeytype caret tracking with smooth auto-scroll.
 * 5. Full Monkeytype results analytics: Net/Raw WPM, Accuracy, Consistency %, CPM, Error heatmap.
 * 6. Dynamic SVG Timeline Chart rendering Net WPM, Raw WPM, and error dots.
 * 7. Live keyboard visualizer with Shift toggle, target key highlighting, and responsive keymaps.
 * 8. Personal Best tracking and local storage history synchronization.
 * 9. Exam / Certification Test Mode featuring the historic UN General Assembly Climate Speech (Nepali, Preeti & English).
 * 10. Clean, 100% typable texts: removed untypable brackets, em-dashes, Greek symbols, and disruptive focus overlay.
 */

(function () {
  'use strict';

  // --- 1. SEGMENTER & GRAPHEME UTILITIES ---
  const neSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('ne', { granularity: 'grapheme' }) : null;
  const enSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null;

  function getGraphemes(text, lang) {
    if (!text) return [];
    if (lang === 'nepali_preeti') {
      return text.split('');
    }
    const seg = (lang === 'english' ? enSegmenter : neSegmenter);
    if (seg) {
      return [...seg.segment(text)].map(s => s.segment);
    }
    return text.split('');
  }

  // --- 2. EXAM & CERTIFICATION SPEECH DATASETS (100% TYPABLE, NO UNTYPABLE SYMBOLS) ---
  const EXAM_SPEECH_NEPALI = `श्रीमान् अध्यक्षज्यू श्रीमान् महासचिवज्यू महामहिमज्यूहरु सम्माननीय प्रतिनिधिज्यूहरु महिला तथा सज्जनवृन्द म यहाँ तपाईंहरुसामू हिमालयमा रहेको एउटा टाढाको देश नेपालका तर्फबाट मानवतालाई नजिकैदेखि दिइरहेको चेतावनी लिएर आएको छु। आज म यहाँ विकास लोकतन्त्र शान्ति र एउटा राष्ट्रको आशाबारे मात्रै बोल्न चाहन्थे। तर त्यसको सट्टा म मृत्यु र अकल्पनीय विनाशबारे बोल्छु। ती परिवारबारे जो कहिल्यै घर नफर्कने आफ्ना प्रियजनलाई पर्खिरहेका छन्। ती समुदायबारे जसले लेदो ढुंगामाटो पानीभित्र आफ्ना मानिसहरुको खोजी गरिरहेका छन् जसको शरीर अब कहिल्यै नभेटिन सक्छ। ती पुलहरु सडकहरु विद्यालयहरु घरहरु र जीविकोपार्जनका माध्यमहरु निमेषभरमै बगेर गए। एउटा देशबारे जसले दिगो विकासको लक्ष्य हासिल गर्ने दिशामा निरन्तर प्रगति गरिरहेको थियो त्यसमा अवरोध पुगेको छ। चार साताअघि विश्वले नेपालको हिमाली समुदायहरुमा तीव्रताका साथ आएको विनाशकारी बाढीको भयावह दृश्य देख्यो जसलाई धेरैले हिमालयन सुनामी भनेका छन्। भोटेकोशी त्रिशूली विपद् स्थानीय त्रासदी मात्रै थिएन यो विश्वका लागि एउटा चेतावनी पनि थियो। र म आज तपाईंहरुसँग सोध्छु के हामीले साँच्चै त्यो चेतावनी सुनेका छौँ। करिब तीन वर्षअघि संयुक्त राष्ट्रसंघका महासचिवले हाम्रो सगरमाथा क्षेत्रमा उभिएर नजिकिँदै गरेको जलवायु विपत्तिको भयावह अवस्थाबारे मानवतालाई चेतावनी दिनुभएको थियो। विश्वको छानोबाट आएको त्यो चित्कार बुलन्द रुपमा सुनिएन। हामीले नेपालमा सुन्यौं हाम्रो समुदायले सुन्यो। विश्वभरका वैज्ञानिकहरुले सुने। उनीहरुले प्रमाणसहित त्यसलाई दोहोर्याइरहे। तर हामी विश्वका राजनीतिक नेतृत्वहरुले त्यो चेतावनीलाई जोखिममा रहेका मानिसहरुको आवश्यकताअनुसार तीव्र गतिमा कार्यान्वयनमा बदल्न बेवास्ता गर्यौँ। त्यसको दुःखद् परिणाम हामीले गत महिना भोग्यौँ। तातिँदै गरेको जलवायुले नाजुक हिमालयको पारिस्थितिक प्रणालीलाई अस्थिर बनाएको छ। हिउँले जमेको माटो पग्लिँदा हिमालको भिरालो भूभागमा चिरा परेका छन्। हिमचट्टानसहितको पहिरो बाढीलगायत शृंखलाबद्ध जोखिमहरु बढिरहेका छन्। परिणामस्वरुप यस विनाशले नेपाल चीन सीमाका दुवै भूभागमा ठूलो क्षति पुर्यायो। बाढी निरन्तर भारततिर बग्दै गयो। यसले हामीलाई एउटा आधारभूत कुरा बताउँछ। जलवायु परिवर्तनले सीमा चिन्दैन। हिमनदी र बाढी पासपोर्टमा भिसा लगाएर यात्रा गर्दैनन्। महामहिमज्यूहरु म यहाँ गुनासो गर्न होइन केही सुझाव साझा गर्न आएको हुँ। सर्वप्रथम विपत्तिपछि नेपाललाई सहयोग गर्न आउने सबैप्रति गहिरो कृतज्ञता व्यक्त गर्दछु। हाम्रा छिमेकी मुलुकहरु भारत र चीनले तत्कालै र खुला हृदयका साथ सहयोग गरे। अन्य मित्रराष्ट्रहरु संयुक्त राष्ट्रसंघीय प्रणाली मानवीय सहायता प्रदायक संस्थाहरु परोपकारी संस्थाहरु तथा विश्वभरका मानिस नेपालसँगै उभिनुभयो। म उहाँहरु सबैलाई नेपालका कृतज्ञ जनताका तर्फबाट धन्यवाद भन्न चाहन्छु। नेपाल अहिले पुनःस्थापना र पुनर्निर्माणको विशाल कार्यको सामना गरेको छ। कम्तीमा चौध सय जनाको मृत्यु भएको पुष्टि भइसकेको छ भने छ हजारभन्दा बढी मानिस अझै बेपत्ता हुनुहुन्छ। हाम्रो द्रुत क्षति आकलनअनुसार अब भौतिक पुनःस्थापनाका लागि नेपालको कुल गार्हस्थ उत्पादन जिडिपीको दश प्रतिशत आवश्यक छ। सन् दुई हजार पन्ध्र मा नेपालमा गएको गोरखा भूकम्पपछिको पुनर्निर्माणमा जस्तै यसपटक पनि हामी तपाईंहरुको ऐक्यबद्धता र सहयोगको अपेक्षा गर्छौँ। तर यो विपद् नेपाल बाहेकका लागि पनि किन अर्थपूर्ण छ भन्ने हामीले बुझ्नुपर्छ। विश्वव्यापी हरितगृह ग्यास उत्सर्जनमा नेपालको योगदान शून्य दशमलव एक प्रतिशतभन्दा कम छ। यो संकट हामीले सिर्जना गरेका होइनौँ। तर यसको ठूलो मूल्य हामीले चुकाइरहेका छौँ। हाम्रा हिमनदी खुम्चिँदै गएका छन्। हाम्रा हिमालका भिराला भूभागहरु अस्थिर बन्दै गएका छन्। हाम्रा नदीहरु पूर्वानुमान गर्न नसकिने अवस्थामा पुगेका छन्। प्रत्येक ठूला विपद्ले हामीले वर्षौँ लगाएर निर्माण गरेका विकासका पूर्वाधारहरुलाई ध्वस्त बनाउने चेतावनी दिइरहेका छन्। नेपालका लागि जलवायु विपद् मानवीय घटना मात्रै होइन विकासको संकट पनि हो। यसले सडकहरु पुलहरु विद्यालयहरु घरहरु खेतीयोग्य जमिन र जीविकोपार्जनका माध्यमलाई क्षति पुर्याउँछ। यसले गरिब देशले गरेको नगन्य गल्तीबाट भएको क्षतिको भरपाइका लागि ठूलो ऋण लिन बाध्य बनाउँछ। हामी कुनै देश वा महादेशलाई दोष दिन यहाँ आएका होइनौँ। हामी जलवायु परिवर्तनलाई अर्को भूराजनीतिक युद्धभूमिमा परिणत गर्न पनि यहाँ आएका होइनौँ। हामी यहाँ सबैलाई आफ्नो जिम्मेवारी र ऐक्यबद्धतामा पुनःप्रतिबद्ध हुन आग्रह गर्न आएका हौँ। जलवायु परिवर्तनसम्बन्धी संयुक्त राष्ट्रसंघीय प्रारूप महासन्धिमार्फत अन्तर्राष्ट्रिय समुदायले साझा तर फरक फरक जिम्मेवारी तथा आ आफ्नो क्षमताको सिद्धान्तमा पहिले नै सहमति जनाइसकेको छ। जसले ऐतिहासिक रुपमा समस्यामा बढी योगदान गरेका छन् र जोसँग प्रतिक्रिया जनाउने बढी क्षमता छ उनीहरुले बढी गर्नुपर्छ। जलवायु न्याय संयुक्त राष्ट्रसंघको दस्तावेजमा सुन्दर वाक्यमा मात्र सीमित हुनुहुँदैन। हाम्रो देशका मानिसहरुलाई बारम्बार विगतको पुनर्निर्माणमा संलग्न गराइनुको साटो आफ्नो भविष्य बनाउने अवसर दिइनुपर्छ। महामहिमज्यूहरु हिन्दूकुश हिमालय करिब दुई अर्ब मानिसको घर हो। यी पर्वतहरुले नेपालभन्दा धेरै परसम्म रहेका जनसंख्यालाई पानी पारिस्थितिक प्रणाली कृषि र जीविकोपार्जन प्रदान गर्छन्। हिमालय पृथ्वीको छेउमा रहेको भूभाग मात्रै होइन यो पृथ्वीको जीवन सहयोग प्रणालीको महत्वपूर्ण हिस्सा पनि हो। त्यसैले पहिलो आकस्मिक कदमका रुपमा नेपाल भारत र चीनको नेतृत्वमा हिमालय जलवायु उत्थानशीलता संयन्त्र स्थापना गर्न हामी प्रस्ताव गर्छौँ। यस संयन्त्रमार्फत हामी भू उपग्रहसम्बन्धी तथ्यांक र विशेषज्ञता साझा गरौँ। जोखिमयुक्त हिमतालहरुको अनुगमन गरौँ। संयुक्त पूर्वसूचना प्रणालीलाई सुदृढ बनाऔँ। र जब विपद् आउँछ सीमापार सहयोगलाई समन्वय गरौँ। हिमालयलाई छरिएका सूचनाभन्दा अन्तर्राष्ट्रिय सहयोगको एउटा प्रयोगशाला बनाऔँ। नेपाल एउटा अतिकम विकसित देश भएर पनि आफ्नो पारिस्थितिक हिस्साभन्दा धैरे ठूलो वैश्विक भूमिका निर्वाह गरिरहेको छ। हामीले आफ्नो भूभागको करिब आधा हिस्सा ढाक्ने गरी वन क्षेत्र विस्तार गरेका छौँ। आफ्ना स्वच्छ ऊर्जाको आवश्यकता पूरा गर्न र बाहिरबाट आएको प्रदूषणको स्रोतलाई विस्थापित गर्न तीव्रगतिमा जलविद्युत् आयोजनाहरु विकास गरिरहेका छौँ। युरोपका केही भूभागसँग तुलना गर्न मिल्ने दरमा विद्युतीय सवारीसाधनहरुको प्रयोगलाई प्रवर्द्धन गरिरहेका छौँ। स्थानीय तहमा जलवायु अनुकूलनलाई सुदृढ बनाइरहेका छौँ। दोहोरिरहने जलवायु विपद्को सामना गर्न अझ बढी कदम चाल्नेछौँ। तर नेपाल एक्लैले विश्वव्यापी शासन व्यवस्थाको असफलताबाट सिर्जित संकटविरुद्ध उत्थानशीलता निर्माण गर्न सक्दैन। त्यसैले यस महासभाले यी छ शब्दलाई ध्यान दिनुपर्छ। राहत पुनःस्थापना पुनर्निर्माण र त्यसैगरी जिम्मेवारी क्षतिपूर्ति उत्थानशीलता। पहिला तीनवटा विपद्पछि हामीलाई आवश्यक पर्छन्। पछिल्ला तीनवटा विपद्लाई स्थायी अवस्थाका रुपमा परिणत हुन नदिन हामीलाई आवश्यक पर्छन्। जब जलवायुजन्य विपद्ले गरिब देशको पूर्वाधार नष्ट गर्छ त्यसको उत्तर अर्को ठूलो ऋण वा टुक्रे अनुदान मात्र हुन सक्दैन। हामीलाई विश्वबाट अनुदानमा आधारित पर्याप्त सहयोग आवश्यक छ। क्षति तथा नोक्सानी कोष विश्वव्यापी वातावरणीय सुविधा र अन्य सम्बन्धित वित्तीय संयन्त्रहरु अझै अपर्याप्त छन्। जलवायु वित्त यस्तो कर्मचारीतन्त्रको जाल बन्नु हुँदैन जसबाट कमजोर देशहरुले आफूलाई आवश्यक सहयोगका लागि वर्षौंसम्म प्रमाणित गर्नुपरोस्। जब घरमा आगो लाग्छ तब हामी परिवारलाई पचास वटा फाराम भर्न लगाउँदैनौँ। हामी काम गर्छौँ। जलवायु न्यायको अर्थ पनि यही हुनुपर्छ। महामहिमज्यूहरु यसले मलाई एउटा ठूलो प्रश्नतर्फ जोड्छ। हामी कस्तो अन्तर्राष्ट्रिय व्यवस्था चाहन्छौँ। संयुक्त राष्ट्रसंघ मानवताले भोगेको भयावह विश्वयुद्धको अनुभवबाट जन्मिएको हो। यसको वाचा सार्वभौमिकता महत्वपूर्ण हुन्छ भन्ने थियो। अन्तर्राष्ट्रिय कानुन महत्वपूर्ण हुनेछ। हरेक मानवको गरिमा महत्वपूर्ण हुनेछ। कमजोरहरुले शक्तिशालीहरुले जे निर्णय गर्छन् त्यो मात्र स्वीकार गर्नुपर्ने छैन। आज त्यो अन्तर्राष्ट्रिय प्रणाली दबाबमा छ। धेरै पटक सैन्य र आर्थिक शक्तिले कसको आवाज सुनिन्छ भन्ने निर्धारण गर्छ। नेपाल निष्पक्ष विश्वव्यापी आर्थिक व्यवस्थामा विश्वास गर्छ। सन् उन्नाइस सय चौरान्नब्बे मा संयुक्त राष्ट्रसंघीय विकास कार्यक्रमको मानव विकास प्रतिवेदनले मानवीय असुरक्षाको अवधारणा अघि सारेको थियो। यसले सुरक्षालाई भूभागभन्दा मानिससँग र हतियारभन्दा विकाससँग जोडेको थियो। यसले डर र अभावबाट स्वतन्त्रता सुनिश्चित गर्न शान्तिको लाभांश प्रयोग गर्न आह्वान गरेको थियो। गत मार्चमा नेपालमा इतिहासकै सबैभन्दा निष्पक्ष र शान्तिपूर्ण निर्वाचन भयो। त्यसबाट निर्वाचित बहुमतको सरकारले त्यसयता धेरै अन्तर्राष्ट्रिय प्रतिकूलताको सामना गर्नुपरेको छ। जब नेपालका एक गरिब किसानले यस मनसुनमा आफ्नो खेतमा बीउ छर्न खोज्नुभयो समयमै मल पाउनुभएन। जब राजमार्गमा कालोपत्र गर्न खोज्यौँ बिटुमिन पाएनौँ। जब परिवारले साँझको खाना पकाउन खोज्यो त्यसबेला खाना पकाउने इन्धन भएन। एकातिर हिमनदीहरु पग्लिरहेका छन् र बाली उत्पादन घटिरहेको छ बिना चेतावनी बाढी आइरहेको छ। अर्कोतिर विश्वव्यापी आपूर्ति शृंखलाले गरिब मानिसलाई उनीहरुको आफ्नो नियन्त्रणभन्दा बाहिरका कारणका लागि सजाय दिइरहेको छ। अन्तरमहादेशीय क्षेप्यास्त्रहरु समयमै पुग्छन्। राइफल र गोलीगठ्ठा सबै अवरोधहरु तोड्दै समयमै सीमा पार गर्छन्। तर नेपालका एक किसानले आवश्यकता परेको समयमा बजार मूल्यमा मल वा इन्धन खरिद गर्न सक्नुहुन्न। हामीले यस्तो संसार बनाएका छौँ जहाँ युद्धका लागि आवश्यक सामान आपूर्ति गर्न सजिलो छ तर खाद्यान्नका लागि निकै कठिन छ। यो नेपालको मात्रै दुर्भाग्य होइन। बंगलादेशलाई सोध्नुहोस्। भुटानलाई सोध्नुहोस्। भारतलाई सोध्नुहोस्। माल्दिभ्सलाई सोध्नुहोस्। पाकिस्तानलाई सोध्नुहोस्। श्रीलंकालाई सोध्नुहोस्। हाम्रो क्षेत्रका अन्य कुनै पनि देशलाई सोध्नुहोस्। तपाईंले उस्तै जवाफ पाउनुहुनेछ हामीले नतताएको जलवायुबाट प्रभावित र सुरु नगरेका युद्धबाट फेरि प्रभावित। यसले हामीलाई वर्तमान विश्वव्यापी सहकार्यको व्यवस्थामा देखिएको भन्दा धैरे कुरा बिग्रिएको छ भन्ने स्पष्ट पार्छ। महामहिमज्यूहरु मलाई भनिएको छ म यो वर्ष यस महासभालाई सम्बोधन गर्ने सबैभन्दा कान्छो सरकार प्रमुख हुँ। तर मैले यहाँ यसलाई मुख्य कथा बनाउन आएको होइन। यहाँ यस मञ्चबाट जे जति कुरा भनिए पनि म एउटा कुरा स्पष्ट रुपमा भनियोस् भन्ने सुनिश्चित गर्न आएको हुँ। भुक्तानी गर्न तयार रहेको देशले खरिद गर्न सक्षम हुनुपर्छ र बहत्तर घण्टाभित्र संसारको जुनसुकै ठाउँमा हतियार पुर्याउन सक्ने विश्वसँग एउटा किसानलाई सम्मानजनक जीविकोपार्जनका साधनबाट वञ्चित गर्न कुनै बहाना बनाउनु हुँदैन। हामी बहुपक्षीयतामा विश्वास गरिरहन्छौँ। यसैले हामीलाई यस्तो संयुक्त राष्ट्रसंघ आवश्यक छ जहाँ साना र गरिब देशहरुको उपस्थिति महसुस होस् र हामी न्यायपूर्ण परिणामका लागि सँगै काम गर्न सकौँ। त्यसैले जलवायु न्याय पैसाको विषय मात्रै होइन। यो खर्च कसले बेहोर्छ भन्ने वितरणात्मक न्यायको विषय हो। यो कसको आवाज सुनिन्छ भन्ने प्रक्रियागत न्यायको विषय हो। साथै पर्वतीय समुदायहरु साना टापु राष्ट्रहरु भूपरिवेष्ठित तथा कम विकसित देशहरु र जन्मिन बाँकी पुस्ताहरुको भविष्यलाई समान रुपमा महत्व दिइन्छ कि दिइँदैन भन्ने विषय पनि हो। संयुक्त राष्ट्रसंघमा भोलिदेखि आयोजना हुने सगरमाथादेखि समुद्रसम्म साइड इभेन्टबाट नेपाल यो संवादको नेतृत्व गर्न सहयोग गर्न तयार छ। श्रीमान् अध्यक्षज्यू तथा महामहिमज्यूहरु हामी अहिले गहिरो विश्वव्यापी अनिश्चितताको मोडमा उभिएका छौँ। नयाँ पुस्ताको चाहना प्रतिबिम्बित गर्ने ताजा लोकतान्त्रिक जनमतका साथ यस महासभामा उपस्थित भएका छौँ। हाम्रा युवाहरुले इमानदारी र जवाफदेहिताको राजनीति माग गरेका छन्। यो पुस्तान्तरण राष्ट्रिय विषय मात्रै होइन। यो द्वन्द असमानता र न्यून अवसरविरुद्ध विश्वव्यापी जागरणको हिस्सा पनि हो। म नेतृत्वको सरकार एउटा यस्तो राज्य निर्माणमा प्रतिबद्ध छ जहाँ मर्यादित रोजगारी सामाजिक सुरक्षा र प्रत्येक नेपालीलाई आफ्नै घरमा बस्ने चाहना पूरा गर्ने अवसर प्राप्त हुनेछ। नेपालमा आएको बाढीले बढ्दो चरम मौसमी घटनाहरुबाट आकार लिने भविष्यको संकेत गर्छ। त्यसैले हामी तत्कालको उपाय छाडेर दीर्घकालीन पूर्वतयारीको दिशातर्फ अघि बढ्ने संस्कृतिको विकास गर्नुपर्छ। हामी उत्थानशीलताका लागि वित्तीय व्यवस्था र बीमा तथा नवप्रवर्तनमा लगानी गरौँ। अझ बलियो पूर्वाधार र संस्थाहरु निर्माण गरौँ। जीवाश्म इन्धनको निर्भरता घटाऔँ। चेतावनी दिने सचेत गराउने र जीवन बचाउने प्रणाली निर्माण गरौँ। कमजोरलाई सबैभन्दा कम शक्ति दिने व्यवस्थामा सुधार गरौँ। जब विश्वको छानोबाट अर्को चेतावनी आउँछ त्यो सुन्न तयार रहौँ र त्यसैअनुसार काम गर्न पनि तयार रहौँ। भगवान् पशुपतिनाथले विश्वको कल्याण गरुन्। यो विश्व बुद्धले देखाएको बाटोमा हिँड्न सकोस्। धन्यवाद नमस्ते।`;

  const EXAM_SPEECH_ENGLISH = `Mr. President Mr. Secretary-General Excellencies Distinguished delegates Ladies and gentlemen I come before you from Nepal a distant country in the Himalayas carrying a close warning for humanity. I wish I could stand here today simply to speak about development democracy peace and the hopes of a young nation. Instead I must speak about death and destruction of epic proportions. About families waiting for loved ones who will never come home. About communities searching through mud rocks and water for people whose bodies may never be recovered. About bridges roads schools homes and livelihoods swept away in minutes. And about a country whose steady progress to achieve Sustainable Development Goals has been interrupted. Four weeks ago the world saw the shocking images of the catastrophic flash floods that swept through mountain communities of Nepal with ferocity many have called a Himalayan Tsunami. The Bhotekoshi Trishuli disaster was not just a local tragedy it was a warning to the world. And I ask you today have we really heard that warning? Nearly three years ago standing in the shadow of Mount Everest the Secretary-General of the United Nations warned humanity about the madness of an impending climate disaster. That cry from the rooftop of the world was not heard loudly enough. We in Nepal heard it. Our communities heard it. Scientists around the world heard it. They repeated it with evidence. But we the political leaders of the world have been negligent to translate those warnings into action at the speed and scale that vulnerable people require. Last month we saw the tragic consequences. A warming climate is destabilizing the fragile Himalayan ecology. Melting permafrost are fracturing mountain slopes beneath the glaciers and accelerating the risks of ice-rock avalanche floods landslides and other cascading hazards. The resulting devastation unleashed havoc on both sides of the Nepal-China border. The flood continued downstream towards India. This tells us something fundamental: Climate change does not recognize borders. Glaciers and floods do not travel with a visa stamped on passports. Excellencies I am not here to complain but to share some suggestions. First I wish to express deep gratitude of Nepal to all those who came to our aid in the aftermath of the deluge. Our immediate neighbors India and China offered prompt and generous assistance. Other friendly countries the United Nations system humanitarian agencies philanthropies and people around the world stood with Nepal. To all of them I say thank you on behalf of the grateful people of Nepal. Nepal now faces a massive task of recovery and reconstruction. After at least fourteen hundred confirmed deaths and over six thousand people still missing our rapid assessments peg physical recovery needs at about ten percent of GDP. As in rebuilding after past disasters like the two thousand fifteen Gorkha earthquake we count on your solidarity and support. But we must also understand why this disaster matters beyond Nepal. Nepal contributes less than point one percent of global greenhouse-gas emissions. We did not create this crisis. Yet we are paying a colossal price for it. Our glaciers are retreating. Our mountain slopes are becoming unstable. Our rivers are becoming less predictable. And every major disaster threatens to erase years of development. For Nepal climate catastrophe is not just a humanitarian event but a development emergency. It destroys roads bridges schools homes farms and livelihoods. It destroys clean energy infrastructure that we need to fuel our future. And it forces a poor country to borrow money to repair damage it did not cause. But we are not here to blame any country or continent. We are not here to turn climate change into another geopolitical battlefield. We are here to ask everyone to recommit to shared responsibility and solidarity. Through the United Nations Framework Convention on Climate Change the international community has already agreed to the principle of common but differentiated responsibilities and respective capabilities. Those who have historically contributed more to the problem and those with greater capacity to respond must do more. Climate Justice cannot just remain a beautiful phrase in a United Nations Document. People of our country must be allowed to build their future instead of constantly rebuilding their past. Excellencies the Hindu Kush Himalaya is home to nearly two billion people. These mountains provide water ecosystems agriculture and livelihoods to populations far beyond Nepal. The Himalayas are not peripheral to the planet. They are part of the life-support system of the planet. That is why as an urgent first step we propose that we establish a Himalayan Climate Resilience Mechanism led by Nepal India and China. Through this mechanism let us share satellite data and expertise. Let us monitor dangerous glacial lakes. Let us strengthen joint early-warning systems. And when disaster strikes let us coordinate assistance across borders. Let the Himalayas become a laboratory of international cooperation rather than a frontier of fragmented information. Remarkable for a least developed country Nepal is already playing a global role exceeding its ecological share. We have restored forests to cover nearly half our territory. We are installing hydro power at a pace enough to power all our clean energy needs and displace dirty sources abroad. We are promoting electric mobility with an adoption rate to match parts of Europe. We are strengthening climate adaptation at the local level. And we shall do more to withstand increased intensity and frequency of climate disasters. But Nepal cannot build resilience alone against a crisis made worse by the failure of global governance. That is why this Assembly must note six words: Relief Rehabilitation Reconstruction. And also: Responsibility Reparation Resilience. The first three are what we need after disaster. The second three are what we need to ensure that disaster does not become a permanent condition. When a climate-driven disaster destroys the infrastructure of a poor country the answer cannot simply be another mega loan or a patchwork of small grants. We need adequate grant-based support from the world. The Loss and Damage Fund the Global Environment Facility and other relevant financing mechanisms remain grossly inadequate. Climate finance must not become a bureaucratic maze through which vulnerable countries spend years proving that they need help. When the house is burning we do not ask the family to complete fifty forms. We act. That is what climate justice must mean. Excellencies this brings me to a larger question: What kind of international order do we want? The United Nations was born from the experience of horrific World Wars. Its promise was that sovereignty would matter. International law would matter. The dignity of every human being would matter. And the weak would not simply have to accept whatever the powerful decide. Today that international system is under strain. Too often military and economic power determines whose voice is heard. Nepal believes we need a much fairer global economic order. In nineteen ninety-four UNDP Human Development Report conceptualized the notion of human insecurity. It equated security with people rather than territories and with development rather than arms. It called for the peace dividend to secure freedoms from fear and want. The new majority government in Nepal elected through the fairest and most peaceful elections in our history this March has had to weather many international adversities since. When a poor farmer in Nepal went to sow her seeds this monsoon fertilizers did not reach her on time. When we wanted to pave a new highway there was no bitumen. When a family sat down for an evening meal there was shortage of cooking fuel. On the one hand there are melting glaciers and failing harvests to floods arriving without warning. On the other a global supply chain punishes poor people for causes beyond reason. Inter-continental missiles arrive on time. Rifles and ammunition cross borders clear every bottleneck meet each deadline. But a peasant in Nepal cannot procure his fertilizer or fuel at market price at a time of need. We have built a world with flawless logistics for war and broken logistics for food. And this is not the private misfortune of Nepal. Ask Bangladesh. Ask Bhutan. Ask India. Ask the Maldives. Ask Pakistan. Ask Sri Lanka. Ask any other country in our region and you will hear the same account: hit by the climate we did not warm and hit again by the wars we did not start. This tells us there is a lot more broken than meets the eye in the present order of global cooperation. Excellencies I am told I am the youngest Head of Government to address this Assembly this year. I did not come here to make that the story. I came to make sure that whatever else is said from this podium one thing is said plainly: a country that is willing to pay should be able to buy and a world that can deliver a weapon anywhere in seventy-two hours has no excuse for leaving a farmer without means for a decent livelihood. This is why we continue to believe in multilateralism. This is why we need a United Nations in which the presence of small poor countries is felt and we can work together towards just outcomes. Climate justice is therefore not only about money. It is about distributive justice who bears the costs. It is about procedural justice who has a voice. It is about whether the future of mountain communities small island states landlocked and least-developed countries and generations yet unborn count equally. Starting tomorrow at the Sagarmatha to the Sea side-event right here at the United Nations Nepal is ready to help lead this conversation. Mr. President and Excellencies we are at this General Assembly at a moment of profound global uncertainty and with a renewed democratic mandate that reflects the aspirations of a new generation. Our youth have demanded a politics of integrity and accountability. This generational shift is not only a national story. It is part of a global awakening against conflicts inequities and lack of opportunities. The commitment of my government is clear: to build a state that delivers decent jobs social protection and a fair chance for every Nepali to thrive at home. The floods signal a future shaped by rising climate extremes. Our baselines are no longer relevant. And we must move from ad-hoc responses to a culture of preparedness. Let us finance resilience and invest in insurance and innovation. Let us build stronger infrastructure and institutions. Let us reduce fossil-fuel dependence. Let us build systems that warn alert and save lives. Let us reform the order that leaves the weakest with the least power. And when the next warning comes from the rooftop of the world: Let us be ready to hear it and ready to act. May Lord Pashupatinath bless the world. May this world walk the path shown by Buddha. Thank you Namaste.`;

  // --- 3. CLEAN REGULAR DATASETS (FREE OF UNTYPABLE SYMBOLS) ---
  const DATA = {
    nepali: {
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
          'नेपाल प्रकृतिको अनुपम वरदान पाएको एउटा सुन्दर देश हो।',
          'साथीभाइसँग बसेर गफगाफ गर्नुको मज्जा नै बेग्लै हुन्छ।',
          'आफ्नो गाउँ र प्रकृतिको काखमा बिताएका पलहरु सधैँ अविस्मरणीय रहन्छन्।',
          'मिहिनेत र धैर्यता नै जीवनमा सफलता हासिल गर्ने मूल मन्त्र हुन्।',
          'सधैँ सकारात्मक सोच राखौँ र अरूको भलो चिताऔँ।',
          'साँझपख हिमालको काखमा डुब्दै गरेको घाम हेर्न निकै मनमोहक देखिन्छ।',
          'पुस्तक पढ्ने बानीले हाम्रो सोच र दृष्टिकोणलाई फराकिलो बनाउँछ।'
        ],
        quotes: [
          'हुने बिरुवाको चिल्लो पात नहुने बिरुवाको खस्रो पात।',
          'आफू भलो त जगत भलो।',
          'घाँटी हेरी हाड निल्नु समय हेरी पाइला चाल्नु।',
          'नबोल्नेको चामल बिक्दैन बोल्नेको पिठो पनि बिक्छ।',
          'कागलाई बेल पाक्यो हर्ष न विस्मात।'
        ],
        special: [
          '१ २ ३ ४ ५ ६ ७ ८ ९ ०',
          'पहिलो दोस्रो तेस्रो चौथो पाँचौँ छैटौँ सातौँ आठौँ नवौँ दशौँ',
          'काठमाडौँ पोखरा धरान बुटवल विराटनगर',
          'चिया खाजा पानी दिन रात सुख दुःख माया प्रेम',
          'नेपाली भाषा देवनागरी लिपि र हाम्रो साझा पहिचान।'
        ]
      },
      medium: {
        words: [
          'साहित्य', 'संस्कृति', 'सभ्यता', 'प्रकृति', 'संगीत', 'सिर्जना', 'कल्पना', 'यात्रा', 'अनुभूति', 'भावना',
          'सञ्चार', 'प्रविधि', 'इन्टरनेट', 'कम्प्युटर', 'डिजिटल', 'सफ्टवेयर', 'आधुनिक', 'सिनेमा', 'नाटक', 'उपन्यास',
          'पर्यटन', 'अन्नपूर्ण', 'सगरमाथा', 'मुस्ताङ', 'मनाङ', 'राराताल', 'चितवन', 'लुम्बिनी', 'पाटन', 'भक्तपुर',
          'दसैँ', 'तिहार', 'छठ', 'होली', 'ल्होसार', 'माघी', 'इन्द्रजात्रा', 'रोधीघर', 'देउडा', 'मादल',
          'मित्रता', 'इमानदारी', 'परिश्रम', 'उत्साह', 'प्रेरणा', 'सहानुभूति', 'एकता', 'स्वाभिमान', 'पहिचान', 'सौन्दर्य',
          'जिन्दगी', 'सम्बन्ध', 'चुनौती', 'सम्भावना', 'परिवर्तन', 'विकास', 'अवसर', 'गन्तव्य', 'प्रयास', 'सफलता'
        ],
        sentences: [
          'पोखराको फेवातालमा माछापुच्छ्रेको छायाँ नाचेको दृश्यले हरकसैलाई मन्त्रमुग्ध बनाउँछ।',
          'दसैँ र तिहारको आगमनसँगै गाउँघरमा पिङ खेल्ने र रमाइलो गर्ने उल्लास छाउँछ।',
          'सूचना प्रविधिको विकासले आज संसारलाई एउटा सानो विश्वग्राममा रुपान्तरण गरिदिएको छ।',
          'साहित्य समाजको ऐना हो जसले मानिसका गहिरा भावना पीडा र सपनाहरुलाई अभिव्यक्त गर्छ।',
          'रारा तालको निलो कञ्चन पानी र वरपरका सल्लाका रुखहरुले स्वर्गको अनुभूति दिलाउँछन्।',
          'कफी सपमा बसेर साथीहरुसँग नयाँ आइडिया र स्टार्टअपका बारेमा छलफल गर्नु युवाहरुको नयाँ संस्कृति बनेको छ।'
        ],
        quotes: [
          'मानिस ठूलो दिलले हुन्छ जातले हुँदैन। महाकवि लक्ष्मीप्रसाद देवकोटा।',
          'घाँसी दरिद्र घरको तर बुद्धि कस्तो म भानुभक्त भईकन आज यस्तो। भानुभक्त आचार्य।',
          'नेपाली हामी रहूँला कहाँ नेपालै नरहे उचाइ हाम्रो कहाँ पुग्ला हिमालै नरहे। माधवप्रसाद घिमिरे।',
          'ज्ञान मर्दछ हाँसेर रोए विज्ञान मर्दछ। बालकृष्ण सम।',
          'हामी वीर छौं तर बुद्धू छौं हामी बुद्धू छौं र त वीर छौं। भूपि शेरचन।'
        ],
        special: [
          '११ १२ १३ १४ १५ १६ १७ १८ १९ २०',
          'सुन्दरीजल चिसापानी नगरकोट धुलिखेल',
          'नेपाली साहित्य कला संगीत र संस्कृति',
          'सत्यमेव जयते जननी जन्मभूमिश्च स्वर्गादपि गरीयसी।'
        ]
      },
      hard: {
        words: [
          'सौन्दर्यानुभूति', 'विश्वव्यापीकरण', 'अन्तर्राष्ट्रिय', 'दृष्टिकोण', 'काव्यात्मक', 'दार्शनिक', 'आत्मगौरव', 'सहअस्तित्व',
          'पुनर्जागरण', 'उत्तरआधुनिकता', 'नवप्रवर्तन', 'पारिस्थितिक', 'पर्यावरण', 'जैविकविविधता', 'आलोचनात्मक', 'प्रतिविम्बित',
          'रुपान्तरण', 'सहानुभूतिमूलक', 'दूरगामी', 'संवर्धन', 'प्रतिबद्धता', 'संगीतमय', 'अनुसन्धान', 'बौद्धिक', 'अविस्मरणीय',
          'अभिव्यक्ति', 'चेतनाप्रवाह', 'मनोवैज्ञानिक', 'संवेदनशील', 'अस्तित्ववादी', 'सृजनशीलता', 'कल्पनाशक्ति', 'प्रज्ञावान्'
        ],
        sentences: [
          'महाकवि देवकोटाको मुनामदन केवल खण्डकाव्य मात्र नभएर नेपाली समाजको गहिरो सामाजिक यथार्थ र मानवीय वेदनाको अमर गाथा हो।',
          'पारिजातको शिरीषको फूलले नेपाली आख्यान जगतमा अस्तित्ववादी र विसंगतिवादी चिन्तनको एउटा नयाँ युगको सूत्रपात गरेको थियो।',
          'कला र साहित्यको मूल उद्देश्य मानवीय संवेदनालाई परिष्कृत गर्दै समाजमा प्रेम न्याय र करुणाको ज्योति फैलाउनु हो।',
          'संघर्ष र चुनौतीहरुबाट नभागी धैर्य र सृजनशीलताका साथ अघि बढ्ने व्यक्तिले नै इतिहासमा आफ्नो अमिट छाप छोड्न सक्छ।'
        ],
        quotes: [
          'के नेपाल सानो छ। विशाल छ विराट छ यो त विश्वको मुटु हो जहाँ सगरमाथाले आकाश छुन्छ। महाकवि लक्ष्मीप्रसाद देवकोटा।',
          'समय कसैको लागि पर्खँदैन बगेको खोला र बितेको समय कहिल्यै फर्किएर आउँदैन।',
          'अगुल्टोले हानेको कुकुर बिजुली चम्कँदा तर्सन्छ विगतका अनुभवले मानिसलाई सतर्क र परिपक्व बनाउँछ।'
        ],
        special: [
          '२१ २२ २३ २४ २५ २६ २७ २८ २९ ३०',
          'सगरमाथा कञ्चनजंघा ल्होत्से मकालु चोयु धौलागिरी मनास्लु अन्नपूर्ण',
          'नेपालको संविधान सार्वभौमसत्ता भौगोलिक अखण्डता र स्वाधीनता।'
        ]
      }
    },
    english: {
      easy: {
        words: [
          'mountain', 'river', 'forest', 'morning', 'coffee', 'friend', 'smile', 'peace', 'journey', 'dream',
          'light', 'cloud', 'sunshine', 'music', 'story', 'window', 'nature', 'spring', 'winter', 'autumn',
          'valley', 'garden', 'ocean', 'breeze', 'star', 'planet', 'silence', 'laughter', 'simple', 'happy',
          'bridge', 'travel', 'guitar', 'flower', 'meadow', 'shadow', 'golden', 'silver', 'gentle', 'warm'
        ],
        sentences: [
          'The morning sun paints the snow-capped mountain peaks in golden hues.',
          'A warm cup of coffee and a great book make the quietest afternoons memorable.',
          'Kindness is a universal language that the deaf can hear and the blind can see.',
          'Walking beneath the green canopy of the forest fills the heart with pure calm.',
          'Every small step forward brings you closer to achieving your greatest dreams.'
        ],
        quotes: [
          'The journey of a thousand miles begins with a single step. Lao Tzu.',
          'In the middle of difficulty lies opportunity. Albert Einstein.',
          'Simplicity is the ultimate sophistication. Leonardo da Vinci.'
        ],
        special: [
          '1 2 3 4 5 6 7 8 9 0',
          'Day Night Coffee Tea Peace Harmony',
          'Elevation 8848 meters Mount Everest Sagarmatha'
        ]
      },
      medium: {
        words: [
          'creativity', 'discovery', 'innovation', 'philosophy', 'adventure', 'curiosity', 'resilience', 'reflection',
          'atmosphere', 'constellation', 'harmony', 'imagination', 'perspective', 'tranquility', 'architecture',
          'serendipity', 'wanderlust', 'compassion', 'mindfulness', 'equilibrium', 'authenticity', 'inspiration',
          'landscape', 'brilliance', 'dedication', 'enthusiasm', 'gratitude', 'renaissance', 'symbiosis'
        ],
        sentences: [
          'Travel teaches us that the world is far richer kinder and more astonishing than we ever dared to imagine.',
          'Writing by hand or typing effortlessly on a keyboard allows our deepest thoughts to flow into reality without friction.',
          'Mastering touch typing transforms your keyboard from an obstacle into a direct extension of your thoughts.',
          'Continuous deliberate practice bridges the gap between raw potential and world-class mastery.'
        ],
        quotes: [
          'Not all those who wander are lost. J.R.R. Tolkien.',
          'We do not see things as they are we see them as we are. Anais Nin.',
          'The only true wisdom is in knowing you know nothing. Socrates.'
        ],
        special: [
          '10 20 30 40 50 60 70 80 90 100',
          'Kathmandu Pokhara Lalitpur Bhaktapur Chitwan',
          'Practice makes progress patience creates mastery.'
        ]
      },
      hard: {
        words: [
          'consciousness', 'ephemeral', 'juxtaposition', 'quintessential', 'solitude', 'magnificent', 'ineffable',
          'contemplation', 'metamorphosis', 'crystallization', 'biodiversity', 'synchronicity', 'philosophical',
          'transcendence', 'kaleidoscope', 'subterranean', 'unprecedented', 'enlightenment', 'renaissance',
          'phenomenological', 'indefatigable', 'magnanimous', 'perspicacity', 'quintessence'
        ],
        sentences: [
          'The Himalayan ridgeline stands as an ancient testament to geological epochs weathering timeless winds with majestic indifference.',
          'Profound literature does not merely reflect existing reality it constructs an entirely new emotional sanctuary for the wandering soul.',
          'Cultivating effortless keystroke rhythm requires harmonizing sensory feedback cognitive muscle memory and disciplined breathing.'
        ],
        quotes: [
          'Two things awe me most the starry sky above me and the moral law within me. Immanuel Kant.',
          'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. Ralph Waldo Emerson.'
        ],
        special: [
          '100 200 300 400 500 600 700 800 900 1000',
          'Unicode standard Devanagari typography font shaping text rendering'
        ]
      }
    }
  };

  // --- 4. COMPREHENSIVE TYPABLE PREETI MAPPING ---
  const CONTEXTUAL_RULES = [
    ["((?:.्)*.)ि", "l$1"],
    ["र्((?:.्)*.)", "$1{"]
  ];

  const PREETI_CHAR_MAP = [
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

    ["औ", "cf}"], ["ओ", "cf]"], ["आ", "cf"], ["अ", "c"],
    ["ई", "O{"], ["इ", "O"], ["ऊ", "pm"], ["उ", "p"],
    ["ऋ", "C"], ["ऐ", "P]"], ["ए", "P"],

    ["ू", "\""], ["ु", "'"], ["ं", "+"], ["ा", "f"], ["ृ", "["],
    ["्", "\\"], ["े", "]"], ["ै", "}"], ["ँ", "F"], ["ी", "L"],
    ["ः", "M"], ["ो", "f]"], ["ौ", "f}"]
  ];

  function toPreeti(text) {
    if (!text) return '';
    let s = text;
    for (const [pattern, replacement] of CONTEXTUAL_RULES) {
      s = s.replace(new RegExp(pattern, 'g'), replacement);
    }
    for (const [u, p] of PREETI_CHAR_MAP) {
      s = s.replaceAll(u, p);
    }
    return s;
  }

  // --- 5. HARDWARE KEYBOARD MATRIX & MAPPINGS ---
  const KEY_ROWS = [
    // Row 1
    [
      { code: 'Backquote', key: '`', eng: ['`', '~'], uni: ['ञ', '॥'], rom: ['`', '~'], pre: ['`', '~', 'ञ', 'ञ्'], flex: '1' },
      { code: 'Digit1', key: '1', eng: ['1', '!'], uni: ['१', 'ज्ञ'], rom: ['१', '!'], pre: ['1', '!', 'ज्ञ', '१'], flex: '1' },
      { code: 'Digit2', key: '2', eng: ['2', '@'], uni: ['२', 'ई'], rom: ['२', '@'], pre: ['2', '@', 'द्द', '२'], flex: '1' },
      { code: 'Digit3', key: '3', eng: ['3', '#'], uni: ['३', 'घ'], rom: ['३', '#'], pre: ['3', '#', 'घ', '३'], flex: '1' },
      { code: 'Digit4', key: '4', eng: ['4', '$'], uni: ['४', 'द्ध'], rom: ['४', '$'], pre: ['4', '$', 'द्ध', '४'], flex: '1' },
      { code: 'Digit5', key: '5', eng: ['5', '%'], uni: ['५', 'छ'], rom: ['५', '%'], pre: ['5', '%', 'छ', '५'], flex: '1' },
      { code: 'Digit6', key: '6', eng: ['6', '^'], uni: ['६', 'ट'], rom: ['६', '^'], pre: ['6', '^', 'ट', '६'], flex: '1' },
      { code: 'Digit7', key: '7', eng: ['7', '&'], uni: ['७', 'ठ'], rom: ['७', '&'], pre: ['7', '&', 'ठ', '७'], flex: '1' },
      { code: 'Digit8', key: '8', eng: ['8', '*'], uni: ['८', 'ड'], rom: ['८', '*'], pre: ['8', '*', 'ड', '८'], flex: '1' },
      { code: 'Digit9', key: '9', eng: ['9', '('], uni: ['९', 'ढ'], rom: ['९', '('], pre: ['9', '(', 'ढ', '९'], flex: '1' },
      { code: 'Digit0', key: '0', eng: ['0', ')'], uni: ['०', 'ण'], rom: ['०', ')'], pre: ['0', ')', 'ण', '०'], flex: '1' },
      { code: 'Minus', key: '-', eng: ['-', '_'], uni: ['औ', 'ओ'], rom: ['-', '_'], pre: ['-', '_', '❨', '❩'], flex: '1' },
      { code: 'Equal', key: '=', eng: ['=', '+'], uni: ['‍', '‌'], rom: ['=', '+'], pre: ['.', '+', '.', 'ं'], flex: '1' },
      { code: 'Backspace', key: 'Backspace', flex: '2', special: true, label: 'Backspace ⌫' }
    ],
    // Row 2
    [
      { code: 'Tab', key: 'Tab', flex: '1.5', special: true, label: 'Tab ⇥' },
      { code: 'KeyQ', key: 'q', eng: ['q', 'Q'], uni: ['त्र', 'त्त'], rom: ['ौ', 'ऒ'], pre: ['q', 'Q', 'त्र', 'त्त'], flex: '1' },
      { code: 'KeyW', key: 'w', eng: ['w', 'W'], uni: ['ध', 'ध्'], rom: ['ो', 'ऒ'], pre: ['w', 'W', 'ध', 'ध्'], flex: '1' },
      { code: 'KeyE', key: 'e', eng: ['e', 'E'], uni: ['भ', 'भ्'], rom: ['े', 'ऐ'], pre: ['e', 'E', 'भ', 'भ्'], flex: '1' },
      { code: 'KeyR', key: 'r', eng: ['r', 'R'], uni: ['च', 'च्'], rom: ['र', 'ऋ'], pre: ['r', 'R', 'च', 'च्'], flex: '1' },
      { code: 'KeyT', key: 't', eng: ['t', 'T'], uni: ['त', 'त्'], rom: ['त', 'ट'], pre: ['t', 'T', 'त', 'त्'], flex: '1' },
      { code: 'KeyY', key: 'y', eng: ['y', 'Y'], uni: ['थ', 'थ्'], rom: ['य', 'ञ'], pre: ['y', 'Y', 'थ', 'थ्'], flex: '1' },
      { code: 'KeyU', key: 'u', eng: ['u', 'U'], uni: ['ग', 'ग्'], rom: ['ु', 'ू'], pre: ['u', 'U', 'ग', 'ग्'], flex: '1' },
      { code: 'KeyI', key: 'i', eng: ['i', 'I'], uni: ['ष', 'क्ष्'], rom: ['ि', 'ी'], pre: ['i', 'I', 'ष', 'क्ष्'], flex: '1' },
      { code: 'KeyO', key: 'o', eng: ['o', 'O'], uni: ['य', 'इ'], rom: ['ओ', 'ऒ'], pre: ['o', 'O', 'य', 'इ'], flex: '1' },
      { code: 'KeyP', key: 'p', eng: ['p', 'P'], uni: ['उ', 'ए'], rom: ['प', 'फ'], pre: ['p', 'P', 'उ', 'ए'], flex: '1' },
      { code: 'BracketLeft', key: '[', eng: ['[', '{'], uni: ['र्', 'ृ'], rom: ['[', '{'], pre: ['[', '{', 'ृ', 'र्'], flex: '1' },
      { code: 'BracketRight', key: ']', eng: [']', '}'], uni: ['े', 'ै'], rom: [']', '}'], pre: [']', '}', 'े', 'ै'], flex: '1' },
      { code: 'Backslash', key: '\\', eng: ['\\', '|'], uni: ['्', 'ं'], rom: ['्र', 'ृ'], pre: ['\\', '|', '्', '्र'], flex: '1.5' }
    ],
    // Row 3
    [
      { code: 'CapsLock', key: 'CapsLock', flex: '1.75', special: true, label: 'Caps ⇪' },
      { code: 'KeyA', key: 'a', eng: ['a', 'A'], uni: ['ब', 'आ'], rom: ['ा', 'आ'], pre: ['a', 'A', 'ब', 'ब्'], flex: '1' },
      { code: 'KeyS', key: 's', eng: ['s', 'S'], uni: ['क', 'क्'], rom: ['स', 'श'], pre: ['s', 'S', 'क', 'क्'], flex: '1' },
      { code: 'KeyD', key: 'd', eng: ['d', 'D'], uni: ['म', 'म्'], rom: ['द', 'ड'], pre: ['d', 'D', 'म', 'म्'], flex: '1' },
      { code: 'KeyF', key: 'f', eng: ['f', 'F'], uni: ['ा', 'ँ'], rom: ['फ', 'ँ'], pre: ['f', 'F', 'ा', 'ँ'], flex: '1' },
      { code: 'KeyG', key: 'g', eng: ['g', 'G'], uni: ['न', 'न्'], rom: ['ग', 'घ'], pre: ['g', 'G', 'न', 'न्'], flex: '1' },
      { code: 'KeyH', key: 'h', eng: ['h', 'H'], uni: ['ज', 'ज्'], rom: ['ह', 'ः'], pre: ['h', 'H', 'ज', 'ज्'], flex: '1' },
      { code: 'KeyJ', key: 'j', eng: ['j', 'J'], uni: ['व', 'ो'], rom: ['ज', 'झ'], pre: ['j', 'J', 'व', 'व्'], flex: '1' },
      { code: 'KeyK', key: 'k', eng: ['k', 'K'], uni: ['प', 'फ्'], rom: ['क', 'ख'], pre: ['k', 'K', 'प', 'प्'], flex: '1' },
      { code: 'KeyL', key: 'l', eng: ['l', 'L'], uni: ['ि', 'ी'], rom: ['ल', 'ळ'], pre: ['l', 'L', 'ि', 'ी'], flex: '1' },
      { code: 'Semicolon', key: ';', eng: [';', ':'], uni: ['स', 'स्'], rom: [';', ':'], pre: [';', ':', 'स', 'स्'], flex: '1' },
      { code: 'Quote', key: '\'', eng: ['\'', '"'], uni: ['ु', 'ू'], rom: ['\'', '"'], pre: ['\'', '"', 'ु', 'ू'], flex: '1' },
      { code: 'Enter', key: 'Enter', flex: '2.25', special: true, label: 'Enter ↵' }
    ],
    // Row 4
    [
      { code: 'ShiftLeft', key: 'Shift', flex: '2.25', special: true, label: 'Shift ⇧' },
      { code: 'KeyZ', key: 'z', eng: ['z', 'Z'], uni: ['श', 'श्'], rom: ['श', 'ष'], pre: ['z', 'Z', 'श', 'श्'], flex: '1' },
      { code: 'KeyX', key: 'x', eng: ['x', 'X'], uni: ['ह', 'ह्'], rom: ['क्ष', 'ज्ञ'], pre: ['x', 'X', 'ह', 'ह्'], flex: '1' },
      { code: 'KeyC', key: 'c', eng: ['c', 'C'], uni: ['अ', 'ऋ'], rom: ['च', 'छ'], pre: ['c', 'C', 'अ', 'ऋ'], flex: '1' },
      { code: 'KeyV', key: 'v', eng: ['v', 'V'], uni: ['ख', 'ख्'], rom: ['व', 'ॐ'], pre: ['v', 'V', 'ख', 'ख्'], flex: '1' },
      { code: 'KeyB', key: 'b', eng: ['b', 'B'], uni: ['द', 'ौ'], rom: ['ब', 'भ'], pre: ['b', 'B', 'द', 'द्य'], flex: '1' },
      { code: 'KeyN', key: 'n', eng: ['n', 'N'], uni: ['ल', 'ल्'], rom: ['न', 'ण'], pre: ['n', 'N', 'ल', 'ल्'], flex: '1' },
      { code: 'KeyM', key: 'm', eng: ['m', 'M'], uni: ['ः', 'ड्ड'], rom: ['म', 'ङ'], pre: ['m', 'M', 'फ', 'ः'], flex: '1' },
      { code: 'Comma', key: ',', eng: [',', '<'], uni: ['ऽ', 'ङ'], rom: [',', 'ङ'], pre: [',', '<', ',', '?'], flex: '1' },
      { code: 'Period', key: '.', eng: ['.', '>'], uni: ['।', 'श्र'], rom: ['।', '॥'], pre: ['.', '>', '।', 'श्र'], flex: '1' },
      { code: 'Slash', key: '/', eng: ['/', '?'], uni: ['र', 'रु'], rom: ['्', '?'], pre: ['/', '?', 'र', 'रु'], flex: '1' },
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

  // --- 6. APPLICATION STATE ---
  let state = {
    lang: 'nepali_unicode',
    mode: 'time',
    duration: 60,
    wordCount: 25,
    difficulty: 'medium',
    words: [],
    typedWords: [],
    wordIdx: 0,
    isRunning: false,
    isFinished: false,
    startTime: 0,
    timer: null,
    secsLeft: 60,
    sound: true,
    isShift: false,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errorKeystrokes: 0,
    errorMap: {},
    timeline: []
  };

  // Web Audio Context for keystroke and completion sounds
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

  // --- 7. WORDS POOL & CONTENT SELECTION ---
  function getWordsPool() {
    let list = [];

    if (state.mode === 'exam') {
      const isEng = state.lang === 'english';
      const text = isEng ? EXAM_SPEECH_ENGLISH : EXAM_SPEECH_NEPALI;
      list = text.split(/\s+/).filter(Boolean);
      if (state.lang === 'nepali_preeti') {
        list = list.map(w => toPreeti(w));
      }
      return list;
    }

    const isEng = state.lang === 'english';
    const langObj = isEng ? DATA.english : DATA.nepali;
    const diffObj = langObj[state.difficulty] || langObj.medium;

    if (state.mode === 'words' || state.mode === 'time') {
      const baseWords = diffObj.words;
      const targetCount = state.mode === 'words' ? state.wordCount : 150;
      while (list.length < targetCount) {
        const sh = [...baseWords].sort(() => 0.5 - Math.random());
        list.push(...sh);
      }
      list = list.slice(0, targetCount);
    } else if (state.mode === 'sentences') {
      const shSentences = [...diffObj.sentences].sort(() => 0.5 - Math.random());
      const text = shSentences.join(' ');
      list = text.split(/\s+/).filter(Boolean);
    } else if (state.mode === 'quotes') {
      const shQuotes = [...diffObj.quotes].sort(() => 0.5 - Math.random());
      const text = shQuotes.join(' ');
      list = text.split(/\s+/).filter(Boolean);
    } else if (state.mode === 'special') {
      const text = diffObj.special.join(' ');
      list = text.split(/\s+/).filter(Boolean);
    } else {
      list = diffObj.words;
    }

    if (state.lang === 'nepali_preeti') {
      list = list.map(w => toPreeti(w));
    }

    return list;
  }

  function refillWords() {
    if (state.mode === 'exam') return; // Exam mode uses entire sequential speech text

    const isEng = state.lang === 'english';
    const langObj = isEng ? DATA.english : DATA.nepali;
    const diffObj = langObj[state.difficulty] || langObj.medium;
    let extra = [...diffObj.words].sort(() => 0.5 - Math.random()).slice(0, 50);
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

  // --- 8. TEST SETUP & RESET ---
  function setupTest() {
    clearInterval(state.timer);
    state.timer = null;
    state.isRunning = false;
    state.isFinished = false;
    state.wordIdx = 0;
    state.typedWords = [];
    state.timeline = [];
    state.totalKeystrokes = 0;
    state.correctKeystrokes = 0;
    state.errorKeystrokes = 0;
    state.errorMap = {};
    state.secsLeft = state.duration;

    const timerDisp = document.getElementById('live-timer-display');
    const progDisp = document.getElementById('live-progress-display');
    const wpmDisp = document.getElementById('live-wpm-display');
    const accDisp = document.getElementById('live-acc-display');
    const inputField = document.getElementById('typing-input');

    if (timerDisp) timerDisp.textContent = (state.mode === 'time' || state.mode === 'exam') ? `${state.secsLeft}` : '0s';
    if (progDisp) progDisp.textContent = `0 / ${state.mode === 'words' ? state.wordCount : state.words.length || 25} words`;
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

      // Pre-insert caret inside words-container for 100% stable coordinate space
      const caretDiv = document.createElement('div');
      caretDiv.id = 'typing-caret';
      caretDiv.className = 'typing-caret';
      container.appendChild(caretDiv);

      state.words.forEach((w, wI) => {
        const wSpan = document.createElement('span');
        wSpan.className = 'word-node' + (wI === 0 ? ' is-active-word' : '');
        wSpan.dataset.wordIndex = `${wI}`;
        const clusters = getGraphemes(w, state.lang);
        wSpan.innerHTML = clusters.map((cl, cI) => `<span class="char-node" data-char-index="${cI}">${cl}</span>`).join('');
        container.appendChild(wSpan);
      });
      container.scrollTop = 0;
    }

    renderKeyboard();
    highlightTargetKey();
    updateCaret();
    updatePersonalBestsCards();
  }

  // --- 9. ACTIVE WORD HIGHLIGHT & ACCURATE CARET ---
  function renderActiveWordHighlight() {
    const curWord = state.words[state.wordIdx];
    const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
    const inputField = document.getElementById('typing-input');
    if (!curWord || !curWordEl || !inputField) return;

    const typed = inputField.value;
    const clusters = getGraphemes(curWord, state.lang);
    const charSpans = curWordEl.querySelectorAll('.char-node:not(.is-extra-error)');

    // Remove any previously appended extra error spans
    curWordEl.querySelectorAll('.is-extra-error').forEach(el => el.remove());

    let typedOffset = 0;
    let hasError = false;

    for (let i = 0; i < clusters.length; i++) {
      const cl = clusters[i];
      const span = charSpans[i];
      if (!span) continue;

      span.className = 'char-node';

      if (typedOffset >= typed.length) {
        // Untouched
        continue;
      }

      const remainingTyped = typed.slice(typedOffset);

      if (remainingTyped.startsWith(cl)) {
        // Fully correct grapheme cluster
        span.classList.add('is-correct');
        typedOffset += cl.length;
      } else if (cl.startsWith(remainingTyped)) {
        // In-progress cluster (e.g. typed base consonant before matra)
        span.classList.add('is-partial');
        typedOffset += remainingTyped.length;
      } else {
        // Mismatched error cluster
        span.classList.add('is-error');
        hasError = true;
        typedOffset += Math.min(cl.length, remainingTyped.length);
        const expected = cl;
        state.errorMap[expected] = (state.errorMap[expected] || 0) + 1;
      }
    }

    // If user typed beyond the word length, render extra characters
    if (typed.length > typedOffset) {
      hasError = true;
      const extra = typed.slice(typedOffset);
      const extraSpan = document.createElement('span');
      extraSpan.className = 'char-node is-extra-error';
      extraSpan.textContent = extra;
      curWordEl.appendChild(extraSpan);
    }

    curWordEl.classList.toggle('is-word-error', hasError);
  }

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
    const cRect = container.getBoundingClientRect();
    const inputField = document.getElementById('typing-input');
    const typed = inputField ? inputField.value : '';

    const charSpans = curWordEl.querySelectorAll('.char-node');
    let targetSpan = null;
    let placeAtRight = false;

    if (typed.length === 0) {
      targetSpan = charSpans[0] || curWordEl;
      placeAtRight = false;
    } else {
      const touchedSpans = curWordEl.querySelectorAll('.char-node.is-correct, .char-node.is-partial, .char-node.is-error, .char-node.is-extra-error');
      if (touchedSpans.length > 0) {
        targetSpan = touchedSpans[touchedSpans.length - 1];
        placeAtRight = true;
      } else {
        targetSpan = charSpans[0] || curWordEl;
        placeAtRight = false;
      }
    }

    if (targetSpan) {
      const sRect = targetSpan.getBoundingClientRect();
      const leftPos = placeAtRight ? (sRect.right - cRect.left) : (sRect.left - cRect.left);
      const topPos = (sRect.top - cRect.top + container.scrollTop);

      caret.style.left = `${leftPos}px`;
      caret.style.top = `${topPos}px`;
      caret.style.height = `${Math.max(22, sRect.height - 4)}px`;

      // Smooth auto-scroll when passing line boundary in 2-line container
      if (sRect.top - cRect.top > 38) {
        container.scrollTop += 38;
      }
    }
  }

  // --- 10. KEYBOARD VISUALIZER ENGINE ---
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
            topLbl = state.isShift ? k.pre[1] : k.pre[0];
            mainLbl = state.isShift ? k.pre[3] : k.pre[2];
            fontFam = 'var(--font-nepali)';
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
    const inputField = document.getElementById('typing-input');
    if (!curWord) return;

    const typed = inputField ? inputField.value : '';
    let targetCh = '';
    if (typed.length < curWord.length) {
      targetCh = curWord[typed.length];
    } else {
      targetCh = ' ';
    }

    const targetDisp = document.getElementById('kb-target-char');
    if (targetDisp) {
      targetDisp.textContent = targetCh === ' ' ? '␣ Space' : targetCh;
    }

    if (targetCh === ' ') {
      document.querySelector('.keycap[data-code="Space"]')?.classList.add('is-target');
      return;
    }

    let needsShift = false;
    let targetCode = null;

    for (let r = 0; r < KEY_ROWS.length; r++) {
      for (let k = 0; k < KEY_ROWS[r].length; k++) {
        const item = KEY_ROWS[r][k];
        if (item.special) continue;

        if (state.lang === 'english') {
          if (item.eng[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
          if (item.eng[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
        } else if (state.lang === 'nepali_unicode') {
          if (item.uni[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
          if (item.uni[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
        } else if (state.lang === 'nepali_romanized') {
          if (item.rom[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
          if (item.rom[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
        } else if (state.lang === 'nepali_preeti') {
          if (item.pre[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
          if (item.pre[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
        }
      }
      if (targetCode) break;
    }

    if (targetCode) {
      document.querySelector(`.keycap[data-code="${targetCode}"]`)?.classList.add('is-target');
      if (needsShift) {
        document.querySelector('.keycap[data-code="ShiftLeft"]')?.classList.add('is-target');
      }
    }
  }

  // --- 11. REAL-TIME STATS & WALL-CLOCK TIMER ---
  function computeCurrentStats() {
    const elapsed = Math.max(1, (performance.now() - state.startTime) / 1000);
    const m = elapsed / 60;
    const wpm = Math.max(0, Math.round((state.correctKeystrokes / 5) / m));
    const rawWpm = Math.round((state.totalKeystrokes / 5) / m);
    const acc = state.totalKeystrokes > 0 ? Math.min(100, Math.round((state.correctKeystrokes / state.totalKeystrokes) * 1000) / 10) : 100;
    return { wpm, rawWpm, acc, elapsed };
  }

  function startTimer() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.startTime = performance.now();
    state.timeline = [];

    state.timer = setInterval(() => {
      const now = performance.now();
      const elapsed = Math.floor((now - state.startTime) / 1000);

      if (state.mode === 'time' || state.mode === 'exam') {
        state.secsLeft = Math.max(0, state.duration - elapsed);
        const tDisp = document.getElementById('live-timer-display');
        if (tDisp) tDisp.textContent = `${state.secsLeft}`;
        if (state.secsLeft <= 0) {
          finishTest();
          return;
        }
      } else {
        const tDisp = document.getElementById('live-timer-display');
        if (tDisp) tDisp.textContent = `${elapsed}s`;
      }

      updateLiveStats();

      // Record second snapshot for timeline chart
      const cur = computeCurrentStats();
      state.timeline.push({
        second: elapsed,
        wpm: cur.wpm,
        rawWpm: cur.rawWpm,
        errors: state.errorKeystrokes
      });
    }, 1000);
  }

  function updateLiveStats() {
    if (!state.isRunning) return;
    const stats = computeCurrentStats();

    const wpmDisp = document.getElementById('live-wpm-display');
    const accDisp = document.getElementById('live-acc-display');
    const progDisp = document.getElementById('live-progress-display');

    if (wpmDisp) wpmDisp.textContent = `${stats.wpm}`;
    if (accDisp) accDisp.textContent = `${Math.round(stats.acc)}%`;
    if (progDisp) progDisp.textContent = `${state.wordIdx} / ${state.mode === 'words' ? state.wordCount : state.words.length} words`;
  }

  // --- 12. SVG TIMELINE GRAPH GENERATOR ---
  function renderTimelineChart(timeline) {
    const svg = document.getElementById('timeline-chart-svg');
    if (!svg) return;

    if (!timeline || timeline.length === 0) {
      svg.innerHTML = '<text x="250" y="60" text-anchor="middle" fill="var(--text-muted)" font-size="12">No speed timeline data recorded</text>';
      return;
    }

    const maxWpm = Math.max(40, ...timeline.map(p => Math.max(p.wpm, p.rawWpm)));
    const roundedMax = Math.ceil(maxWpm / 20) * 20;
    const w = 500;
    const h = 120;
    const padL = 30;
    const padR = 20;
    const padT = 15;
    const padB = 25;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;

    const n = Math.max(1, timeline.length - 1);
    const getX = (i) => padL + (i / n) * innerW;
    const getY = (val) => padT + innerH - (Math.min(val, roundedMax) / roundedMax) * innerH;

    let svgHtml = `
      <defs>
        <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
    `;

    // Horizontal Grid Lines & Scale
    const gridSteps = [0, 0.5, 1];
    gridSteps.forEach(ratio => {
      const yVal = padT + innerH * (1 - ratio);
      const labelVal = Math.round(roundedMax * ratio);
      svgHtml += `<line x1="${padL}" y1="${yVal}" x2="${w - padR}" y2="${yVal}" stroke="var(--border-subtle)" stroke-dasharray="3,3" stroke-width="1" />`;
      svgHtml += `<text x="${padL - 6}" y="${yVal + 3}" text-anchor="end" fill="var(--text-muted)" font-size="9" font-family="monospace">${labelVal}</text>`;
    });

    const rawPoints = timeline.map((p, i) => `${getX(i)},${getY(p.rawWpm)}`).join(' ');
    const netPoints = timeline.map((p, i) => `${getX(i)},${getY(p.wpm)}`).join(' ');

    const areaPoints = `${getX(0)},${padT + innerH} ` + netPoints + ` ${getX(timeline.length - 1)},${padT + innerH}`;
    svgHtml += `<polygon points="${areaPoints}" fill="url(#wpmGradient)" />`;

    // Raw WPM line (Blue)
    svgHtml += `<polyline points="${rawPoints}" fill="none" stroke="#60a5fa" stroke-width="1.75" stroke-linecap="round" opacity="0.8" />`;

    // Net WPM line (Accent Red)
    svgHtml += `<polyline points="${netPoints}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" stroke-linecap="round" />`;

    // Errors (Red dots)
    timeline.forEach((p, i) => {
      if (p.errors > 0) {
        svgHtml += `<circle cx="${getX(i)}" cy="${getY(p.wpm)}" r="3.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" />`;
      }
    });

    svg.innerHTML = svgHtml;
  }

  // --- 13. FINISH TEST & DETAILED REPORT ---
  function finishTest() {
    if (state.isFinished) return;
    clearInterval(state.timer);
    state.timer = null;
    state.isRunning = false;
    state.isFinished = true;
    playBeep(880, 'triangle', 0.45, 0.15);

    const stats = computeCurrentStats();
    const netWpm = stats.wpm;
    const rawWpm = stats.rawWpm;
    const acc = stats.acc;
    const cpm = Math.round(state.correctKeystrokes / (stats.elapsed / 60));

    // Calculate Consistency % (Monkeytype standard CV)
    let consistency = 95;
    if (state.timeline.length > 2) {
      const wpms = state.timeline.map(p => p.wpm);
      const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      if (mean > 0) {
        const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / mean) * 100;
        consistency = Math.max(0, Math.min(100, Math.round(100 - cv)));
      }
    }

    // Typist Proficiency Ranking
    let rank = '🌱 Intermediate';
    let feedback = 'नियमित अभ्यासले किबोर्डमा गति र आत्मविश्वास बढ्दै जान्छ।';
    if (netWpm >= 50 && acc >= 95) {
      rank = '🚀 Speed Demon';
      feedback = 'अविश्वसनीय गति! तपाईं प्रो स्तरको टाइपिस्ट हुनुहुन्छ।';
    } else if (netWpm >= 40 && acc >= 90) {
      rank = '⚡ Master Typist';
      feedback = 'उत्कृष्ट गति र शुद्धता! व्यावसायिक स्तरको लेखन क्षमता।';
    } else if (netWpm >= 30 && acc >= 88) {
      rank = '🎯 Proficient';
      feedback = 'धेरै राम्रो गति! दैनिक काम, परीक्षा र साहित्य लेखनका लागि उपयुक्त।';
    } else if (netWpm < 20) {
      rank = '🐣 Learner';
      feedback = 'हतार नगरी शुद्धतामा ध्यान दिनुहोस्, गति आफैँ बढ्दै जानेछ।';
    }

    // Most frequent missed keys
    const missedSorted = Object.entries(state.errorMap).sort((a, b) => b[1] - a[1]);
    const topMissed = missedSorted.slice(0, 3).map(([k, c]) => `${k} (${c})`).join(', ') || 'None';

    // Populate Detailed Stats Modal
    const mNet = document.getElementById('modal-net-wpm');
    const mAcc = document.getElementById('modal-accuracy');
    const mAccDetail = document.getElementById('modal-acc-detail');
    const mRaw = document.getElementById('modal-raw-wpm');
    const mConsistency = document.getElementById('modal-consistency');
    const mCpm = document.getElementById('modal-cpm');
    const mRankPill = document.getElementById('modal-rank-pill');
    const mRankLbl = document.getElementById('modal-rank-label');
    const mRankFeed = document.getElementById('modal-rank-feedback');
    const mCorrect = document.getElementById('modal-strokes-correct');
    const mError = document.getElementById('modal-strokes-error');
    const mMissed = document.getElementById('modal-missed-keys');
    const mErrorRate = document.getElementById('modal-error-rate');
    const mMeta = document.getElementById('modal-test-metadata');

    const langNames = {
      nepali_unicode: 'नेपाली Traditional',
      nepali_romanized: 'नेपाली Romanized',
      nepali_preeti: 'Preeti (ASCII)',
      english: 'English QWERTY'
    };

    let modeDesc = '';
    if (state.mode === 'exam') {
      modeDesc = `🎓 Exam (${Math.round(state.duration / 60)} Min)`;
    } else if (state.mode === 'time') {
      modeDesc = `${state.duration} Seconds`;
    } else {
      modeDesc = `${state.wordCount} Words`;
    }

    const diffDesc = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);

    if (mNet) mNet.textContent = `${netWpm}`;
    if (mAcc) mAcc.textContent = `${acc}%`;
    if (mAccDetail) mAccDetail.textContent = `${state.errorKeystrokes} errors`;
    if (mRaw) mRaw.textContent = `${rawWpm}`;
    if (mConsistency) mConsistency.textContent = `${consistency}%`;
    if (mCpm) mCpm.textContent = `${cpm} CPM`;
    if (mRankPill) mRankPill.textContent = rank;
    if (mRankLbl) mRankLbl.textContent = rank;
    if (mRankFeed) mRankFeed.textContent = feedback;
    if (mCorrect) mCorrect.textContent = `${state.correctKeystrokes}`;
    if (mError) mError.textContent = `${state.errorKeystrokes}`;
    if (mMissed) mMissed.textContent = topMissed;
    if (mErrorRate) mErrorRate.textContent = `${(100 - acc).toFixed(1)}%`;
    if (mMeta) mMeta.textContent = `${langNames[state.lang] || state.lang} • ${modeDesc} • ${diffDesc}`;

    renderTimelineChart(state.timeline);
    document.getElementById('stats-modal')?.classList.add('is-open');

    // Save record to LocalStorage
    try {
      const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
      hist.unshift({
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        layout: state.lang,
        mode: modeDesc,
        wpm: netWpm,
        rawWpm: rawWpm,
        acc: acc,
        duration: Math.round(stats.elapsed)
      });
      localStorage.setItem('nepali_typing_history', JSON.stringify(hist.slice(0, 50)));
      updatePersonalBestsCards();
    } catch (e) {}
  }

  // --- 14. PERSONAL BESTS & HISTORY UPDATER ---
  function updatePersonalBestsCards() {
    try {
      const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
      let pbEng = 0;
      let pbUni = 0;
      let pbRom = 0;
      let pbPre = 0;

      hist.forEach(r => {
        const w = Number(r.wpm) || 0;
        if (r.layout === 'english') pbEng = Math.max(pbEng, w);
        if (r.layout === 'nepali_unicode') pbUni = Math.max(pbUni, w);
        if (r.layout === 'nepali_romanized') pbRom = Math.max(pbRom, w);
        if (r.layout === 'nepali_preeti') pbPre = Math.max(pbPre, w);
      });

      const elEng = document.getElementById('pb-english');
      const elUni = document.getElementById('pb-unicode');
      const elRom = document.getElementById('pb-romanized');
      const elPre = document.getElementById('pb-preeti');
      const elTotal = document.getElementById('total-tests-count');

      if (elEng) elEng.textContent = `${pbEng} WPM`;
      if (elUni) elUni.textContent = `${pbUni} WPM`;
      if (elRom) elRom.textContent = `${pbRom} WPM`;
      if (elPre) elPre.textContent = `${pbPre} WPM`;
      if (elTotal) elTotal.textContent = `${hist.length} test${hist.length === 1 ? '' : 's'} completed`;
    } catch (e) {}
  }

  // --- 15. INPUT & KEY EVENT HANDLING ---
  function bindInputEvents() {
    const inputField = document.getElementById('typing-input');
    const workbench = document.getElementById('typing-workbench');

    workbench?.addEventListener('click', () => {
      inputField?.focus();
    });

    inputField?.addEventListener('focus', () => {
      workbench?.classList.add('is-active');
    });

    inputField?.addEventListener('blur', () => {
      workbench?.classList.remove('is-active');
    });

    // Real-time Keystroke Input Handler
    inputField?.addEventListener('input', () => {
      if (state.isFinished) return;
      if (!state.isRunning && inputField.value.length > 0) startTimer();

      // Normalize combined traditional Devanagari ligatures
      if (state.lang === 'nepali_unicode') {
        const val = inputField.value;
        const normalized = val
          .replace(/अा/g, 'आ')
          .replace(/ाे/g, 'ो')
          .replace(/ाै/g, 'ौ')
          .replace(/अो/g, 'ओ')
          .replace(/अौ/g, 'औ');
        if (normalized !== val) {
          inputField.value = normalized;
        }
      }

      renderActiveWordHighlight();
      highlightTargetKey();
      updateCaret();
      updateLiveStats();
    });

    inputField?.addEventListener('keydown', (e) => {
      // PREVENT SPACE SCROLLING AND ADVANCE WORD
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();

        if (state.isFinished) return;
        if (!state.isRunning) startTimer();

        const curWord = state.words[state.wordIdx];
        const typed = inputField.value.trim();
        if (!curWord) return;

        const isCorrect = (typed === curWord);
        if (isCorrect) {
          playBeep(480, 'sine', 0.05, 0.08);
          state.correctKeystrokes += curWord.length + 1;
        } else {
          playBeep(160, 'sawtooth', 0.1, 0.1);
          state.errorKeystrokes++;
        }
        state.totalKeystrokes += (typed.length || 1) + 1;

        state.typedWords[state.wordIdx] = typed;

        const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
        if (curWordEl) {
          curWordEl.classList.remove('is-active-word');
          curWordEl.classList.add(isCorrect ? 'is-word-correct' : 'is-word-error');
        }

        state.wordIdx++;
        inputField.value = '';

        // Check test completion criteria
        if (state.mode === 'words' && state.wordIdx >= state.wordCount) {
          finishTest();
          return;
        }
        if ((state.mode === 'sentences' || state.mode === 'quotes' || state.mode === 'special') && state.wordIdx >= state.words.length) {
          finishTest();
          return;
        }
        if (state.mode === 'time') {
          if (state.wordIdx >= state.words.length - 15) {
            refillWords();
          }
        }

        const nextWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
        if (nextWordEl) {
          nextWordEl.classList.add('is-active-word');
          const container = document.getElementById('words-container');
          if (container) {
            const wRect = nextWordEl.getBoundingClientRect();
            const cRect = container.getBoundingClientRect();
            if (wRect.top - cRect.top > 38) {
              container.scrollTop += 38;
            }
          }
        }

        renderActiveWordHighlight();
        highlightTargetKey();
        updateCaret();
        updateLiveStats();
        return;
      }

      // FREEDOM BACKSPACE: jump back to previous word for instant correction!
      if (e.key === 'Backspace') {
        if (inputField.value.length === 0 && state.wordIdx > 0) {
          e.preventDefault();

          const curWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
          if (curWordEl) {
            curWordEl.classList.remove('is-active-word', 'is-word-error');
          }

          state.wordIdx--;
          const prevWordEl = document.querySelector(`.word-node[data-word-index="${state.wordIdx}"]`);
          if (prevWordEl) {
            prevWordEl.classList.remove('is-word-correct', 'is-word-error');
            prevWordEl.classList.add('is-active-word');
          }

          inputField.value = state.typedWords[state.wordIdx] || '';

          renderActiveWordHighlight();
          highlightTargetKey();
          updateCaret();
          updateLiveStats();
          return;
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

      // Hardware layout keystroke mapping on US physical keyboard
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (state.isFinished) return;
        if (!state.isRunning) startTimer();

        const isAscii = e.key.charCodeAt(0) < 128;
        if (state.lang === 'nepali_unicode' && isAscii) {
          const matched = KEY_CODE_MAP[e.code];
          if (matched && matched.uni) {
            e.preventDefault();
            const ch = (e.shiftKey || state.isShift) ? matched.uni[1] : matched.uni[0];
            const start = inputField.selectionStart ?? inputField.value.length;
            const end = inputField.selectionEnd ?? inputField.value.length;
            inputField.setRangeText(ch, start, end, 'end');

            // Auto-merge traditional ligatures
            let val = inputField.value;
            val = val
              .replace(/अा/g, 'आ')
              .replace(/ाे/g, 'ो')
              .replace(/ाै/g, 'ौ')
              .replace(/अो/g, 'ओ')
              .replace(/अौ/g, 'औ');
            inputField.value = val;

            inputField.dispatchEvent(new Event('input'));
            return;
          }
        } else if (state.lang === 'nepali_romanized' && isAscii) {
          const matched = KEY_CODE_MAP[e.code];
          if (matched && matched.rom) {
            e.preventDefault();
            const ch = (e.shiftKey || state.isShift) ? matched.rom[1] : matched.rom[0];
            const start = inputField.selectionStart ?? inputField.value.length;
            const end = inputField.selectionEnd ?? inputField.value.length;
            inputField.setRangeText(ch, start, end, 'end');
            inputField.dispatchEvent(new Event('input'));
            return;
          }
        }
      }
    });

    // Auto-focus input on printable key if user clicked away
    window.addEventListener('keydown', (e) => {
      if (document.activeElement !== inputField && !e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
        inputField?.focus();
      }

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

  // --- 16. TOOLBAR, MODAL & BUTTON LISTENERS ---
  function bindToolbarEvents() {
    // Language Tabs
    document.querySelectorAll('.lang-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-tab-btn').forEach(b => {
          b.classList.remove('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-primary)]', 'shadow-sm');
          b.classList.add('text-[var(--text-secondary)]');
        });
        btn.classList.add('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-primary)]', 'shadow-sm');
        btn.classList.remove('text-[var(--text-secondary)]');
        state.lang = btn.dataset.lang;
        setupTest();
      });
    });

    // Mode Tabs
    document.querySelectorAll('.mode-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-tab-btn').forEach(b => {
          b.classList.remove('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-blue)]');
          b.classList.add('text-[var(--text-muted)]');
        });
        btn.classList.add('active', 'bg-[var(--bg-surface)]', 'text-[var(--accent-blue)]');
        btn.classList.remove('text-[var(--text-muted)]');
        state.mode = btn.dataset.mode;

        const timeOpts = document.getElementById('time-options');
        const wordsOpts = document.getElementById('words-options');
        const examOpts = document.getElementById('exam-options');

        if (timeOpts) timeOpts.classList.toggle('hidden', state.mode !== 'time');
        if (wordsOpts) wordsOpts.classList.toggle('hidden', state.mode !== 'words');
        if (examOpts) examOpts.classList.toggle('hidden', state.mode !== 'exam');

        if (state.mode === 'exam') {
          state.duration = 300; // 5 min official exam standard
          document.querySelectorAll('.exam-btn').forEach(b => {
            const is300 = b.dataset.seconds === '300';
            b.classList.toggle('active', is300);
            b.classList.toggle('bg-[var(--bg-surface)]', is300);
            b.classList.toggle('font-bold', is300);
            b.classList.toggle('text-purple-600', is300);
            b.classList.toggle('text-[var(--text-muted)]', !is300);
          });
        }

        setupTest();
      });
    });

    // Time Duration Buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-btn').forEach(b => {
          b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
          b.classList.add('text-[var(--text-muted)]');
        });
        btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
        btn.classList.remove('text-[var(--text-muted)]');
        state.duration = parseInt(btn.dataset.seconds, 10);
        setupTest();
      });
    });

    // Word Count Buttons
    document.querySelectorAll('.word-count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.word-count-btn').forEach(b => {
          b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
          b.classList.add('text-[var(--text-muted)]');
        });
        btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-[var(--accent-primary)]');
        btn.classList.remove('text-[var(--text-muted)]');
        state.wordCount = parseInt(btn.dataset.words, 10);
        setupTest();
      });
    });

    // Exam Duration Buttons
    document.querySelectorAll('.exam-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.exam-btn').forEach(b => {
          b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-purple-600');
          b.classList.add('text-[var(--text-muted)]');
        });
        btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-purple-600');
        btn.classList.remove('text-[var(--text-muted)]');
        state.duration = parseInt(btn.dataset.seconds, 10);
        setupTest();
      });
    });

    // Difficulty Buttons
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => {
          b.classList.remove('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-amber-500');
          b.classList.add('text-[var(--text-muted)]');
        });
        btn.classList.add('active', 'bg-[var(--bg-surface)]', 'font-bold', 'text-amber-500');
        btn.classList.remove('text-[var(--text-muted)]');
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

    // Quick Quotes / Literature Button in Header
    document.getElementById('quick-quotes-btn')?.addEventListener('click', () => {
      state.lang = 'nepali_unicode';
      state.mode = 'quotes';
      state.difficulty = 'medium';

      document.querySelectorAll('.lang-tab-btn').forEach(b => {
        const isTarget = b.dataset.lang === 'nepali_unicode';
        b.classList.toggle('active', isTarget);
        b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
        b.classList.toggle('text-[var(--accent-primary)]', isTarget);
      });
      document.querySelectorAll('.mode-tab-btn').forEach(b => {
        const isTarget = b.dataset.mode === 'quotes';
        b.classList.toggle('active', isTarget);
        b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
        b.classList.toggle('text-[var(--accent-blue)]', isTarget);
      });
      setupTest();
    });

    // Sound toggle
    document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
      state.sound = !state.sound;
      document.getElementById('sound-icon-on')?.classList.toggle('hidden', !state.sound);
      document.getElementById('sound-icon-off')?.classList.toggle('hidden', state.sound);
    });

    // Toggle Keyboard Visualizer
    const kbToggleBtn = document.getElementById('toggle-keyboard-btn');
    const kbContainer = document.getElementById('keyboard-visualizer-container');
    const kbToggleTxt = document.getElementById('toggle-keyboard-text');

    kbToggleBtn?.addEventListener('click', () => {
      if (!kbContainer) return;
      const isHidden = kbContainer.classList.contains('hidden');
      kbContainer.classList.toggle('hidden', !isHidden);
      if (kbToggleTxt) kbToggleTxt.textContent = !isHidden ? 'Show Keys' : 'Hide Keys';
      kbToggleBtn.classList.toggle('bg-[var(--bg-surface-subtle)]', isHidden);
      if (isHidden) {
        kbContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Toggle Shift on Keyboard Visualizer
    document.getElementById('kb-shift-toggle')?.addEventListener('click', () => {
      state.isShift = !state.isShift;
      const ind = document.getElementById('kb-shift-indicator');
      if (ind) ind.className = state.isShift ? 'w-2 h-2 rounded-full bg-red-500 inline-block' : 'w-2 h-2 rounded-full bg-neutral-400 inline-block';
      renderKeyboard();
    });

    // Copy Results Summary
    document.getElementById('copy-result-btn')?.addEventListener('click', () => {
      const netWpm = document.getElementById('modal-net-wpm')?.textContent || '0';
      const acc = document.getElementById('modal-accuracy')?.textContent || '100%';
      const rawWpm = document.getElementById('modal-raw-wpm')?.textContent || '0';
      const rank = document.getElementById('modal-rank-pill')?.textContent || 'Master Typist';
      const meta = document.getElementById('modal-test-metadata')?.textContent || '';

      const summary = `🇳🇵 Nepali Typing PRO Results:\nLayout: ${meta}\nSpeed: ${netWpm} Net WPM (${rawWpm} Raw WPM)\nAccuracy: ${acc}\nRank: ${rank}\nPractice your Nepali typing: https://typing.topnepali.com`;

      navigator.clipboard?.writeText(summary).then(() => {
        const copyTxt = document.getElementById('copy-result-text');
        if (copyTxt) {
          const oldTxt = copyTxt.textContent;
          copyTxt.textContent = '✓ Copied!';
          setTimeout(() => { copyTxt.textContent = oldTxt; }, 2000);
        }
      }).catch(() => {});
    });

    // History Modal
    document.getElementById('open-history-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('history-modal');
      const table = document.getElementById('history-table-body');
      const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
      updatePersonalBestsCards();

      if (table) {
        if (hist.length === 0) {
          table.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-muted">No test records yet. Complete a test to record your stats!</td></tr>';
        } else {
          table.innerHTML = hist.map(r => `
            <tr>
              <td class="p-2.5 font-mono">${r.date}</td>
              <td class="p-2.5 uppercase font-medium">${(r.layout || '').replace('nepali_', '')}</td>
              <td class="p-2.5">${r.mode || `${r.duration}s`}</td>
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
        updatePersonalBestsCards();
        document.getElementById('open-history-btn')?.click();
      }
    });
  }

  // --- 17. INITIALIZE ON DOM READY ---
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
