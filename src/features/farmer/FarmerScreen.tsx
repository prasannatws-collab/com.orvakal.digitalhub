import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Phone, MapPin, Clock, Search, Navigation2, Zap, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react-native';
import { useLanguage } from '../../core/state/LanguageContext';
import { useTheme } from '../../core/state/ThemeContext';
import { GlassCard } from '../../core/components/GlassCard';
import { AudioButton } from '../../core/components/AudioButton';
import { Badge } from '../../core/components/Badge';
import { DI } from '../../core/di';

// Import datasets
import {
  powerSchedules,
  mandiRates,
  vegMandiRates,
  govtMspRates,
  tractorRentals,
  advisories,
  waterReservoirs,
  repairMechanics,
  agriContacts,
} from '../../data/datasources/static/agriData';

type SubTab = 'feeder' | 'mandi' | 'msp' | 'tractor' | 'advisory' | 'water' | 'repair' | 'agri-officer';

interface FarmerScreenProps {
  initialSubTab: SubTab | null;
  onClose: () => void;
}

// Mock coordinates for Orvakal center: 15.68401, 78.174366
const mockCoordinates: Record<string, { latitude: number; longitude: number }> = {
  'mec-1': { latitude: 15.6838, longitude: 78.1738 },
  'mec-2': { latitude: 15.6859, longitude: 78.1749 },
  'mec-3': { latitude: 15.6821, longitude: 78.1712 },
  'mec-4': { latitude: 15.6872, longitude: 78.1765 },
};

export const FarmerScreen: React.FC<FarmerScreenProps> = ({ initialSubTab, onClose }) => {
  const { lang, getTxt, t } = useLanguage();
  const { colors } = useTheme();
  const [subTab, setSubTab] = useState<SubTab | null>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mandiType, setMandiType] = useState<'crops' | 'veg'>('crops');

  // Proximity sorting state
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const locationService = DI.getLocationService();

  // Reset search when sub-tab changes
  useEffect(() => {
    setSearchQuery('');
  }, [subTab]);

  const requestGPSLocation = async () => {
    try {
      setIsLocating(true);
      const coords = await locationService.getCurrentLocation();
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

  // Helper to sort mechanics by computed distance
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

  const matchesSearch = (text: string) => {
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  if (subTab === null) {
    const farmerMenus = [
      { id: 'feeder', title: { en: "Power Feeder Schedule", te: "కరెంట్ సరఫరా వేళలు", hi: "बिजली फीडर समय" }, desc: { en: "Agricultural electricity timings (3-phase day/night schedule).", te: "వ్యవసాయ కరెంట్ సరఫరా పగలు మరియు రాత్రి వేళల పట్టిక.", hi: "कृषि बिजली आपूर्ति (3-चरण दिन/रात कार्यक्रम) की जानकारी।" }, icon: "⚡" },
      { id: 'mandi', title: { en: "Agri Mandi Rates", te: "మార్కెట్ ధరలు (మండి)", hi: "कृषि मंडी दरें" }, desc: { en: "Real-time crop & vegetable rates with daily price trends.", te: "పంటలు మరియు కూరగాయల మార్కెట్ ధరలు, హెచ్చుతగ్గుల వివరాలు.", hi: "फसलों और सब्जियों के दैनिक भाव और बाजार के रुझान।" }, icon: "🌾" },
      { id: 'msp', title: { en: "Minimum Support Price", te: "మద్దతు ధర (MSP)", hi: "न्यूनतम समर्थन मूल्य (MSP)" }, desc: { en: "Government mandated minimum support prices for major crops.", te: "ప్రభుత్వం ప్రకటించిన పంటల కనీస మద్దతు ధరల పట్టిక.", hi: "मुख्य फसलों के लिए सरकार द्वारा निर्धारित न्यूनतम समर्थन मूल्य।" }, icon: "🏷️" },
      { id: 'tractor', title: { en: "Tractor & Machinery Rent", te: "యంత్రాల అద్దె", hi: "ट्रैक्टर और मशीनरी किराया" }, desc: { en: "Tractors, rotavators, and harvesters available for local sharing.", te: "ట్రాక్టర్లు, హార్వెస్టర్ల కిరాయి మరియు ఫోన్ నంబర్లు.", hi: "ट्रैक्टर और कृषि उपकरणों को किराए पर देने वाले स्थानीय लोगों की सूची।" }, icon: "🚜" },
      { id: 'advisory', title: { en: "Crop Advisories", te: "వ్యవసాయ సలహాలు", hi: "फसल स्वास्थ्य सलाह" }, desc: { en: "Pest controls, fertilizer dosages, and seasonal advisories.", te: "తెగుళ్ళ నివారణ మరియు ఎరువుల మోతాదులపై సూచనలు.", hi: "कीट नियंत्रण, उर्वरक और मौसमी फसल संबंधी सलाह।" }, icon: "🌱" },
      { id: 'water', title: { en: "Water Levels", te: "జలాశయాల నీటి మట్టాలు", hi: "जलाशय जल स्तर" }, desc: { en: "Reservoirs capacities, current levels, and inflow updates.", te: "కాలువలు మరియు జలాశయాల నీటి మట్టాల తాజా వివరాలు.", hi: "स्थानीय नहरों और जलाशयों में पानी के स्तर की जानकारी।" }, icon: "💧" },
      { id: 'repair', title: { en: "Motor & Tractor Repairs", te: "మోటార్ & ట్రాక్టర్ మరమ్మతులు", hi: "मोटर और ट्रैक्टर मरम्मत" }, desc: { en: "Local borewell, motor, and tractor mechanics sorted by proximity.", te: "స్థానిక మోటార్ వైండింగ్, బోరుబావి మరియు ట్రాక్టర్ మెకానిక్కుల వివరాలు.", hi: "मोटर बाइंडिंग, नलकूप और ट्रैक्टर कारीगरों की सूची।" }, icon: "🔧" },
      { id: 'agri-officer', title: { en: "Agricultural Support Officers", te: "వ్యవసాయ అధికారులు", hi: "कृषि सहायता अधिकारी" }, desc: { en: "Contact details for Mandal Agricultural Officer and Rythu Bharosa Kendras.", te: "రైతు భరోసా కేంద్రం (RBK) సహాయ నిపుణుల ఫోన్ నంబర్లు.", hi: "मंडल कृषि अधिकारी और स्थानीय सहायता केंद्र के फोन नंबर।" }, icon: "👨‍🌾" },
    ];

    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            🌾 {lang === 'en' ? "Farmer Desk" : lang === 'te' ? "రైతు డెస్క్" : "किसान डेस्क"}
          </Text>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]} onPress={onClose}>
            <Text style={[styles.backBtnText, { color: colors.uniformPastelText }]}>🏠 Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuGrid}>
          {farmerMenus.map((item) => (
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]} onPress={() => setSubTab(null)}>
          <Text style={[styles.backBtnText, { color: colors.uniformPastelText }]}>⬅️ Menu</Text>
        </TouchableOpacity>
        <Text style={[styles.subTabTitle, { color: colors.foreground }]}>
          {subTab === 'feeder' ? 'Feeder' :
           subTab === 'mandi' ? 'Mandi Rates' :
           subTab === 'msp' ? 'MSP Rates' :
           subTab === 'tractor' ? 'Rentals' :
           subTab === 'advisory' ? 'Advisories' :
           subTab === 'water' ? 'Water Levels' :
           subTab === 'repair' ? 'Repairs' : 'Support Officers'}
        </Text>
        {subTab === 'repair' && (
          <TouchableOpacity style={[styles.gpsBtn, { backgroundColor: userCoords ? colors.uniformPastelBg : colors.card, borderColor: userCoords ? colors.uniformPastelBorder : colors.border }]} onPress={requestGPSLocation}>
            <Navigation2 size={12} color={userCoords ? colors.uniformPastelText : colors.primary} />
            <Text style={[styles.gpsBtnText, { color: userCoords ? colors.uniformPastelText : colors.primary }]}>
              {isLocating ? 'GPS...' : userCoords ? 'Sorted GPS' : 'Sort GPS'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {subTab !== 'feeder' && subTab !== 'water' && (
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search crop or item..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* A. Power Feeder Schedule */}
      {subTab === 'feeder' && (
        <View style={styles.listContainer}>
          {powerSchedules.map((item) => (
            <GlassCard key={item.id}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.flexRow}>
                  <Zap size={18} color="#eab308" style={styles.marginRight} />
                  <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(item.feederName)}</Text>
                </View>
                <Badge variant={item.status.en.toLowerCase() === 'active' ? 'success' : 'danger'}>{getTxt(item.status)}</Badge>
              </View>
              <View style={styles.divider} />
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Clock size={12} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.foreground }]}>Day Shift (3-Phase): <Text style={{ fontWeight: 'bold' }}>{getTxt(item.dayTimings)}</Text></Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={12} color={colors.primary} style={{ marginTop: 4 }} />
                  <Text style={[styles.detailText, { color: colors.foreground, marginTop: 4 }]}>Night Shift (3-Phase): <Text style={{ fontWeight: 'bold' }}>{getTxt(item.nightTimings)}</Text></Text>
                </View>
              </View>
              <Text style={{ fontSize: 9, color: colors.mutedForeground, fontStyle: 'italic' }}>
                * Day and night shifts swap weekly on Mondays. Contact feeder assistant for queries.
              </Text>
            </GlassCard>
          ))}
        </View>
      )}

      {/* B. Mandi Rates */}
      {subTab === 'mandi' && (
        <View style={styles.listContainer}>
          {/* Toggle crops/veg */}
          <View style={styles.toggleRow}>
            <TouchableOpacity style={[styles.toggleBtn, { backgroundColor: mandiType === 'crops' ? colors.uniformPastelBg : colors.card, borderColor: mandiType === 'crops' ? colors.uniformPastelBorder : colors.border, borderWidth: 1 }]} onPress={() => setMandiType('crops')}>
              <Text style={[styles.toggleText, { color: mandiType === 'crops' ? colors.uniformPastelText : colors.mutedForeground }]}>Crops / Grains</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, { backgroundColor: mandiType === 'veg' ? colors.uniformPastelBg : colors.card, borderColor: mandiType === 'veg' ? colors.uniformPastelBorder : colors.border, borderWidth: 1 }]} onPress={() => setMandiType('veg')}>
              <Text style={[styles.toggleText, { color: mandiType === 'veg' ? colors.uniformPastelText : colors.mutedForeground }]}>Vegetables</Text>
            </TouchableOpacity>
          </View>

          {mandiType === 'crops' ? (
            mandiRates
              .filter(m => matchesSearch(getTxt(m.crop)))
              .map((rate) => (
                <View key={rate.id} style={[styles.rateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View>
                    <Text style={[styles.rateCrop, { color: colors.foreground }]}>{getTxt(rate.crop)}</Text>
                    <Text style={[styles.rateVal, { color: colors.secondary }]}>{getTxt(rate.priceRange)}</Text>
                  </View>
                  <View style={styles.trendRow}>
                    {rate.trend === 'up' && <ArrowUpRight size={14} color="#15803D" />}
                    {rate.trend === 'down' && <ArrowDownRight size={14} color="#B91C1C" />}
                    {rate.trend === 'flat' && <Minus size={14} color="#B45309" />}
                    <Text style={[styles.trendText, { color: rate.trend === 'up' ? '#15803D' : rate.trend === 'down' ? '#B91C1C' : '#B45309' }]}>
                      {rate.trend.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))
          ) : (
            vegMandiRates
              .filter(v => matchesSearch(getTxt(v.item)))
              .map((rate) => (
                <View key={rate.id} style={[styles.rateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View>
                    <Text style={[styles.rateCrop, { color: colors.foreground }]}>{getTxt(rate.item)}</Text>
                    <Text style={[styles.rateVal, { color: colors.secondary }]}>{getTxt(rate.priceRange)}</Text>
                  </View>
                  <View style={styles.trendRow}>
                    {rate.trend === 'up' && <ArrowUpRight size={14} color="#15803D" />}
                    {rate.trend === 'down' && <ArrowDownRight size={14} color="#B91C1C" />}
                    {rate.trend === 'flat' && <Minus size={14} color="#B45309" />}
                    <Text style={[styles.trendText, { color: rate.trend === 'up' ? '#15803D' : rate.trend === 'down' ? '#B91C1C' : '#B45309' }]}>
                      {rate.trend.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))
          )}
        </View>
      )}

      {/* C. Minimum Support Price (MSP) */}
      {subTab === 'msp' && (
        <View style={styles.listContainer}>
          {govtMspRates
            .filter(r => matchesSearch(getTxt(r.crop)))
            .map((item) => (
              <GlassCard key={item.id}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(item.crop)}</Text>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>Season: {getTxt(item.season)}</Text>
                  </View>
                  <AudioButton text={`${getTxt(item.crop)}. MSP benchmark rate is ${getTxt(item.mspPrice)}`} />
                </View>
                <View style={styles.divider} />
                <Text style={{ fontSize: 13, color: colors.secondary, fontWeight: 'bold' }}>
                  MSP Rate: {getTxt(item.mspPrice)}
                </Text>
              </GlassCard>
            ))}
        </View>
      )}

      {/* D. Tractor Rentals */}
      {subTab === 'tractor' && (
        <View style={styles.listContainer}>
          {tractorRentals
            .filter(t => matchesSearch(getTxt(t.tractorModel)) || matchesSearch(getTxt(t.ownerName)))
            .map((trac) => (
              <GlassCard key={trac.id}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(trac.tractorModel)}</Text>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>Owner: {getTxt(trac.ownerName)}</Text>
                  </View>
                  <Badge variant={trac.available ? 'success' : 'danger'}>{trac.available ? 'Available' : 'Booked'}</Badge>
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <Text style={[styles.detailText, { color: colors.foreground, fontWeight: 'bold' }]}>Rental rate: {getTxt(trac.rate)}</Text>
                  <Text style={[styles.detailText, { color: colors.mutedForeground, marginTop: 2 }]}>Location: {getTxt(trac.location)}</Text>
                </View>
                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(trac.phone)}>
                  <Phone size={14} color={colors.uniformPastelText} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Call Owner ({trac.phone})</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
        </View>
      )}

      {/* E. Crop Advisories */}
      {subTab === 'advisory' && (
        <View style={styles.listContainer}>
          {advisories
            .filter(a => matchesSearch(getTxt(a.title)) || matchesSearch(getTxt(a.content)))
            .map((adv) => (
              <GlassCard key={adv.id}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(adv.title)}</Text>
                    <Badge variant="info" style={{ marginTop: 4 }}>{adv.category.toUpperCase()}</Badge>
                  </View>
                  <AudioButton text={`${getTxt(adv.title)}. ${getTxt(adv.content)}`} />
                </View>
                <View style={styles.divider} />
                <Text style={[styles.detailText, { color: colors.foreground, lineHeight: 15 }]}>
                  {getTxt(adv.content)}
                </Text>
                <Text style={{ fontSize: 9, color: colors.mutedForeground, marginTop: 6 }}>
                  Published Date: {adv.date}
                </Text>
              </GlassCard>
            ))}
        </View>
      )}

      {/* F. Irrigation Water Levels */}
      {subTab === 'water' && (
        <View style={styles.listContainer}>
          {waterReservoirs.map((res) => (
            <GlassCard key={res.id}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(res.reservoirName)}</Text>
                <Badge variant={res.status.en.toLowerCase().includes('good') || res.status.en.toLowerCase().includes('normal') ? 'success' : 'warning'}>
                  {getTxt(res.status)}
                </Badge>
              </View>
              <View style={styles.divider} />
              <View style={styles.cardDetails}>
                <Text style={[styles.detailText, { color: colors.foreground }]}>Current Level: <Text style={{ fontWeight: 'bold' }}>{getTxt(res.levelInfo)}</Text></Text>
                <Text style={[styles.detailText, { color: colors.mutedForeground, marginTop: 2 }]}>Max Capacity: {getTxt(res.capacityInfo)}</Text>
              </View>
            </GlassCard>
          ))}
        </View>
      )}

      {/* G. Repairs */}
      {subTab === 'repair' && (
        <View style={styles.listContainer}>
          {getSortedItems(repairMechanics)
            .filter(m => matchesSearch(getTxt(m.name)) || matchesSearch(m.specialty))
            .map((mech) => (
              <GlassCard key={mech.id}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <View style={styles.row}>
                      <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(mech.name)}</Text>
                      {userCoords && <Badge style={{ marginLeft: 6 }}>{computeProximity(mech.id)}</Badge>}
                    </View>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>{mech.specialty.toUpperCase()} SPECIALIST</Text>
                  </View>
                  <Badge variant={mech.available ? 'success' : 'danger'}>{mech.available ? 'Active' : 'Busy'}</Badge>
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <Text style={[styles.detailText, { color: colors.mutedForeground }]}>Location: {getTxt(mech.location)}</Text>
                  <Text style={[styles.detailText, { color: colors.mutedForeground, marginTop: 2 }]}>Rating: ⭐ {mech.rating}</Text>
                </View>
                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(mech.phone)}>
                  <Phone size={14} color={colors.uniformPastelText} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Call Mechanic ({mech.phone})</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
        </View>
      )}

      {/* H. Agricultural Officers */}
      {subTab === 'agri-officer' && (
        <View style={styles.listContainer}>
          {agriContacts
            .filter(o => matchesSearch(getTxt(o.name)) || matchesSearch(getTxt(o.designation)))
            .map((contact) => (
              <GlassCard key={contact.id}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(contact.name)}</Text>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>{getTxt(contact.designation)}</Text>
                  </View>
                  <AudioButton text={getTxt(contact.name)} />
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <Text style={[styles.detailText, { color: colors.mutedForeground }]}>Office Location: {getTxt(contact.location)}</Text>
                </View>
                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(contact.phone)}>
                  <Phone size={14} color={colors.uniformPastelText} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Call Officer ({contact.phone})</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
        </View>
      )}

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
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: 6,
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
  },
  detailText: {
    fontSize: 12,
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
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  rateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  rateCrop: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  rateVal: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '800',
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
});
