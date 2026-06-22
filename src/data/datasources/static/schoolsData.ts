import type { LocalizedText } from '../../../types';

export interface SchoolStaff {
  role: LocalizedText;
  name: LocalizedText;
  phone: string;
}

export interface SchoolDetailed {
  id: string;
  name: LocalizedText;
  schoolName: LocalizedText;
  subject: LocalizedText;
  phone: string;
  type: 'school' | 'tuition';
  address: LocalizedText;
  principal: LocalizedText;
  timings: LocalizedText;
  facilities: LocalizedText[];
  establishedYear: string;
  staff: SchoolStaff[];
}

export const schools: SchoolDetailed[] = [
  {
    id: "sch-1",
    name: {
      en: "Zilla Parishad High School (ZPHS)",
      te: "జిల్లా పరిషత్ ఉన్నత పాఠశాల (ZPHS)",
      hi: "जिला परिषद हाई स्कूल (ZPHS)"
    },
    schoolName: {
      en: "ZPHS Boys & Girls School, Orvakal",
      te: "ZPHS బాలుర & బాలికల ఉన్నత పాఠశాల, ఓర్వకల్లు",
      hi: "जेडपीएचएस बालक एवं बालिका हाई स्कूल, ओरवाकल"
    },
    subject: {
      en: "Telugu & English Medium (Grades 6-10)",
      te: "తెలుగు & ఇంగ్లీష్ మీడియం (6-10 తరగతులు)",
      hi: "तेलुगु और अंग्रेजी माध्यम (कक्षा 6-10)"
    },
    phone: "+91 9440623450",
    type: "school",
    address: {
      en: "Government School Lane, Orvakal",
      te: "ప్రభుత్వ పాఠశాల వీధి, ఓర్వకల్లు",
      hi: "सरकारी स्कूल गली, ओरवाकल"
    },
    principal: {
      en: "Mr. G. Raghunath, M.A., B.Ed. (Headmaster)",
      te: "శ్రీ జి. రఘునాథ్, M.A., B.Ed. (ప్రధానోపాధ్యాయులు)",
      hi: "श्री जी. रघुनाथ, एम.ए., बी.एड. (प्रधानाध्यापक)"
    },
    timings: {
      en: "09:00 AM - 04:30 PM (Monday - Saturday)",
      te: "ఉదయం 09:00 - సాయంత్రం 04:30 (సోమ - శని)",
      hi: "सुबह 09:00 - शाम 04:30 (सोमवार - शनिवार)"
    },
    facilities: [
      { en: "Mid-day Meals Program", te: "మధ్యాహ్న భోజన పథకం", hi: "मध्याह्न भोजन कार्यक्रम" },
      { en: "Science Laboratory", te: "సైన్స్ లాబొరేటరీ", hi: "विज्ञान प्रयोगशाला" },
      { en: "Drinking Water RO Plant", te: "తాగునీటి మినరల్ ప్లాంట్", hi: "पेयजल आरओ प्लांट" },
      { en: "Library & Sports Playground", te: "గ్రంథాలయం & ఆట స్థలం", hi: "पुस्तकालय और खेल का मैदान" }
    ],
    establishedYear: "1972",
    staff: [
      {
        role: { en: "Headmaster", te: "ప్రధానోపాధ్యాయులు", hi: "प्रधानाध्यापक" },
        name: { en: "Mr. G. Raghunath", te: "శ్రీ జి. రఘునాథ్", hi: "श्री जी. रघुनाथ" },
        phone: "+91 9440623450"
      },
      {
        role: { en: "Mathematics Assistant", te: "గణిత ఉపాధ్యాయులు", hi: "गणित सहायक" },
        name: { en: "Mr. K. Raghavan", te: "శ్రీ కె. రాఘవన్", hi: "श्री के. राघवन" },
        phone: "+91 9848123411"
      },
      {
        role: { en: "Physical Science Assistant", te: "భౌతిక శాస్త్ర ఉపాధ్యాయులు", hi: "भौतिक विज्ञान सहायक" },
        name: { en: "Mrs. V. Kalyani", te: "శ్రీమతి వి. కల్యాణి", hi: "श्रीमती वी. कल्याणी" },
        phone: "+91 9848123412"
      }
    ]
  },
  {
    id: "sch-2",
    name: {
      en: "Mandal Parishad Primary School (MPPS)",
      te: "మండల పరిషత్ ప్రాథమిక పాఠశాల (MPPS)",
      hi: "मंडल परिषद प्राथमिक स्कूल (MPPS)"
    },
    schoolName: {
      en: "MPPS Urdu Medium Primary School, Orvakal",
      te: "MPPS ఉర్దూ మీడియం ప్రాథమిక పాఠశాల, ఓర్వకల్లు",
      hi: "एमपीपीएस उर्दू माध्यम प्राथमिक स्कूल, ओरवाकल"
    },
    subject: {
      en: "Urdu & English Medium (Grades 1-5)",
      te: "ఉర్దూ & ఇంగ్లీష్ మీడియం (1-5 తరగతులు)",
      hi: "उर्दू और अंग्रेजी माध्यम (कक्षा 1-5)"
    },
    phone: "+91 9440623451",
    type: "school",
    address: {
      en: "Masjid Bazar Lane, Orvakal",
      te: "మసీదు బజార్ వీధి, ఓర్వకల్లు",
      hi: "मस्जिद बाजार गली, ओरवाकल"
    },
    principal: {
      en: "Mrs. Shaik Farzana, B.A., D.Ed. (Headmistress)",
      te: "శ్రీమతి షేక్ ఫర్జానా, B.A., D.Ed. (ప్రధానోపాధ్యాయురాలు)",
      hi: "श्रीमती शेख फरजाना, बीए, डी.एड. (प्रधानाध्यापिका)"
    },
    timings: {
      en: "09:00 AM - 04:00 PM (Monday - Saturday)",
      te: "ఉదయం 09:00 - సాయంత్రం 04:00 (సోమ - శని)",
      hi: "सुबह 09:00 - शाम 04:00 (सोमवार - शनिवार)"
    },
    facilities: [
      { en: "Mid-day Meals Program", te: "మధ్యాహ్న భోజన పథకం", hi: "मध्याह्न भोजन कार्यक्रम" },
      { en: "Primary Class Activity Room", te: "ప్రాథమిక తరగతి యాక్టివిటీ గది", hi: "प्राथमिक कक्षा गतिविधि कक्ष" },
      { en: "RO Drinking Water", te: "శుద్ధ తాగునీటి సదుపాయం", hi: "आरओ पेयजल" }
    ],
    establishedYear: "1980",
    staff: [
      {
        role: { en: "Headmistress", te: "ప్రధానోపాధ్యాయురాలు", hi: "प्रधानाध्यापिका" },
        name: { en: "Mrs. Shaik Farzana", te: "శ్రీమతి షేక్ ఫర్జానా", hi: "श्रीमती शेख फरजाना" },
        phone: "+91 9440623451"
      }
    ]
  },
  {
    id: "sch-3",
    name: {
      en: "Govt Girls Hostel",
      te: "ప్రభుత్వ బాలికల వసతి గృహం",
      hi: "सरकारी बालिका छात्रावास"
    },
    schoolName: {
      en: "Govt Girls Hostel, Orvakal",
      te: "ప్రభుత్వ బాలికల వసతి గృహం, ఓర్వకల్లు",
      hi: "सरकारी बालिका छात्रावास, ओरवाकल"
    },
    subject: {
      en: "Residential facility for school/college girls",
      te: "పాఠశాల మరియు కాలేజీ విద్యార్థినులకు వసతి సౌకర్యం",
      hi: "स्कूल और कॉलेज की छात्राओं के लिए आवासीय सुविधा"
    },
    phone: "",
    type: "school",
    address: {
      en: "Mandal Office Road, Orvakal",
      te: "మండల కార్యాలయ రోడ్, ఓర్వకల్లు",
      hi: "मंडल कार्यालय रोड, ओरवाकल"
    },
    principal: {
      en: "Hostel Warden",
      te: "వసతి గృహ వార్డెన్",
      hi: "छात्रावास वार्डन"
    },
    timings: {
      en: "07:00 AM - 05:00 PM (Monday - Saturday)",
      te: "ఉదయం 07:00 - సాయంత్రం 05:00 (సోమ - శని)",
      hi: "सुबह 07:00 - शाम 05:00 (सोमवार - शनिवार)"
    },
    facilities: [
      { en: "Free accommodation & hygienic food", te: "ఉచిత వసతి మరియు రుచికరమైన భోజనం", hi: "निःशुल्क आवास और स्वच्छ भोजन" },
      { en: "Study room & 24/7 security", te: "స్టడీ రూమ్ మరియు 24/7 భద్రత", hi: "अध्ययन कक्ष और 24/7 सुरक्षा" }
    ],
    establishedYear: "1985",
    staff: [
      {
        role: { en: "Warden", te: "వార్డెన్", hi: "वार्डन" },
        name: { en: "Hostel Warden", te: "వసతి గృహ వార్డెన్", hi: "छात्रावास वार्डन" },
        phone: ""
      }
    ]
  },
  {
    id: "sch-4",
    name: {
      en: "Bala Bharathi English Medium School",
      te: "బాల భారతి ఇంగ్లీష్ మీడియం స్కూల్",
      hi: "बाल भारती अंग्रेजी माध्यम स्कूल"
    },
    schoolName: {
      en: "Bala Bharathi School, Orvakal",
      te: "బాల భారతి పాఠశాల, ఓర్వకల్లు",
      hi: "बाल भारती स्कूल, ओरवाकल"
    },
    subject: {
      en: "English Medium Primary & Secondary (Grades Nursery-10)",
      te: "ఇంగ్లీష్ మీడియం ప్రైమరీ & సెకండరీ (నర్సరీ-10 తరగతులు)",
      hi: "अंग्रेजी माध्यम प्राथमिक और माध्यमिक (नर्सरी-10)"
    },
    phone: "",
    type: "school",
    address: {
      en: "Main route, Orvakal",
      te: "మెయిన్ రూట్, ఓర్వకల్లు",
      hi: "मुख्य मार्ग, ओरवाकल"
    },
    principal: {
      en: "Principal",
      te: "ప్రిన్సిపాల్",
      hi: "प्राचार्य"
    },
    timings: {
      en: "07:00 AM - 05:00 PM (Monday - Saturday)",
      te: "ఉదయం 07:00 - సాయంత్రం 05:00 (సోమ - శని)",
      hi: "सुबह 07:00 - शाम 05:00 (सोमवार - शनिवार)"
    },
    facilities: [
      { en: "Smart classes & computer laboratory", te: "స్మార్ట్ క్లాసులు మరియు కంప్యూటర్ ల్యాబ్", hi: "स्मार्ट कक्षाएं और कंप्यूटर लैब" },
      { en: "Playground & extra-curricular activities", te: "ఆట స్థలం మరియు ఇతర సాంస్కృతిక కార్యక్రమాలు", hi: "खेल का मैदान और पाठ्येतर गतिविधियाँ" }
    ],
    establishedYear: "2005",
    staff: [
      {
        role: { en: "Principal", te: "ప్రిన్సిపాల్", hi: "प्राचार्य" },
        name: { en: "School Principal", te: "పాఠశాల ప్రిన్సిపాల్", hi: "स्कूल प्राचार्य" },
        phone: ""
      }
    ]
  },
  {
    id: "sch-5",
    name: {
      en: "Yella Reddy College",
      te: "యల్లా రెడ్డి కాలేజీ",
      hi: "यल्ला रेड्डी कॉलेज"
    },
    schoolName: {
      en: "Yella Reddy College, Orvakal",
      te: "యల్లా రెడ్డి కాలేజీ, ఓర్వకల్లు",
      hi: "यल्ला रेड्डी कॉलेज, ओरवाकल"
    },
    subject: {
      en: "Intermediate & Degree Courses",
      te: "ఇంటర్మీడియట్ మరియు డిగ్రీ కోర్సులు",
      hi: "इंटरमीडिएट और डिग्री पाठ्यक्रम"
    },
    phone: "",
    type: "school",
    address: {
      en: "Main Bazar Road, Orvakal",
      te: "మెయిన్ బజార్ రోడ్, ఓర్వకల్లు",
      hi: "मुख्य बाजार रोड, ओरवाकल"
    },
    principal: {
      en: "Principal",
      te: "ప్రిన్సిపాల్",
      hi: "प्राचार्य"
    },
    timings: {
      en: "07:00 AM - 05:00 PM (Monday - Saturday)",
      te: "ఉదయం 07:00 - సాయంత్రం 05:00 (సోమ - శని)",
      hi: "सुबह 07:00 - शाम 05:00 (सोमवार - शनिवार)"
    },
    facilities: [
      { en: "Well-equipped science and computer labs", te: "సైన్స్ మరియు కంప్యూటర్ ల్యాబ్‌లు", hi: "सुसज्जित विज्ञान और कंप्यूटर लैब" },
      { en: "Spacious library and seminar halls", te: "లైబ్రరీ మరియు సెమินార్ హాల్స్", hi: "विशाल पुस्तकालय और संगोष्ठी कक्ष" }
    ],
    establishedYear: "2010",
    staff: [
      {
        role: { en: "Principal", te: "ప్రిన్సిపాల్", hi: "प्राचार्य" },
        name: { en: "College Principal", te: "కళాశాల ప్రిన్సిపాల్", hi: "कॉलेज प्राचार्य" },
        phone: ""
      }
    ]
  },
  {
    id: "sch-6",
    name: {
      en: "Kasturba Gandhi Balika Vidyalaya (KGBV)",
      te: "కస్తూర్బా గాంధీ బాలికల విద్యాలయం (KGBV)",
      hi: "कस्तूरबा गांधी बालिका विद्यालय (केGBV)"
    },
    schoolName: {
      en: "KGBV Orvakal",
      te: "KGBV ఓర్వకల్లు",
      hi: "केGBV ओरवाकल"
    },
    subject: {
      en: "Residential School for Girls (Grades 6-10)",
      te: "బాలికల రెసిడెన్షియల్ పాఠశాల (6-10 తరగతులు)",
      hi: "लड़कियों के लिए आवासीय विद्यालय (कक्षा 6-10)"
    },
    phone: "",
    type: "school",
    address: {
      en: "Near Mandal Office, Orvakal",
      te: "మండల కార్యాలయం సమీపంలో, ఓర్వకల్లు",
      hi: "मंडल कार्यालय के पास, ओरवाकल"
    },
    principal: {
      en: "Special Officer",
      te: "ప్రత్యేకాధికారి",
      hi: "विशेष अधिकारी"
    },
    timings: {
      en: "07:00 AM - 05:00 PM (Monday - Saturday)",
      te: "ఉదయం 07:00 - సాయంత్రం 05:00 (సోమ - శని)",
      hi: "सुबह 07:00 - शाम 05:00 (सोमवार - शनिवार)"
    },
    facilities: [
      { en: "Free boarding, lodging and books", te: "ఉచిత భోజన వసతి మరియు పుస్తకాలు", hi: "निःशुल्क भोजन, आवास और पुस्तकें" },
      { en: "Vocational training & skill development", te: "వృత్తి విద్యా శిక్షణ & నైపుణ్యాభివృద్ధి", hi: "व्यावसायिक प्रशिक्षण और कौशल विकास" }
    ],
    establishedYear: "2008",
    staff: [
      {
        role: { en: "Special Officer", te: "ప్రత్యేకాధికారి", hi: "विशेष अधिकारी" },
        name: { en: "KGBV Coordinator", te: "KGBV కోఆర్డినేటర్", hi: "केGBV समन्वयक" },
        phone: ""
      }
    ]
  },
  {
    id: "sch-7",
    name: {
      en: "Bugga Rameswara College",
      te: "బుగ్గ రామేశ్వర కాలేజీ",
      hi: "बुग्गा रामेश्वर कॉलेज"
    },
    schoolName: {
      en: "Bugga Rameswara Junior & Degree College",
      te: "బుగ్గ రామేశ్వర జూనియర్ & డిగ్రీ కాలేజీ",
      hi: "बुग्गा रामेश्वर जूनियर और डिग्री कॉलेज"
    },
    subject: {
      en: "Higher Secondary & Under-Graduate Education",
      te: "హయ్యర్ సెకండరీ & అండర్ గ్రాడ్యుయేట్ విద్యా సంస్థ",
      hi: "उच्च माध्यमिक और स्नातक शिक्षा"
    },
    phone: "",
    type: "school",
    address: {
      en: "Bugga Rameswara Temple Road, Orvakal",
      te: "బుగ్గ రామేశ్వర ఆలయ రోడ్, ఓర్వకల్లు",
      hi: "बुग्गा रामेश्वर मंदिर रोड, ओरवाकल"
    },
    principal: {
      en: "Principal",
      te: "ప్రిన్సిపాల్",
      hi: "प्राचार्य"
    },
    timings: {
      en: "07:00 AM - 05:00 PM (Monday - Saturday)",
      te: "ఉదయం 07:00 - సాయంత్రం 05:00 (సోమ - శని)",
      hi: "सुबह 07:00 - शाम 05:00 (सोमवार - शनिवार)"
    },
    facilities: [
      { en: "Science laboratories & library room", te: "సైన్స్ లాబొరేటరీలు మరియు లైబ్రరీ గది", hi: "विज्ञान प्रयोगशालाएं और पुस्तकालय कक्ष" },
      { en: "Sports arena & computer setup", te: "క్రీడా మైదానం మరియు కంప్యూటర్ సదుపాయం", hi: "खेल का मैदान और कंप्यूटर सेटअप" }
    ],
    establishedYear: "2012",
    staff: [
      {
        role: { en: "Principal", te: "ప్రిన్సిపాల్", hi: "प्राचार्य" },
        name: { en: "College Principal", te: "కళాశాల ప్రిన్సిపాల్", hi: "कॉलेज प्राचार्य" },
        phone: ""
      }
    ]
  }
];
export const tuitions = [];
export const schoolsAndTuitions = [...schools];
