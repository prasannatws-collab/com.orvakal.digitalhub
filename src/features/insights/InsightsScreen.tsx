import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../../core/state/LanguageContext';
import { useTheme } from '../../core/state/ThemeContext';
import { GlassCard } from '../../core/components/GlassCard';
import { AudioButton } from '../../core/components/AudioButton';
import { Badge } from '../../core/components/Badge';

// Import datasets
import { registeredCompanies } from '../../data/datasources/static/registeredCompanies';
import {
  industrialPresenceContext,
  keyCompanies,
  keyInfrastructure,
  policyIncentives,
  hubResources,
} from '../../data/datasources/static/industrialHubData';

interface InsightsScreenProps {
  onBackClick: () => void;
  onActiveIndustriesClick: () => void;
  onShortcutClick: (
    tab: 'home' | 'directory' | 'farmer' | 'services' | 'jobs' | 'insights' | 'weather' | 'utilities',
    subTab?: string,
    query?: string
  ) => void;
  onCompanySelect: (company: any) => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  onBackClick,
  onActiveIndustriesClick,
  onShortcutClick,
  onCompanySelect,
}) => {
  const { lang, t, getTxt } = useLanguage();
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          💡 {lang === 'en' ? "Industrial Hub" : lang === 'te' ? "పారిశ్రామిక హబ్" : "औद्योगिक हब"}
        </Text>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]} onPress={onBackClick}>
          <Text style={[styles.backBtnText, { color: colors.uniformPastelText }]}>🏠 Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* 1. At A Glance panel */}
      <GlassCard style={{ borderColor: `${colors.primary}30` }}>
        <Text style={[styles.sectionHeading, { color: colors.foreground }]}>
          {lang === 'en' ? "Orvakal At A Glance" : lang === 'te' ? "ఓర్వకల్లు ఒక చూపులో" : "ओरवाकल एक नज़र में"}
        </Text>
        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.statsBlock, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={onActiveIndustriesClick}>
            <Text style={[styles.statsNum, { color: colors.uniformPastelText }]}>{registeredCompanies.length}</Text>
            <Text style={[styles.statsLabel, { color: colors.uniformPastelText }]}>🏢 {t.activeIndustries || 'Active Setup'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statsBlock, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => onShortcutClick('jobs', 'job')}>
            <Text style={[styles.statsNum, { color: colors.uniformPastelText }]}>💼</Text>
            <Text style={[styles.statsLabel, { color: colors.uniformPastelText }]}>
              {lang === 'en' ? "Careers at Hub" : lang === 'te' ? "హబ్‌లో ఉద్యోగాలు" : "हब में करियर"} ➔
            </Text>
          </TouchableOpacity>
        </View>

        {/* Badges of companies */}
        <View style={styles.companyBadgesContainer}>
          <Text style={[styles.subLabel, { color: colors.mutedForeground }]}>
            🏢 {t.activeIndustriesList || "Active Registered Companies:"}
          </Text>
          <View style={styles.badgesWrapper}>
            {registeredCompanies.map((comp) => (
              <TouchableOpacity key={comp.id} onPress={() => onCompanySelect(comp)}>
                <Badge variant="info" style={styles.badgeSpacing}>{getTxt(comp.name)}</Badge>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </GlassCard>

      {/* 2. Presence Context */}
      <GlassCard style={{ borderLeftWidth: 4, borderLeftColor: '#be123c' }}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitleText, { color: '#be123c' }]}>🏢 {getTxt(industrialPresenceContext.title)}</Text>
          <AudioButton text={`${getTxt(industrialPresenceContext.title)}. ${getTxt(industrialPresenceContext.content)}`} />
        </View>
        <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>{getTxt(industrialPresenceContext.content)}</Text>
        {industrialPresenceContext.bullets && (
          <View style={[styles.bulletsContainer, { borderLeftColor: colors.border }]}>
            {industrialPresenceContext.bullets.map((bullet, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={[styles.bulletBold, { color: colors.foreground }]}>{getTxt(bullet.boldText)}</Text>
                <Text style={[styles.bulletText, { color: colors.mutedForeground }]}>{getTxt(bullet.normalText)}</Text>
              </View>
            ))}
          </View>
        )}
      </GlassCard>

      {/* 3. Key Companies */}
      <GlassCard style={{ borderLeftWidth: 4, borderLeftColor: '#0369a1' }}>
        <Text style={[styles.cardTitleText, { color: '#0369a1', marginBottom: 10 }]}>
          🏭 {lang === 'en' ? "Key Companies Linked to Orvakal" : lang === 'te' ? "ఓర్వకల్లుతో ప్రముఖ కంపెనీలు" : "ओरवाकल से जुड़ी प्रमुख कंपनियां"}
        </Text>
        <View style={styles.companiesList}>
          {keyCompanies.map((comp) => (
            <View key={comp.id} style={[styles.companyCard, { backgroundColor: `${colors.muted}40` }]}>
              <Text style={[styles.companyNameText, { color: colors.foreground }]}>{getTxt(comp.name)}</Text>
              <Text style={[styles.companyDescText, { color: colors.mutedForeground }]}>{getTxt(comp.description)}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* 4. Key Infrastructure */}
      <GlassCard style={{ borderLeftWidth: 4, borderLeftColor: '#15803d' }}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitleText, { color: '#15803d' }]}>🔌 {getTxt(keyInfrastructure.title)}</Text>
          <AudioButton text={`${getTxt(keyInfrastructure.title)}. ${getTxt(keyInfrastructure.content)}`} />
        </View>
        <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>{getTxt(keyInfrastructure.content)}</Text>
        {keyInfrastructure.bullets && (
          <View style={styles.bulletsList}>
            {keyInfrastructure.bullets.map((bullet, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={[styles.bulletBold, { color: colors.foreground }]}>{getTxt(bullet.boldText)}</Text>
                <Text style={[styles.bulletText, { color: colors.mutedForeground, marginLeft: 0, marginTop: 2 }]}>
                  {getTxt(bullet.normalText)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </GlassCard>

      {/* 5. Policy Incentives */}
      <GlassCard style={{ borderLeftWidth: 4, borderLeftColor: '#6d28d9' }}>
        <Text style={[styles.cardTitleText, { color: '#6d28d9', marginBottom: 8 }]}>⚖️ {getTxt(policyIncentives.title)}</Text>
        {policyIncentives.bullets && (
          <View style={styles.bulletsList}>
            {policyIncentives.bullets.map((bullet, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={[styles.bulletBold, { color: colors.foreground }]}>{getTxt(bullet.boldText)}</Text>
                <Text style={[styles.bulletText, { color: colors.mutedForeground, marginLeft: 0, marginTop: 2 }]}>
                  {getTxt(bullet.normalText)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </GlassCard>

      {/* 6. Resources & Getting Started */}
      <GlassCard style={{ borderLeftWidth: 4, borderLeftColor: '#b45309' }}>
        <Text style={[styles.cardTitleText, { color: '#b45309', marginBottom: 6 }]}>
          🔗 {lang === 'en' ? "Getting Started & Resources" : lang === 'te' ? "ప్రారంభించడం & వనరులు" : "शुरुआत करना और संसाधन"}
        </Text>
        <Text style={[styles.bodyText, { color: colors.mutedForeground, fontSize: 11 }]}>
          {lang === 'en'
            ? "Official channels and portals for incentive approvals and industrial allotments:"
            : "ప్రోత్సాహక అనుమతులు మరియు భూమి కేటాయింపులకు సంబంధించిన అధికారిక సమాచారం:"}
        </Text>
        <View style={styles.bulletsList}>
          {hubResources.map((res) => (
            <View key={res.id} style={styles.bulletItem}>
              <Text style={[styles.bulletBold, { color: colors.foreground }]}>{getTxt(res.title)}</Text>
              <Text style={[styles.bulletText, { color: colors.mutedForeground, marginLeft: 0, marginTop: 2 }]}>
                {getTxt(res.description)}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>

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
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statsBlock: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statsNum: {
    fontSize: 20,
    fontWeight: '800',
  },
  statsLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  companyBadgesContainer: {
    marginTop: 10,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  badgesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badgeSpacing: {
    marginRight: 4,
    marginBottom: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 16,
  },
  bulletsContainer: {
    borderLeftWidth: 2,
    paddingLeft: 8,
    marginTop: 10,
    gap: 8,
  },
  bulletRow: {
    marginBottom: 4,
  },
  bulletBold: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
  },
  companiesList: {
    gap: 8,
  },
  companyCard: {
    padding: 8,
    borderRadius: 6,
  },
  companyNameText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  companyDescText: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
  },
  bulletsList: {
    marginTop: 8,
    gap: 8,
  },
  bulletItem: {
    marginBottom: 4,
  },
});
