export interface PrivacySection {
  id: string;
  emoji: string;
  title: {
    en: string;
    te: string;
    hi: string;
  };
  content: {
    en: string;
    te: string;
    hi: string;
  };
}

export const privacySections: PrivacySection[] = [
  {
    id: "intro",
    emoji: "🛡️",
    title: {
      en: "Privacy Commitment",
      te: "గోప్యతా నిబద్ధత",
      hi: "गोपनीयता प्रतिबद्धता"
    },
    content: {
      en: "Welcome to Orvakal Digital Hub. We are committed to protecting your privacy. This policy explains what device permissions we use and how we handle your data.",
      te: "ఓర్వకల్లు డిజిటల్ హబ్‌కు స్వాగతం. మీ గోప్యతను రక్షించడానికి మేము కట్టుబడి ఉన్నాము. ఈ యాప్ ఏ ఏ అనుమతులు ఉపయోగిస్తుంది మరియు మీ డేటాను ఎలా నిర్వహిస్తుందో ఈ విధానం వివరిస్తుంది.",
      hi: "ओरवाकल डिजिटल हब में आपका स्वागत है। हम आपकी गोपनीयता की रक्षा करने के लिए प्रतिबद्ध हैं। यह नीति बताती है कि हम किन डिवाइस अनुमतियों का उपयोग करते हैं और आपके डेटा को कैसे संभालते हैं।"
    }
  },
  {
    id: "location",
    emoji: "📍",
    title: {
      en: "Location Usage (GPS)",
      te: "స్థాన వినియోగం (GPS)",
      hi: "स्थान का उपयोग (जीपीएस)"
    },
    content: {
      en: "We access your location (ACCESS_FINE_LOCATION) to dynamically calculate the distance to local public resources (banks, schools, hospitals) and sort them. All distance sorting is processed locally on your device; your coordinates are never saved or sent to any server.",
      te: "సమీపంలోని సేవలు (బ్యాంకులు, ఆసుపత్రులు, పాఠశాలలు) దూరాన్ని లెక్కించడానికి మరియు క్రమబద్ధీకరించడానికి మేము స్థాన అనుమతులను (GPS) ఉపయోగిస్తాము. ఈ లెక్కలు పూర్తిగా మీ పరికరంలోనే జరుగుతాయి మరియు మీ అక్షాంశరేఖాంశాలు ఎక్కడా నిల్వ చేయబడవు లేదా ఏ సర్వర్‌కు పంపబడవు.",
      hi: "हम आस-पास की सुविधाओं (बैंकों, स्कूलों, अस्पतालों) की दूरी की गणना करने और उन्हें व्यवस्थित करने के लिए आपके स्थान (ACCESS_FINE_LOCATION) का उपयोग करते हैं। दूरी की सभी गणनाएँ आपके डिवाइस पर स्थानीय रूप से की जाती हैं; आपके निर्देशांक कभी सहेजे या किसी सर्वर पर नहीं भेजे जाते हैं।"
    }
  },
  {
    id: "audio",
    emoji: "🎙️",
    title: {
      en: "Microphone & Accessibility",
      te: "మైక్రోఫోన్ & యాక్సెసిబిలిటీ",
      hi: "माइक्रोफ़ोन और एक्सेसिबिलिटी"
    },
    content: {
      en: "To assist rural users and provide text-to-speech audio reader support in English, Telugu, and Hindi, the app requests microphone permissions. Audio inputs are processed strictly on-device and are never recorded, saved, or uploaded.",
      te: "గ్రామీణ వినియోగదారుల సౌలభ్యం కోసం ఇంగ్లీష్, తెలుగు మరియు హిందీలలో ఆడియో రీడర్ మరియు వాయిస్ అసిస్టెన్స్ ఫీచర్లకు మద్దతు ఇవ్వడానికి యాప్ మైక్రోఫోన్ అనుమతిని అడుగుతుంది. ఆడియో ప్రాసెసింగ్ పరికరంలోనే జరుగుతుంది మరియు రికార్డ్ చేయబడదు లేదా అప్‌లోడ్ చేయబడదు.",
      hi: "ग्रामीण उपयोगकर्ताओं की सहायता करने और अंग्रेजी, तेलुगु और हिंदी में टेक्स्ट-टू-स्पीच ऑडियो रीडर सहायता प्रदान करने के लिए, ऐप माइक्रोफ़ोन अनुमतियों का अनुरोध करता है। ऑडियो केवल आपके डिवाइस पर संसाधित किया जाता है और कभी भी रिकॉर्ड, सहेजा या अपलोड नहीं किया जाता है।"
    }
  },
  {
    id: "internet",
    emoji: "🌐",
    title: {
      en: "Internet & Live Data",
      te: "ఇంటర్నెట్ & ప్రత్యక్ష సమాచారం",
      hi: "इंटरनेट और लाइव डेटा"
    },
    content: {
      en: "Internet access is used to load live weather updates from Open-Meteo, mandi prices, and official notices. These requests are anonymous and do not contain any personal identifier or tracking cookies.",
      te: "వాతావరణం (ఓపెన్-మెటియో ద్వారా), మార్కెట్ ధరలు మరియు నోటీసుల వంటి ప్రత్యక్ష సమాచారాన్ని లోడ్ చేయడానికి ఇంటర్నెట్ అనుమతి ఉపయోగించబడుతుంది. ఈ అభ్యర్థనలు పూర్తిగా అనామకమైనవి మరియు వ్యక్తిగత గుర్తింపు వివరాలను కలిగి ఉండవు.",
      hi: "ओपन-मेटियो से लाइव मौसम अपडेट, मंडी की कीमतें और आधिकारिक नोटिस लोड करने के लिए इंटरनेट का उपयोग किया जाता है। ये अनुरोध अज्ञात हैं और इसमें कोई व्यक्तिगत पहचानकर्ता या ट्रैकिंग कुकीज़ नहीं हैं।"
    }
  },
  {
    id: "accounts",
    emoji: "👤",
    title: {
      en: "No Accounts Required",
      te: "లాగిన్ అవసరం లేదు",
      hi: "लॉगिन की आवश्यकता नहीं"
    },
    content: {
      en: "You can use all main directories, tools, and calculators without creating an account or providing personal details. Optional interactive features (like submitting a grievance to the Panchayat or posting a job listing) only collect and transmit the specific fields you choose to submit.",
      te: "యాప్‌లోని వివరాలు మరియు సాధనాలను ఉపయోగించడానికి ఎటువంటి లాగిన్ లేదా వ్యక్తిగత వివరాలు అవసరం లేదు. ఐచ్ఛిక ఫీచర్లు (పంచాయతీకి ఫిర్యాదు చేయడం లేదా ఉద్యోగ పోస్టింగ్) మాత్రమే మీరు నమోదు చేసిన వివరాలను సంబంధిత ప్రక్రియ కోసం సేకరిస్తాయి.",
      hi: "आप बिना कोई खाता बनाए या व्यक्तिगत विवरण दिए सभी मुख्य निर्देशिकाओं और उपकरणों का उपयोग कर सकते हैं। वैकल्पिक इंटरैक्टिव सुविधाएं (जैसे पंचायत में शिकायत दर्ज करना या नौकरी पोस्ट करना) केवल उन्हीं विशिष्ट फ़ील्ड को एकत्र और प्रसारित करती हैं जिन्हें आप सबमिट करना चुनते हैं।"
    }
  },
  {
    id: "control",
    emoji: "⚙️",
    title: {
      en: "Your Control",
      te: "మీ నియంత్రణ",
      hi: "आपका नियंत्रण"
    },
    content: {
      en: "You can turn off location and microphone permissions at any time through your device settings. Disabling location will fall back to alphabetical list sorting, and the app will continue to remain fully functional.",
      te: "మీరు మీ మొబైల్ సెట్టింగ్స్ ద్వారా ఎప్పుడైనా స్థాన మరియు మైక్రోఫోన్ అనుమతులను నిలిపివేయవచ్చు. స్థాన అనుమతి లేకపోతే జాబితాలు వర్ణమాల క్రమంలో అమర్చబడతాయి మరియు యాప్ యధావిధిగా పనిచేస్తుంది.",
      hi: "आप अपने डिवाइस की सेटिंग के माध्यम से किसी भी समय स्थान और माइक्रोफ़ोन अनुमतियों को बंद कर सकते हैं। स्थान को अक्षम करने पर सूचियां वर्णानुक्रम में व्यवस्थित होंगी, और ऐप पूरी तरह से काम करना जारी रखेगा।"
    }
  }
];
