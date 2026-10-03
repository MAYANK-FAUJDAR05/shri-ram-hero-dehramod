import { DealershipFaq } from '../types';

export const DEALERSHIP_FAQS: DealershipFaq[] = [
  // ==================== SERVICING FAQs ====================
  {
    id: 'servicing-schedule',
    category: 'servicing',
    popular: true,
    question: {
      en: 'What is the Free Service schedule for a new Hero motorcycle or scooter?',
      hi: 'नई हीरो मोटरसाइकिल या स्कूटर के लिए फ्री सर्विस का शेड्यूल क्या है?'
    },
    answer: {
      en: 'Every new Hero two-wheeler comes with 5 Free Periodic Services. The labor charge is 100% free during these services (consumables like engine oil, oil filter, and gaskets are chargeable at MRP):\n• 1st Service: 500 – 750 km or 60 days (crucial engine run-in inspection & oil flush)\n• 2nd Service: 3,000 – 3,500 km or 100 days\n• 3rd Service: 6,000 – 6,500 km or 200 days\n• 4th Service: 9,000 – 9,500 km or 300 days\n• 5th Service: 12,000 – 12,500 km or 400 days.',
      hi: 'हर नए हीरो दोपहिया वाहन के साथ 5 फ्री पीरियोडिक सर्विस कूपन मिलते हैं। इन सर्विस के दौरान लेबर चार्ज 100% मुफ्त होता है (केवल इंजन ऑयल व फ़िल्टर जैसे कंज्यूमेबल्स का वास्तविक मूल्य लिया जाता है):\n• पहली सर्विस: 500 – 750 किमी या 60 दिन\n• दूसरी सर्विस: 3,000 – 3,500 किमी या 100 दिन\n• तीसरी सर्विस: 6,000 – 6,500 किमी या 200 दिन\n• चौथी सर्विस: 9,000 – 9,500 किमी या 300 दिन\n• पांचवीं सर्विस: 12,000 – 12,500 किमी या 400 दिन।'
    },
    keyTakeaway: {
      en: '5 free labor services across 12,000 km or 400 days at any authorized Hero workshop.',
      hi: '12,000 किमी या 400 दिनों में 5 नि:शुल्क लेबर सर्विस किसी भी अधिकृत हीरो वर्कशॉप पर।'
    },
    tags: ['Free Service', 'Schedule', 'Maintenance', 'Kilometer Interval']
  },
  {
    id: 'servicing-joyride-amc',
    category: 'servicing',
    popular: true,
    question: {
      en: 'What is the Hero Joyride Annual Maintenance Contract (AMC) program?',
      hi: 'हीरो जॉयराइड वार्षिक रखरखाव अनुबंध (AMC) क्या है और इसके क्या फायदे हैं?'
    },
    answer: {
      en: 'Hero Joyride is an authorized smart Annual Maintenance Contract (AMC) that locks in heavy maintenance savings for 1 full year. Key privileges include:\n• 4 Scheduled maintenance services with 100% labor discount\n• 4 Free washing & polishing vouchers\n• 5% Flat discount on all Hero Genuine Spare Parts & engine oil\n• 10% Flat discount on additional labor jobs & minor repairs\n• Free safety check-ups before monsoon & festival journeys\n• Priority bay allocation with reduced turnaround time.',
      hi: 'हीरो जॉयराइड एक अधिकृत एनुअल मेंटेनेंस कॉन्ट्रैक्ट (AMC) है जो आपको 1 साल के लिए सर्विस खर्चों पर भारी बचत देता है:\n• 4 सर्विस में लेबर चार्ज पर 100% छूट\n• 4 फ्री वॉटर वॉशिंग व पॉलिशिंग\n• सभी हीरो जेन्युइन पार्ट्स और इंजन ऑयल पर 5% सीधी छूट\n• अतिरिक्त रिपेयर लेबर पर 10% की छूट\n• मानसून व त्योहारों से पहले फ्री सेफ्टी चेकअप\n• प्रायोरिटी सर्विस बे ताकि आपका समय बचे।'
    },
    keyTakeaway: {
      en: 'Saves up to ₹1,800 annually while ensuring 100% genuine parts & factory care.',
      hi: 'सालाना ₹1,800 तक की बचत और 100% ओरिजिनल पार्ट्स की गारंटी।'
    },
    tags: ['Joyride AMC', 'Discount', 'Free Wash', 'Savings']
  },
  {
    id: 'servicing-engine-oil',
    category: 'servicing',
    question: {
      en: 'Which engine oil is recommended for Hero BS6 motorcycles and scooters?',
      hi: 'हीरो BS6 मोटरसाइकिलों और स्कूटरों के लिए कौन सा इंजन ऑयल सबसे बेहतर है?'
    },
    answer: {
      en: 'Hero MotoCorp exclusively recommends "Hero 4T Plus Genuine 10W-30" (SJ / SL / JASO MA2 grade) semi-synthetic and premium synthetic oils. Formulated specifically for Indian operating temperatures and stop-and-go traffic, it provides:\n• Up to 9% better friction reduction compared to generic oils\n• Consistent xSens sensor performance and higher fuel mileage\n• Maximum heat dissipation in high-compression engines like Xpulse, Xtreme, and Splendor.\nWe always dispense genuine factory sealed packs with security holographic verification.',
      hi: 'हीरो मोटोकॉर्प आधिकारिक तौर पर "Hero 4T Plus Genuine 10W-30" (JASO MA2) इंजन ऑयल की सिफारिश करता है। यह भारतीय सड़कों व तापमान के लिए खास तैयार किया गया है:\n• साधारण ऑयल की तुलना में 9% तक कम घर्षण\n• xSens सेंसर्स का सटीक काम और बेहतर माइलेज\n• उच्च तापमान में इंजन को ठंडा और सुरक्षित रखना।\nहमारी वर्कशॉप में केवल सीलबंद और ओरिजिनल होलोग्राम वाला हीरो ऑयल ही उपयोग होता है।'
    },
    keyTakeaway: {
      en: 'Always demand Hero 4T Plus 10W-30 for optimal engine life, cooler running, and warranty validity.',
      hi: 'इंजन की लंबी उम्र और माइलेज के लिए हमेशा हीरो 4T प्लस 10W-30 ऑयल का ही प्रयोग करें।'
    },
    tags: ['Engine Oil', '10W-30', 'Hero 4T Plus', 'Mileage']
  },
  {
    id: 'servicing-pan-india',
    category: 'servicing',
    question: {
      en: 'Can I get my Hero motorcycle serviced at any dealership across India?',
      hi: 'क्या मैं भारत में किसी भी अधिकृत हीरो वर्कशॉप पर अपनी बाइक की सर्विस करा सकता हूँ?'
    },
    answer: {
      en: 'Yes, absolutely. Hero MotoCorp operates a centralized digital Dealer Management System (DMS). Your vehicle chassis number, service history, Joyride AMC validity, and warranty records are digitally accessible across 6,000+ authorized dealerships and service touchpoints throughout India. Whether touring in Himachal or commuting in Kerala, your warranty and free service coupons remain fully honored.',
      hi: 'जी हाँ, बिल्कुल। हीरो मोटोकॉर्प का डीलर मैनेजमेंट सिस्टम पूरी तरह से डिजिटल और सेंट्रलाइज्ड है। आपकी बाइक का चेसिस नंबर, सर्विस रिकॉर्ड, जॉयराइड AMC और वारंटी भारत के 6,000+ अधिकृत टचपॉइंट्स पर उपलब्ध रहते हैं। आप देश के किसी भी शहर में अपनी फ्री सर्विस या रिपेयर करा सकते हैं।'
    },
    keyTakeaway: {
      en: 'Pan-India digital service records accessible across 6,000+ official Hero centers.',
      hi: 'देश भर के 6,000+ सेंटर्स पर डिजिटल सर्विस रिकॉर्ड और फ्री सर्विस कूपन मान्य।'
    },
    tags: ['Pan India', 'Service Network', 'Digital History', 'Touring']
  },
  {
    id: 'servicing-booking',
    category: 'servicing',
    question: {
      en: 'How do I book a scheduled or Express 60-Minute Service at Shri Ram Hero?',
      hi: 'श्री राम हीरो में सर्विस बुक करने या एक्सप्रेस 60-मिनट सर्विस लेने का तरीका क्या है?'
    },
    answer: {
      en: 'We offer hassle-free service booking options:\n1. Agency Helpline: Call our agency reception directly at 8890992086\n2. Hero AI Chat Assistant: Ask the on-screen Hero AI Advisor to request a service callback\n3. Walk-in Express 60-Min Bay: Dedicated bays for minor periodic service (oil change, wash, brake tuning) completed within 60 minutes with a comfortable AC customer lounge and live vehicle inspection screen.',
      hi: 'आप आसानी से सर्विस बुक कर सकते हैं:\n1. एजेंसी हेल्पलाइन: हमारे एजेंसी नंबर 8890992086 पर कॉल करें\n2. हीरो AI चैटबॉट: स्क्रीन पर उपलब्ध हीरो AI असिस्टेंट से सर्विस कॉलबैक का अनुरोध करें\n3. 60-मिनट एक्सप्रेस बे: रूटीन सर्विस (ऑयल चेंज, वॉशिंग, ब्रेक एडजस्टमेंट) मात्र 60 मिनट में कराएं। हमारे एसी लाउंज में बैठकर लाइव काम देखें।'
    },
    keyTakeaway: {
      en: 'Express 60-minute service available with dedicated technicians and customer lounge.',
      hi: 'डेडिकेटेड बे के साथ 60 मिनट में एक्सप्रेस सर्विस और आरामदायक लाउंज की सुविधा।'
    },
    tags: ['Express Service', 'Booking', 'Customer Lounge', 'Fast Turnaround']
  },

  // ==================== INSURANCE FAQs ====================
  {
    id: 'insurance-structure',
    category: 'insurance',
    popular: true,
    question: {
      en: 'What insurance policy is included when purchasing a new Hero two-wheeler?',
      hi: 'नया हीरो दोपहिया वाहन खरीदते समय कौन सा इंश्योरेंस पैकेज मिलता है?'
    },
    answer: {
      en: 'As per Government of India & IRDAI mandates, all new two-wheelers are sold with a "1 + 5 Year Package Policy":\n• 1-Year Comprehensive Own Damage (OD) Cover: Protects against accidents, theft, fire, natural disasters, and vandalism.\n• 5-Year Mandatory Third Party (TP) Liability Cover: Covers legal liability for third-party bodily injury, death, and property damage for five full years.\nAfter Year 1, you only need to renew the Own Damage (OD) component annually, while your Third Party cover remains active for the entire 5 years.',
      hi: 'IRDAI और भारत सरकार के नियमों के अनुसार, हर नए दोपहिया वाहन पर "1 + 5 वर्ष का पैकेज इंश्योरेंस" दिया जाता है:\n• 1 साल का ओन डैमेज (OD) कवर: दुर्घटना, चोरी, आग, बाढ़ और प्राकृतिक आपदाओं से पूर्ण सुरक्षा।\n• 5 साल का थर्ड पार्टी (TP) कवर: कानूनी रूप से अनिवार्य 5 साल का थर्ड पार्टी लायबिलिटी कवर।\nपहले साल के बाद आपको केवल ओन डैमेज (OD) पॉलिसी को सालाना रिन्यू कराना होता है, थर्ड पार्टी 5 साल तक चालू रहती है।'
    },
    keyTakeaway: {
      en: 'Includes 1-Year Own Damage protection + 5-Year uninterrupted Third Party liability.',
      hi: '1 वर्ष का संपूर्ण सुरक्षा कवर + 5 वर्ष का अनिवार्य थर्ड पार्टी लीगल कवर।'
    },
    tags: ['1+5 Year Policy', 'Comprehensive', 'Third Party', 'IRDAI']
  },
  {
    id: 'insurance-cashless-claims',
    category: 'insurance',
    popular: true,
    question: {
      en: 'Does Shri Ram Hero offer Cashless Accidental Claim settlements?',
      hi: 'क्या श्री राम हीरो में दुर्घटना क्लेम पर कैशलेस सुविधा उपलब्ध है?'
    },
    answer: {
      en: 'Yes! Shri Ram Hero has direct tie-ups with India’s leading general insurance providers including ICICI Lombard, Bajaj Allianz, HDFC ERGO, New India Assurance, Oriental Insurance, and Tata AIG.\n• Paperless Digital Processing: Our dedicated in-house insurance desk handles surveyor approvals and estimates directly.\n• Zero Out-of-Pocket Payment: The insurance company pays our authorized workshop directly. You only pay the standard compulsory deductible (typically ₹100) and non-metallic consumable charges (if zero-dep is not opted).\n• Genuine Spares Guarantee: 100% Hero Genuine parts are installed on all claim repairs.',
      hi: 'जी हाँ! श्री राम हीरो का ICICI Lombard, Bajaj Allianz, HDFC ERGO, New India Assurance और Tata AIG जैसी प्रमुख बीमा कंपनियों के साथ सीधा कैशलेस टाई-अप है:\n• पेपरलेस डिजिटल क्लेम: हमारी डीलरशिप का इंश्योरेंस डेस्क सीधे सर्वेयर अप्रूवल कराता है।\n• सीधे कंपनी द्वारा भुगतान: बिल का भुगतान बीमा कंपनी सीधे वर्कशॉप को करती है। आपको सिर्फ अनिवार्य डिडक्टिबल (लगभग ₹100) देना होता है।\n• ओरिजिनल पार्ट्स: सभी रिपेयरिंग में 100% हीरो जेन्युइन स्पेयर पार्ट्स ही लगाए जाते हैं।'
    },
    keyTakeaway: {
      en: 'Direct cashless tie-ups with top insurers; zero hassle and paperless claim filing.',
      hi: 'प्रमुख बीमा कंपनियों के साथ डायरेक्ट कैशलेस सुविधा, बिना किसी झंझट के क्लेम सेटलमेंट।'
    },
    tags: ['Cashless Claim', 'Tie-up Insurers', 'Accident Repair', 'In-house Desk']
  },
  {
    id: 'insurance-ncb-transfer',
    category: 'insurance',
    question: {
      en: 'Can I transfer my No Claim Bonus (NCB) discount from my old two-wheeler?',
      hi: 'क्या मैं अपने पुराने दोपहिया वाहन का नो क्लेम बोनस (NCB) नए वाहन पर ट्रांसफर करा सकता हूँ?'
    },
    answer: {
      en: 'Yes! No Claim Bonus belongs to you as a safe rider, not to the old vehicle. If you haven’t made an insurance claim on your previous two-wheeler, you can transfer between 20% to 50% NCB to your new Hero motorcycle or scooter.\nJust provide the NCB Retention Letter or previous policy copy from your existing insurer. Our insurance desk will apply the discount directly to your new Own Damage premium, saving you up to ₹1,500 – ₹2,500 instantly on delivery.',
      hi: 'जी हाँ! नो क्लेम बोनस (NCB) वाहन मालिक को मिलता है। यदि आपने अपनी पिछली बाइक पर कोई क्लेम नहीं लिया था, तो आप 20% से लेकर 50% तक का NCB डिस्काउंट अपनी नई हीरो बाइक पर ट्रांसफर करा सकते हैं।\nबस अपनी पुरानी पॉलिसी या NCB लेटर हमारे सेल्स डेस्क पर दें। हम तुरंत आपकी नई बाइक के प्रीमियम में से यह छूट घटा देंगे, जिससे आपको ₹1,500 से ₹2,500 तक की सीधी बचत होगी।'
    },
    keyTakeaway: {
      en: 'Transfer up to 50% NCB from your old two-wheeler to cut your new bike premium.',
      hi: 'पुराने वाहन से 50% तक NCB ट्रांसफर कराकर नए वाहन के इंश्योरेंस पर भारी बचत पाएं।'
    },
    tags: ['No Claim Bonus', 'NCB Transfer', 'Premium Discount', 'Safe Driver']
  },
  {
    id: 'insurance-zero-dep',
    category: 'insurance',
    question: {
      en: 'What is Zero Depreciation (Bumper-to-Bumper) cover and why is it recommended?',
      hi: 'जीरो डेप्रिसिएशन (बंपर-टू-बंपर) कवर क्या है और इसे लेना क्यों जरूरी है?'
    },
    answer: {
      en: 'Standard two-wheeler insurance deducts 30% to 50% depreciation on fiber, plastic, rubber, and nylon parts during an accident claim. A Zero Depreciation (Nil Dep / Bumper-to-Bumper) add-on ensures:\n• 100% claim settlement on plastic, fiber fairings, headlamps, and metal body panels with zero depreciation penalty\n• Maximum financial peace of mind, especially on faired sports bikes (Karizma XMR, Xtreme 125R) and stylish scooters (Xoom, Destini, Vida V1)\n• Shri Ram Hero provides Zero Dep coverage options at subsidized rates during vehicle purchase.',
      hi: 'साधारण बीमा में क्लेम के समय फाइबर, प्लास्टिक और रबर पार्ट्स पर 30% से 50% तक की कटौती कर ली जाती है। लेकिन जीरो डेप्रिसिएशन (Zero-Dep) ऐड-ऑन लेने पर:\n• प्लास्टिक, फाइबर बॉडी, हेडलाइट और मेटल पार्ट्स पर 100% खर्च बीमा कंपनी वहन करती है।\n• विशेषकर Karizma XMR, Xtreme 125R, Xoom और Vida EV जैसे वाहनों के लिए यह बेहद लाभदायक है।\n• श्री राम हीरो पर वाहन डिलीवरी के समय यह सुरक्षा बेहद किफायती दरों पर जोड़ी जा सकती है।'
    },
    keyTakeaway: {
      en: 'Zero cut on plastic & fiber parts; 100% parts cost reimbursed during accident repairs.',
      hi: 'दुर्घटना में प्लास्टिक व फाइबर पार्ट्स पर 0% कटौती, पूरा खर्च कंपनी द्वारा वहन।'
    },
    tags: ['Zero Dep', 'Bumper to Bumper', 'Fairing Protection', 'Add-on']
  },
  {
    id: 'insurance-renewal',
    category: 'insurance',
    question: {
      en: 'How can I renew my lapsed or expiring Hero two-wheeler insurance?',
      hi: 'अगर मेरी बाइक का इंश्योरेंस खत्म हो गया है या होने वाला है तो मैं इसे कैसे रिन्यू कराऊं?'
    },
    answer: {
      en: 'We run a dedicated Renewal & Protection Helpdesk. Even if your insurance has already lapsed:\n• Instant digital quotes across 8+ authorized insurance partners\n• Doorstep or WhatsApp-based self-inspection link if policy expired past 90 days\n• Immediate policy PDF delivered via WhatsApp & email within 5 minutes\n• Inspection and spot renewal available while your bike is in for routine servicing.',
      hi: 'हमारे शोरूम पर एक समर्पित इंश्योरेंस रिन्यूअल डेस्क है। यदि आपकी पॉलिसी खत्म भी हो चुकी है:\n• 8+ बड़ी कंपनियों के सबसे सस्ते व बेहतरीन कोट्स मात्र 2 मिनट में\n• अगर 90 दिन से ज्यादा का गैप है तो व्हाट्सएप पर आसान वीडियो इंस्पेक्शन\n• तुरंत व्हाट्सएप और ईमेल पर ओरिजिनल पॉलिसी की कॉपी\n• जब आपकी बाइक सर्विस के लिए आए, उसी समय हाथ के हाथ रिन्यूअल की सुविधा।'
    },
    keyTakeaway: {
      en: 'Instant 5-minute renewal with competitive premiums and spot inspection assistance.',
      hi: 'मात्र 5 मिनट में बिना किसी झंझट के तुरंत पॉलिसी रिन्यूअल और व्हाट्सएप डिलीवरी।'
    },
    tags: ['Renewal', 'Lapsed Policy', 'Instant Quote', 'Quick Issuance']
  },

  // ==================== WARRANTY FAQs ====================
  {
    id: 'warranty-period',
    category: 'warranty',
    popular: true,
    question: {
      en: 'What is the standard manufacturer warranty on Hero motorcycles and scooters?',
      hi: 'हीरो मोटरसाइकिल और स्कूटर पर कंपनी की तरफ से कितनी वारंटी मिलती है?'
    },
    answer: {
      en: 'Hero MotoCorp provides an industry-leading standard warranty on every vehicle straight from the factory:\n• Motorcycles (Splendor, Passion, HF Deluxe, Glamour, Xtreme, Xpulse, Karizma): 5 Years or 70,000 Kilometers (whichever occurs first)\n• Scooters (Pleasure+, Destini 125, Xoom 110/125R): 5 Years or 50,000 Kilometers\n• Premium Vida V1 EV: 3 Years or 30,000 km vehicle warranty + 3-Year / 30,000 km battery warranty\nThis warranty covers manufacturing defects in all core mechanical and electrical assemblies, repaired free of charge with genuine parts.',
      hi: 'हीरो मोटोकॉर्प अपने सभी दोपहिया वाहनों पर ऑटोमोबाइल इंडस्ट्री की सबसे भरोसेमंद वारंटी प्रदान करता है:\n• मोटरसाइकिलें (Splendor, Passion, HF Deluxe, Glamour, Xtreme, Xpulse, Karizma): 5 साल या 70,000 किलोमीटर (जो भी पहले हो)\n• स्कूटर्स (Pleasure+, Destini, Xoom): 5 साल या 50,000 किलोमीटर\n• Vida V1 इलेक्ट्रिक: 3 साल या 30,000 किमी वाहन वारंटी + 3 साल या 30,000 किमी बैटरी वारंटी।\nयह वारंटी इंजन, गियरबॉक्स और चेसिस के सभी तकनीकी फॉल्ट्स को पूरी तरह फ्री में ठीक करने का वचन देती है।'
    },
    keyTakeaway: {
      en: '5 Years / 70,000 km on motorcycles & 5 Years / 50,000 km on scooters.',
      hi: 'मोटरसाइकिल पर 5 साल/70,000 किमी व स्कूटर पर 5 साल/50,000 किमी की लंबी वारंटी।'
    },
    tags: ['5-Year Warranty', '70000 km', 'Manufacturer Guarantee', 'Coverage']
  },
  {
    id: 'warranty-vida-battery',
    category: 'warranty',
    popular: true,
    question: {
      en: 'What warranty is offered on the Vida V1 electric scooter battery pack?',
      hi: 'Vida V1 इलेक्ट्रिक स्कूटर के बैटरी पैक पर कितनी वारंटी और सुरक्षा मिलती है?'
    },
    answer: {
      en: 'The Vida V1 powered by Hero features dual removable high-density lithium-ion batteries engineered for extreme Indian weather:\n• Battery Warranty: 3 Years or 30,000 km warranty covering capacity degradation below manufacturer thresholds.\n• IP67 Certified: 100% waterproof and dustproof battery packs tested under heavy waterlogging and monsoon conditions.\n• Battery Management System (BMS): Continuous real-time thermal monitoring, short-circuit cut-off, and overcharge protection.\n• Swappable Convenience: Easily charge at home via standard 5A/15A socket or quick-swap at Vida fast charging stations.',
      hi: 'हीरो के Vida V1 इलेक्ट्रिक स्कूटर में दो रिमूवेबल लिथियम-आयन बैटरी पैक दिए गए हैं:\n• बैटरी वारंटी: 3 साल या 30,000 किमी की पूर्ण वारंटी।\n• IP67 सर्टिफाइड: पानी और धूल से 100% सुरक्षित, भारी बारिश और जलभराव में पूरी तरह टेस्टेड।\n• स्मार्ट BMS: ओवरहीटिंग, शॉर्ट सर्किट और ओवरचार्जिंग से रियल-टाइम सुरक्षा।\n• आसान चार्जिंग: घर के सामान्य 5A सॉकेट पर या फास्ट चार्जिंग नेटवर्क पर तुरंत चार्ज करें।'
    },
    keyTakeaway: {
      en: '3 Years / 30,000 km IP67 waterproof lithium-ion battery warranty with smart BMS monitoring.',
      hi: '3 साल/30,000 किमी की IP67 वॉटरप्रूफ रिमूवेबल बैटरी वारंटी और स्मार्ट सुरक्षा।'
    },
    tags: ['Vida EV', 'Battery Warranty', 'IP67 Waterproof', 'Lithium-ion']
  },
  {
    id: 'warranty-coverage-exclusions',
    category: 'warranty',
    question: {
      en: 'What is covered under the Hero warranty, and what items are excluded?',
      hi: 'हीरो वारंटी में किन पार्ट्स की गारंटी होती है और कौन से पार्ट्स इसमें शामिल नहीं हैं?'
    },
    answer: {
      en: 'Here is the transparent breakdown:\n• WHAT IS COVERED: Engine block, cylinder head, crankshaft, transmission gears, fuel injection system, ECU/sensors, wiring harness, digital meter console, starter motor, rear shock absorbers, and swingarm.\n• WHAT IS EXCLUDED (Normal wear & tear items): Brake shoes/pads, clutch plates, spark plugs, drive chain & sprockets, halogen/LED bulbs, tires & tubes (covered by tire manufacturer), filters, engine oil, and cables.\n• Also excluded: Accidental damage, water ingestion due to deep flood diving, or damage from adulterated fuel.',
      hi: 'वारंटी के तहत कवरेज का स्पष्ट विवरण इस प्रकार है:\n• क्या शामिल है (कवर्ड): इंजन ब्लॉक, पिस्टन, सिलेंडर, गियरबॉक्स, फ्यूल इंजेक्शन (FI), ECU और सेंसर्स, वायरिंग हार्नेस, डिजिटल स्पीडोमीटर, स्टार्टर मोटर, सस्पेंशन और चेसिस।\n• क्या शामिल नहीं है (वियर एंड टियर): ब्रेक शू/पैड्स, क्लच प्लेट्स, स्पार्क प्लग, ड्राइव चेन, बल्ब, टायर व ट्यूब (टायर कंपनी द्वारा कवर्ड), केबल्स और इंजन ऑयल।\n• दुर्घटना या गलत फ्यूल से हुआ नुकसान वारंटी में नहीं, बल्कि इंश्योरेंस में कवर होता है।'
    },
    keyTakeaway: {
      en: 'Core mechanical & electrical components fully covered; regular wear items excluded.',
      hi: 'इंजन, गियरबॉक्स व इलेक्ट्रिकल पार्ट्स पूरी तरह कवर्ड; घिसने वाले पार्ट्स सामान्य रूप से बाहर।'
    },
    tags: ['Coverage', 'Exclusions', 'Engine Warranty', 'Wear and Tear']
  },
  {
    id: 'warranty-aftermarket-accessories',
    category: 'warranty',
    question: {
      en: 'Does installing third-party aftermarket accessories void my Hero warranty?',
      hi: 'क्या बाहर से एक्सेसरीज या हॉर्न लगवाने से मेरी बाइक की वारंटी खत्म हो जाएगी?'
    },
    answer: {
      en: 'Yes, improper aftermarket electrical modifications pose serious warranty risks:\n• Wire Splicing / Cutting: Splicing into the original wiring harness to fit high-decibel horns, non-certified loud LED flashers, or GPS immobilizers immediately voids the electrical wiring, ECU, and battery warranty.\n• Engine Tuning / Free-Flow Exhausts: Third-party exhaust modifications void engine and catalytic converter warranty.\n• The Safe Solution: Always choose "Hero Genuine Accessories" (HGA) available at Shri Ram Hero. These use OEM plug-and-play couplers with no wire cutting, maintaining 100% factory warranty integrity.',
      hi: 'जी हाँ, बाहर से गलत वायरिंग या एक्सेसरीज लगवाने पर वारंटी अमान्य हो सकती है:\n• तार काटना या छीलना: तेज हॉर्न, सस्ती LED लाइट या जीपीएस लगाने के लिए ओरिजिनल वायरिंग काटना वारंटी को तुरंत रद्द कर देता है।\n• साइलेंसर मॉडिफिकेशन: लोकल एग्जॉस्ट लगाने से इंजन वारंटी खत्म हो जाती है।\n• सुरक्षित उपाय: हमेशा श्री राम हीरो से "Hero Genuine Accessories (HGA)" ही लगवाएं, जो ओरिजिनल कपलर-टू-कपलर फिटिंग के साथ आती हैं और वारंटी 100% सुरक्षित रहती है।'
    },
    keyTakeaway: {
      en: 'Wire-cutting voids electrical warranty; always use plug-and-play Hero Genuine Accessories.',
      hi: 'ओरिजिनल तार काटने पर वारंटी रद्द हो सकती है; हमेशा प्लग-एंड-प्ले ओरिजिनल हीरो एक्सेसरीज ही चुनें।'
    },
    tags: ['Accessories', 'Void Warranty', 'Wire Cutting', 'Hero Genuine']
  },
  {
    id: 'warranty-maintenance-rules',
    category: 'warranty',
    question: {
      en: 'How do I keep my 5-Year Hero warranty 100% active without risk of rejection?',
      hi: 'अपनी 5 साल की वारंटी को बिना किसी रुकावट के एक्टिव रखने के लिए क्या नियम हैं?'
    },
    answer: {
      en: 'Keeping your warranty intact is simple and requires only 3 good habits:\n1. Adhere to Scheduled Maintenance: Complete your 5 free services and subsequent paid services within the recommended kilometer/time window at any authorized Hero workshop.\n2. Insist on Hero Genuine Parts & 4T Plus Oil: Always ensure genuine parts and recommended Hero 4T Plus oil are used during service (invoiced digitally on your DMS job card).\n3. Avoid Unauthorized Mechanic Alterations: Never let untrained roadside mechanics open the engine casing, bore the cylinder, or tamper with the fuel injection system.',
      hi: 'अपनी 5 साल की वारंटी को 100% सुरक्षित रखने के 3 आसान नियम हैं:\n1. समय पर सर्विस कराएं: अपने 5 फ्री सर्विस कूपन और उसके बाद की पेड सर्विस तय समय व किलोमीटर के अंदर अधिकृत वर्कशॉप से ही कराएं।\n2. ओरिजिनल स्पेयर पार्ट्स और हीरो ऑयल: हमेशा बिल वाले ओरिजिनल हीरो स्पेयर पार्ट्स और 4T Plus ऑयल का ही उपयोग करें।\n3. अनधिकृत मिस्त्री से इंजन न खुलवाएं: बाहर के लोकल मैकेनिक से इंजन या फ्यूल इंजेक्शन सिस्टम में छेड़छाड़ न कराएं।'
    },
    keyTakeaway: {
      en: 'Timely service at authorized dealers + genuine Hero oil keeps your 5-year warranty bulletproof.',
      hi: 'समय पर अधिकृत वर्कशॉप से सर्विस और असली हीरो ऑयल से आपकी 5 साल की वारंटी पूरी तरह सुरक्षित।'
    },
    tags: ['Keep Warranty Active', 'Best Practices', 'Timely Service', 'Job Card']
  },

  // ==================== FINANCE & REGISTRATION FAQs ====================
  {
    id: 'finance-herofincorp',
    category: 'finance',
    popular: true,
    question: {
      en: 'What documents are required for instant two-wheeler loan approval at Shri Ram Hero?',
      hi: 'श्री राम हीरो में तुरंत लोन अप्रूवल के लिए किन दस्तावेजों (डॉक्यूमेंट्स) की जरूरत होती है?'
    },
    answer: {
      en: 'With our on-site Hero FinCorp, HDFC Bank, IDFC First, and L&T Finance representative counters, loan approvals take just 15 to 30 minutes. Required documents:\n• KYC: Aadhaar Card & PAN Card (mandatory)\n• Address Proof: Aadhaar Card, Electricity Bill, or Ration Card\n• Income Proof: 3 to 6 months bank statement or passbook photocopy (special low-documentation schemes also available for farmers and self-employed individuals)\n• Down payment schemes starting as low as ₹5,999 with flexible EMI tenures of 12, 24, 36, and 48 months.',
      hi: 'हमारे शोरूम पर उपस्थित Hero FinCorp, HDFC Bank, IDFC First और L&T Finance के काउंटर्स से लोन मात्र 15 से 30 मिनट में अप्रूव हो जाता है। आवश्यक दस्तावेज:\n• पहचान पत्र: आधार कार्ड और पैन कार्ड (अनिवार्य)\n• पते का प्रमाण: आधार कार्ड, बिजली बिल या राशन कार्ड\n• आय प्रमाण: 3 से 6 महीने का बैंक स्टेटमेंट या पासबुक कॉपी (किसानों और व्यापारियों के लिए बिना इनकम प्रूफ वाली विशेष स्कीमें भी उपलब्ध)\n• मात्र ₹5,999 के न्यूनतम डाउन पेमेंट और 12 से 48 महीने की आसान किश्तों की सुविधा।'
    },
    keyTakeaway: {
      en: 'Instant 15-minute approval with Aadhaar + PAN; down payments starting at just ₹5,999.',
      hi: 'आधार व पैन कार्ड पर 15 मिनट में लोन अप्रूवल, मात्र ₹5,999 से डाउन पेमेंट शुरू।'
    },
    tags: ['Hero FinCorp', 'Loan Documents', 'Low Down Payment', 'Instant Approval']
  },
  {
    id: 'finance-exchange-bonus',
    category: 'finance',
    question: {
      en: 'Can I exchange my old two-wheeler of any brand for a brand new Hero vehicle?',
      hi: 'क्या मैं किसी भी कंपनी की पुरानी बाइक देकर नई हीरो बाइक एक्सचेंज कर सकता हूँ?'
    },
    answer: {
      en: 'Yes! Shri Ram Hero accepts old motorcycles and scooters of ANY brand (Honda, TVS, Bajaj, Yamaha, Suzuki, or older Hero/Hero Honda models):\n• Transparent 25-Point Evaluation: Evaluated in under 15 minutes by certified assessors.\n• Extra Exchange Bonus: Get up to ₹3,000 to ₹5,000 additional manufacturer exchange loyalty bonus on select models.\n• Instant Down Payment Offset: The evaluated value is immediately adjusted against your new vehicle down payment, eliminating cash strain.\n• Free RC Transfer Assistance: We handle the legal paperwork and ownership transfer for complete peace of mind.',
      hi: 'जी हाँ! श्री राम हीरो पर आप किसी भी कंपनी (Honda, TVS, Bajaj, Yamaha, Suzuki या पुरानी Hero Honda) की बाइक या स्कूटर देकर नई हीरो बाइक ले सकते हैं:\n• 15 मिनट में पारदर्शी 25-पॉइंट वैल्यूएशन हमारे एक्सपर्ट्स द्वारा\n• ₹3,000 से ₹5,000 तक का अतिरिक्त एक्सचेंज बोनस\n• पुरानी बाइक की पूरी कीमत नई बाइक के डाउन पेमेंट में तुरंत एडजस्ट हो जाती है\n• RC ट्रांसफर का पूरा कानूनी काम हमारी टीम द्वारा मुफ्त संभाला जाता है।'
    },
    keyTakeaway: {
      en: 'Accepts all brands with up to ₹5,000 exchange bonus and legal RC transfer assistance.',
      hi: 'सभी ब्रांड्स स्वीकार्य, ₹5,000 तक का एक्सचेंज बोनस और फ्री आरसी ट्रांसफर सहायता।'
    },
    tags: ['Exchange Bonus', 'Old Bike Exchange', '25-point Valuation', 'RC Transfer']
  }
];
