import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Phone, MapPin, Clock, Search, Navigation2, Star } from 'lucide-react-native';
import { useLanguage } from '../../core/state/LanguageContext';
import { useTheme } from '../../core/state/ThemeContext';
import { GlassCard } from '../../core/components/GlassCard';
import { AudioButton } from '../../core/components/AudioButton';
import { Badge } from '../../core/components/Badge';
import { DI } from '../../core/di';

// Import datasets
import { commercialShops } from '../../data/datasources/static/commercialShops';

interface ServicesScreenProps {
  initialCategory: string | null;
  onClose: () => void;
}

// Deterministically generate coordinates for shops offset from Orvakal center: 15.68401, 78.174366
const getShopCoords = (id: string, index: number) => {
  // Use index to calculate minor offsets
  const latOffset = ((index % 10) - 5) * 0.0015;
  const lonOffset = (((index * 3) % 10) - 5) * 0.0015;
  return {
    latitude: 15.68401 + latOffset,
    longitude: 78.174366 + lonOffset
  };
};

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ initialCategory, onClose }) => {
  const { lang, getTxt } = useLanguage();
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Proximity sorting state
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const locationService = DI.getLocationService();

  useEffect(() => {
    setSearchQuery('');
  }, [selectedCategory]);

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

  const computeProximity = (id: string, index: number): string => {
    if (!userCoords) return '';
    const itemCoords = getShopCoords(id, index);
    const dist = locationService.calculateDistance(userCoords, itemCoords);
    return `${dist.toFixed(2)} km`;
  };

  // Helper to sort elements by computed distance
  const getSortedShops = (shopsList: typeof commercialShops): typeof commercialShops => {
    if (!userCoords) return shopsList;
    return [...shopsList].sort((a, b) => {
      // Find indexes in parent array to fetch exact coordinates
      const indexA = commercialShops.findIndex(s => s.id === a.id);
      const indexB = commercialShops.findIndex(s => s.id === b.id);
      const coordsA = getShopCoords(a.id, indexA);
      const coordsB = getShopCoords(b.id, indexB);
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

  // List of all business categories with localized titles and descriptions
  const categoriesList = [
    {
      id: 'restaurant',
      title: { en: "Food & Restaurants", te: "రెస్టారెంట్లు & భోజనం", hi: "भोजन और रेस्तरां" },
      desc: { en: "Local restaurants, fast food, and dining centers.", te: "స్థానిక రెస్టారెంట్లు, భోజన శాలల సమాచారం.", hi: "स्थानीय रेस्तरां, फास्ट फूड और भोजन केंद्र।" },
      emoji: "🍕"
    },
    {
      id: 'hotel',
      title: { en: "Hotel/Stays", te: "హోటళ్ళు & వసతి గృహాలు", hi: "होटल और होमस्टे" },
      desc: { en: "Lodging, hotels, guest houses, and homestays.", te: "వసతి గృహాలు, లాడ్జీలు మరియు హోటళ్ల వివరాలు.", hi: "ठहरने के स्थान, होटल और गेस्ट हाउस की जानकारी।" },
      emoji: "🏨"
    },
    {
      id: 'rentals',
      title: { en: "Home Rentals & PGs", te: "ఇళ్ళు & పీజీ అద్దెలు", hi: "मकान और पीजी किराया" },
      desc: { en: "Houses for rent, PG accommodations, and hostel facilities.", te: "అద్దె ఇళ్లు, పి.జి వసతులు మరియు హాస్టల్స్ వివరాలు.", hi: "किराये के मकान, पीजी और छात्रावास सुविधाएं।" },
      emoji: "🏠"
    },
    {
      id: 'banquet',
      title: { en: "Banquet & Event Halls", te: "ఫంక్షన్ హాళ్ళు & ఈవెంట్స్", hi: "बैंक्वेट और इवेंट हॉल" },
      desc: { en: "Function halls, marriage convention halls, and event organizers.", te: "కళ్యాణ మండపాలు, ఫంక్షన్ హాళ్ళు మరియు డెకరేటర్స్ వివరాలు.", hi: "शादी और पार्टी के लिए हॉल और इवेंट प्लानर्स।" },
      emoji: "🎪"
    },
    {
      id: 'medical',
      title: { en: "Medical Stores", te: "మందుల దుకాణాలు", hi: "मेडिकल स्टोर" },
      desc: { en: "Local pharmacies, chemists, and medicine counters.", te: "స్థానిక మందుల షాపులు మరియు అత్యవసర ఫార్మసీల సమాచారం.", hi: "दवाइयाँ, केमिस्ट और मेडिकल स्टोर के नंबर।" },
      emoji: "💊"
    },
    {
      id: 'dairy',
      title: { en: "Milk Dairies", te: "పాల డెయిరీలు", hi: "दूध डेयरियां" },
      desc: { en: "Fresh milk booths, dairies, and milk cooperatives.", te: "పాలు, పెరుగు మరియు ఇతర పాల ఉత్పత్తుల విక్రయ కేంద్రాలు.", hi: "ताजा दूध और डेयरी उत्पादों के विक्रय केंद्र।" },
      emoji: "🥛"
    },
    {
      id: 'tuitions',
      title: { en: "Tuitions & Coaching", te: "ట్యూషన్లు & కోచింగ్", hi: "ट्यूशन और कोचिंग" },
      desc: { en: "Academic tuitions, coding classes, and school guidance.", te: "స్కూల్ ట్యూషన్లు, కోడింగ్ క్లాసులు మరియు కోచింగ్ సెంటర్ల వివరాలు.", hi: "स्कूली ट्यूशन, कंप्यूटर कोडिंग और कोचिंग कक्षाएं।" },
      emoji: "📖"
    },
    {
      id: 'boutique',
      title: { en: "Boutiques & Tailors", te: "బోటిక్ & లేడీస్ టైలర్స్", hi: "बुटीक और टेलर" },
      desc: { en: "Ladies tailors, designer boutiques, and apparel stitchers.", te: "లేడీస్ టైలరింగ్, డిజైనర్ బోటిక్స్ మరియు మగ్గం వర్క్ కేంద్రాలు.", hi: "लेडीज टेलरिंग और डिजाइनर बुटीक की सूची।" },
      emoji: "🧵"
    },
    {
      id: 'clothing',
      title: { en: "Cloth Shopping", te: "బట్టల దుకాణాలు", hi: "कपड़ों की दुकानें" },
      desc: { en: "Readymade apparel shops, sarees, and clothing stores.", te: "రెడీమేడ్ బట్టలు, చీరలు మరియు టెక్స్టైల్స్ దుకాణాల వివరాలు.", hi: "रेडीमेड कपड़े, साड़ियां और वस्त्र भंडार।" },
      emoji: "🛍️"
    },
    {
      id: 'wholesaler',
      title: { en: "Wholesalers & Kirana", te: "హోల్‌సేల్ & కిరాణా", hi: "किराना और थोक व्यापारी" },
      desc: { en: "General provision stores and wholesale commodity distributors.", te: "కిరాణా దుకాణాలు, జనరల్ స్టోర్స్ మరియు హోల్‌సేల్ వ్యాపారుల నంబర్లు.", hi: "किराना स्टोर और थोक खाद्यान्न विक्रेता।" },
      emoji: "🛒"
    },
    {
      id: 'hardware',
      title: { en: "Hardware & Electricals", te: "హార్డ్‌వేర్ & ఎలక్ట్రికల్స్", hi: "हार्डवेयर और बिजली का सामान" },
      desc: { en: "Electrical appliances, plumbing, pipes, and hardware.", te: "హార్డ్‌వేర్, ఎలక్ట్రికల్స్, ప్లంబింగ్ మరియు పెయింట్స్ దుకాణాలు.", hi: "बिजली का सामान, नलसाजी और हार्डवेयर की दुकानें।" },
      emoji: "🛠️"
    },
    {
      id: 'stationery',
      title: { en: "Stationery & Xerox", te: "స్టేషనరీ & జిరాక్స్", hi: "स्टेशनरी और फोटोकॉपी" },
      desc: { en: "Books, stationery supplies, and photocopying booths.", te: "స్టేషనరీ, జిరాక్స్, బుక్ స్టోర్స్ మరియు ఇంటర్నెట్ కేఫ్‌ల వివరాలు.", hi: "स्टेशनरी, फोटोकॉपी और स्कूल/ऑफिस आपूर्ति।" },
      emoji: "✏️"
    },
    {
      id: 'event-rental',
      title: { en: "Tents, Lights & Event Supply", te: "ఈవెంట్స్ సప్లైస్", hi: "टेंट और इवेंट डेकोरेशन" },
      desc: { en: "Event decors, sound systems, tents, and light supplies.", te: "టెంట్ హౌస్, డీజే సౌండ్ సిస్టమ్స్ మరియు లైటింగ్ డెకరేటర్స్ వివరాలు.", hi: "टेंट हाउस, माइक, लाइट और इवेंट की सामग्री किराए पर।" },
      emoji: "🎤"
    },
    {
      id: 'car-rental',
      title: { en: "Car & Vehicle Rentals", te: "కార్ & వాహనాల అద్దెలు", hi: "वाहन किराया" },
      desc: { en: "Travel cabs, passenger vehicle rentals, and taxi bookings.", te: "ట్రావెల్స్, అద్దె కార్లు మరియు వివాహ వాహనాల బుకింగ్ సేవలు.", hi: "किराए की कार, कैब और यात्रा सेवाएं।" },
      emoji: "🚗"
    },
    {
      id: 'driving-school',
      title: { en: "Driving Schools", te: "డ్రైవింగ్ స్కూల్స్", hi: "ड्राइविंग स्कूल" },
      desc: { en: "Car and motorcycle driving training schools.", te: "కార్ మరియు బైక్ డ్రైవింగ్ నేర్పించే స్కూల్స్ సమాచారం.", hi: "कार और बाइक चलाने की ट्रेनिंग देने वाले स्कूल।" },
      emoji: "🚘"
    },
    {
      id: 'water-supplier',
      title: { en: "Water Cans & Tankers", te: "మినరల్ వాటర్ & ట్యాంకర్లు", hi: "पानी के टैंकर और कैन" },
      desc: { en: "Mineral water cans and commercial water tankers supply.", te: "మినరల్ వాటర్ క్యాన్లు మరియు వాటర్ ట్యాంకర్ల సప్లైయర్స్.", hi: "पीने के पानी की केन और पानी के टैंकर की आपूर्ति।" },
      emoji: "💧"
    },
    {
      id: 'laundry',
      title: { en: "Laundry & Ironing", te: "లాండ్రీ & ఇస్త్రీ సేవలు", hi: "धोबी और ड्राई क्लीनिंग" },
      desc: { en: "Dry cleaning, washing, and steam ironing services.", te: "బట్టలు ఉతకడం, డ్రై క్లీనింగ్ మరియు ఇస్త్రీ సేవల కేంద్రాలు.", hi: "कपड़े धुलाई, ड्राई क्लीनिंग और इस्त्री (प्रेस) की दुकानें।" },
      emoji: "🧺"
    },
    {
      id: 'pesticide',
      title: { en: "Pesticide & Seeds", te: "ఎరువులు & విత్తనాలు", hi: "खाद और बीज" },
      desc: { en: "Farming seeds, agricultural fertilizers, and crop chemicals.", te: "వ్యవసాయ విత్తనాలు, ఎరువులు మరియు పురుగుల మందుల దుకాణాలు.", hi: "कृषि बीज, खाद और कीटनाशक विक्रेताओं की सूची।" },
      emoji: "🌾"
    },
    {
      id: 'courier',
      title: { en: "Courier & Cargo", te: "కొరియర్ & కార్గో సేవలు", hi: "कुरियर और कार्गो" },
      desc: { en: "Parcel delivery desk, cargo logistics, and booking hubs.", te: "కొరియర్ సర్వీసులు మరియు పార్సెల్ బుకింగ్ కౌంటర్ల వివరాలు.", hi: "कूरियर बुकिंग और पार्सल डिलीवरी काउंटर।" },
      emoji: "📦"
    },
    {
      id: 'auto',
      title: { en: "Auto Stand & Transport", te: "ఆటో స్టాండ్ & రవాణా", hi: "ऑटो स्टैंड और परिवहन" },
      desc: { en: "Rickshaw stands, transport vehicles, and driver contacts.", te: "ఆటో స్టాండ్లు, రవాణా వాహనాలు మరియు లగేజ్ ఆటో డ్రైవర్ల నంబర్లు.", hi: "स्थानीय ऑटो स्टैंड और माल परिवहन सेवाएं।" },
      emoji: "🛺"
    },
    {
      id: 'drivers',
      title: { en: "Drivers & Chauffeurs", te: "డ్రైవర్లు & చౌఫర్లు", hi: "चालक और चौफ़र" },
      desc: { en: "Car, tractor, and truck drivers for hire.", te: "అద్దెకు లభించే కార్, ట్రాక్టర్ మరియు హెవీ వెహికల్ డ్రైవర్ల వివరాలు.", hi: "गाड़ी चलाने के लिए अनुभवी ड्राइवर और चौफ़र।" },
      emoji: "🧑‍✈️"
    },
  ];

  if (selectedCategory === null) {
    // Categories List (Styled like Govt Info tab menu hub)
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            🏠 {lang === 'en' ? "Services Catalog" : lang === 'te' ? "సేవల కేటలాగ్" : "सेवा निर्देशिका"}
          </Text>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]} onPress={onClose}>
            <Text style={[styles.backBtnText, { color: colors.uniformPastelText }]}>🏠 Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuGrid}>
          {categoriesList.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.menuCard, { backgroundColor: colors.uniformMenuBg, borderColor: colors.uniformMenuBorder }]} onPress={() => setSelectedCategory(item.id)}>
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
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

  // Filtered shops list
  const activeShops = commercialShops.filter(s => s.category === selectedCategory);
  const currentCategoryName = categoriesList.find(c => c.id === selectedCategory)?.title || { en: 'Services', te: 'సేవలు', hi: 'सेवाएं' };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]} onPress={() => setSelectedCategory(null)}>
          <Text style={[styles.backBtnText, { color: colors.uniformPastelText }]}>⬅️ Categories</Text>
        </TouchableOpacity>
        <Text style={[styles.subTabTitle, { color: colors.foreground }]}>{getTxt(currentCategoryName)}</Text>
        <TouchableOpacity style={[styles.gpsBtn, { backgroundColor: userCoords ? colors.uniformPastelBg : colors.card, borderColor: userCoords ? colors.uniformPastelBorder : colors.border }]} onPress={requestGPSLocation}>
          <Navigation2 size={12} color={userCoords ? colors.uniformPastelText : colors.primary} />
          <Text style={[styles.gpsBtnText, { color: userCoords ? colors.uniformPastelText : colors.primary }]}>
            {isLocating ? 'GPS...' : userCoords ? 'Sorted GPS' : 'Sort GPS'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search business name..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.listContainer}>
        {getSortedShops(activeShops)
          .filter(s => matchesSearch(getTxt(s.name)) || matchesSearch(getTxt(s.owner)))
          .map((shop) => {
            const rawIndex = commercialShops.findIndex(item => item.id === shop.id);
            return (
              <GlassCard key={shop.id}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(shop.name)}</Text>
                      {userCoords && <Badge style={{ marginLeft: 6 }}>{computeProximity(shop.id, rawIndex)}</Badge>}
                    </View>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>Owner: {getTxt(shop.owner)}</Text>
                  </View>
                  <AudioButton text={`${getTxt(shop.name)}. Timings: ${getTxt(shop.timing)}`} />
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <Clock size={12} color={colors.primary} />
                    <Text style={[styles.detailText, { color: colors.mutedForeground }]}>Timings: {getTxt(shop.timing)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MapPin size={12} color={colors.primary} style={{ marginTop: 2 }} />
                    <Text style={[styles.detailText, { color: colors.mutedForeground, marginTop: 2 }]}>Location: {getTxt(shop.location)}</Text>
                  </View>

                  {shop.stars && (
                    <View style={[styles.detailRow, { marginTop: 4 }]}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} color={i < (shop.stars || 0) ? '#eab308' : colors.muted} fill={i < (shop.stars || 0) ? '#eab308' : 'transparent'} />
                      ))}
                    </View>
                  )}

                  {shop.details && (
                    <Text style={[styles.shopDetailsText, { color: colors.foreground }]}>{getTxt(shop.details)}</Text>
                  )}

                  {shop.priceRate && (
                    <Text style={[styles.priceText, { color: colors.secondary }]}>Rate: {getTxt(shop.priceRate)}</Text>
                  )}
                </View>
                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(shop.phone)}>
                  <Phone size={14} color={colors.uniformPastelText} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Call Business ({shop.phone})</Text>
                </TouchableOpacity>
              </GlassCard>
            );
          })}
      </View>

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
    flexWrap: 'wrap',
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
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
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
    gap: 6,
  },
  detailText: {
    fontSize: 12,
  },
  shopDetailsText: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 6,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
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
});
