import React, { useState, useRef, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Linking, Animated, Image } from 'react-native';
import { LayoutDashboard, Building2, Sprout, Home, Briefcase, Bell, Moon, Sun, Phone, ShieldAlert, X } from 'lucide-react-native';

// State & Contexts
import { LanguageProvider, useLanguage } from './src/core/state/LanguageContext';
import { ThemeProvider, useTheme } from './src/core/state/ThemeContext';
import { DomainDataProvider, useDomainData } from './src/core/state/DomainDataContext';

// Screens
import { DashboardScreen } from './src/features/dashboard/DashboardScreen';
import { DirectoryScreen } from './src/features/directory/DirectoryScreen';
import { FarmerScreen } from './src/features/farmer/FarmerScreen';
import { ServicesScreen } from './src/features/hospitality/ServicesScreen';
import { JobsScreen } from './src/features/jobs/JobsScreen';
import { InsightsScreen } from './src/features/insights/InsightsScreen';
import { WeatherScreen } from './src/features/weather/WeatherScreen';
import { UtilitiesScreen } from './src/features/utilities/UtilitiesScreen';

// Core Components & DI
import { CustomModal } from './src/core/components/CustomModal';
import { Badge } from './src/core/components/Badge';
import { registeredCompanies } from './src/data/datasources/static/registeredCompanies';
import { emergencies } from './src/data/datasources/static/govtData';
import { notices } from './src/data/datasources/static/noticesData';

type Tab = 'home' | 'directory' | 'farmer' | 'services' | 'jobs' | 'insights' | 'weather' | 'utilities';

function MainAppShell() {
  const { lang, setLang, t, getTxt } = useLanguage();
  const { theme, setTheme, colors } = useTheme();
  const { localJobs } = useDomainData();

  // Navigation state
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [directorySubTab, setDirectorySubTab] = useState<'govt' | 'education' | 'grievance' | 'postal' | 'banks' | 'police' | 'hospital' | 'schemes' | 'committees' | null>(null);
  const [farmerSubTab, setFarmerSubTab] = useState<'feeder' | 'mandi' | 'msp' | 'tractor' | 'advisory' | 'water' | 'repair' | 'agri-officer' | null>(null);
  const [servicesCategory, setServicesCategory] = useState<string | null>(null);
  const [jobsSubTab, setJobsSubTab] = useState<'job' | 'labour' | 'industries' | null>(null);
  const [activeUtility, setActiveUtility] = useState<'interest' | 'unit' | 'stopwatch' | 'pomodoro' | 'coin' | 'age' | 'datediff' | null>(null);

  // Notice board drawer overlay state
  const [showNotices, setShowNotices] = useState<boolean>(false);

  // Bottom nav scroll-aware visibility
  const navTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const navVisible = useRef(true);

  const handleScroll = useCallback((event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;
    if (diff > 8 && navVisible.current) {
      // Scrolling down — hide nav
      navVisible.current = false;
      Animated.spring(navTranslateY, {
        toValue: 120,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }).start();
    } else if (diff < -6 && !navVisible.current) {
      // Scrolling up — show nav
      navVisible.current = true;
      Animated.spring(navTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }).start();
    }
    lastScrollY.current = Math.max(0, currentY);
  }, [navTranslateY]);

  // Global overlay Modals
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [airportModalOpen, setAirportModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<any | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [companiesModalOpen, setCompaniesModalOpen] = useState(false);

  const handleShortcutClick = (
    tabName: Tab,
    subTabName?: string,
    query?: string
  ) => {
    setActiveTab(tabName);
    if (tabName === 'directory') {
      setDirectorySubTab((subTabName || null) as any);
    }
    if (tabName === 'farmer') {
      setFarmerSubTab((subTabName || null) as any);
    }
    if (tabName === 'services') {
      setServicesCategory(subTabName || null);
    }
    if (tabName === 'jobs') {
      setJobsSubTab((subTabName || null) as any);
    }
    if (tabName === 'utilities') {
      setActiveUtility((subTabName || null) as any);
    }
    // Always show bottom nav when switching tabs
    if (!navVisible.current) {
      navVisible.current = true;
      Animated.spring(navTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 24,
        bounciness: 0,
      }).start();
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      {/* Global Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          {/* App logo */}
          <Image
            source={require('./assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <View style={styles.branding}>
            <Text style={[styles.title, { color: colors.foreground }]}>{t.title || 'Orvakal Hub'}</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t.subtitle || 'Smart Village Portal'}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Language Selector */}
          <View style={[styles.langSelector, { borderColor: colors.border, backgroundColor: colors.glassBg }]}>
            {['en', 'te', 'hi'].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.langBtn, { backgroundColor: lang === l ? colors.primary : 'transparent' }]}
                onPress={() => setLang(l as any)}
              >
                <Text style={[styles.langBtnText, { color: lang === l ? '#ffffff' : colors.foreground }]}>
                  {l.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Theme toggler */}
          <TouchableOpacity
            style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: colors.glassBg }]}
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? (
              <Moon size={14} color={colors.foreground} />
            ) : (
              <Sun size={14} color={colors.foreground} />
            )}
          </TouchableOpacity>

          {/* Bell notices trigger */}
          <TouchableOpacity
            style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: colors.glassBg }]}
            onPress={() => setShowNotices(true)}
          >
            <Bell size={14} color={colors.foreground} />
            <View style={styles.pulseDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {activeTab === 'home' && (
          <DashboardScreen
            onShortcutClick={handleShortcutClick}
            onSosClick={() => setSosModalOpen(true)}
            onAirportClick={() => setAirportModalOpen(true)}
            onScroll={handleScroll}
          />
        )}

        {activeTab === 'directory' && (
          <DirectoryScreen
            initialSubTab={directorySubTab}
            onClose={() => handleShortcutClick('home')}
          />
        )}

        {activeTab === 'farmer' && (
          <FarmerScreen
            initialSubTab={farmerSubTab}
            onClose={() => handleShortcutClick('home')}
          />
        )}

        {activeTab === 'services' && (
          <ServicesScreen
            initialCategory={servicesCategory}
            onClose={() => handleShortcutClick('home')}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsScreen
            initialSubTab={jobsSubTab}
            onClose={() => handleShortcutClick('home')}
            onSelectIndustry={setSelectedIndustry}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsScreen
            onBackClick={() => handleShortcutClick('home')}
            onActiveIndustriesClick={() => setCompaniesModalOpen(true)}
            onShortcutClick={handleShortcutClick}
            onCompanySelect={setSelectedCompany}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherScreen
            onClose={() => handleShortcutClick('home')}
          />
        )}

        {activeTab === 'utilities' && (
          <UtilitiesScreen
            initialUtility={activeUtility}
            onClose={() => handleShortcutClick('home')}
          />
        )}
      </View>

      {/* Slide-out Notice Board bottom drawer */}
      {showNotices && (
        <View style={[styles.drawerOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.drawer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color: colors.foreground }]}>📌 Notice Board</Text>
              <TouchableOpacity onPress={() => setShowNotices(false)} style={[styles.closeBtn, { borderColor: colors.border }]}>
                <X size={16} color={colors.foreground} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.drawerScroll}>
              {notices.map((n) => (
                <View key={n.id} style={[styles.noticeItem, { borderLeftColor: n.type === 'alert' ? '#ef4444' : colors.primary }]}>
                  <View style={styles.noticeRow}>
                    <Text style={[styles.noticeTitle, { color: colors.foreground }]}>{getTxt(n.title)}</Text>
                    <Text style={{ fontSize: 9, color: colors.mutedForeground }}>{n.date}</Text>
                  </View>
                  <Text style={[styles.noticeContent, { color: colors.mutedForeground }]}>{getTxt(n.content)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Bottom Tab Navigation Bar — solid, full-width, responsive */}
      <Animated.View
        style={[
          styles.navBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            transform: [{ translateY: navTranslateY }],
          },
        ]}
      >
        <TouchableOpacity style={styles.navItem} onPress={() => handleShortcutClick('home')}>
          <View style={[styles.navIconWrapper, { backgroundColor: activeTab === 'home' ? `${colors.primary}18` : 'transparent' }]}>
            <LayoutDashboard size={20} color={activeTab === 'home' ? colors.primary : colors.mutedForeground} />
          </View>
          <Text style={[styles.navText, { color: activeTab === 'home' ? colors.primary : colors.mutedForeground, fontWeight: activeTab === 'home' ? '800' : '500' }]}>Home</Text>
          {activeTab === 'home' && <View style={[styles.navActiveBar, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleShortcutClick('directory')}>
          <View style={[styles.navIconWrapper, { backgroundColor: activeTab === 'directory' ? `${colors.primary}18` : 'transparent' }]}>
            <Building2 size={20} color={activeTab === 'directory' ? colors.primary : colors.mutedForeground} />
          </View>
          <Text style={[styles.navText, { color: activeTab === 'directory' ? colors.primary : colors.mutedForeground, fontWeight: activeTab === 'directory' ? '800' : '500' }]}>Govt Info</Text>
          {activeTab === 'directory' && <View style={[styles.navActiveBar, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleShortcutClick('farmer')}>
          <View style={[styles.navIconWrapper, { backgroundColor: activeTab === 'farmer' ? `${colors.primary}18` : 'transparent' }]}>
            <Sprout size={20} color={activeTab === 'farmer' ? colors.primary : colors.mutedForeground} />
          </View>
          <Text style={[styles.navText, { color: activeTab === 'farmer' ? colors.primary : colors.mutedForeground, fontWeight: activeTab === 'farmer' ? '800' : '500' }]}>Farmer</Text>
          {activeTab === 'farmer' && <View style={[styles.navActiveBar, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleShortcutClick('services')}>
          <View style={[styles.navIconWrapper, { backgroundColor: activeTab === 'services' ? `${colors.primary}18` : 'transparent' }]}>
            <Home size={20} color={activeTab === 'services' ? colors.primary : colors.mutedForeground} />
          </View>
          <Text style={[styles.navText, { color: activeTab === 'services' ? colors.primary : colors.mutedForeground, fontWeight: activeTab === 'services' ? '800' : '500' }]}>Services</Text>
          {activeTab === 'services' && <View style={[styles.navActiveBar, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleShortcutClick('jobs')}>
          <View style={[styles.navIconWrapper, { backgroundColor: activeTab === 'jobs' ? `${colors.primary}18` : 'transparent' }]}>
            <Briefcase size={20} color={activeTab === 'jobs' ? colors.primary : colors.mutedForeground} />
          </View>
          <Text style={[styles.navText, { color: activeTab === 'jobs' ? colors.primary : colors.mutedForeground, fontWeight: activeTab === 'jobs' ? '800' : '500' }]}>Jobs</Text>
          {activeTab === 'jobs' && <View style={[styles.navActiveBar, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>
      </Animated.View>

      {/* Global Modals */}

      {/* A. SOS Emergency Modal */}
      <CustomModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} title="Emergency Helplines">
        <View style={styles.modalGap}>
          {emergencies.map((emg) => (
            <View key={emg.id} style={[styles.emergencyRow, { backgroundColor: `${colors.muted}30` }]}>
              <View>
                <Text style={[styles.emgName, { color: colors.foreground }]}>{getTxt(emg.name)}</Text>
                <Text style={{ fontSize: 10, color: colors.mutedForeground }}>{getTxt(emg.location)}</Text>
              </View>
              <TouchableOpacity style={styles.callEmgBtn} onPress={() => handleCall(emg.phone)}>
                <Phone size={10} color="#be123c" style={styles.marginRight} />
                <Text style={styles.callEmgText}>{emg.phone}</Text>
              </TouchableOpacity>
            </View>
          ))}
          <Text style={styles.emgNote}>Click to call directly. Free emergency numbers function offline.</Text>
        </View>
      </CustomModal>

      {/* B. Airport Transit Modal */}
      <CustomModal isOpen={airportModalOpen} onClose={() => setAirportModalOpen(false)} title="Uyyalawada Narasimha Reddy Airport (KJB)">
        <View style={styles.modalGap}>
          <Text style={{ fontSize: 11, color: colors.mutedForeground, lineHeight: 15 }}>
            Orvakal airport connects Kurnool district directly to major cities under the UDAN connectivity scheme.
          </Text>
          <View style={styles.divider} />
          <Text style={[styles.listHeading, { color: colors.primary }]}>Weekly Flight Schedule</Text>
          
          <View style={[styles.flightRow, { backgroundColor: `${colors.muted}40` }]}>
            <View>
              <Text style={[styles.flightRoute, { color: colors.foreground }]}>Kurnool (KJB) ➜ Bengaluru (BLR)</Text>
              <Text style={{ fontSize: 10, color: colors.mutedForeground }}>Indigo • Daily • 02:15 PM</Text>
            </View>
            <Badge variant="success">Active</Badge>
          </View>

          <View style={[styles.flightRow, { backgroundColor: `${colors.muted}40` }]}>
            <View>
              <Text style={[styles.flightRoute, { color: colors.foreground }]}>Kurnool (KJB) ➜ Hyderabad (HYD)</Text>
              <Text style={{ fontSize: 10, color: colors.mutedForeground }}>Indigo • Daily • 10:30 AM</Text>
            </View>
            <Badge variant="success">Active</Badge>
          </View>

          <View style={[styles.flightRow, { backgroundColor: `${colors.muted}40` }]}>
            <View>
              <Text style={[styles.flightRoute, { color: colors.foreground }]}>Kurnool (KJB) ➜ Chennai (MAA)</Text>
              <Text style={{ fontSize: 10, color: colors.mutedForeground }}>Indigo • Tue, Thu, Sat • 04:45 PM</Text>
            </View>
            <Badge variant="success">Active</Badge>
          </View>
        </View>
      </CustomModal>

      {/* C. Registered Companies Modal */}
      <CustomModal isOpen={companiesModalOpen} onClose={() => setCompaniesModalOpen(false)} title="Active Registered Companies">
        <View style={styles.modalGap}>
          {registeredCompanies.map((comp) => (
            <TouchableOpacity key={comp.id} style={[styles.companyCard, { backgroundColor: `${colors.muted}30` }]} onPress={() => { setCompaniesModalOpen(false); setSelectedCompany(comp); }}>
              <Text style={[styles.companyName, { color: colors.primary }]}>{getTxt(comp.name)}</Text>
              <Text style={{ fontSize: 10, color: colors.mutedForeground }}>Sector: {getTxt(comp.sector)}</Text>
              <Text style={{ fontSize: 10, color: colors.mutedForeground }}>Location: {getTxt(comp.location)}</Text>
              <Text style={[styles.companyDesc, { color: colors.foreground }]} numberOfLines={2}>{getTxt(comp.description)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </CustomModal>

      {/* D. Registered Company Profile Details Modal */}
      <CustomModal isOpen={selectedCompany !== null} onClose={() => setSelectedCompany(null)} title="Company Profile">
        {selectedCompany && (
          <View style={styles.modalGap}>
            <Text style={[styles.companyName, { color: colors.primary, fontSize: 15 }]}>{getTxt(selectedCompany.name)}</Text>
            <Text style={[styles.emgName, { color: colors.foreground }]}>Sector: {getTxt(selectedCompany.sector)}</Text>
            <Text style={[styles.emgName, { color: colors.foreground }]}>Location: {getTxt(selectedCompany.location)}</Text>
            <View style={styles.divider} />
            <Text style={[styles.emgName, { color: colors.foreground, fontWeight: 'bold' }]}>About the Company:</Text>
            <Text style={{ fontSize: 11, color: colors.mutedForeground, lineHeight: 15, marginTop: 4 }}>
              {getTxt(selectedCompany.description)}
            </Text>
          </View>
        )}
      </CustomModal>

      {/* E. Industrial Plant Details Modal */}
      <CustomModal isOpen={selectedIndustry !== null} onClose={() => setSelectedIndustry(null)} title="Industrial Desk">
        {selectedIndustry && (
          <View style={styles.modalGap}>
            <Text style={[styles.companyName, { color: colors.primary, fontSize: 14 }]}>{getTxt(selectedIndustry.name)}</Text>
            <Text style={{ fontSize: 11, color: colors.foreground, marginTop: 4 }}>Sector: {getTxt(selectedIndustry.sector)}</Text>
            <Text style={{ fontSize: 11, color: colors.foreground }}>Location: {getTxt(selectedIndustry.location)}</Text>
            <Text style={{ fontSize: 11, color: colors.foreground }}>Status: {getTxt(selectedIndustry.status)}</Text>
            <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.primary }]} onPress={() => handleCall(selectedIndustry.hrContact)}>
              <Phone size={14} color="#ffffff" style={styles.marginRight} />
              <Text style={styles.callBtnText}>Contact HR Office</Text>
            </TouchableOpacity>
          </View>
        )}
      </CustomModal>

    </SafeAreaView>
  );
}

// Global wrap
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DomainDataProvider>
          <MainAppShell />
        </DomainDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 36,
    height: 36,
  },

  branding: {
    marginLeft: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 8,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 2,
  },
  langBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  langBtnText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  iconBtn: {
    borderWidth: 1,
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  content: {
    flex: 1,
    paddingBottom: 72,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 1000,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  navIconWrapper: {
    width: 42,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  navActiveBar: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  navText: {
    fontSize: 9.5,
    fontWeight: '500',
    marginTop: 1,
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    justifyContent: 'flex-end',
  },
  drawer: {
    borderTopWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    padding: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  closeBtn: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 8,
  },
  drawerScroll: {
    marginBottom: 20,
  },
  noticeList: {
    gap: 10,
  },
  noticeItem: {
    borderLeftWidth: 4,
    paddingLeft: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  noticeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  noticeContent: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14,
  },
  modalGap: {
    gap: 10,
  },
  emergencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  emgName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  callEmgBtn: {
    backgroundColor: '#ffe4e6',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callEmgText: {
    color: '#be123c',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emgNote: {
    fontSize: 9,
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 4,
  },
  listHeading: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  flightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  flightRoute: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  companyCard: {
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  companyName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  companyDesc: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 4,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  callBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  marginRight: {
    marginRight: 4,
  },
});
