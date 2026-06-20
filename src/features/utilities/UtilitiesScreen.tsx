import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useLanguage } from '../../core/state/LanguageContext';
import { useTheme } from '../../core/state/ThemeContext';

// Import extracted components
import { InterestCalculator } from './components/InterestCalculator';
import { UnitConverter } from './components/UnitConverter';
import { StopwatchTimer } from './components/StopwatchTimer';
import { PomodoroTimer } from './components/PomodoroTimer';
import { CoinSpinner } from './components/CoinSpinner';
import { AgeCalculator } from './components/AgeCalculator';
import { DateDifference } from './components/DateDifference';

type UtilityType = 'interest' | 'unit' | 'stopwatch' | 'pomodoro' | 'coin' | 'age' | 'datediff';

interface UtilitiesScreenProps {
  initialUtility: UtilityType | null;
  onClose: () => void;
}

export const UtilitiesScreen: React.FC<UtilitiesScreenProps> = ({ initialUtility, onClose }) => {
  const { lang } = useLanguage();
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTool, setActiveTool] = useState<UtilityType | null>(initialUtility);

  // Synchronize state if prop changes
  useEffect(() => {
    setActiveTool(initialUtility);
  }, [initialUtility]);

  const handleToolSelect = (tool: UtilityType) => {
    setActiveTool(tool);
  };

  const handleBackToMenu = () => {
    setActiveTool(null);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {activeTool === null ? (
        <MasterMenu
          onClose={onClose}
          onSelectTool={handleToolSelect}
          colors={colors}
          lang={lang}
          isDark={isDark}
        />
      ) : (
        <View style={styles.toolContainer}>
          {/* Tool Header */}
          <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
            <TouchableOpacity onPress={handleBackToMenu} style={[styles.headerBackBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]}>
              <ArrowLeft size={18} color={colors.uniformPastelText} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              {activeTool === 'interest' && (lang === 'te' ? 'వడ్డీ క్యాలిక్యులేటర్' : lang === 'hi' ? 'ब्याज कैलकुलेटर' : 'Interest Calculator')}
              {activeTool === 'unit' && (lang === 'te' ? 'యూనిట్ కన్వర్టర్' : lang === 'hi' ? 'इकाई कनवर्टर' : 'Unit Converter')}
              {activeTool === 'stopwatch' && (lang === 'te' ? 'స్టాప్‌వాచ్' : lang === 'hi' ? 'स्टॉपवॉच' : 'Stopwatch & Timer')}
              {activeTool === 'pomodoro' && (lang === 'te' ? 'పోమోడోరో టైమర్' : lang === 'hi' ? 'पोमोडोरो टाइमर' : 'Pomodoro Focus')}
              {activeTool === 'coin' && (lang === 'te' ? 'కాయిన్ స్పిన్నర్' : lang === 'hi' ? 'सिक्का स्पिनर' : 'Suspense Coin Spinner')}
              {activeTool === 'age' && (lang === 'te' ? 'వయస్సు క్యాలిక్యులేటర్' : lang === 'hi' ? 'आयु कैलकुलेटर' : 'Age Calculator')}
              {activeTool === 'datediff' && (lang === 'te' ? 'తేదీల వ్యత్యాసం' : lang === 'hi' ? 'तारीख का अंतर' : 'Date Difference')}
            </Text>
            <View style={{ width: 34 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {activeTool === 'interest' && <InterestCalculator colors={colors} isDark={isDark} />}
            {activeTool === 'unit' && <UnitConverter colors={colors} isDark={isDark} />}
            {activeTool === 'stopwatch' && <StopwatchTimer colors={colors} isDark={isDark} />}
            {activeTool === 'pomodoro' && <PomodoroTimer colors={colors} isDark={isDark} />}
            {activeTool === 'coin' && <CoinSpinner colors={colors} isDark={isDark} />}
            {activeTool === 'age' && <AgeCalculator colors={colors} isDark={isDark} />}
            {activeTool === 'datediff' && <DateDifference colors={colors} isDark={isDark} />}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MASTER MENU COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface MasterMenuProps {
  onClose: () => void;
  onSelectTool: (tool: UtilityType) => void;
  colors: any;
  lang: string;
  isDark: boolean;
}

const MasterMenu: React.FC<MasterMenuProps> = ({ onClose, onSelectTool, colors, lang, isDark }) => {
  const toolsList = [
    { key: 'interest' as const, emoji: '💰', label: { en: 'Interest Calculator', te: 'వడ్డీ క్యాలిక్యులేటర్', hi: 'ब्याज कैलकुलेटर' }, desc: { en: 'Simple & Compound interest calculations', te: 'సాధారణ మరియు చక్ర వడ్డీ లెక్కలు', hi: 'साधारण और चक्रवृद्धि ब्याज गणना' }, color: '#4ade80' },
    { key: 'unit' as const, emoji: '📐', label: { en: 'Unit Converter', te: 'యూనిట్ కన్వర్టర్', hi: 'इकाई कनवर्टर' }, desc: { en: 'Convert length, weight, area, and temperature', te: 'పొడవు, బరువు, వైశాల్యం మరియు ఉష్ణోగ్రత మార్పిడి', hi: 'लंबाई, वजन, क्षेत्रफल और तापमान बदलें' }, color: '#60a5fa' },
    { key: 'stopwatch' as const, emoji: '⏱', label: { en: 'Stopwatch & Timer', te: 'స్టాప్‌వాచ్ & టైమర్', hi: 'स्टॉपवॉच और टाइमर' }, desc: { en: 'Precise stopwatch and custom countdowns', te: 'ఖచ్చితమైన స్టాప్‌వాచ్ మరియు కౌంట్‌డౌన్', hi: 'सटीक स्टॉपवॉच और कस्टम उलटी गिनती' }, color: '#fbbf24' },
    { key: 'pomodoro' as const, emoji: '🍅', label: { en: 'Pomodoro Timer', te: 'పోమోడోరో టైమర్', hi: 'पोमोడోरो టైమర్' }, desc: { en: 'Enhance focus with work and break intervals', te: 'పని మరియు విరామ సమయాల ఏకాగ్రత', hi: 'काम और ब्रेक के अंतराल के साथ ध्यान बढ़ाएं' }, color: '#ef4444' },
    { key: 'coin' as const, emoji: '🪙', label: { en: 'Coin Spinner', te: 'కాయిన్ స్పిన్నర్', hi: 'सिक्का स्पिनर' }, desc: { en: 'Heads or Tails flip with 5s suspense spin', te: '5 సెకన్ల ఉత్కంఠభరిత కాయిన్ టాస్', hi: '5 सेकेंड के सस्पेंस स्पिन के साथ चित या पट' }, color: '#fbbf24' },
    { key: 'age' as const, emoji: '🎂', label: { en: 'Age Calculator', te: 'వయస్సు క్యాలిక్యులేటర్', hi: 'आयु कैलकुलेटर' }, desc: { en: 'Calculate exact years, months, and days from DOB', te: 'మీ పుట్టిన తేదీ నుండి కచ్చితమైన వయస్సు', hi: 'जन्म तिथि से सटीक वर्ष, महीने और दिन' }, color: '#34d399' },
    { key: 'datediff' as const, emoji: '📅', label: { en: 'Date Difference', te: 'తేదీల వ్యత్యాసం', hi: 'तारीख का अंतर' }, desc: { en: 'Find difference between two custom dates', te: 'రెండు తేదీల మధ్య గల వ్యత్యాసం', hi: 'दो तारीखों के बीच का अंतर ज्ञात करें' }, color: '#818cf8' },
  ];

  return (
    <View style={styles.toolContainer}>
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={onClose} style={[styles.headerBackBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]}>
          <ArrowLeft size={18} color={colors.uniformPastelText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {lang === 'te' ? '🛠️ రోజువారీ సాధనాలు' : lang === 'hi' ? '🛠️ दैनिक उपकरण' : '🛠️ Daily Utilities'}
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.menuTitleText, { color: colors.foreground }]}>
          {lang === 'te' ? 'అందుబాటులో ఉన్న సాధనాలు' : lang === 'hi' ? 'उपलब्ध उपकरण' : 'Available Tools'}
        </Text>
        <Text style={[styles.menuSubText, { color: colors.mutedForeground }]}>
          {lang === 'te' ? 'మరింత సౌలభ్యం కోసం ప్రతి సాధనం ప్రత్యేక పేజీగా తెరవబడుతుంది' : lang === 'hi' ? 'अधिक सुविधा के लिए प्रत्येक उपकरण एक नए पृष्ठ के रूप में खुलता है' : 'Click any card to open a tool as an ultra-stylish page'}
        </Text>

        <View style={styles.menuGrid}>
          {toolsList.map((tool) => (
            <TouchableOpacity
              key={tool.key}
              style={[
                styles.menuCard,
                {
                  backgroundColor: colors.uniformMenuBg,
                  borderColor: colors.uniformMenuBorder,
                },
              ]}
              onPress={() => onSelectTool(tool.key)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: `${tool.color}15` }]}>
                <Text style={styles.menuIconEmoji}>{tool.emoji}</Text>
              </View>
              <View style={styles.menuCardContent}>
                <Text style={[styles.menuCardLabel, { color: colors.foreground }]}>
                  {tool.label[lang as 'en' | 'te' | 'hi'] ?? tool.label.en}
                </Text>
                <Text style={[styles.menuCardDesc, { color: colors.mutedForeground }]}>
                  {tool.desc[lang as 'en' | 'te' | 'hi'] ?? tool.desc.en}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  toolContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBackBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  menuTitleText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  menuSubText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 20,
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconEmoji: {
    fontSize: 26,
  },
  menuCardContent: {
    flex: 1,
    gap: 2,
  },
  menuCardLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  menuCardDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
});
