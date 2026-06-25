import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Linking,
} from 'react-native';

import {
  Search,
  Bell,
  ShieldAlert,
  ArrowRight,
  Users,
  Zap,
  ChevronDown,
  Cpu,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react-native';
import { useLanguage } from '../../core/state/LanguageContext';
import { useTheme } from '../../core/state/ThemeContext';
import { useWeatherClock } from './hooks/useWeatherClock';
import { GlassCard } from '../../core/components/GlassCard';
import { AudioButton } from '../../core/components/AudioButton';
import { CustomModal } from '../../core/components/CustomModal';
import { govtSources } from '../../data/datasources/static/govtSourcesData';
import { DI } from '../../core/di';
import {
  getConditionTranslations,
  getConditionEmoji,
} from '../../data/services/OpenMeteoWeatherService';
import { notices } from '../../data/datasources/static/noticesData';
import { newsItems } from '../../data/datasources/static/directoryData';
import { flights, buses, trains } from '../../data/datasources/static/transitData';
import { attractions } from '../../data/datasources/static/hospitalityData';

interface DashboardScreenProps {
  onShortcutClick: (
    tab: 'home' | 'directory' | 'farmer' | 'services' | 'jobs' | 'insights' | 'weather' | 'utilities',
    subTab?: string,
    query?: string
  ) => void;
  onSosClick: () => void;
  onAirportClick: () => void;
  onScroll?: (event: any) => void;
  onPrivacyClick?: () => void;
  onSafetyClick?: () => void;
}

// Persona tab definitions
const PERSONA_TABS = [
  { id: 'farmer', icon: '🌾', label: { en: 'Farmer', te: 'రైతు', hi: 'किसान' } },
  { id: 'student', icon: '🎓', label: { en: 'Student', te: 'విద్యార్థి', hi: 'छात्र' } },
  { id: 'villager', icon: '🏡', label: { en: 'Villager', te: 'గ్రామీణుడు', hi: 'ग्रामीण' } },
  { id: 'visitor', icon: '📖', label: { en: 'Visitor', te: 'సందర్శకుడు', hi: 'पर्यटक' } },
];

// 2×4 Service grid
const SERVICE_GRID = [
  {
    id: 'emergency',
    icon: '🚨',
    label: { en: 'Emergency', te: 'అత్యవసరం', hi: 'आपातकाल' },
    bgLight: '#FFECEC',
    bgDark: '#3A1818',
    textLight: '#991B1B',
    textDark: '#FECACA',
    action: (cb: any) => cb.onSosClick(),
  },
  {
    id: 'transport',
    icon: '🚌',
    label: { en: 'Transport', te: 'రవాణా', hi: 'परिवहन' },
    bgLight: '#E6F8F6',
    bgDark: '#112E2B',
    textLight: '#03544D',
    textDark: '#A5F3FC',
    action: (cb: any) => cb.onShortcutClick('home'),
  },
  {
    id: 'hotel',
    icon: '🏨',
    label: { en: 'Hotel Stays', te: 'హోటల్లు', hi: 'होटल' },
    bgLight: '#E0F2FE',
    bgDark: '#0C2D48',
    textLight: '#0369A1',
    textDark: '#BAE6FD',
    action: (cb: any) => cb.onShortcutClick('services', 'hotel'),
  },
  {
    id: 'committees',
    icon: '👥',
    label: { en: 'Village Committees', te: 'గ్రామ కమిటీలు', hi: 'ग्राम समिति' },
    bgLight: '#F3E8FF',
    bgDark: '#2E1065',
    textLight: '#6B21A8',
    textDark: '#E9D5FF',
    action: (cb: any) => cb.onShortcutClick('directory', 'committees'),
  },
  {
    id: 'jobs',
    icon: '💼',
    label: { en: 'Search Jobs', te: 'ఉద్యోగాలు', hi: 'नौकरी' },
    bgLight: '#FEF3C7',
    bgDark: '#451A03',
    textLight: '#92400E',
    textDark: '#FDE68A',
    action: (cb: any) => cb.onShortcutClick('jobs'),
  },
  {
    id: 'mandi',
    icon: '🌾',
    label: { en: 'Mandi Rates', te: 'మండి ధరలు', hi: 'మండి భావ' },
    bgLight: '#ECEFDF',
    bgDark: '#142C12',
    textLight: '#3F6212',
    textDark: '#D9F99D',
    action: (cb: any) => cb.onShortcutClick('farmer', 'mandi'),
  },
  {
    id: 'schemes',
    icon: '📋',
    label: { en: 'Govt Schemes', te: 'ప్రభుత్వ పథకాలు', hi: 'యోజనాయేఁ' },
    bgLight: '#FCE7F3',
    bgDark: '#4A1525',
    textLight: '#9D174D',
    textDark: '#FBCFE8',
    action: (cb: any) => cb.onShortcutClick('directory', 'schemes'),
  },
  {
    id: 'govtoffices',
    icon: '🏛️',
    label: { en: 'Govt Offices', te: 'ప్రభుత్వ కార్యాలయాలు', hi: 'సరకారీ కార్యాలయ' },
    bgLight: '#EFF6FF',
    bgDark: '#172554',
    textLight: '#1E40AF',
    textDark: '#BFDBFE',
    action: (cb: any) => cb.onShortcutClick('directory', 'govt'),
  },
];

const getPersonaAction = (
  id: string,
  onShortcutClick: DashboardScreenProps['onShortcutClick']
) => {
  switch (id) {
    case 'farmer': return () => onShortcutClick('farmer');
    case 'student': return () => onShortcutClick('directory', 'education');
    case 'villager': return () => onShortcutClick('directory');
    case 'visitor': return () => onShortcutClick('services', 'hotel');
    default: return () => onShortcutClick('home');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DAILY UTILITIES SECTION
// ─────────────────────────────────────────────────────────────────────────────
interface DailyUtilitiesSectionProps {
  isDark: boolean;
  colors: any;
  onShortcutClick: DashboardScreenProps['onShortcutClick'];
}

const DailyUtilitiesSection: React.FC<DailyUtilitiesSectionProps> = ({ isDark, colors, onShortcutClick }) => {
  const { getTxt } = useLanguage();

  const cardBg = isDark ? 'rgba(17,24,39,0.95)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)';

  const TOOLS = [
    { icon: '💰', label: { en: 'Interest\nCalc', te: 'వడ్డీ\nక్యాలిక్యులేటర్', hi: 'బ్యాజ\nకైల్కులేటర్' }, color: '#4ade80', darkBg: '#142C12', lightBg: '#ECEFDF', textLight: '#3F6212', textDark: '#D9F99D', onPress: () => onShortcutClick('utilities', 'interest') },
    { icon: '📐', label: { en: 'Unit\nConv', te: 'యూనిట్\nకన్వర్టర్', hi: 'ఇకాయీ\nకనవర్టర్' }, color: '#60a5fa', darkBg: '#0C2D48', lightBg: '#E0F2FE', textLight: '#0369A1', textDark: '#BAE6FD', onPress: () => onShortcutClick('utilities', 'unit') },
    { icon: '⏱', label: { en: 'Stopwatch\n& Timer', te: 'స్టాప్‌వాచ్\n& టైమర్', hi: 'స్టాప్వాచ్\n& టైమర్' }, color: '#fbbf24', darkBg: '#451A03', lightBg: '#FEF3C7', textLight: '#92400E', textDark: '#FDE68A', onPress: () => onShortcutClick('utilities', 'stopwatch') },
    { icon: '⚡', label: { en: 'More\nTools', te: 'మరిన్ని\nసాధనాలు', hi: 'ఔర\nఉపకరణ' }, color: '#c084fc', darkBg: '#2E1065', lightBg: '#F3E8FF', textLight: '#6B21A8', textDark: '#E9D5FF', onPress: () => onShortcutClick('utilities') },
  ];

  return (
    <View style={[dutStyles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      {/* Header */}
      <View style={dutStyles.header}>
        <View style={[dutStyles.headerIcon, { backgroundColor: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)' }]}>
          <Text style={{ fontSize: 14 }}>🛠️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[dutStyles.title, { color: colors.foreground }]}>Daily Utilities</Text>
          <Text style={[dutStyles.subtitle, { color: colors.mutedForeground }]}>Handy tools for everyday use</Text>
        </View>
      </View>

      {/* 1×4 Tool Grid */}
      <View style={dutStyles.grid}>
        {TOOLS.map((tool, i) => (
          <TouchableOpacity
            key={i}
            style={[
              dutStyles.toolCard,
              { backgroundColor: isDark ? tool.darkBg : tool.lightBg },
            ]}
            onPress={tool.onPress}
          >
            <View style={[dutStyles.toolIconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}>
              <Text style={dutStyles.toolEmoji}>{tool.icon}</Text>
            </View>
            <Text style={[dutStyles.toolLabel, { color: isDark ? tool.textDark : tool.textLight }]}>{getTxt(tool.label)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const dutStyles = StyleSheet.create({
  section: { borderRadius: 18, borderWidth: 1.5, padding: 14, paddingBottom: 16, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  headerIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '800' },
  subtitle: { fontSize: 11, marginTop: 2 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  toolCard: { flex: 1, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 2, alignItems: 'center', gap: 6, minHeight: 85, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 6, elevation: 4 },
  toolIconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  toolEmoji: { fontSize: 18 },
  toolLabel: { fontSize: 9.5, fontWeight: '800', textAlign: 'center', lineHeight: 12 },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onShortcutClick,
  onSosClick,
  onAirportClick,
  onScroll,
  onPrivacyClick,
  onSafetyClick,
}) => {
  const { t, getTxt, lang } = useLanguage();
  const { colors, theme } = useTheme();
  const { timeString, getGreetingKey, weatherData } = useWeatherClock();

  const [searchText, setSearchText] = useState('');
  const [activePersona, setActivePersona] = useState('farmer');
  const [transitTab, setTransitTab] = useState<'flights' | 'buses' | 'trains'>('flights');
  const [sourcesModalOpen, setSourcesModalOpen] = useState(false);

  const localizedCondition = getConditionTranslations(weatherData.conditionCode)[lang as 'en' | 'te' | 'hi'];
  const condEmoji = getConditionEmoji(weatherData.conditionCode);

  const isDark = theme === 'dark';

  const handleOrvakalPress = async () => {
    const speechService = DI.getSpeechService();
    const isSpeaking = await speechService.isSpeaking();
    if (isSpeaking) {
      await speechService.stop();
    } else {
      const welcomeMessage = {
        en: "Welcome to Orvakal Digital Hub, a smart village portal for Andhra Pradesh's fast-growing mega industrial, solar, and agricultural hub.",
        te: "ఆంధ్రప్రదేశ్ లో వేగంగా అభివృద్ధి చెందుతున్న మెగా పారిశ్రామిక, సౌర విద్యుత్ మరియు వ్యవసాయ కేంద్రమైన ఓర్వకల్లు డిజిటల్ హబ్‌కు స్వాగతం.",
        hi: "आंध्र प्रदेश के तेजी से बढ़ते मेगा औद्योगिक, सौर और कृषि हब, ओरवाकल डिजिटल हब में आपका स्वागत है।"
      }[lang as 'en' | 'te' | 'hi'] || "Welcome to Orvakal Digital Hub.";

      await speechService.speak(welcomeMessage, lang);
    }
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* ── 1. Search Bar ──────────────────────────────────────── */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#ffffff',
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(99,102,241,0.2)',
            },
          ]}
        >
          <Search size={16} color={isDark ? '#a5b4fc' : '#6366f1'} style={styles.searchIcon} />
          <TextInput
            placeholder={t.searchPlaceholder}
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}
            style={[styles.searchInput, { color: colors.foreground }]}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* ── 1.5. Government Disclaimer Section (High Visibility) ──── */}
        <View
          style={[
            styles.disclaimerCard,
            {
              backgroundColor: isDark ? 'rgba(217, 119, 6, 0.08)' : 'rgba(217, 119, 6, 0.04)',
              borderColor: isDark ? 'rgba(217, 119, 6, 0.25)' : 'rgba(217, 119, 6, 0.15)',
              shadowColor: '#d97706',
              marginBottom: 10,
            },
          ]}
        >
          <View style={styles.disclaimerHeader}>
            <Info size={14} color={isDark ? '#F59E0B' : '#D97706'} style={styles.marginRight} />
            <Text style={[styles.disclaimerTitleText, { color: isDark ? '#F59E0B' : '#D97706' }]}>
              {t.disclaimerTitle}
            </Text>
          </View>
          <Text style={[styles.disclaimerBodyText, { color: colors.mutedForeground, marginTop: 4 }]}>
            {t.govtDisclaimer}
          </Text>
          <TouchableOpacity
            style={[
              styles.disclaimerBtn,
              {
                backgroundColor: colors.uniformPastelBg,
                borderColor: colors.uniformPastelBorder,
                marginTop: 8,
              },
            ]}
            onPress={() => setSourcesModalOpen(true)}
          >
            <ExternalLink size={12} color={colors.uniformPastelText} style={styles.marginRight} />
            <Text style={[styles.disclaimerBtnText, { color: colors.uniformPastelText }]}>
              {t.officialGovtSources}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── 2. SOS Banner ───────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.sosStrip}
          onPress={onSosClick}
          activeOpacity={0.8}
        >
          <View style={styles.sosInner}>
            <ShieldAlert size={18} color="#ffffff" style={styles.marginRight} />
            <Text style={styles.sosText}>
              {lang === 'te'
                ? 'అత్యవసర SOS హెల్ప్‌లైన్'
                : lang === 'hi'
                  ? 'आपातकालीन एसओएस हेल्पलाइन'
                  : 'EMERGENCY SOS HOTLINES'}
            </Text>
          </View>
          <View style={styles.sosBadge}>
            <Text style={styles.sosBadgeText}>
              {lang === 'te' ? 'సహాయం పొందండి' : lang === 'hi' ? 'सहायता लें' : 'GET HELP'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ── 3. Hero Banner (with embedded weather + time) ───────── */}
        <View
          style={[
            styles.heroBanner,
            {
              backgroundColor: colors.uniformPastelBg,
              borderColor: colors.border,
              borderWidth: 1.5,
            }
          ]}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroTitleRow}>
              <TouchableOpacity
                style={[
                  styles.heroTitleButton,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 107, 120, 0.08)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 107, 120, 0.25)',
                  }
                ]}
                onPress={handleOrvakalPress}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Read Orvakal introduction aloud"
              >
                <Cpu size={14} color={isDark ? '#34d399' : colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.heroTitle, { color: isDark ? '#ffffff' : colors.primary }]}>ORVAKAL</Text>
                <Sparkles size={11} color={isDark ? '#fbbf24' : '#e65c00'} style={{ marginLeft: 6 }} />
              </TouchableOpacity>

              <View
                style={[
                  styles.heroTitleBadge,
                  {
                    backgroundColor: isDark ? 'rgba(74,222,128,0.18)' : 'rgba(22,163,74,0.12)',
                    borderColor: isDark ? 'rgba(74,222,128,0.35)' : 'rgba(22,163,74,0.25)',
                  }
                ]}
              >
                <View style={styles.greenDot} />
                <Text style={[styles.heroTitleBadgeText, { color: isDark ? '#4ade80' : '#15803d' }]}>LIVE</Text>
              </View>
            </View>

            <Text style={[styles.heroDesc, { color: isDark ? 'rgba(255,255,255,0.85)' : '#334155' }]}>
              {lang === 'te'
                ? 'ఆంధ్రప్రదేశ్ వేగంగా అభివృద్ధి చెందుతున్న మెగా పారిశ్రామిక కేంద్రం. సౌర పార్కులు, విమాన రవాణా మరియు వ్యవసాయ సేవలు మీ చేతి వేళ్ళ చివర.'
                : lang === 'hi'
                  ? 'आंध्र प्रदेश का तेज़ी से बढ़ता मेगा औद्योगिक हब। सौर पार्क, उड़ान पारगमन और कृषि सेवाएं आपकी उंगलियों पर।'
                  : "Andhra Pradesh's fast-growing mega industrial hub. Solar parks, flight transit & agri services at your fingertips."}
            </Text>

            <View style={styles.heroBadgeRow}>
              <View
                style={[
                  styles.heroBadge,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0, 107, 120, 0.06)',
                    borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0, 107, 120, 0.15)',
                  }
                ]}
              >
                <View style={styles.greenDot} />
                <Text style={[styles.heroBadgeText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                  {lang === 'te' ? 'క్రియాశీల పంచాయత్' : lang === 'hi' ? 'सक्रिय पंचायत' : 'Active Panchayat'}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.heroBadge,
                  styles.heroBadgeAirport,
                  {
                    backgroundColor: isDark ? 'rgba(251,191,36,0.15)' : '#fef3c7',
                    borderColor: isDark ? 'rgba(251,191,36,0.3)' : '#fde68a',
                  }
                ]}
                onPress={onAirportClick}
              >
                <Text style={[styles.heroBadgeText, { color: isDark ? '#fbbf24' : '#b45309' }]}>✈️ Airport KJB</Text>
              </TouchableOpacity>
            </View>

            {/* ── Embedded Weather + Time Strip ── */}
            <TouchableOpacity
              style={[
                styles.weatherStrip,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.65)',
                  borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,107,120,0.12)',
                }
              ]}
              onPress={() => onShortcutClick('weather')}
              accessibilityLabel="View detailed weather"
            >
              {/* Left: weather */}
              <View style={styles.weatherStripLeft}>
                <Text style={styles.weatherStripEmoji}>{condEmoji}</Text>
                <View>
                  <Text style={[styles.weatherStripTemp, { color: isDark ? '#ffffff' : colors.foreground }]}>{weatherData.temperature}°C</Text>
                  <Text style={[styles.weatherStripCond, { color: isDark ? 'rgba(255,255,255,0.7)' : colors.mutedForeground }]} numberOfLines={1}>{localizedCondition}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={[styles.weatherStripDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,107,120,0.15)' }]} />

              {/* Mid: humidity + wind */}
              <View style={styles.weatherStripMid}>
                <Text style={[styles.weatherStripStat, { color: isDark ? 'rgba(255,255,255,0.85)' : colors.mutedForeground }]}>💧 {weatherData.humidity}%</Text>
                <Text style={[styles.weatherStripStat, { color: isDark ? 'rgba(255,255,255,0.85)' : colors.mutedForeground }]}>🌬️ {weatherData.windSpeed} km/h</Text>
              </View>

              {/* Divider */}
              <View style={[styles.weatherStripDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,107,120,0.15)' }]} />

              {/* Right: time */}
              <View style={styles.weatherStripRight}>
                <Text style={[styles.weatherStripTime, { color: isDark ? '#ffffff' : colors.primary }]}>{timeString}</Text>
                <Text style={[styles.weatherStripTimeLabel, { color: isDark ? 'rgba(255,255,255,0.6)' : colors.mutedForeground }]}>
                  {lang === 'te' ? 'స్థానిక సమయం' : lang === 'hi' ? 'స్థానీయ సమయ్' : 'Local Time'}
                </Text>
              </View>

              {/* Tap hint */}
              <ChevronDown size={12} color={isDark ? 'rgba(255,255,255,0.6)' : colors.mutedForeground} style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.investorCta,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(230, 92, 0, 0.08)',
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(230, 92, 0, 0.15)',
                }
              ]}
              onPress={() => onShortcutClick('insights')}
            >
              <View style={styles.investorLeft}>
                <Text style={styles.investorBulb}>💡</Text>
                <View>
                  <Text style={[styles.investorTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                    {lang === 'te'
                      ? 'ఓర్వకల్లు పారిశ్రామిక హబ్ అంతర్దృష్టులు'
                      : lang === 'hi'
                        ? 'ओरवाकल इंडस्ट्रियल हब इनसाइट्स'
                        : 'Orvakal Industrial Hub Insights'}
                  </Text>
                  <Text style={[styles.investorZone, { color: isDark ? '#fbbf24' : '#e65c00' }]}>INVESTOR ZONE</Text>
                </View>
              </View>
              <View style={[styles.investorArrow, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(230, 92, 0, 0.15)' }]}>
                <ArrowRight size={16} color={isDark ? '#ffffff' : '#e65c00'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 4. Quick Recommendations & Links ─────────────────────── */}
        <View
          style={[
            styles.quickSection,
            {
              backgroundColor: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff',
              borderColor: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)',
            },
          ]}
        >
          <View style={styles.quickHeader}>
            <View style={[styles.quickHeaderIcon, { backgroundColor: isDark ? 'rgba(0, 163, 184, 0.2)' : 'rgba(0, 107, 120, 0.1)' }]}>
              <Users size={14} color={isDark ? '#80DEEA' : '#006B78'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.quickTitle, { color: colors.foreground }]}>
                {lang === 'te' ? 'శీఘ్ర సిఫార్సులు & లింకులు' : lang === 'hi' ? 'त्वरित अनुशंसाएं और लिंक' : 'Quick Recommendations & Links'}
              </Text>
              <Text style={[styles.quickSubtitle, { color: colors.mutedForeground }]}>
                {lang === 'te' ? 'నావిగేట్ చేయడానికి ఒక వ్యక్తిత్వాన్ని ఎంచుకోండి:' : lang === 'hi' ? 'नेविगेट करने के लिए एक व्यक्तित्व चुनें:' : 'Select a persona to navigate:'}
              </Text>
            </View>
          </View>

          {/* Persona pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.personaPillsRow}
          >
            {PERSONA_TABS.map((p) => {
              const isActive = activePersona === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.personaPill,
                    {
                      backgroundColor: isActive
                        ? isDark ? 'rgba(0, 163, 184, 0.2)' : 'rgba(0, 107, 120, 0.1)'
                        : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      borderColor: isActive
                        ? isDark ? '#00A3B8' : '#006B78'
                        : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    },
                  ]}
                  onPress={() => {
                    setActivePersona(p.id);
                    getPersonaAction(p.id, onShortcutClick)();
                  }}
                >
                  <Text style={styles.personaPillIcon}>{p.icon}</Text>
                  <Text
                    style={[
                      styles.personaPillLabel,
                      { color: isActive ? (isDark ? '#80DEEA' : '#004D5A') : colors.foreground },
                    ]}
                  >
                    {p.label[lang as 'en' | 'te' | 'hi'] ?? p.label.en}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0, 107, 120, 0.1)' }]} />

          {/* Service card grid */}
          <View style={styles.serviceGrid}>
            {SERVICE_GRID.map((svc) => (
              <TouchableOpacity
                key={svc.id}
                style={[
                  styles.serviceCard,
                  { backgroundColor: isDark ? svc.bgDark : svc.bgLight },
                ]}
                onPress={() => svc.action({ onShortcutClick, onSosClick, onAirportClick })}
                accessibilityRole="button"
                accessibilityLabel={svc.label.en}
              >
                <View style={[styles.serviceIconCircle, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' }]}>
                  <Text style={styles.serviceIcon}>{svc.icon}</Text>
                </View>
                <Text style={[styles.serviceLabel, { color: isDark ? svc.textDark : svc.textLight }]} numberOfLines={2}>
                  {svc.label[lang as 'en' | 'te' | 'hi'] ?? svc.label.en}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 5. Daily Utilities ──────────────────────────────────── */}
        <DailyUtilitiesSection isDark={isDark} colors={colors} onShortcutClick={onShortcutClick} />

        {/* ── 6. Notice Board ─────────────────────────────────────── */}
        <View
          style={[
            styles.noticeBoardCard,
            {
              backgroundColor: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff',
              borderColor: isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.12)',
            },
          ]}
        >
          <View style={[styles.noticeBoardHeader, { borderBottomColor: isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)' }]}>
            <View style={styles.flexRow}>
              <View style={[styles.noticeBoardIconBox, { backgroundColor: isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)' }]}>
                <Bell size={13} color="#ef4444" />
              </View>
              <Text style={styles.noticeBoardTitle}>
                {lang === 'en' ? 'NOTICE BOARD' : lang === 'te' ? 'సమాచార బోర్డు' : 'सूचना पट्ट'}
              </Text>
            </View>
            <AudioButton
              text={notices.map((n) => `${getTxt(n.title)}. ${getTxt(n.content)}`).join('. ')}
              size={14}
            />
          </View>
          <View style={{ padding: 12, gap: 10 }}>
            {notices.map((n) => (
              <View
                key={n.id}
                style={[
                  styles.noticeItemEnhanced,
                  {
                    borderLeftColor: n.type === 'alert' ? '#ef4444' : '#6366f1',
                    backgroundColor: n.type === 'alert'
                      ? (isDark ? 'rgba(239,68,68,0.08)' : '#fff5f5')
                      : (isDark ? 'rgba(99,102,241,0.08)' : '#f8f9ff'),
                    borderColor: n.type === 'alert'
                      ? 'rgba(239,68,68,0.15)'
                      : 'rgba(99,102,241,0.1)',
                  },
                ]}
              >
                <View style={styles.noticeRow}>
                  <Text style={[styles.noticeTitleEnhanced, { color: colors.foreground }]} numberOfLines={2}>
                    {getTxt(n.title)}
                  </Text>
                  <View style={[styles.noticeDateBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                    <Text style={[styles.noticeDateText, { color: colors.mutedForeground }]}>{n.date}</Text>
                  </View>
                </View>
                <Text style={[styles.noticeContent, { color: colors.mutedForeground, marginTop: 5 }]}>
                  {getTxt(n.content)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 7. Transit & Transport Desk ─────────────────────────── */}
        <View
          style={[
            styles.transitCard,
            {
              backgroundColor: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff',
              borderColor: isDark ? 'rgba(52,211,153,0.2)' : 'rgba(16,185,129,0.15)',
            },
          ]}
        >
          <View style={[styles.transitHeader, { borderBottomColor: isDark ? 'rgba(52,211,153,0.15)' : 'rgba(16,185,129,0.1)' }]}>
            <View style={styles.flexRow}>
              <View style={[styles.transitIconBox, { backgroundColor: isDark ? 'rgba(52,211,153,0.15)' : 'rgba(16,185,129,0.1)' }]}>
                <Text style={{ fontSize: 13 }}>🚉</Text>
              </View>
              <Text style={[styles.transitHeaderTitle, { color: isDark ? '#34d399' : '#059669' }]}>
                {lang === 'te' ? 'రవాణా & ట్రాన్స్‌పోర్ట్ డెస్క్' : lang === 'hi' ? 'परिवहन और ट्रांसपोर्ट डेस्क' : 'Transit & Transport Desk'}
              </Text>
            </View>
          </View>

          {/* Tab selector */}
          <View style={[styles.transitTabBar, { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
            {(['flights', 'buses', 'trains'] as const).map((tab) => {
              const isActive = transitTab === tab;
              const tabLabel = {
                flights: { icon: '✈️', en: 'Flights (KJB)', te: 'విమానాలు', hi: 'ఉడాయినేం' },
                buses: { icon: '🚌', en: 'Buses (APSRTC)', te: 'బస్సులు', hi: 'బసేం' },
                trains: { icon: '🚆', en: 'Trains (KRNT)', te: 'రైళ్ళు', hi: 'ట్రేనేం' },
              }[tab];
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.transitTab,
                    isActive && [
                      styles.transitTabActive,
                      {
                        backgroundColor: isDark ? 'rgba(0, 163, 184, 0.2)' : 'rgba(0, 107, 120, 0.1)',
                        borderColor: isDark ? '#00A3B8' : '#006B78',
                      },
                    ],
                  ]}
                  onPress={() => setTransitTab(tab)}
                >
                  <Text style={styles.transitTabIcon}>{tabLabel.icon}</Text>
                  <Text
                    style={[
                      styles.transitTabLabel,
                      { color: isActive ? (isDark ? '#80DEEA' : '#004D5A') : colors.mutedForeground },
                      isActive && { fontWeight: '700' },
                    ]}
                  >
                    {tabLabel[lang as 'en' | 'te' | 'hi'] ?? tabLabel.en}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ padding: 12, gap: 8 }}>
            {transitTab === 'flights' && flights.map((f) => (
              <View key={f.id} style={[styles.transitRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                <View style={styles.transitCardLeft}>
                  <Text style={[styles.transitFlightNo, { color: colors.foreground }]}>
                    {f.flightNo} <Text style={[styles.transitAirline, { color: colors.mutedForeground }]}>({getTxt(f.airline)})</Text>
                  </Text>
                  <Text style={[styles.transitRouteText, { color: colors.mutedForeground }]}>{getTxt(f.from)} → {getTxt(f.to)}</Text>
                  <Text style={[styles.transitDays, { color: colors.mutedForeground }]}>Days: {getTxt(f.days)}</Text>
                </View>
                <View style={styles.transitCardRight}>
                  <Text style={[styles.transitTimeBig, { color: colors.foreground }]}>{f.departure}</Text>
                  <Text style={[styles.transitTimeLabel, { color: colors.mutedForeground }]}>Departs</Text>
                  <View style={[styles.transitStatusBadge, { backgroundColor: f.status.en.startsWith('On') ? '#dcfce7' : '#fee2e2' }]}>
                    <Text style={[styles.transitStatusText, { color: f.status.en.startsWith('On') ? '#16a34a' : '#dc2626' }]}>{getTxt(f.status)}</Text>
                  </View>
                </View>
              </View>
            ))}
            {transitTab === 'trains' && trains.map((tr) => (
              <View key={tr.id} style={[styles.transitRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                <View style={styles.transitCardLeft}>
                  <Text style={[styles.transitFlightNo, { color: colors.foreground }]}>
                    #{tr.trainNo} <Text style={[styles.transitAirline, { color: colors.mutedForeground }]}>({getTxt(tr.name)})</Text>
                  </Text>
                  <Text style={[styles.transitRouteText, { color: colors.mutedForeground }]}>{getTxt(tr.route)}</Text>
                  <Text style={[styles.transitDays, { color: colors.mutedForeground }]}>{getTxt(tr.days)}</Text>
                </View>
                <View style={styles.transitCardRight}>
                  <Text style={[styles.transitTimeBig, { color: colors.foreground, fontSize: 10 }]}>{getTxt(tr.timing)}</Text>
                </View>
              </View>
            ))}
            {transitTab === 'buses' && buses.map((bus) => (
              <View key={bus.id} style={[styles.transitRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                <View style={styles.transitCardLeft}>
                  <Text style={[styles.transitFlightNo, { color: colors.foreground }]}>{bus.busNo}</Text>
                  <Text style={[styles.transitRouteText, { color: colors.mutedForeground }]}>{getTxt(bus.route)}</Text>
                  <Text style={[styles.transitDays, { color: colors.mutedForeground }]}>{getTxt(bus.type)}</Text>
                </View>
                <View style={styles.transitCardRight}>
                  <Text style={[styles.transitTimeBig, { color: colors.foreground, fontSize: 10, textAlign: 'right' }]}>{getTxt(bus.timing)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── 8. Industrial Hub News ───────────────────────────────── */}
        <GlassCard>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitleText, { color: colors.foreground }]}>
              📰{' '}
              {lang === 'en' ? 'Industrial Hub News' : lang === 'te' ? 'పారిశ్రామిక హబ్ వార్తలు' : 'औद्योगिक हब समाचार'}
            </Text>
            <AudioButton
              text={newsItems.map((news) => `${getTxt(news.title)}. ${getTxt(news.summary)}`).join('. ')}
              size={14}
            />
          </View>
          <View style={styles.noticeList}>
            {newsItems.map((news) => (
              <View
                key={news.id}
                style={[
                  styles.newsItem,
                  {
                    borderLeftColor: colors.secondary,
                    backgroundColor: `${colors.muted}20`,
                  },
                ]}
              >
                <View style={styles.noticeRow}>
                  <Text style={[styles.newsTitle, { color: colors.foreground }]}>{getTxt(news.title)}</Text>
                  <Text style={[styles.noticeDate, { color: colors.mutedForeground }]}>{news.date}</Text>
                </View>
                <Text style={[styles.noticeContent, { color: colors.mutedForeground, marginTop: 4 }]}>
                  {getTxt(news.summary)}
                </Text>
                <Text style={[styles.newsSource, { color: colors.mutedForeground }]}>
                  Source: {getTxt(news.source)}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* ── 9. Local Attractions ─────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {t.attractions || 'Local Places'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.attScroll}
          >
            {attractions.map((item) => (
              <View
                key={item.id}
                style={[styles.attCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.imagePlaceholder, { backgroundColor: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)' }]}>
                  <Text style={styles.placeholderEmoji}>🏞️</Text>
                </View>
                <View style={styles.attInfo}>
                  <Text style={[styles.attName, { color: colors.foreground }]}>{getTxt(item.name)}</Text>
                  <Text style={[styles.attDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {getTxt(item.description)}
                  </Text>
                  <View style={[styles.attFooter, { borderTopColor: colors.border }]}>
                    <Text style={[styles.attDistance, { color: isDark ? '#34d399' : '#059669' }]}>
                      {getTxt(item.distance)}
                    </Text>
                    <Text style={[styles.attStatus, { color: isDark ? '#a5b4fc' : '#6366f1' }]}>Open</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── 10. Footer Section ───────────────────────────────────── */}
        <View style={[styles.footerSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            © 2026 Orvakal Digital Hub. Community Initiative.
          </Text>
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', marginTop: 4 }}>
            <TouchableOpacity onPress={onPrivacyClick}>
              <Text style={[styles.footerPrivacyLink, { color: colors.primary }]}>
                {t.privacyPolicy}
              </Text>
            </TouchableOpacity>
            <View style={{ width: 1, height: 12, backgroundColor: colors.mutedForeground, opacity: 0.3 }} />
            <TouchableOpacity onPress={onSafetyClick}>
              <Text style={[styles.footerPrivacyLink, { color: colors.primary }]}>
                {t.safetyPolicy}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Government Sources Modal */}
      <CustomModal
        isOpen={sourcesModalOpen}
        onClose={() => setSourcesModalOpen(false)}
        title={t.officialGovtSources}
      >
        <Text style={{ fontSize: 11, color: colors.mutedForeground, marginBottom: 12, lineHeight: 15 }}>
          {t.govtSourcesHelpText}
        </Text>
        <View style={{ gap: 10 }}>
          {govtSources.map((source) => (
            <View
              key={source.id}
              style={[
                styles.sourceCard,
                {
                  backgroundColor: `${colors.muted}15`,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.sourceNameText, { color: colors.foreground }]}>
                {getTxt(source.name)}
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL(source.url)}>
                <Text style={[styles.sourceUrlText, { color: colors.primary }]}>
                  {source.url}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.sourceDescText, { color: colors.mutedForeground }]}>
                {getTxt(source.description)}
              </Text>
              <TouchableOpacity
                style={[styles.visitBtn, { backgroundColor: colors.primary }]}
                onPress={() => Linking.openURL(source.url)}
              >
                <Text style={styles.visitBtnText}>{t.visitOfficialSite}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 14, paddingBottom: 100, gap: 14 },

  flexRow: { flexDirection: 'row', alignItems: 'center' },
  marginRight: { marginRight: 6 },

  // ── Search Bar ────────────────────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    padding: 0,
  },

  // ── SOS Banner ────────────────────────────────────────────────
  sosStrip: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#dc2626',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  sosInner: { flexDirection: 'row', alignItems: 'center' },
  sosText: { fontWeight: '800', fontSize: 13, color: '#ffffff' },
  sosBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  // ── Hero Banner ───────────────────────────────────────────────
  heroBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 240,
    shadowColor: '#1a3a3a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  heroBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#0d1f2d',
  },
  heroGlowLeft: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0f766e',
    opacity: 0.45,
  },
  heroGlowRight: {
    position: 'absolute',
    bottom: -40,
    right: -20,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#d97706',
    opacity: 0.55,
  },
  heroShimmer: {
    position: 'absolute',
    top: '30%',
    left: '35%',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroContent: { padding: 22, zIndex: 1 },
  heroTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  heroTitleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2.5,
  },
  heroTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(74,222,128,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  heroTitleBadgeText: { color: '#4ade80', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  heroDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11.5,
    lineHeight: 17,
    marginBottom: 12,
  },
  heroBadgeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  heroBadgeAirport: {
    backgroundColor: 'rgba(251,191,36,0.18)',
    borderColor: 'rgba(251,191,36,0.35)',
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  heroBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '700' },

  // ── Embedded Weather Strip ────────────────────────────────────
  weatherStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  weatherStripLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1.2 },
  weatherStripEmoji: { fontSize: 22 },
  weatherStripTemp: { color: '#ffffff', fontSize: 16, fontWeight: '900' },
  weatherStripCond: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '600', marginTop: 1 },
  weatherStripDivider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.2)' },
  weatherStripMid: { flex: 1, gap: 4 },
  weatherStripStat: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '600' },
  weatherStripRight: { alignItems: 'flex-end' },
  weatherStripTime: { color: '#ffffff', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  weatherStripTimeLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },

  investorCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    padding: 13,
  },
  investorLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  investorBulb: { fontSize: 22 },
  investorTitle: { color: '#ffffff', fontSize: 12, fontWeight: '700', marginBottom: 2 },
  investorZone: { color: '#fbbf24', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  investorArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Quick Recommendations ─────────────────────────────────────
  quickSection: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 14,
    paddingBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  quickHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  quickHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: { fontSize: 14, fontWeight: '800' },
  quickSubtitle: { fontSize: 11, marginTop: 2 },
  personaPillsRow: { gap: 8, paddingVertical: 2 },
  personaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  personaPillIcon: { fontSize: 14 },
  personaPillLabel: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1.5, marginVertical: 14, borderRadius: 2 },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceCard: {
    width: '23%',
    borderRadius: 14,
    padding: 9,
    alignItems: 'center',
    gap: 6,
    minHeight: 84,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  serviceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: { fontSize: 20 },
  serviceLabel: { fontSize: 9.5, fontWeight: '800', textAlign: 'center', lineHeight: 13 },

  // ── Notice Board ──────────────────────────────────────────────
  noticeBoardCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  noticeBoardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1.5,
  },
  noticeBoardIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  noticeBoardTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#ef4444',
  },
  noticeItemEnhanced: {
    borderLeftWidth: 3,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  noticeTitleEnhanced: { fontSize: 12, fontWeight: '700', flex: 1, lineHeight: 16 },
  noticeDateBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, marginLeft: 8 },
  noticeDateText: { fontSize: 9, fontWeight: '600' },
  noticeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  noticeTitle: { fontSize: 12, fontWeight: 'bold', flex: 1 },
  noticeDate: { fontSize: 9, marginLeft: 8 },
  noticeContent: { fontSize: 11, lineHeight: 15 },

  // ── Transit ───────────────────────────────────────────────────
  transitCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  transitIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  transitHeader: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1.5,
  },
  transitHeaderTitle: { fontSize: 13, fontWeight: '800' },
  transitTabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 6,
  },
  transitTab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    gap: 2,
  },
  transitTabActive: {
    borderWidth: 1.5,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 6,
  },
  transitTabIcon: { fontSize: 16 },
  transitTabLabel: { fontSize: 10, fontWeight: '500', textAlign: 'center' },
  transitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  transitCardLeft: { flex: 1, gap: 3 },
  transitCardRight: { alignItems: 'flex-end', gap: 3 },
  transitFlightNo: { fontSize: 13, fontWeight: '700' },
  transitAirline: { fontSize: 11, fontWeight: '400' },
  transitRouteText: { fontSize: 10, lineHeight: 14 },
  transitDays: { fontSize: 9.5 },
  transitTimeBig: { fontSize: 14, fontWeight: '800' },
  transitTimeLabel: { fontSize: 9, fontWeight: '500' },
  transitStatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 2 },
  transitStatusText: { fontSize: 9.5, fontWeight: '700' },

  // ── News ──────────────────────────────────────────────────────
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitleText: { fontSize: 14, fontWeight: 'bold' },
  noticeList: { gap: 8 },
  newsItem: { borderLeftWidth: 2, padding: 8, borderRadius: 6 },
  newsTitle: { fontSize: 12, fontWeight: 'bold', flex: 1 },
  newsSource: { fontSize: 9, fontStyle: 'italic', marginTop: 4 },

  // ── Attractions ───────────────────────────────────────────────
  sectionContainer: {},
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10, letterSpacing: -0.2 },
  attScroll: { gap: 12 },
  attCard: { width: 200, borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  imagePlaceholder: { width: '100%', height: 90, alignItems: 'center', justifyContent: 'center' },
  placeholderEmoji: { fontSize: 30 },
  attInfo: { padding: 10 },
  attName: { fontSize: 12, fontWeight: 'bold' },
  attDesc: { fontSize: 10, lineHeight: 13, marginTop: 4, height: 26 },
  attFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 6, marginTop: 6 },
  attDistance: { fontSize: 10, fontWeight: 'bold' },
  attStatus: { fontSize: 10, fontWeight: 'bold' },
  footerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    marginTop: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 10,
    textAlign: 'center',
  },
  footerPrivacyLink: {
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  disclaimerCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginVertical: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  disclaimerTitleText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  disclaimerBodyText: {
    fontSize: 10.5,
    lineHeight: 15,
  },
  disclaimerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
    gap: 6,
    borderWidth: 1,
  },
  disclaimerBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  sourceCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4,
    gap: 6,
  },
  sourceNameText: {
    fontSize: 12.5,
    fontWeight: 'bold',
  },
  sourceUrlText: {
    fontSize: 11,
    textDecorationLine: 'underline',
    marginBottom: 2,
  },
  sourceDescText: {
    fontSize: 10.5,
    lineHeight: 14,
  },
  visitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
    gap: 4,
  },
  visitBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
