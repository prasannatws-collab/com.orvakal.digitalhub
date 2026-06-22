import type { LocalizedText } from '../../../types';

export interface GovtOfficeDetailed {
  id: string;
  name: LocalizedText;
  location: LocalizedText;
  timings: LocalizedText;
  phone: string;
  icon: string;
  services: LocalizedText[];
}

export const govtOffices: GovtOfficeDetailed[] = [
  {
    id: "office-gp",
    name: { en: "Gram Panchayat Office", te: "గ్రామ పంచాయతీ కార్యాలయం", hi: "ग्राम पंचायत कार्यालय" },
    location: { en: "Main Road, Orvakal", te: "మెయిన్ రోడ్, ఓర్వకల్లు", hi: "मुख्य मार्ग, ओरवाकल" },
    timings: { en: "10:00 AM - 05:00 PM (Sunday Closed)", te: "ఉదయం 10:00 - సాయంత్రం 5:00 (ఆదివారం సెలవు)", hi: "सुबह 10:00 - शाम 5:00 (रविवार बंद)" },
    phone: "+91 9440123456",
    icon: "Building2",
    services: [
      { en: "Drinking Water Connection Approval", te: "తాగునీటి కనెక్షన్ అనుమతి", hi: "पेयजल कनेक्शन की स्वीकृति" },
      { en: "Property Tax Assessment & Payments", te: "ఆస్తి పన్ను అంచనా & చెల్లింపులు", hi: "संपत्ति कर निर्धारण और भुगतान" },
      { en: "Streetlight Repair & Maintenance Requests", te: "వీధి దీపాల మరమ్మతు అభ్యర్థనలు", hi: "स्ट्रीटलाइट मरम्मत और रखरखाव अनुरोध" },
      { en: "Sanitation & Drainage Cleaning Complaints", te: "పారిశుద్ధ్య & డ్రైనేజీ శుభ్రత ఫిర్యాదులు", hi: "स्वच्छता और जल निकासी सफाई शिकायतें" }
    ]
  },
  {
    id: "office-sach",
    name: { en: "Grama Sachivalayam & RBK Office", te: "గ్రామ సచివాలయం & రైతు భరోసా కేంద్రం (RBK)", hi: "ग्राम सचिवालय और रायथू भरोसा केंद्र (आरबीके)" },
    location: { en: "Panchayat Compound, Orvakal", te: "పంచాయతీ ఆవరణ, ఓర్వకల్లు", hi: "पंचायत परिसर, ओरवाकल" },
    timings: { en: "10:00 AM - 05:00 PM (Sunday Closed)", te: "ఉదయం 10:00 - సాయంత్రం 05:00 (ఆదివారం సెలవు)", hi: "सुबह 10:00 - शाम 05:00 (रविवार बंद)" },
    phone: "+91 9440654321",
    icon: "ShieldAlert",
    services: [
      { en: "Birth & Death Certificates registration", te: "జనన & మరణ ధృవీకరణ పత్రాల నమోదు", hi: "जन्म और मृत्यु प्रमाण पत्र पंजीकरण" },
      { en: "Integrated Caste & Income Certificates applications", te: "కుల & ఆదాయ ధృవీకరణ పత్రాల దరఖాస్తులు", hi: "एकीकृत जाति और आय प्रमाण पत्र आवेदन" },
      { en: "Aadhaar e-KYC & Bio-metric validations", te: "ఆధార్ బయోమెట్రిక్ e-KYC ధృవీకరణ", hi: "आधार ई-केवाईसी और बायोमेट्रिक सत्यापन" },
      { en: "Welfare Pension Scheme enrollment verification", te: "సంక్షేమ పింఛను పథక అర్హత ధృవీకరణ", hi: "कल्याण पेंशन योजना नामांकन सत्यापन" },
      { en: "Subsidized Seeds & Fertilizers booking", te: "రాయితీ విత్తనాలు & ఎరువుల బుకింగ్", hi: "रियायती बीज और उर्वरक बुकिंग" },
      { en: "E-Panta crop registration & booking", te: "ఈ-పంట నమోదు (E-Panta)", hi: "ई-पंटा फसल पंजीकरण और बुकिंग" },
      { en: "Free Soil Health Card testing & dispatch", te: "ఉచిత మట్టి పరీక్షలు & సలహాలు", hi: "मुफ्त मिट्टी स्वास्थ्य कार्ड परीक्षण और प्रेषण" },
      { en: "Agri-equipment rental services", te: "వ్యవసాయ పరికరాల అద్దె సేవలు", hi: "कृषि उपकरण किराए पर लेने की सेवाएं" }
    ]
  },
  {
    id: "office-sro",
    name: { en: "Sub-Registrar Office (SRO)", te: "సబ్-రిజిస్ట్రార్ కార్యాలయం", hi: "उप-पंजीयक कार्यालय" },
    location: { en: "SRO Complex, Old Highway Junction, Orvakal", te: "ఎస్ఆర్ఓ కాంప్లెక్స్, పాత హైవే జంక్షన్, ఓర్వకల్లు", hi: "एसआरओ कॉम्प्लेक्स, पुराना हाईवे जंक्शन, ओरवाकल" },
    timings: { en: "10:00 AM - 05:00 PM (Sunday Closed)", te: "ఉదయం 10:00 - సాయంత్రం 5:00 (ఆదివారం సెలవు)", hi: "सुबह 10:00 - शाम 5:00 (रविवार बंद)" },
    phone: "+91 8518290444",
    icon: "FileText",
    services: [
      { en: "Agricultural & Residential Land registrations", te: "వ్యవసాయ & నివాస స్థలాల రిజిస్ట్రేషన్లు", hi: "कृषि और आवासीय भूमि पंजीकरण" },
      { en: "Marriage Registration & Certificate issuance", te: "వివాహ రిజిస్ట్రేషన్ & సర్టిఫికేట్ జారీ", hi: "विवाह पंजीकरण और प्रमाण पत्र जारी करना" },
      { en: "Encumbrance Certificate (EC) generation", te: "ఈసీ (ఎన్‌కంబరెన్స్ సర్టిఫికేట్) జారీ", hi: "भार प्रमाण पत्र (EC) जनरेशन" },
      { en: "Sale Deeds, Gift Deeds, & Mortgage Deeds registration", te: "క్రయ విక్రయాలు, బహుమతి & తాకట్టు దస్తావేజుల రిజిస్ట్రేషన్", hi: "बिक्री विलेख, उपहार विलेख और बंधक विलेख पंजीकरण" }
    ]
  },
  {
    id: "office-mro",
    name: { en: "Mandal Revenue Office (MRO Tahsildar)", te: "మండల రెవెన్యూ కార్యాలయం (MRO)", hi: "मंडल राजस्व कार्यालय (एमआरओ)" },
    location: { en: "Court Road, Orvakal", te: "కోర్టు రోడ్, ఓర్వకల్లు", hi: "Court Road, ओरवाकल" },
    timings: { en: "10:00 AM - 05:00 PM (Sunday Closed)", te: "ఉదయం 10:00 - సాయంత్రం 5:00 (ఆదివారం సెలవు)", hi: "सुबह 10:00 - शाम 5:00 (रविवार बंद)" },
    phone: "+91 8518290555",
    icon: "Landmark",
    services: [
      { en: "Agricultural Land Mutation (Pattadar Passbook updates)", te: "వ్యవసాయ భూమి మ్యుటేషన్ (పట్టాదార్ పాస్ పుస్తకం)", hi: "कृषि भूमि नामांतरण (म्यूटेशन) और पट्टादार पासबुक अपडेट" },
      { en: "Resolving Land boundaries & survey disputes", te: "భూ సరిహద్దులు & కొలతల వివాదాల పరిష్కారం", hi: "भूमि सीमा और सर्वेक्षण विवादों का समाधान" },
      { en: "Caste, Income, & Residence final approvals", te: "కుల, ఆదాయ, నివాస ధృవీకరణ పత్రాల తుది ఆమోదం", hi: "जाति, आय और निवास प्रमाण पत्र की अंतिम मंजूरी" },
      { en: "Mandal level administrative certifications", te: "మండల స్థాయి పరిపాలనా ధృవీకరణ పత్రాల జారీ", hi: "मंडल स्तर के प्रशासनिक प्रमाणपत्र" }
    ]
  },
  {
    id: "office-mpdo",
    name: { en: "Mandal Praja Parishat Office", te: "మండల ప్రజా పరిషత్ కార్యాలయం", hi: "मंडल प्रजा परिषद कार्यालय" },
    location: { en: "Mandal Parishad Complex, Orvakal", te: "మండల పరిషత్ కార్యాలయం, ఓర్వకల్లు", hi: "मंडल परिषद परिसर, ओरवाकल" },
    timings: { en: "10:00 AM - 05:00 PM (Sunday Closed)", te: "ఉదయం 10:00 - సాయంత్రం 5:00 (ఆదివారం సెలవు)", hi: "सुबह 10:00 - शाम 5:00 (रविवार बंद)" },
    phone: "+91 8518290666",
    icon: "Activity",
    services: [
      { en: "Rural housing schemes sanction (YSR / PMAY)", te: "గ్రామీణ గృహ నిర్మాణ పథకాల మంజూరు (YSR/PMAY)", hi: "ग्रामीण आवास योजनाओं की स्वीकृति (YSR / PMAY)" },
      { en: "MGNREGS (Employment Guarantee) work allocations", te: "ఉపాధి హామీ పథకం (MGNREGS) పనుల కేటాయింపు", hi: "मनरेगा (रोजगार गारंटी) कार्य आवंटन" },
      { en: "Mandal infrastructure development funds disbursement", te: "మండల మౌలిక సదుపాయాల అభివృద్ధి నిధుల మంజూరు", hi: "मंडल बुनियादी ढांचा विकास निधि वितरण" },
      { en: "Panchayat governance inspections & review", te: "పంచాయతీల పాలనా వ్యవహారాల తనిఖీ", hi: "पंचायत शासन निरीक्षण और समीक्षा" }
    ]
  },
  {
    id: "office-ms",
    name: { en: "MeeSeva Center", te: "మీసేవ కేంద్రం", hi: "मीसेवा केंद्र" },
    location: { en: "Opposite SBI, Main Road, Orvakal", te: "స్టేట్ బ్యాంక్ ఎదురుగా, మెయిన్ రోడ్, ఓర్వకల్లు", hi: "भारतीय स्टेट बैंक के सामने, मुख्य मार्ग, ओरवाकल" },
    timings: { en: "08:30 AM - 07:30 PM (Sunday Closed)", te: "ఉదయం 8:30 - రాత్రి 7:30 (ఆదివారం సెలవు)", hi: "सुबह 8:30 - शाम 7:30 (रविवार बंद)" },
    phone: "+91 8518290333",
    icon: "Clock",
    services: [
      { en: "All Digital Public Services Applications", te: "అన్ని రకాల ప్రభుత్వ డిజిటల్ సేవల దరఖాస్తులు", hi: "सभी डिजिटल सार्वजनिक सेवा आवेदन" },
      { en: "Adangal & 1B land records certified copies", te: "అడంగల్ & 1B భూ రికార్డుల సర్టిఫైడ్ కాపీలు", hi: "अदंगल और 1B भूमि रिकॉर्ड की प्रमाणित प्रतियां" },
      { en: "Electricity & utility bill payments", te: "కరెంట్ బిల్లులు & ఇతర పన్నుల చెల్లింపులు", hi: "बिजली और अन्य उपयोगिता बिल भुगतान" },
      { en: "Passport & Pan card online application", te: "పాస్‌పోర్ట్ & పాన్ కార్డ్ ఆన్‌లైన్ దరఖాస్తులు", hi: "पासपोर्ट और पैन कार्ड ऑनलाइन आवेदन" }
    ]
  },
  {
    id: "office-apiic",
    name: { en: "APIIC Office", te: "APIIC కార్యాలయం", hi: "एपीआईआईसी कार्यालय" },
    location: { en: "Bypass Road, Orvakal", te: "బైపాస్ రోడ్, ఓర్వకల్లు", hi: "बाईपास रोड, ओरवाकल" },
    timings: { en: "09:00 AM - 06:00 PM (Sunday Closed)", te: "ఉదయం 9:00 - సాయంత్రం 6:00 (ఆదివారం సెలవు)", hi: "सुबह 9:00 - शाम 6:00 (रविवार बंद)" },
    phone: "+91 9848098765",
    icon: "Building2",
    services: [
      { en: "Industrial Land allotment applications status", te: "పారిశ్రామిక స్థలాల కేటాయింపు దరఖాస్తుల స్థితి", hi: "औद्योगिक भूमि आवंटन आवेदन की स्थिति" },
      { en: "Factory building plan clearance updates", te: "ఫ్యాక్టరీ నిర్మాణ ప్లాన్ ఆమోదాల నవీకరణలు", hi: "कारखाना भवन योजना मंजूरी अपडेट" },
      { en: "Industrial water & power setup coordination", te: "పారిశ్రామిక విద్యుత్ & నీటి సరఫరా సమన్వయం", hi: "औद्योगिक पानी और बिजली सेटअप समन्वय" }
    ]
  },
  {
    id: "office-agri",
    name: { en: "Mandal Agriculture Office", te: "మండల వ్యవసాయ కార్యాలయం", hi: "मंडल कृषि कार्यालय" },
    location: { en: "Mandal Parishad Road, Orvakal", te: "మండల పరిషత్ రోడ్, ఓర్వకల్లు", hi: "मंडल परिषद रोड, ओरवाकल" },
    timings: { en: "07:00 AM - 05:00 PM (Sunday Closed)", te: "ఉదయం 07:00 - సాయంత్రం 05:00 (ఆదివారం సెలవు)", hi: "सुबह 07:00 - शाम 05:00 (रविवार बंद)" },
    phone: "",
    icon: "Sprout",
    services: [
      { en: "Agriculture inputs, subsidies, and extension services", te: "వ్యవసాయ ఇన్పుట్లు, రాయితీలు మరియు సేవలు", hi: "कृषि इनपुट, सब्सिडी और विस्तार सेवाएं" },
      { en: "Farmer training programs and workshops", te: "రైతు శిక్షణా కార్యక్రమాలు మరియు వర్క్‌షాప్‌లు", hi: "किसान प्रशिक्षण कार्यक्रम और कार्यशालाएं" }
    ]
  },
  {
    id: "office-mgnregs",
    name: { en: "MGNREGS Office", te: "MGNREGS కార్యాలయం (ఉపాధి హామీ పథకం)", hi: "मनरेगा (MGNREGS) कार्यालय" },
    location: { en: "Mandal Parishad Complex, Orvakal", te: "మండల పరిషత్ కాంప్లెక్స్, ఓర్వకల్లు", hi: "मंडल परिषद परिसर, ओरवाकल" },
    timings: { en: "07:00 AM - 05:00 PM (Sunday Closed)", te: "ఉదయం 07:00 - సాయంత్రం 05:00 (ఆదివారం సెలవు)", hi: "सुबह 07:00 - शाम 05:00 (रविवार बंद)" },
    phone: "",
    icon: "Briefcase",
    services: [
      { en: "MGNREGS Job Card registration and issue", te: "MGNREGS జాబ్ కార్డ్ రిజిస్ట్రేషన్ మరియు జారీ", hi: "मनरेगा जॉब कार्ड पंजीकरण और जारी करना" },
      { en: "Wage employment work demand and payments tracking", te: "ఉపాధి పనుల డిమాండ్ మరియు చెల్లింపుల పర్యవేక్షణ", hi: "मजदूरी रोजगार कार्य की मांग और भुगतान ट्रैकिंग" }
    ]
  },
  {
    id: "office-msme",
    name: { en: "MSME Park", te: "MSME పార్క్", hi: "एमएसएमई (MSME) पार्क" },
    location: { en: "Industrial Corridor, Orvakal", te: "పారిశ్రామిక కారిడార్, ఓర్వకల్లు", hi: "औद्योगिक गलियारा, ओरवाकल" },
    timings: { en: "09:00 AM - 06:00 PM (Sunday Closed)", te: "ఉదయం 09:00 - సాయంత్రం 06:00 (ఆదివారం సెలవు)", hi: "सुबह 09:00 - शाम 06:00 (रविवार बंद)" },
    phone: "",
    icon: "Factory",
    services: [
      { en: "Infrastructure support for micro, small, and medium enterprises", te: "సూక్ష్మ, చిన్న, మధ్యతరహా పరిశ్రమలకు మౌలిక సదుపాయాల మద్దతు", hi: "सूक्ष्म, लघु और मध्यम उद्यमों के लिए बुनियादी ढांचा सहायता" },
      { en: "Industrial plot allocations and clearances", te: "పారిశ్రామిక ప్లాట్ల కేటాయింపులు మరియు అనుమతులు", hi: "औद्योगिक भूखंड आवंटन और मंजूरी" }
    ]
  },
  {
    id: "office-powergrid",
    name: { en: "Power Grid Corporation of India Limited (PGCIL)", te: "పవర్ గ్రిడ్ కార్పొరేషన్ ఆఫ్ ఇండియా లిమిటెడ్ (PGCIL)", hi: "पावर ग्रिड कॉर्पोरेशन ऑफ इंडिया लिमिटेड (PGCIL)" },
    location: { en: "Substation Zone, Orvakal", te: "సబ్‌స్టేషన్ జోన్, ఓర్వకల్లు", hi: "सबस्टेशन जोन, ओरवाकल" },
    timings: { en: "09:00 AM - 05:30 PM (Sunday Closed)", te: "ఉదయం 09:00 - సాయంత్రం 05:30 (ఆదివారం సెలవు)", hi: "सुबह 09:00 - शाम 05:30 (रविवार बंद)" },
    phone: "",
    icon: "Zap",
    services: [
      { en: "Bulk power transmission and grid management", te: "బల్క్ పవర్ ట్రాన్స్మిషన్ మరియు గ్రిడ్ నిర్వహణ", hi: "थोक बिजली पारेषण और ग्रिड प्रबंधन" },
      { en: "Substation maintenance and operations", te: "సబ్‌స్టేషన్ నిర్వహణ మరియు కార్యకలాపాలు", hi: "सबस्टेशन रखरखाव और संचालन" }
    ]
  },
  {
    id: "office-solarpark",
    name: { en: "Kurnool Ultra Mega Solar Park, Greenco (Pinnapuram)", te: "కర్నూలు అల్ట్రా మెగా సోలార్ పార్క్, గ్రీన్‌కో (పిన్నాపురం)", hi: "कर्नूल अल्ट्रा मेगा सोलर पार्क, ग्रीनको (पिन्नापुरम)" },
    location: { en: "Pinnapuram Route, Orvakal Mandal", te: "పిన్నాపురం రూట్, ఓర్వకల్లు మండలం", hi: "पिन्नापुरम मार्ग, ओरवाकल मंडल" },
    timings: { en: "09:00 AM - 06:00 PM (Daily)", te: "ఉదయం 09:00 - సాయంత్రం 06:00 (ప్రతిరోజూ)", hi: "सुबह 09:00 - शाम 06:00 (प्रतिदिन)" },
    phone: "",
    icon: "Sun",
    services: [
      { en: "Renewable solar and wind energy generation", te: "पुनरुत्पादक సోలార్ మరియు విండ్ విద్యుత్ ఉత్పత్తి", hi: "अक्षय सौर और पवन ऊर्जा उत्पादन" },
      { en: "Integrated pump storage and green energy transmission", te: "ఇంటిగ్రేటెड పంప్ స్టోరేజ్ మరియు గ్రీన్ ఎనర్జీ ట్రాన్స్మిషన్", hi: "एकीकृत पंप भंडारण और हरित ऊर्जा संचरण" }
    ]
  },
  {
    id: "office-kranti",
    name: { en: "Kranti Orvakal Grama Abhivridhi", te: "క్రాంతి ఓర్వకల్లు గ్రామ అభివృద్ధి", hi: "क्रांति ओरवाकल ग्राम विकास" },
    location: { en: "Main Bazar Road, Orvakal", te: "మెయిన్ బజార్ రోడ్, ఓర్వకల్లు", hi: "मुख्य बाजार रोड, ओरवाकल" },
    timings: { en: "07:00 AM - 05:00 PM (Sunday Closed)", te: "ఉదయం 07:00 - సాయంత్రం 05:00 (ఆదివారం సెలవు)", hi: "सुबह 07:00 - शाम 05:00 (रविवार बंद)" },
    phone: "",
    icon: "Users",
    services: [
      { en: "Community development and social welfare initiatives", te: "సామాజిక మరియు గ్రామ అభివృద్ధి కార్యక్రమాలు", hi: "सामुदायिक विकास और सामाजिक कल्याण पहल" },
      { en: "Livelihood programs and self-help group support", te: "జీవనోపాధి కార్యక్రమాలు మరియు స్వయం సహాయక బృందాల మద్దతు", hi: "आजीविका कार्यक्रम और स्वयं सहायता समूह सहायता" }
    ]
  }
];
