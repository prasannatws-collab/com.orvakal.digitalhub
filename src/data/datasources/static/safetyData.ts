export interface SafetySection {
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

export const safetySections: SafetySection[] = [
  {
    id: "zero_tolerance",
    emoji: "🚫",
    title: {
      en: "Zero-Tolerance for CSAE",
      te: "CSAE పట్ల శూన్య సహనం (Zero-Tolerance)",
      hi: "CSAE के खिलाफ जीरो-टॉलरेंस नीति"
    },
    content: {
      en: "We maintain a strict zero-tolerance policy against Child Sexual Abuse and Exploitation (CSAE). Uploading, hosting, sharing, or facilitating any such content is absolutely prohibited and results in immediate, permanent ban and direct legal reporting.",
      te: "బాల లైంగిక దుర్వినియోగం మరియు దోపిడీ (CSAE) పై మేము శూన్య సహన విధానాన్ని అమలు చేస్తాము. అలాంటి కంటెంట్‌ను అప్‌లోడ్ చేయడం, షేర్ చేయడం లేదా ప్రోత్సహించడం పూర్తిగా నిషేధించబడింది. అలా చేస్తే వెంటనే అకౌంట్ శాశ్వతంగా బ్యాన్ చేయబడుతుంది మరియు చట్టపరమైన చర్యలు తీసుకోబడతాయి.",
      hi: "हम बाल यौन शोषण और शोषण (CSAE) के खिलाफ एक सख्त जीरो-टॉलरेंस नीति अपनाते हैं। ऐसी किसी भी सामग्री को अपलोड, साझा या बढ़ावा देना पूरी तरह से प्रतिबंधित है। उल्लंघन करने वालों को तुरंत स्थायी रूप से प्रतिबंधित कर कानूनी कार्रवाई की जाएगी।"
    }
  },
  {
    id: "detection",
    emoji: "🔍",
    title: {
      en: "Detection & Prevention",
      te: "గుర్తింపు & నివారణా చర్యలు",
      hi: "पहचान और रोकथाम"
    },
    content: {
      en: "All public submissions (such as job postings, labour listings, and community boards) undergo strict pre-moderation. We use automated keyword filtering and manual administrator checks to detect, prevent, and remove inappropriate content.",
      te: "యాప్‌లో పోస్ట్ చేసే ఉద్యోగాలు, కార్మికుల వివరాలు మరియు ఇతర పబ్లిక్ సమాచారం ప్రచురించబడటానికి ముందే అడ్మిన్లు పరిశీలిస్తారు. అవాంఛనీయ కంటెంట్‌ను గుర్తించి నిరోధించడానికి మేము ఆటోమేటెడ్ ఫిల్టర్లు మరియు మాన్యువల్ రివ్యూలను ఉపయోగిస్తాము.",
      hi: "नौकरी और श्रमिक पंजीकरण जैसे सभी सार्वजनिक सबमिशन का प्रकाशन से पहले कड़ा सत्यापन किया जाता है। अनुचित सामग्री को रोकने और हटाने के लिए हम स्वचालित कीवर्ड फ़िल्टर और मैनुअल व्यवस्थापक समीक्षाओं का उपयोग करते हैं।"
    }
  },
  {
    id: "reporting",
    emoji: "📞",
    title: {
      en: "User Reporting Mechanisms",
      te: "వినియోగదారుల ఫిర్యాదుల విధానం",
      hi: "उपयोगकर्ता रिपोर्टिंग प्रणाली"
    },
    content: {
      en: "Users can report suspicious content directly via the in-app Panchayat Grievance Desk (select 'Others' / specify 'Safety'). You can also email our safety helpline at prasanna.tws@gmail.com for immediate action.",
      te: "వినియోగదారులు యాప్‌లోని పంచాయతీ ఫిర్యాదు డెస్క్ (గ్రీవెన్స్ డెస్క్) ద్వారా నేరుగా రిపోర్ట్ చేయవచ్చు. అత్యవసర సహాయం లేదా సందేహాల కోసం prasanna.tws@gmail.com కు ఈమెయిల్ పంపవచ్చు.",
      hi: "उपयोगकर्ता ऐप में उपलब्ध पंचायत शिकायत डेस्क के माध्यम से सीधे संदिग्ध सामग्री की रिपोर्ट कर सकते हैं। आप त्वरित कार्रवाई के लिए हमारी सुरक्षा हेल्पलाइन prasanna.tws@gmail.com पर ईमेल भी कर सकते हैं।"
    }
  },
  {
    id: "compliance",
    emoji: "📜",
    title: {
      en: "Compliance & Industry Standards",
      te: "చట్టాల అనువర్తనం & ప్రమాణాలు",
      hi: "कानूनी अनुपालन और मानक"
    },
    content: {
      en: "We fully comply with local and national laws including the Protection of Children from Sexual Offences (POCSO) Act, 2012, and Intermediary Guidelines. All detected violations are immediately escalated to the National Cyber Crime Reporting Portal.",
      te: "మేము భారతీయ చట్టాలైన POCSO చట్టం, 2012 మరియు ఐటీ నిబంధనలను ఖచ్చితంగా అనుసరిస్తాము. ఏదైనా చట్టవిరుద్ధమైన ఉల్లంఘన జరిగితే వెంటనే జాతీయ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్ (cybercrime.gov.in) కు నివేదిస్తాము.",
      hi: "हम बाल यौन अपराध संरक्षण (POCSO) अधिनियम, 2012 और सूचना प्रौद्योगिकी नियमों सहित राष्ट्रीय कानूनों का पूरी तरह से पालन करते हैं। किसी भी उल्लंघन की सूचना तुरंत राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल को दी जाती है।"
    }
  }
];
