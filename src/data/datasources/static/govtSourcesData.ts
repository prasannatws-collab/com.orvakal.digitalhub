export interface GovtSource {
  id: string;
  name: { en: string; te: string; hi: string };
  url: string;
  description: { en: string; te: string; hi: string };
}

export const govtSources: GovtSource[] = [
  {
    id: "source-kurnool",
    name: {
      en: "Kurnool District Administration Portal",
      te: "కర్నూలు జిల్లా పరిపాలన పోర్టల్",
      hi: "कर्नूल जिला प्रशासन पोर्टल"
    },
    url: "https://kurnool.ap.gov.in",
    description: {
      en: "Government portal for Kurnool district local administration, contacts, and local updates.",
      te: "కర్నూలు జిల్లా పరిపాలన, అధికారులు మరియు తాజా వార్తల వివరాల పోర్టల్.",
      hi: "कर्नूल जिला प्रशासन, संपर्क और समाचारों के लिए सरकारी पोर्टल।"
    }
  },
  {
    id: "source-apgov",
    name: {
      en: "Andhra Pradesh State Government Portal",
      te: "ఆంధ్రప్రదేశ్ ప్రభుత్వ పోర్టల్",
      hi: "आंध्र प्रदेश सरकार पोर्टल"
    },
    url: "https://www.ap.gov.in",
    description: {
      en: "Website of the Government of Andhra Pradesh for state services and policies.",
      te: "ఆంధ్రప్రదేశ్ రాష్ట్ర ప్రభుత్వ సేవలు మరియు జీవోల కోసం వెబ్‌సైట్.",
      hi: "राज्य सेवाओं और नीतियों के लिए आंध्र प्रदेश सरकार की वेबसाइट।"
    }
  },
  {
    id: "source-indiagov",
    name: {
      en: "National Portal of India",
      te: "భారత జాతీయ పోర్టల్",
      hi: "भारत का राष्ट्रीय पोर्टल"
    },
    url: "https://www.india.gov.in",
    description: {
      en: "Single-window access to information and services of the Indian Government.",
      te: "భారత ప్రభుత్వం అందించే కేంద్ర సేవల సమాచార ఏకైక పోర్టల్.",
      hi: "भारत सरकार की जानकारी और सेवाओं तक एकल-खिड़की पहुंच।"
    }
  },
  {
    id: "source-pmkisan",
    name: {
      en: "PM Kisan Samman Nidhi Portal",
      te: "పీఎం కిసాన్ సమ్మాన్ నిధి పోర్టల్",
      hi: "पीएम किसान सम्मान निधि पोर्टल"
    },
    url: "https://pmkisan.gov.in",
    description: {
      en: "Central government portal for farmer welfare benefits and schemes tracking.",
      te: "రైతు లబ్ధిదారులు మరియు వారి పథకాల వివరాల ట్రాకింగ్ కోసం కేంద్ర ప్రభుత్వ పోర్టల్.",
      hi: "किसान कल्याण लाभों और योजनाओं की ट्रैकिंग के लिए केंद्र सरकार का पोर्टल।"
    }
  },
  {
    id: "source-meeseva",
    name: {
      en: "AP MeeSeva Online Services",
      te: "ఏపీ మీసేవ ఆన్‌లైన్ సేవలు",
      hi: "एपी मीसेवा ऑनलाइन सेवाएं"
    },
    url: "https://onlineap.meeseva.gov.in",
    description: {
      en: "Citizen services portal for certificates, land records, and bill payments.",
      te: "ప్రభుత్వ ధృవీకరణ పత్రాలు, భూ రికార్డులు మరియు బిల్లుల చెల్లింపుల పోర్టల్.",
      hi: "प्रमाण पत्र, भूमि रिकॉर्ड और बिल भुगतान के लिए नागरिक सेवा पोर्टल।"
    }
  },
  {
    id: "source-apiic",
    name: {
      en: "APIIC Industrial Portal",
      te: "APIIC పారిశ్రామిక పోర్టల్",
      hi: "एपीआईआईसी औद्योगिक पोर्टल"
    },
    url: "https://apiic.in",
    description: {
      en: "Andhra Pradesh Industrial Infrastructure Corporation portal for industrial hub details.",
      te: "ఆంధ్రప్రదేశ్ పారిశ్రామిక మౌలిక సదుపాయాల సంస్థ వెబ్‌సైట్.",
      hi: "औद्योगिक हब विवरण के लिए आंध्र प्रदेश औद्योगिक बुनियादी ढांचा निगम का पोर्टल।"
    }
  },
  {
    id: "source-indiapost",
    name: {
      en: "India Post Portal",
      te: "భారత పోస్టల్ శాఖ వెబ్‌సైట్",
      hi: "भारतीय डाक पोर्टल"
    },
    url: "https://www.indiapost.gov.in",
    description: {
      en: "Portal for post office services, pin codes, and savings schemes.",
      te: "పోస్టల్ సేవలు, పిన్ కోడ్లు మరియు పొదుపు పథకాల వివరాల పోర్టల్.",
      hi: "डाकघर सेवाओं, पिन कोड और बचत योजनाओं के लिए सरकारी पोर्टल।"
    }
  },
  {
    id: "source-appolice",
    name: {
      en: "Andhra Pradesh Police Portal",
      te: "ఆంధ్రప్రదేశ్ పోలీస్ వెబ్‌సైట్",
      hi: "आंध्र प्रदेश पुलिस पोर्टल"
    },
    url: "https://appolice.gov.in",
    description: {
      en: "Site for Andhra Pradesh Police security services and directory.",
      te: "ఆంధ్రప్రదేశ్ శాంతిభద్రతల విభాగం మరియు అత్యవసర సేవల సైట్.",
      hi: "आंध्र प्रदेश पुलिस सुरक्षा सेवाओं और निर्देशिका के लिए साइट।"
    }
  }
];
