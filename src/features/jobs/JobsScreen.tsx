import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { Phone, Briefcase, Calendar, DollarSign, Plus, UserPlus, Search, MapPin } from 'lucide-react-native';
import { useLanguage } from '../../core/state/LanguageContext';
import { industries } from '../../data/datasources/static/jobsData';
import { useTheme } from '../../core/state/ThemeContext';
import { useDomainData } from '../../core/state/DomainDataContext';
import { GlassCard } from '../../core/components/GlassCard';
import { AudioButton } from '../../core/components/AudioButton';
import { Badge } from '../../core/components/Badge';

type SubTab = 'job' | 'labour' | 'industries';

interface JobsScreenProps {
  initialSubTab: SubTab | null;
  onClose: () => void;
  onSelectIndustry: (ind: any) => void;
}

export const JobsScreen: React.FC<JobsScreenProps> = ({ initialSubTab, onClose, onSelectIndustry }) => {
  const { lang, getTxt, t } = useLanguage();
  const { colors } = useTheme();
  const { localJobs, setLocalJobs, localLabour, setLocalLabour } = useDomainData();
  const [subTab, setSubTab] = useState<SubTab | null>(initialSubTab || 'job');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  // Job Form
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobType, setJobType] = useState<'full-time' | 'contract' | 'daily-wages'>('full-time');
  const [jobReq, setJobReq] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobPhone, setJobPhone] = useState('');

  // Labour Form
  const [labourName, setLabourName] = useState('');
  const [labourSkill, setLabourSkill] = useState('');
  const [labourRate, setLabourRate] = useState('');
  const [labourLocation, setLabourLocation] = useState('');
  const [labourPhone, setLabourPhone] = useState('');

  useEffect(() => {
    setSearchQuery('');
    setShowAddForm(false);
  }, [subTab]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`);
  };

  const handlePostJob = () => {
    if (!jobTitle || !jobCompany || !jobSalary || !jobPhone) {
      alert(lang === 'en' ? 'Please fill in required fields.' : 'దయచేసి అవసరమైన వివరాలు పూరించండి.');
      return;
    }
    const newJob = {
      id: `job-${Date.now()}`,
      title: { en: jobTitle, te: jobTitle, hi: jobTitle },
      company: { en: jobCompany, te: jobCompany, hi: jobCompany },
      type: jobType,
      salary: { en: jobSalary, te: jobSalary, hi: jobSalary },
      requirements: { en: jobReq, te: jobReq, hi: jobReq },
      description: { en: jobDesc, te: jobDesc, hi: jobDesc },
      phone: jobPhone,
      postedDate: new Date().toLocaleDateString(),
    };
    setLocalJobs([newJob, ...localJobs]);
    setShowAddForm(false);
    // Reset inputs
    setJobTitle('');
    setJobCompany('');
    setJobSalary('');
    setJobReq('');
    setJobDesc('');
    setJobPhone('');
    alert(lang === 'en' ? 'Job posted successfully!' : 'ఉద్యోగం విజయవంతంగా పోస్ట్ చేయబడింది!');
  };

  const handleRegisterLabour = () => {
    if (!labourName || !labourSkill || !labourRate || !labourPhone) {
      alert(lang === 'en' ? 'Please fill in required fields.' : 'దయచేసి అవసరమైన వివరాలు పూరించండి.');
      return;
    }
    const newLabour = {
      id: `lab-${Date.now()}`,
      name: { en: labourName, te: labourName, hi: labourName },
      skill: { en: labourSkill, te: labourSkill, hi: labourSkill },
      rate: { en: labourRate, te: labourRate, hi: labourRate },
      location: { en: labourLocation, te: labourLocation, hi: labourLocation },
      phone: labourPhone,
    };
    setLocalLabour([newLabour, ...localLabour]);
    setShowAddForm(false);
    // Reset inputs
    setLabourName('');
    setLabourSkill('');
    setLabourRate('');
    setLabourLocation('');
    setLabourPhone('');
    alert(lang === 'en' ? 'Labour registered successfully!' : 'కార్మికుడు విజయవంతంగా నమోదయ్యారు!');
  };

  const matchesSearch = (text: string) => {
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          💼 {lang === 'en' ? "Jobs & Commerce" : lang === 'te' ? "ఉద్యోగాలు & వాణిజ్యం" : "नौकरियां और वाणिज्य"}
        </Text>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]} onPress={onClose}>
          <Text style={[styles.backBtnText, { color: colors.uniformPastelText }]}>🏠 Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabBtn, { borderBottomColor: subTab === 'job' ? colors.uniformPastelText : 'transparent' }]} onPress={() => setSubTab('job')}>
          <Text style={[styles.tabText, { color: subTab === 'job' ? colors.uniformPastelText : colors.mutedForeground }]}>Job Board</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, { borderBottomColor: subTab === 'labour' ? colors.uniformPastelText : 'transparent' }]} onPress={() => setSubTab('labour')}>
          <Text style={[styles.tabText, { color: subTab === 'labour' ? colors.uniformPastelText : colors.mutedForeground }]}>Labour Registry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, { borderBottomColor: subTab === 'industries' ? colors.uniformPastelText : 'transparent' }]} onPress={() => setSubTab('industries')}>
          <Text style={[styles.tabText, { color: subTab === 'industries' ? colors.uniformPastelText : colors.mutedForeground }]}>Mega Industries</Text>
        </TouchableOpacity>
      </View>

      {/* Action Add Button */}
      {subTab !== 'industries' && !showAddForm && (
        <TouchableOpacity style={[styles.postBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => setShowAddForm(true)}>
          {subTab === 'job' ? (
            <>
              <Plus size={16} color={colors.uniformPastelText} style={styles.marginRight} />
              <Text style={[styles.postBtnText, { color: colors.uniformPastelText }]}>Post a Job Opportunity</Text>
            </>
          ) : (
            <>
              <UserPlus size={16} color={colors.uniformPastelText} style={styles.marginRight} />
              <Text style={[styles.postBtnText, { color: colors.uniformPastelText }]}>Register as Daily Labour</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Forms Drawer */}
      {showAddForm && (
        <GlassCard style={{ marginBottom: 16 }}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.formHeading, { color: colors.foreground }]}>
              {subTab === 'job' ? 'Submit Job Vacancy' : 'Labour Enrollment'}
            </Text>
            <TouchableOpacity style={[styles.backBtn, { borderColor: colors.uniformPastelBorder, backgroundColor: colors.uniformPastelBg }]} onPress={() => setShowAddForm(false)}>
              <Text style={[styles.backBtnText, { color: colors.uniformPastelText }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          {subTab === 'job' ? (
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Job Title *</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. Warehouse Packer, Welder" placeholderTextColor={colors.mutedForeground} value={jobTitle} onChangeText={setJobTitle} />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Company/Employer *</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. UltraTech Cement, local farm" placeholderTextColor={colors.mutedForeground} value={jobCompany} onChangeText={setJobCompany} />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Salary / Wage *</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. ₹15,000/month, ₹600/day" placeholderTextColor={colors.mutedForeground} value={jobSalary} onChangeText={setJobSalary} />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Job Category</Text>
                <View style={styles.categoryPicker}>
                  {([ 'full-time', 'contract', 'daily-wages' ] as const).map((type) => (
                    <TouchableOpacity key={type} style={[styles.catOption, { borderColor: jobType === type ? colors.uniformPastelBorder : colors.border, backgroundColor: jobType === type ? colors.uniformPastelBg : 'transparent' }]} onPress={() => setJobType(type)}>
                      <Text style={[styles.catOptionText, { color: jobType === type ? colors.uniformPastelText : colors.foreground }]}>{type.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Requirements</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. No experience, 10th pass, basic welding" placeholderTextColor={colors.mutedForeground} value={jobReq} onChangeText={setJobReq} />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
                <TextInput style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.foreground }]} placeholder="Describe responsibilities..." placeholderTextColor={colors.mutedForeground} multiline={true} value={jobDesc} onChangeText={setJobDesc} />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Contact Phone *</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="10 digit mobile" placeholderTextColor={colors.mutedForeground} keyboardType="phone-pad" value={jobPhone} onChangeText={setJobPhone} />
              </View>
              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={handlePostJob}>
                <Text style={[styles.submitBtnText, { color: colors.uniformPastelText }]}>Post Job</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Labourer Full Name *</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="Enter your name" placeholderTextColor={colors.mutedForeground} value={labourName} onChangeText={setLabourName} />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Trade / Skill *</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. Plumber, Bricklayer, Electrician, Loader" placeholderTextColor={colors.mutedForeground} value={labourSkill} onChangeText={setLabourSkill} />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Expected Daily Wage Rate *</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. ₹500/day, ₹700/day" placeholderTextColor={colors.mutedForeground} value={labourRate} onChangeText={setLabourRate} />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Location / Village Center</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. Highway Circle, Orvakal" placeholderTextColor={colors.mutedForeground} value={labourLocation} onChangeText={setLabourLocation} />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Contact Phone *</Text>
                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.foreground }]} placeholder="10 digit mobile" placeholderTextColor={colors.mutedForeground} keyboardType="phone-pad" value={labourPhone} onChangeText={setLabourPhone} />
              </View>
              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={handleRegisterLabour}>
                <Text style={[styles.submitBtnText, { color: colors.uniformPastelText }]}>Enroll Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>
      )}

      {/* Search Input for lists */}
      {!showAddForm && (
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            placeholder={subTab === 'job' ? 'Search job title...' : subTab === 'labour' ? 'Search labour skills...' : 'Search factory sector...'}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Lists */}
      {!showAddForm && (
        <View style={styles.listContainer}>
          
          {/* 1. Job Board */}
          {subTab === 'job' && localJobs
            .filter(j => matchesSearch(getTxt(j.title)) || matchesSearch(getTxt(j.company)))
            .map((job) => (
              <GlassCard key={job.id}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(job.title)}</Text>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>{getTxt(job.company)}</Text>
                    <Badge variant={job.type === 'full-time' ? 'success' : 'info'} style={{ marginTop: 6 }}>
                      {job.type.toUpperCase()}
                    </Badge>
                  </View>
                  <AudioButton text={`${getTxt(job.title)} at ${getTxt(job.company)}`} />
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <DollarSign size={12} color={colors.secondary} />
                    <Text style={[styles.detailText, { color: colors.foreground, fontWeight: 'bold' }]}>Wage/Salary: {getTxt(job.salary)}</Text>
                  </View>
                  <View style={[styles.detailRow, { marginTop: 4 }]}>
                    <Briefcase size={12} color={colors.primary} />
                    <Text style={[styles.detailText, { color: colors.mutedForeground }]}>Reqs: {getTxt(job.requirements)}</Text>
                  </View>
                  {job.description && (
                    <Text style={[styles.descText, { color: colors.foreground }]}>{getTxt(job.description)}</Text>
                  )}
                  <View style={[styles.detailRow, { marginTop: 6 }]}>
                    <Calendar size={12} color={colors.mutedForeground} />
                    <Text style={{ fontSize: 9, color: colors.mutedForeground, marginLeft: 6 }}>Posted: {job.postedDate}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(job.phone)}>
                  <Phone size={14} color={colors.uniformPastelText} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Contact Recruiter ({job.phone})</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}

          {/* 2. Labour Registry */}
          {subTab === 'labour' && localLabour
            .filter(l => matchesSearch(getTxt(l.name)) || matchesSearch(getTxt(l.skill)))
            .map((labour) => (
              <GlassCard key={labour.id}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(labour.name)}</Text>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>{getTxt(labour.skill).toUpperCase()}</Text>
                  </View>
                  <AudioButton text={`${getTxt(labour.name)} is a ${getTxt(labour.skill)}`} />
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <Text style={[styles.detailText, { color: colors.foreground, fontWeight: 'bold' }]}>Expected Wage: {getTxt(labour.rate)}</Text>
                  <View style={[styles.detailRow, { marginTop: 4 }]}>
                    <MapPin size={12} color={colors.primary} />
                    <Text style={[styles.detailText, { color: colors.mutedForeground, marginLeft: 4 }]}>Location: {getTxt(labour.location)}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => handleCall(labour.phone)}>
                  <Phone size={14} color={colors.uniformPastelText} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>Call Laborer ({labour.phone})</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}

          {/* 3. Mega Industries */}
          {subTab === 'industries' && industries
            .filter((ind) => matchesSearch(getTxt(ind.name)) || matchesSearch(getTxt(ind.sector)))
            .map((ind) => (
              <GlassCard key={ind.id}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={[styles.officerName, { color: colors.foreground }]}>{getTxt(ind.name)}</Text>
                    <Text style={[styles.officerRole, { color: colors.primary }]}>Sector: {getTxt(ind.sector)}</Text>
                  </View>
                  <Badge variant={getTxt(ind.status).toLowerCase().includes('active') || getTxt(ind.status).toLowerCase().includes('operational') ? 'success' : 'warning'}>
                    {getTxt(ind.status)}
                  </Badge>
                </View>
                <View style={styles.divider} />
                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <MapPin size={12} color={colors.primary} />
                    <Text style={[styles.detailText, { color: colors.mutedForeground, marginLeft: 4 }]}>Location: {getTxt(ind.location)}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.uniformPastelBg, borderColor: colors.uniformPastelBorder, borderWidth: 1 }]} onPress={() => onSelectIndustry(ind)}>
                  <Briefcase size={14} color={colors.uniformPastelText} style={styles.marginRight} />
                  <Text style={[styles.callBtnText, { color: colors.uniformPastelText }]}>View Industry Desk Details</Text>
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
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  postBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginLeft: 6,
  },
  descText: {
    fontSize: 11,
    lineHeight: 15,
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
  formHeading: {
    fontSize: 14,
    fontWeight: 'bold',
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
});
