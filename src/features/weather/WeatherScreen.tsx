import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Droplets, Wind, Sun, AlertTriangle, Thermometer } from 'lucide-react-native';
import { useLanguage } from '../../core/state/LanguageContext';
import { useTheme } from '../../core/state/ThemeContext';
import { useWeatherClock } from '../dashboard/hooks/useWeatherClock';
import {
  getConditionTranslations,
  getConditionEmoji,
  getAQIStatus,
  getUVStatus,
} from '../../data/services/OpenMeteoWeatherService';

interface WeatherScreenProps {
  onClose: () => void;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({ onClose }) => {
  const { lang, t } = useLanguage();
  const { colors, theme } = useTheme();
  const { weatherData, weatherLoading, weatherError, timeString } = useWeatherClock();

  const isDark = theme === 'dark';

  if (weatherLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}><Text style={[styles.loadingText, { color: colors.foreground }]}>{lang === 'te' ? 'వాతావరణ వివరాలు లోడ్ అవుతున్నాయి...' : lang === 'hi' ? 'मौसम का विवरण लोड हो रहा है...' : 'Loading weather details...'}</Text></View>
      </SafeAreaView>
    );
  }

  if (weatherError || !weatherData) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: 12 }} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>{weatherError || 'Failed to load weather data'}</Text>
          <TouchableOpacity style={[styles.backBtnText, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={onClose}><Text style={{ color: colors.uniformPastelText, fontWeight: 'bold' }}>Go Back</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const localizedCondition = getConditionTranslations(weatherData.conditionCode)[lang as 'en' | 'te' | 'hi'];
  const localizedAqiStatus = getAQIStatus(weatherData.aqi)[lang as 'en' | 'te' | 'hi'];
  const localizedUvStatus  = getUVStatus(weatherData.uvIndex)[lang as 'en' | 'te' | 'hi'];
  const condEmoji          = getConditionEmoji(weatherData.conditionCode);

  // High-fidelity background coloring based on theme and current temp/conditions
  const isRainy = weatherData.conditionCode >= 50 && weatherData.conditionCode <= 69;
  const isSunny = weatherData.conditionCode <= 3;

  const getHeaderGradient = () => {
    if (isDark) {
      return isRainy ? '#1e293b' : isSunny ? '#111827' : '#0f172a';
    } else {
      return isRainy ? '#e2e8f0' : isSunny ? '#fffbeb' : '#f8fafc';
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Dynamic Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: getHeaderGradient() }]}>
        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]}>
          <ArrowLeft size={18} color={colors.uniformPastelText} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            {lang === 'te' ? 'వాతావరణ కేంద్రం' : lang === 'hi' ? 'मौसम डेस्क' : 'Weather Desk'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
            Orvakal Hub, Andhra Pradesh
          </Text>
        </View>
        <View style={{ width: 34 }} /> {/* alignment balance */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Subtle absolute background glow */}
          <View style={[styles.glowEffect, { backgroundColor: isSunny ? 'rgba(251,191,36,0.06)' : 'rgba(99,102,241,0.06)' }]} />

          <View style={styles.heroTopRow}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroEmoji}>{condEmoji}</Text>
              <Text style={[styles.heroTemp, { color: colors.foreground }]}>{weatherData.temperature}°C</Text>
              <Text style={[styles.heroCondition, { color: isDark ? '#a5b4fc' : '#4f46e5' }]}>{localizedCondition}</Text>
              <View style={styles.feelsLikeRow}>
                <Thermometer size={12} color={colors.mutedForeground} />
                <Text style={[styles.heroFeel, { color: colors.mutedForeground }]}>
                  {lang === 'te' ? `అనిపించేది: ${weatherData.apparentTemperature}°C` : lang === 'hi' ? `महसूस: ${weatherData.apparentTemperature}°C` : `Feels like ${weatherData.apparentTemperature}°C`}
                </Text>
              </View>
            </View>

            <View style={styles.heroRight}>
              <View style={[styles.timeBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
                <Text style={[styles.timeText, { color: colors.foreground }]}>{timeString}</Text>
                <Text style={[styles.timeLabel, { color: colors.mutedForeground }]}>
                  {lang === 'te' ? 'స్థానిక సమయం' : lang === 'hi' ? 'स्थानीय समय' : 'Local Time'}
                </Text>
              </View>
              <View style={styles.sunBox}>
                <Text style={[styles.sunText, { color: colors.foreground }]}>🌅 {weatherData.sunrise}</Text>
                <Text style={[styles.sunText, { color: colors.foreground, marginTop: 4 }]}>🌇 {weatherData.sunset}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Detailed Metrics Grid */}
        <Text style={[styles.sectionHeading, { color: colors.foreground }]}>
          {lang === 'te' ? 'వాతావరణ కొలతలు' : lang === 'hi' ? 'मौसम मेट्रिक्स' : 'Weather Metrics'}
        </Text>
        <View style={styles.metricsGrid}>
          {[
            { icon: <Droplets size={20} color="#38bdf8" />, label: lang === 'te' ? 'తేమ' : lang === 'hi' ? 'आर्द्रता' : 'Humidity', value: `${weatherData.humidity}%`, color: '#38bdf8' },
            { icon: <Wind size={20} color="#34d399" />, label: lang === 'te' ? 'గాలి వేగం' : lang === 'hi' ? 'हवा की गति' : 'Wind Speed', value: `${weatherData.windSpeed} km/h`, color: '#34d399' },
            { icon: <Text style={{ fontSize: 18 }}>🌧️</Text>, label: lang === 'te' ? 'వర్షం అవకాశం' : lang === 'hi' ? 'बारिश की संभावना' : 'Rain Chance', value: `${weatherData.rainChance}%`, color: '#60a5fa' },
            { icon: <Text style={{ fontSize: 18 }}>😮‍💨</Text>, label: 'AQI Status', value: `${weatherData.aqi} - ${localizedAqiStatus}`, color: '#fbbf24' },
            { icon: <Sun size={20} color="#c084fc" />, label: 'UV Index', value: `${weatherData.uvIndex} - ${localizedUvStatus}`, color: '#c084fc' },
          ].map((item, index) => (
            <View
              key={index}
              style={[
                styles.metricCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  width: index === 3 || index === 4 ? '100%' : '48%', // AQI and UV take full row width for readability
                },
              ]}
            >
              <View style={styles.metricHeader}>
                <View style={[styles.metricIconContainer, { backgroundColor: isDark ? `${item.color}15` : `${item.color}08` }]}>
                  {item.icon}
                </View>
                <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
              </View>
              <Text style={[styles.metricValue, { color: colors.foreground }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* 3-Day Forecast Section */}
        <Text style={[styles.sectionHeading, { color: colors.foreground, marginTop: 8 }]}>
          {lang === 'te' ? '📅 3-రోజుల అంచనా' : lang === 'hi' ? '📅 3-दिन का पूर्वानुमान' : '📅 3-Day Forecast'}
        </Text>
        <View style={styles.forecastContainer}>
          {(weatherData.forecast || []).map((day: any, i: number) => (
            <View key={i} style={[styles.forecastRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.forecastLeft}>
                <Text style={styles.forecastEmoji}>{getConditionEmoji(day.conditionCode)}</Text>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.forecastDate, { color: colors.foreground }]}>{day.date}</Text>
                  <Text style={[styles.forecastConditionName, { color: colors.mutedForeground }]}>
                    {getConditionTranslations(day.conditionCode)[lang as 'en' | 'te' | 'hi']}
                  </Text>
                </View>
              </View>
              <View style={styles.forecastRight}>
                <Text style={[styles.forecastTemp, { color: colors.foreground }]}>
                  {day.maxTemp}°C / {day.minTemp}°C
                </Text>
                <View style={styles.forecastRainRow}>
                  <Text style={{ fontSize: 10 }}>🌧️</Text>
                  <Text style={[styles.forecastRainText, { color: '#60a5fa' }]}> {day.rainChance}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  backBtnText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroLeft: {
    flex: 1.2,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 6,
  },
  heroTemp: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroCondition: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  feelsLikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  heroFeel: {
    fontSize: 11,
    fontWeight: '600',
  },
  heroRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  timeBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  timeLabel: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  sunBox: {
    alignItems: 'flex-end',
    marginTop: 14,
  },
  sunText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    gap: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 36, // offset to align below label text
  },
  forecastContainer: {
    gap: 8,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
  },
  forecastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastEmoji: {
    fontSize: 32,
  },
  forecastDate: {
    fontSize: 13,
    fontWeight: '800',
  },
  forecastConditionName: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  forecastRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  forecastTemp: {
    fontSize: 13,
    fontWeight: '800',
  },
  forecastRainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastRainText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
