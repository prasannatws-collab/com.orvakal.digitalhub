import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Phone, MapPin, Clock, Search, Shield, Navigation2, Building2, ChevronDown, ChevronUp, CheckCircle2, Mail } from 'lucide-react-native';
import { useLanguage } from '../../core/state/LanguageContext';
import { useTheme } from '../../core/state/ThemeContext';
import { GlassCard } from '../../core/components/GlassCard';
import { AudioButton } from '../../core/components/AudioButton';
import { Badge } from '../../core/components/Badge';
import { DI } from '../../core/di';

// Import datasets
import { govtOfficers, schools } from '../../data/datasources/static/govtData';
import { govtOffices } from '../../data/datasources/static/govtOfficesData';
import { stateSchemes } from '../../data/datasources/static/schemes/stateSchemes';
import { centralSchemes } from '../../data/datasources/static/schemes/centralSchemes';
import { bankSchemes } from '../../data/datasources/static/schemes/bankSchemes';
import { postalSchemes } from '../../data/datasources/static/schemes/postalSchemes';

const allSchemes = [...stateSchemes, ...centralSchemes, ...bankSchemes, ...postalSchemes];
import { banksAndAtms } from '../../data/datasources/static/banksData';
import { postalServices } from '../../data/datasources/static/postalData';
import { policeStations } from '../../data/datasources/static/policeData';
import { committees } from '../../data/datasources/static/communityData';

type SubTab = 'govt' | 'education' | 'grievance' | 'postal' | 'banks' | 'police' | 'hospital' | 'schemes' | 'committees';

interface DirectoryScreenProps {
  initialSubTab: SubTab | null;
  onClose: () => void;
}

// Mock Coordinates for Orvakal center: 15.68401, 78.174366
const mockCoordinates: Record<string, { latitude: number; longitude: number }> = {
  'bnk-1': { latitude: 15.6845, longitude: 78.1748 }, // SBI
  'bnk-2': { latitude: 15.6835, longitude: 78.1741 }, // APGB
  'bnk-3': { latitude: 15.6852, longitude: 78.1732 }, // Canara
  'post-1': { latitude: 15.6830, longitude: 78.1755 }, // Post Office
  'sch-1': { latitude: 15.6820, longitude: 78.1762 }, // ZP School
  'sch-2': { latitude: 15.6865, longitude: 78.1725 }, // MPPS School
  'police-1': { latitude: 15.6850, longitude: 78.1750 }, // Police
  'phc-1': { latitude: 15.6840, longitude: 78.1730 }, // PHC
};

export const DirectoryScreen: React.FC<DirectoryScreenProps> = ({ initialSubTab, onClose }) => {
  const { lang, getTxt, t } = useLanguage();
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [subTab, setSubTab] = useState<SubTab | null>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedOfficeId, setExpandedOfficeId] = useState<string | null>(null);
  const [schemeProvider, setSchemeProvider] = useState<string>('all');
  const [schemeCategory, setSchemeCategory] = useState<string>('all');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  // Proximity sorting state
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Grievance states
  const [grievanceName, setGrievanceName] = useState('');
  const [grievancePhone, setGrievancePhone] = useState('');
  const [grievanceCategory, setGrievanceCategory] = useState('water');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [grievanceSuccessMessage, setGrievanceSuccessMessage] = useState<string | null>(null);

  const locationService = DI.getLocationService();

  // Reset search when sub-tab changes
  useEffect(() => {
    setSearchQuery('');
    setGrievanceSuccessMessage(null);
  }, [subTab]);

  const requestGPSLocation = async () => {
    try {
      setIsLocating(true);
      const coords = await locationService.getCurrentLocation(lang);
      if (coords) {
        setUserCoords(coords);
      } else {
        alert(lang === 'en' ? "Unable to retrieve GPS coordinates. Using default sorting." : "జీపీఎస్ అందుబాటులో లేదు. డిఫాల్ట్ సార్టింగ్ ఉపయోగించబడుతోంది.");
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLocating(false);
    }
  };

  const computeProximity = (id: string): string => {
    if (!userCoords) return '';
    const itemCoords = mockCoordinates[id];
    if (!itemCoords) return '';
    const dist = locationService.calculateDistance(userCoords, itemCoords);
    return `${dist.toFixed(2)} km`;
  };

  // Helper to sort elements by computed distance
  const getSortedItems = <T extends { id: string }>(items: T[]): T[] => {
    if (!userCoords) return items;
    return [...items].sort((a, b) => {
      const coordsA = mockCoordinates[a.id];
      const coordsB = mockCoordinates[b.id];
      if (!coordsA) return 1;
      if (!coordsB) return -1;
      const distA = locationService.calculateDistance(userCoords, coordsA);
      const distB = locationService.calculateDistance(userCoords, coordsB);
      return distA - distB;
    });
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`);
  };

  const handleGrievanceSubmit = () => {
    if (!grievanceName || !grievancePhone || !grievanceDesc) {
      alert(lang === 'en' ? 'Please fill in all required fields.' : 'దయచేసి అన్ని వివరాలు పూరించండి.');
      return;
    }
    const trackId = `ORV-${Math.floor(1000 + Math.random() * 9000)}`;
    const msg = lang === 'en'
      ? `Grievance submitted successfully!\nTracking ID: ${trackId}\nOur Panchayati Secretary will contact you within 48 hours.`
      : `ఫిర్యాదు విజయవంతంగా సమర్పించబడింది!\nట్రాకింగ్ ఐడీ: ${trackId}\n48 గంటల్లో పంచాయతీ కార్యదర్శి మిమ్మల్ని సంప్రదిస్తారు.`;
    
    setGrievanceSuccessMessage(msg);
    setGrievanceName('');
    setGrievancePhone('');
    setGrievanceDesc('');
  };

  if (subTab === null) {
    // Menu Hub
    const directoryItems = [
      { id: 'grievance', title: { en: "Panchayat Grievance Desk", te: "పంచాయతీ ఫిర్యాదుల విభాగం", hi: "पंचायत शिकायत डेस्क" }, desc: { en: "File and track civic complaints directly with village administration.", te: "వీధి దీపాలు, నీరు మరియు మురుగు కాలువల సమస్యలపై ఫిర్యాదు చేయండి.", hi: "सड़क, पानी और बिजली जैसी शिकायतों को सीधे ग्राम पंचायत में दर्ज करें।" }, icon: "📝" },
      { id: 'govt', title: { en: "Govt Offices & Officers", te: "ప్రభుత్వ కార్యాలయాలు & అధికారులు", hi: "सरकारी कार्यालय और अधिकारी" }, desc: { en: "Contact details for Panchayat, SRO, Tahsildar, and agricultural coordinators.", te: "సర్పంచ్, పంచాయతీ సెక్రటరీ, విలేజ్ ఆఫీసర్ల వివరాలు.", hi: "ग्राम पंचायत, तहसीलदार और कृषि अधिकारियों के नंबर।" }, icon: "🏛️" },
      { id: 'education', title: { en: "Schools & Education Centers", te: "పాఠశాలలు & విద్యా సంస్థలు", hi: "स्कूल और शिक्षा केंद्र" }, desc: { en: "Government schools, private tuition modules, and facilities.", te: "జిల్లా పరిషత్ ఉన్నత పాఠశాల మరియు ఇతర విద్యా కేంద్రాల వివరాలు.", hi: "स्थानीय सरकारी स्कूलों और कोचिंग सेंटरों का विवरण।" }, icon: "🏫" },
      { id: 'postal', title: { en: "Post Office & Services", te: "తపాలా కార్యాలయం", hi: "डाकघर और डाक सेवाएं" }, desc: { en: "Speed post details, pin codes, and savings schemes.", te: "ఓర్వకల్లు సబ్ పోస్ట్ ఆఫీస్ పనివేళలు మరియు సేవలు.", hi: "डाकघर की बचत योजनाओं और पिन कोड की जानकारी।" }, icon: "📮" },
      { id: 'banks', title: { en: "Banks & ATMs", te: "బ్యాంకులు & ఏటీఎంలు", hi: "बैंक और एटीएम" }, desc: { en: "SBI, APGB, Canara branch details with 24/7 cash status and crop loan interest rates.", te: "బ్యాంకు బ్రాంచులు, ఐఎఫ్ఎస్ కోడ్ మరియు ఏటీఎంల సమాచారం.", hi: "स्थानीय बैंक शाखाओं, आईएफएससी कोड और एटीएम की स्थिति।" }, icon: "🏦" },
      { id: 'schemes', title: { en: "Government Schemes", te: "ప్రభుత్వ పథకాలు", hi: "सरकारी योजनाएं" }, desc: { en: "State and Central government schemes for farmers, women, and students.", te: "రైతు భరోసా, పించన్లు, మరియు విద్యా పథకాల వివరాలు.", hi: "किसान, महिलाओं और छात्रों के लिए सरकारी कल्याणकारी योजनाएं।" }, icon: "📜" },
      { id: 'police', title: { en: "Police Station & Security", te: "పోలీస్ స్టేషన్ & భద్రత", hi: "पुलिस स्टेशन और सुरक्षा" }, desc: { en: "Orvakal police station phone directory and Sub-Inspector contact.", te: "పోలీస్ స్టేషన్ ఫోన్ నంబర్లు మరియు ఎస్.ఐ వివరాలు.", hi: "थाने के आपातकालीन नंबर और सुरक्षा दल का विवरण।" }, icon: "👮" },
      { id: 'hospital', title: { en: "Hospital & PHC Clinics", te: "హాస్పిటల్ & PHC", hi: "अस्पताल & पीएचसी" }, desc: { en: "Primary Health Center beds count, doctors list, and OPD timings.", te: "ప్రభుత్వ ఆసుపత్రి వైద్యులు, వార్డుల సంఖ్య మరియు పనివేళలు.", hi: "प्राथमिक स्वास्थ्य केंद्र के ओपीडी समय और बेड क्षमता की जानकारी।" }, icon: "🏥" },
      { id: 'committees', title: { en: "Village Committees", te: "గ్రామ కమిటీలు", hi: "ग्राम समितियां" }, desc: { en: "Temple, youth, security and commercial advisory panels.", te: "గ్రామ కమిటీ సభ్యులు మరియు వాటి సమావేశ వివరాలు.", hi: "विभिन्न ग्राम विकास समितियों और उनके सदस्यों का विवरण।" }, icon: "👥" },
    ];

    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            🏛️ {lang === 'en' ? "Govt & Info" : lang === 'te' ? "ప్రభుత్వ & సమాచారం" : "शासन और सूचना"}
          </Text>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]} onPress={onClose}>
            <Text style={[styles.backBtnText, { color: colors.uniformPastelText }]}>🏠 Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* GOVERNMENT NON-OFFICIAL DISCLAIMER BANNER */}
        <View
          style={[
            styles.disclaimerCard,
            {
              backgroundColor: colors.uniformPastelBg,
              borderColor: colors.uniformPastelBorder,
              marginBottom: 14,
            },
          ]}
        >
          <Text style={[styles.disclaimerText, { color: colors.uniformPastelText, fontSize: 10.5, lineHeight: 15 }]}>
            ⚠️ <Text style={{ fontWeight: 'bold' }}>{t.disclaimerTitle}:</Text> {t.govtDisclaimer}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            <TouchableOpacity onPress={() => Linking.openURL('https://kurnool.ap.gov.in')} style={[styles.linkPill, { backgroundColor: `${colors.background}80`, borderColor: colors.uniformPastelBorder }]}>
              <Text style={[styles.linkPillText, { color: colors.uniformPastelText }]}>kurnool.ap.gov.in ↗</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.ap.gov.in')} style={[styles.linkPill, { backgroundColor: `${colors.background}80`, borderColor: colors.uniformPastelBorder }]}>
              <Text style={[styles.linkPillText, { color: colors.uniformPastelText }]}>ap.gov.in ↗</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.india.gov.in')} style={[styles.linkPill, { backgroundColor: `${colors.background}80`, borderColor: colors.uniformPastelBorder }]}>
              <Text style={[styles.linkPillText, { color: colors.uniformPastelText }]}>india.gov.in ↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuGrid}>
          {directoryItems.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.menuCard, { backgroundColor: colors.uniformMenuBg, borderColor: colors.uniformMenuBorder }]} onPress={() => setSubTab(item.id as SubTab)}>
              <Text style={styles.menuEmoji}>{item.icon}</Text>
              <View style={styles.menuInfo}>
                <Text style={[styles.menuTitle, { color: colors.foreground }]}>{getTxt(item.title)}</Text>
                <Text style={[styles.menuDesc, { color: colors.mutedForeground }]} numberOfLines={2}>{getTxt(item.desc)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  // Filtered views based on search query
  const matchesSearch = (text: string) => {
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Sub-tab header navigation */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]} onPress={() => setSubTab(null)}>
          <Text style={[styles.backBtnText, { color: colors.uniformPastelText }]}>⬅️ Menu</Text>
        </TouchableOpacity>
        <Text style={[styles.subTabTitle, { color: colors.foreground }]}>
          {subTab === 'govt' ? 'Officers' :
           subTab === 'education' ? 'Education' :
           subTab === 'postal' ? 'Postal' :
           subTab === 'banks' ? 'Banks & ATMs' :
           subTab === 'police' ? 'Police' :
           subTab === 'hospital' ? 'PHC Hospital' :
           subTab === 'schemes' ? 'Schemes' :
           subTab === 'grievance' ? 'Grievances' : 'Committees'}
        </Text>
        {['banks', 'postal', 'education', 'police', 'hospital'].includes(subTab) && (
          <TouchableOpacity style={[styles.gpsBtn, { backgroundColor: userCoords ? colors.uniformPastelBg : colors.card, borderColor: userCoords ? colors.uniformPastelBorder : colors.border }]} onPress={requestGPSLocation}>
            <Navigation2 size={12} color={userCoords ? colors.uniformPastelText : colors.primary} />
            <Text style={[styles.gpsBtnText, { color: userCoords ? colors.uniformPastelText : colors.primary }]}>
              {isLocating ? 'GPS...' : userCoords ? 'Sorted GPS' : 'Sort GPS'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dynamic Government Disclaimer at the Top of Sub-tabs */}
      <View
        style={[
          styles.disclaimerCard,
          {
            backgroundColor: isDark ? 'rgba(217, 119, 6, 0.08)' : 'rgba(217, 119, 6, 0.04)',
            borderColor: isDark ? 'rgba(217, 119, 6, 0.25)' : 'rgba(217, 119, 6, 0.15)',
            shadowColor: '#d97706',
            marginBottom: 12,
          },
        ]}
      >
        <Text style={[styles.disclaimerText, { color: colors.uniformPastelText, fontSize: 10.5, lineHeight: 15 }]}>
          ⚠️ <Text style={{ fontWeight: 'bold' }}>{t.disclaimerTitle}:</Text> {t.govtDisclaimer}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {subTab === 'postal' && (
            <TouchableOpacity onPress={() => Linking.openURL('https://www.indiapost.gov.in')} style={[styles.linkPill, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.06)', borderColor: isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(217, 119, 6, 0.2)' }]}>
              <Text style={[styles.linkPillText, { color: isDark ? '#F59E0B' : '#D97706' }]}>indiapost.gov.in ↗</Text>
            </TouchableOpacity>
          )}
          {subTab === 'police' && (
            <TouchableOpacity onPress={() => Linking.openURL('https://appolice.gov.in')} style={[styles.linkPill, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.06)', borderColor: isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(217, 119, 6, 0.2)' }]}>
              <Text style={[styles.linkPillText, { color: isDark ? '#F59E0B' : '#D97706' }]}>appolice.gov.in ↗</Text>
            </TouchableOpacity>
          )}
          {subTab === 'schemes' && (
            <>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.ap.gov.in')} style={[styles.linkPill, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.06)', borderColor: isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(217, 119, 6, 0.2)' }]}>
                <Text style={[styles.linkPillText, { color: isDark ? '#F59E0B' : '#D97706' }]}>ap.gov.in ↗</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.india.gov.in')} style={[styles.linkPill, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.06)', borderColor: isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(217, 119, 6, 0.2)' }]}>
                <Text style={[styles.linkPillText, { color: isDark ? '#F59E0B' : '#D97706' }]}>india.gov.in ↗</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://pmkisan.gov.in')} style={[styles.linkPill, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.06)', borderColor: isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(217, 119, 6, 0.2)' }]}>
                <Text style={[styles.linkPillText, { color: isDark ? '#F59E0B' : '#D97706' }]}>pmkisan.gov.in ↗</Text>
              </TouchableOpacity>
            </>
          )}
          {subTab !== 'postal' && subTab !== 'police' && subTab !== 'schemes' && (
            <>
              <TouchableOpacity onPress={() => Linking.openURL('https://kurnool.ap.gov.in')} style={[styles.linkPill, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.06)', borderColor: isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(217, 119, 6, 0.2)' }]}>
                <Text style={[styles.linkPillText, { color: isDark ? '#F59E0B' : '#D97706' }]}>kurnool.ap.gov.in ↗</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.ap.gov.in')} style={[styles.linkPill, { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.06)', borderColor: isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(217, 119, 6, 0.2)' }]}>
                <Text style={[styles.linkPillText, { color: isDark ? '#F59E0B' : '#D97706' }]}>ap.gov.in ↗</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Search Bar for searchable lists */}
      {subTab !== 'grievance' && subTab !== 'hospital' && (
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search details..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* A. Govt Offices & Officers List */}
      {subTab === 'govt' && (
        <View style={styles.listContainer}>
          {/* Collapsed office list */}
          {expandedOfficeId === null && govtOffices
            .filter(o => matchesSearch(getTxt(o.name)) || matchesSearch(getTxt(o.location)))
            .map((office) => (
              <TouchableOpacity
                key={office.id}
                activeOpacity={0.85}
                onPress={() => setExpandedOfficeId(office.id)}
              >
                <GlassCard>
                  <View style={styles.officeCardRow}>
                    <View style={[styles.officeIconBox, { backgroundColor: `${colors.primary}18` }]}>
                      <Building2 size={22} color={colors.primary} />
                    </View>
                    <View style={styles.officeInfo}>
                      <Text style={[styles.officeName, { color: colors.foreground }]}>{getTxt(office.name)}</Text>
                      <View style={styles.officeLocRow}>
                        <MapPin size={11} color="#E53E3E" />
                        <Text style={[styles.officeLocText, { color: colors.mutedForeground }]}>{getTxt(office.location)}</Text>
                      </View>
                    </View>
                    <View style={styles.verifiedBadge}>
                      <CheckCircle2 size={11} color="#15803D" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))
          }

          {/* Expanded office detail view */}
          {expandedOfficeId !== null && (() => {
            const office = govtOffices.find(o => o.id === expandedOfficeId);
            if (!office) return null;
            const officers = govtOfficers.filter(o => o.officeId === office.id);
            return (
              <View>
                {/* Back button */}
                <TouchableOpacity
                  style={[styles.officeBackBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]}
                  onPress={() => setExpandedOfficeId(null)}
                >
                  <Text style={[styles.officeBackBtnText, { color: colors.uniformPastelText }]}>← Back to Offices</Text>
                </TouchableOpacity>

                {/* Office header card */}
                <GlassCard>
                  <Text style={[styles.officeDetailTitle, { color: colors.primary }]}>{getTxt(office.name)}</Text>
                  <View style={styles.detailRow}>
                    <MapPin size={13} color={colors.mutedForeground} />
                    <Text style={[styles.detailText, { color: colors.mutedForeground }]}>{getTxt(office.location)}</Text>
                  </View>
                  <View style={[styles.detailRow, { marginTop: 4 }]}>
                    <Clock size={13} color={colors.mutedForeground} />
                    <Text style={[styles.detailText, { color: colors.mutedForeground }]}>{getTxt(office.timings)}</Text>
                  </View>
                  <View style={[styles.detailRow, { marginTop: 4 }]}>
                    <Phone size={13} color={colors.mutedForeground} />
                    <Text style={[styles.detailText, { color: colors.mutedForeground }]}>{office.phone}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1, marginTop: 12 }]}
                    onPress={() => handleCall(office.phone)}
                  >
                    <Phone size={14} color={colors.uniformPastelText} />
                    <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Call Office</Text>
                  </TouchableOpacity>
                </GlassCard>

                {/* Associated Officers */}
                {officers.length > 0 && (
                  <View style={styles.officeSectionBlock}>
                    <View style={styles.officeSectionHeader}>
                      <Text style={styles.officeSectionDot}>👤</Text>
                      <Text style={[styles.officeSectionLabel, { color: colors.foreground }]}>ASSOCIATED OFFICERS</Text>
                    </View>
                    {officers.map(officer => (
                      <GlassCard key={officer.id}>
                        {/* Officer header row */}
                        <View style={styles.officerHeaderRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.officerDetailName, { color: colors.primary }]}>{getTxt(officer.name)}</Text>
                            <Text style={[styles.officerDetailDesig, { color: colors.mutedForeground }]}>{getTxt(officer.designation)}</Text>
                          </View>
                          <View style={styles.verifiedBadge}>
                            <CheckCircle2 size={11} color="#15803D" />
                            <Text style={styles.verifiedText}>Verified</Text>
                          </View>
                        </View>
                        {/* Contact */}
                        {officer.email && (
                          <View style={[styles.detailRow, { marginTop: 8 }]}>
                            <Mail size={12} color={colors.mutedForeground} />
                            <Text style={[styles.detailText, { color: colors.mutedForeground }]}>Email: {officer.email}</Text>
                          </View>
                        )}
                        <View style={[styles.detailRow, { marginTop: 4 }]}>
                          <Phone size={12} color={colors.mutedForeground} />
                          <Text style={[styles.detailText, { color: colors.mutedForeground }]}>{officer.phone}</Text>
                        </View>
                        {/* Role/Duties */}
                        {officer.servicesDescription && (
                          <View style={{ marginTop: 8 }}>
                            <Text style={[styles.officerFieldLabel, { color: colors.foreground }]}>Role/Duties:</Text>
                            <Text style={[styles.officerFieldText, { color: colors.mutedForeground }]}>{getTxt(officer.servicesDescription)}</Text>
                          </View>
                        )}
                        {/* Permissions */}
                        {officer.permissions && officer.permissions.length > 0 && (
                          <View style={{ marginTop: 8 }}>
                            <Text style={[styles.officerFieldLabel, { color: colors.foreground }]}>Permissions managed:</Text>
                            {officer.permissions.map((perm, idx) => (
                              <View key={idx} style={styles.permissionItem}>
                                <Text style={[styles.permissionBullet, { color: colors.mutedForeground }]}>•</Text>
                                <Text style={[styles.permissionText, { color: colors.mutedForeground }]}>{getTxt(perm)}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                        <TouchableOpacity
                          style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1, marginTop: 12 }]}
                          onPress={() => handleCall(officer.phone)}
                        >
                          <Phone size={14} color={colors.uniformPastelText} />
                          <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Call Officer</Text>
                        </TouchableOpacity>
                      </GlassCard>
                    ))}
                  </View>
                )}

                {/* Services & Applications */}
                <View style={styles.officeSectionBlock}>
                  <View style={styles.officeSectionHeader}>
                    <Text style={styles.officeSectionDot}>✅</Text>
                    <Text style={[styles.officeSectionLabel, { color: colors.foreground }]}>SERVICES & APPLICATIONS</Text>
                  </View>
                  <GlassCard>
                    {office.services.map((svc, idx) => (
                      <View key={idx} style={styles.serviceCheckRow}>
                        <CheckCircle2 size={16} color={colors.primary} />
                        <Text style={[styles.serviceCheckText, { color: colors.foreground }]}>{getTxt(svc)}</Text>
                      </View>
                    ))}
                  </GlassCard>
                </View>
              </View>
            );
          })()}
        </View>
      )}

      {/* B. Schools & Education */}
      {subTab === 'education' && (
        <View style={styles.listContainer}>
          {getSortedItems(schools)
            .filter(s => matchesSearch(getTxt(s.name)) || matchesSearch(getTxt(s.subject)))
            .map((school) => (
              <GlassCard key={school.id}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(school.name)}</Text>
                      {userCoords && <Badge style={{ marginLeft: 6 }}>{computeProximity(school.id)}</Badge>}
                    </View>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>{getTxt(school.schoolName)}</Text>
                    <Text style={[styles.officerDept, { color: colors.mutedForeground }]}>Subject: {getTxt(school.subject)}</Text>
                  </View>
                  <AudioButton text={`${getTxt(school.name)}, ${getTxt(school.schoolName)}`} />
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  {school.establishedYear && (
                    <Text style={[styles.detailText, { color: colors.mutedForeground, marginBottom: 2 }]}>Est Year: {school.establishedYear}</Text>
                  )}
                  {school.principal && (
                    <Text style={[styles.detailText, { color: colors.mutedForeground, marginBottom: 2 }]}>Principal: {getTxt(school.principal)}</Text>
                  )}
                  {school.timings && (
                    <Text style={[styles.detailText, { color: colors.mutedForeground, marginBottom: 2 }]}>Timings: {getTxt(school.timings)}</Text>
                  )}
                </View>
                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(school.phone)}>
                  <Phone size={14} color={colors.uniformPastelText} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Contact Principal ({school.phone})</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
        </View>
      )}

      {/* C. Post Office */}
      {subTab === 'postal' && (
        <View style={styles.listContainer}>
          {getSortedItems(postalServices)
            .filter(p => matchesSearch(getTxt(p.name)))
            .map((post) => (
              <GlassCard key={post.id}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <View style={styles.row}>
                      <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(post.name)}</Text>
                      {userCoords && <Badge style={{ marginLeft: 6 }}>{computeProximity(post.id)}</Badge>}
                    </View>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>Pin: {post.pincode}</Text>
                  </View>
                  <AudioButton text={`${getTxt(post.name)}, pincode ${post.pincode}`} />
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <Text style={[styles.detailText, { color: colors.mutedForeground, fontWeight: 'bold' }]}>Postmaster: {getTxt(post.postmaster)}</Text>
                  <Text style={[styles.detailText, { color: colors.mutedForeground, marginTop: 4 }]}>Timings: {getTxt(post.timing)}</Text>
                </View>

                {/* Schemes */}
                {post.schemes && (
                  <View style={styles.schemesContainer}>
                    <Text style={[styles.schemesHeading, { color: colors.foreground }]}>Featured Postal Schemes:</Text>
                    {post.schemes.map((scheme, idx) => (
                      <View key={idx} style={styles.schemeItem}>
                        <Text style={[styles.schemeTitle, { color: colors.primary }]}>• {getTxt(scheme.name)}</Text>
                        <Text style={[styles.schemeDesc, { color: colors.mutedForeground }]}>{getTxt(scheme.description)}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(post.phone)}>
                  <Phone size={14} color={colors.uniformPastelText} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Call Postmaster ({post.phone})</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
        </View>
      )}

      {/* D. Banks & ATMs */}
      {subTab === 'banks' && (
        <View style={styles.listContainer}>
          {getSortedItems(banksAndAtms)
            .filter(b => matchesSearch(getTxt(b.name)) || matchesSearch(b.ifsc))
            .map((bank) => (
              <GlassCard key={bank.id}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(bank.name)}</Text>
                      {userCoords && <Badge style={{ marginLeft: 6 }}>{computeProximity(bank.id)}</Badge>}
                    </View>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>{getTxt(bank.branch)} • IFSC: {bank.ifsc}</Text>
                  </View>
                  <AudioButton text={`${getTxt(bank.name)}, ${getTxt(bank.branch)}`} />
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <Text style={[styles.detailText, { color: colors.mutedForeground }]}>Timings: {getTxt(bank.timing)}</Text>
                  <Text style={[styles.detailText, { color: colors.mutedForeground, marginTop: 2 }]}>ATM: <Text style={{ color: bank.hasAtm ? '#15803D' : '#B91C1C', fontWeight: 'bold' }}>{getTxt(bank.atmStatus)}</Text></Text>
                </View>

                {/* Staff Contacts */}
                <View style={styles.schemesContainer}>
                  <Text style={[styles.schemesHeading, { color: colors.foreground }]}>Key Personnel Contacts:</Text>
                  {bank.staff.map((person, idx) => (
                    <TouchableOpacity key={idx} style={styles.staffContactRow} onPress={() => handleCall(person.phone)}>
                      <View>
                        <Text style={[styles.staffName, { color: colors.foreground }]}>{getTxt(person.name)}</Text>
                        <Text style={[styles.staffRole, { color: colors.primary }]}>{getTxt(person.role)}</Text>
                      </View>
                      <Phone size={12} color={colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Schemes */}
                {bank.schemes && (
                  <View style={styles.schemesContainer}>
                    <Text style={[styles.schemesHeading, { color: colors.foreground }]}>Popular Bank Schemes:</Text>
                    {bank.schemes.map((scheme, idx) => (
                      <View key={idx} style={styles.schemeItem}>
                        <Text style={[styles.schemeTitle, { color: colors.primary }]}>• {getTxt(scheme.name)}</Text>
                        <Text style={[styles.schemeDesc, { color: colors.mutedForeground }]}>{getTxt(scheme.description)}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(bank.phone)}>
                  <Phone size={14} color={colors.uniformPastelText} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Call Branch Desk ({bank.phone})</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
        </View>
      )}

      {/* E. Police Station */}
      {subTab === 'police' && (
        <View style={styles.listContainer}>
          {policeStations.map((station) => (
            <GlassCard key={station.id}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(station.name)}</Text>
                  <Text style={[styles.officerRole, { color: colors.primary }]}>{getTxt(station.location)}</Text>
                </View>
                <AudioButton text={getTxt(station.name)} />
              </View>
              <View style={styles.divider} />
              
              <View style={styles.schemesContainer}>
                <Text style={[styles.schemesHeading, { color: colors.foreground }]}>Officers In Charge:</Text>
                {station.staff.map((officer, idx) => (
                  <TouchableOpacity key={idx} style={styles.staffContactRow} onPress={() => handleCall(officer.phone)}>
                    <View>
                      <Text style={[styles.staffName, { color: colors.foreground }]}>{getTxt(officer.name)}</Text>
                      <Text style={[styles.staffRole, { color: colors.primary }]}>{getTxt(officer.role)}</Text>
                    </View>
                    <Phone size={12} color={colors.primary} />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(station.phone)}>
                <Shield size={14} color={colors.uniformPastelText} />
                <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Emergency Police Line ({station.phone})</Text>
              </TouchableOpacity>
            </GlassCard>
          ))}
        </View>
      )}

      {/* F. Hospital & PHC */}
      {subTab === 'hospital' && (
        <View style={styles.listContainer}>
          <GlassCard>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={[styles.officerName, { color: colors.foreground }]}>Orvakal Government PHC Hospital</Text>
                <Text style={[styles.officerRole, { color: colors.primary }]}>Highway Circle Junction, Orvakal</Text>
              </View>
              <AudioButton text="Orvakal Government Primary Health Center Hospital" />
            </View>
            <View style={styles.divider} />
            <View style={styles.cardDetails}>
              <Text style={[styles.detailText, { color: colors.mutedForeground }]}>OPD Timings: <Text style={{ color: colors.foreground, fontWeight: 'bold' }}>09:00 AM - 02:00 PM (OPD), Emergency 24/7</Text></Text>
              <Text style={[styles.detailText, { color: colors.mutedForeground, marginTop: 4 }]}>Beds Count: <Text style={{ color: colors.foreground, fontWeight: 'bold' }}>30 Beds (Male/Female/Maternity)</Text></Text>
            </View>
            <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall('+91 8518290108')}>
              <Phone size={14} color={colors.uniformPastelText} />
              <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Emergency Ambulance / Duty Doctor</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      )}

      {/* G. Government Schemes */}
      {subTab === 'schemes' && (() => {
        const providerFilters = [
          { key: 'central', label: 'Central Govt' },
          { key: 'state', label: 'State Govt' },
          { key: 'bank', label: 'Bank' },
          { key: 'postal', label: 'Postal' },
          { key: 'all', label: 'All Providers' },
        ];
        const categoryFilters = [
          { key: 'farmer', emoji: '🌾', label: 'Farmer' },
          { key: 'students', emoji: '🎓', label: 'Students' },
          { key: 'women', emoji: '👩', label: 'Women' },
          { key: 'business', emoji: '🏢', label: 'Business' },
          { key: 'insurance', emoji: '🛡️', label: 'Insurance' },
          { key: 'savings', emoji: '💰', label: 'Savings' },
          { key: 'welfare', emoji: '🤝', label: 'Welfare' },
          { key: 'all', emoji: '🔵', label: 'All categories' },
        ];
        const schemeEmojis: Record<string, string> = {
          farmer: '🌾', students: '🎓', women: '👩', business: '🏢',
          insurance: '🛡️', savings: '💰', welfare: '🏠', default: '📜'
        };
        const providerColors: Record<string, string> = {
          state: '#0D7A5F', central: '#1D4ED8', bank: '#7C3AED', postal: '#B45309'
        };
        const providerLabels: Record<string, string> = {
          state: 'State Govt', central: 'Central Govt', bank: 'Bank', postal: 'Postal'
        };
        const filtered = allSchemes.filter(s => {
          const providerMatch = schemeProvider === 'all' || s.type === schemeProvider;
          const categoryMatch = schemeCategory === 'all' || s.category === schemeCategory;
          const searchMatch = matchesSearch(getTxt(s.title)) || matchesSearch(getTxt(s.description));
          return providerMatch && categoryMatch && searchMatch;
        });
        return (
          <View>
            {/* Header */}
            <GlassCard>
              <Text style={[styles.schemesPageTitle, { color: colors.foreground }]}>Government Schemes & Welfare Desk</Text>
              <Text style={[styles.schemesPageSubtitle, { color: colors.mutedForeground }]}>Browse state and central welfare schemes. Select a category below to filter schemes.</Text>
            </GlassCard>

            {/* Provider filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterRowContent}>
              {providerFilters.map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[
                    styles.filterPill,
                    { borderColor: schemeProvider === f.key ? colors.uniformPastelBorder : colors.border,
                      backgroundColor: schemeProvider === f.key ? colors.uniformPastelBg : colors.card }
                  ]}
                  onPress={() => setSchemeProvider(f.key)}
                >
                  <Text style={[styles.filterPillText, { color: schemeProvider === f.key ? colors.uniformPastelText : colors.foreground }]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Category filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterRowContent}>
              {categoryFilters.map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[
                    styles.filterPill,
                    { borderColor: schemeCategory === f.key ? colors.uniformPastelBorder : colors.border,
                      backgroundColor: schemeCategory === f.key ? colors.uniformPastelBg : colors.card }
                  ]}
                  onPress={() => setSchemeCategory(f.key)}
                >
                  <Text style={[styles.filterPillEmoji]}>{f.emoji}</Text>
                  <Text style={[styles.filterPillText, { color: schemeCategory === f.key ? colors.uniformPastelText : colors.foreground }]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Scheme cards */}
            <View style={[styles.listContainer, { marginTop: 8 }]}>
              {filtered.map((scheme) => {
                const isExpanded = expandedSchemeId === scheme.id;
                const schemeType = scheme.type || 'state';
                const provColor = providerColors[schemeType] || '#0D7A5F';
                const provLabel = providerLabels[schemeType] || schemeType;
                const emoji = schemeEmojis[scheme.category] || schemeEmojis.default;
                return (
                  <TouchableOpacity
                    key={scheme.id}
                    activeOpacity={0.85}
                    onPress={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                  >
                    <GlassCard>
                      <View style={styles.schemeCardRow}>
                        <View style={[styles.schemeIconBox, { backgroundColor: `${provColor}18` }]}>
                          <Text style={styles.schemeIconEmoji}>{emoji}</Text>
                        </View>
                        <View style={styles.schemeCardInfo}>
                          <Text style={[styles.schemeCardTitle, { color: colors.foreground }]}>{getTxt(scheme.title)}</Text>
                          <Text style={[styles.schemeCardDesc, { color: colors.mutedForeground }]} numberOfLines={isExpanded ? undefined : 2}>{getTxt(scheme.description)}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', gap: 6 }}>
                          <View style={[styles.schemeBadge, { borderColor: provColor }]}>
                            <Text style={[styles.schemeBadgeText, { color: provColor }]}>{provLabel}</Text>
                          </View>
                          {isExpanded ? <ChevronUp size={14} color={colors.mutedForeground} /> : <ChevronDown size={14} color={colors.mutedForeground} />}
                        </View>
                      </View>

                      {isExpanded && (
                        <>
                          <View style={styles.divider} />
                          <Text style={[styles.schemeSectionHeading, { color: colors.primary }]}>Benefits:</Text>
                          <Text style={[styles.schemeSectionText, { color: colors.foreground }]}>{getTxt(scheme.benefits)}</Text>
                          <Text style={[styles.schemeSectionHeading, { color: colors.primary, marginTop: 8 }]}>Eligibility:</Text>
                          <Text style={[styles.schemeSectionText, { color: colors.foreground }]}>{getTxt(scheme.eligibility)}</Text>
                          <Text style={[styles.schemeSectionHeading, { color: colors.primary, marginTop: 8 }]}>How to Apply:</Text>
                          <Text style={[styles.schemeSectionText, { color: colors.foreground }]}>{getTxt(scheme.applyProcess)}</Text>
                        </>
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                );
              })}
              {filtered.length === 0 && (
                <GlassCard>
                  <Text style={[styles.schemeSectionText, { color: colors.mutedForeground, textAlign: 'center', paddingVertical: 16 }]}>No schemes match your filters.</Text>
                </GlassCard>
              )}
            </View>
          </View>
        );
      })()}

      {/* H. Grievance Form */}
      {subTab === 'grievance' && (
        <GlassCard>
          <Text style={[styles.formTitle, { color: colors.primary }]}>
            {lang === 'en' ? "File a Civil Grievance" : lang === 'te' ? "ఫిర్యాదు నమోదు చేయండి" : "नागरिक शिकायत दर्ज करें"}
          </Text>
          <Text style={[styles.formSubtitle, { color: colors.mutedForeground }]}>
            {lang === 'en' ? "Your complaint will be forwarded to the Orvakal Gram Panchayat Secretary for action." : "మీ సమస్యను పరిశీలనకు సర్పంచ్/పంచాయతీ కార్యదర్శికి పంపబడుతుంది."}
          </Text>

          {grievanceSuccessMessage ? (
            <View style={[styles.successBox, { backgroundColor: '#DCFCE7', borderColor: '#15803D' }]}>
              <Text style={[styles.successText, { color: '#15803D' }]}>{grievanceSuccessMessage}</Text>
              <TouchableOpacity style={[styles.btnReset, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => setGrievanceSuccessMessage(null)}>
                <Text style={[styles.btnResetText, { color: colors.uniformPastelText }]}>File Another Grievance</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Your Name *</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.foreground }]}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.mutedForeground}
                  value={grievanceName}
                  onChangeText={setGrievanceName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Phone Number *</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.foreground }]}
                  placeholder="Enter 10-digit mobile"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  value={grievancePhone}
                  onChangeText={setGrievancePhone}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Category</Text>
                <View style={styles.categoryPicker}>
                  {['water', 'street-light', 'roads', 'sanitation', 'other'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catOption,
                        {
                          borderColor: grievanceCategory === cat ? colors.uniformPastelBorder : colors.border,
                          backgroundColor: grievanceCategory === cat ? colors.uniformPastelBg : 'transparent',
                        },
                      ]}
                      onPress={() => setGrievanceCategory(cat)}
                    >
                      <Text style={[styles.catOptionText, { color: grievanceCategory === cat ? colors.uniformPastelText : colors.foreground }]}>
                        {cat.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Description of Issue *</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.foreground }]}
                  placeholder="Describe your grievance in detail..."
                  placeholderTextColor={colors.mutedForeground}
                  multiline={true}
                  numberOfLines={4}
                  value={grievanceDesc}
                  onChangeText={setGrievanceDesc}
                />
              </View>

              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={handleGrievanceSubmit}>
                <Text style={[styles.submitBtnText, { color: colors.uniformPastelText }]}>Submit Complaint</Text>
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>
      )}

      {/* I. Committees */}
      {subTab === 'committees' && (
        <View style={styles.listContainer}>
          {committees
            .filter(c => matchesSearch(getTxt(c.name)) || matchesSearch(getTxt(c.purpose)))
            .map((comm) => (
              <GlassCard key={comm.id}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(comm.name)}</Text>
                    {getTxt(comm.president) ? (
                      <Text style={[styles.officerRole, { color: colors.primary }]}>President: {getTxt(comm.president)}</Text>
                    ) : (
                      <Text style={[styles.officerRole, { color: colors.mutedForeground, fontStyle: 'italic', fontSize: 10, marginTop: 2 }]}>
                        {lang === 'te' ? "సంప్రదింపు వివరాలు త్వరలో నవీకరించబడతాయి" : lang === 'hi' ? "संपर्क विवरण जल्द ही अपडेट किए जाएंगे" : "Contact details will be updated soon"}
                      </Text>
                    )}
                  </View>
                  <AudioButton text={getTxt(comm.president) ? `${getTxt(comm.name)}. President is ${getTxt(comm.president)}` : getTxt(comm.name)} />
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <Text style={[styles.detailText, { color: colors.mutedForeground }]}>Members: <Text style={{ color: colors.foreground, fontWeight: 'bold' }}>{comm.membersCount} active members</Text></Text>
                  <Text style={[styles.detailText, { color: colors.mutedForeground, marginTop: 4 }]}>Purpose: <Text style={{ color: colors.foreground }}>{getTxt(comm.purpose)}</Text></Text>
                  <Text style={[styles.detailText, { color: colors.mutedForeground, marginTop: 4 }]}>Meetings: <Text style={{ color: colors.foreground }}>{getTxt(comm.meetings)}</Text></Text>
                </View>
                {comm.phone ? (
                  <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.primary }]} onPress={() => handleCall(comm.phone)}>
                    <Phone size={14} color="#ffffff" />
                    <Text style={styles.callBtnText}>Contact Committee President</Text>
                  </TouchableOpacity>
                ) : null}
              </GlassCard>
            ))}
        </View>
      )}

      {/* Disclaimer is now displayed prominently at the top */}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backBtn: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  subTabTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gpsBtn: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gpsBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuEmoji: {
    fontSize: 28,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 13,
  },
  listContainer: {
    gap: 12,
  },
  officeCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  officeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  officeInfo: {
    flex: 1,
  },
  officeName: {
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 17,
  },
  officeLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  officeLocText: {
    fontSize: 11,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: '#15803D',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#15803D',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 5,
  },
  serviceDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 4,
  },
  serviceText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  expandHint: {
    alignItems: 'center',
    marginTop: 6,
  },
  officeBackBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  officeBackBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  officeDetailTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  officeSectionBlock: {
    marginTop: 14,
  },
  officeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingLeft: 2,
  },
  officeSectionDot: {
    fontSize: 14,
  },
  officeSectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  officerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  officerDetailName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  officerDetailDesig: {
    fontSize: 11,
    marginTop: 2,
  },
  officerFieldLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  officerFieldText: {
    fontSize: 11,
    lineHeight: 15,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 2,
  },
  permissionBullet: {
    fontSize: 11,
    lineHeight: 16,
  },
  permissionText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  serviceCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  serviceCheckText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  /* Schemes */
  schemesPageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  schemesPageSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  filterRow: {
    marginTop: 8,
    marginBottom: 0,
  },
  filterRowContent: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterPillEmoji: {
    fontSize: 12,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  schemeCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  schemeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schemeIconEmoji: {
    fontSize: 20,
  },
  schemeCardInfo: {
    flex: 1,
  },
  schemeCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 17,
  },
  schemeCardDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  schemeBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  schemeBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  officerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  officerRole: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  officerDept: {
    fontSize: 10,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 10,
  },
  cardDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 11,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  callBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  schemesContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  schemesHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  schemeItem: {
    marginBottom: 6,
  },
  schemeTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  schemeDesc: {
    fontSize: 10,
    lineHeight: 13,
    marginTop: 1,
  },
  staffContactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  staffName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  staffRole: {
    fontSize: 10,
  },
  schemeSectionHeading: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  schemeSectionText: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formSubtitle: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 14,
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
  formGroup: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catOption: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  catOptionText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  submitBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  successBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  successText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },
  btnReset: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  btnResetText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  disclaimerCard: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    marginVertical: 4,
  },
  disclaimerText: {
    fontSize: 10.5,
    lineHeight: 15,
  },
  linkPill: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  linkPillText: {
    fontSize: 9.5,
    fontWeight: 'bold',
  },
  subTabDisclaimer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  subTabDisclaimerText: {
    fontSize: 9.5,
    lineHeight: 14.5,
    textAlign: 'center',
  },
});
