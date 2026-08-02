import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import {
  CalendarDays,
  Flame,
  HeartPulse,
  Trash2,
  Check,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Droplets,
  Zap,
  Sparkles,
  Calendar,
  Stethoscope,
} from 'lucide-react-native';
import { useBloomStore } from '../../store/useBloomStore';

export const TrackTab: React.FC = () => {
  const {
    cycleLogs,
    symptomLogs,
    dischargeLogs,
    addCycleLog,
    deleteCycleLog,
    addSymptomLog,
    setIsDischargeModalOpen,
  } = useBloomStore();

  const [activeSubTab, setActiveSubTab] = useState<'symptoms' | 'period' | 'discharge' | 'history'>('symptoms');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [periodFlow, setPeriodFlow] = useState<'light' | 'medium' | 'heavy' | 'spotting'>('medium');
  const [bbtTemp, setBbtTemp] = useState<string>('98.2');
  const [periodNotes, setPeriodNotes] = useState('');
  const [periodSavedSuccess, setPeriodSavedSuccess] = useState(false);

  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, 'mild' | 'moderate' | 'severe'>>({});
  const [moodLevel, setMoodLevel] = useState<number>(2);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [symptomSavedSuccess, setSymptomSavedSuccess] = useState(false);

  const [historyFilter, setHistoryFilter] = useState<'all' | 'period' | 'symptoms' | 'discharge'>('all');

  const symptomCategories = [
    {
      title: 'Body & Pelvic',
      icon: Flame,
      items: ['Cramps', 'Backache', 'Bloating', 'Breast Tenderness', 'Pelvic Tightness'],
    },
    {
      title: 'Head & Energy',
      icon: Zap,
      items: ['Headache', 'Fatigue', 'Brain Fog', 'High Focus', 'Dizziness'],
    },
    {
      title: 'Digestion & Skin',
      icon: HeartPulse,
      items: ['Acne', 'Nausea', 'Sweet Cravings', 'Salty Cravings', 'Constipation'],
    },
    {
      title: 'Emotional & Sleep',
      icon: Sparkles,
      items: ['Mood Swings', 'Anxiety', 'Insomnia', 'High Sensitivity', 'Calm & Grounded'],
    },
  ];

  const quickTags = [
    '#PeppermintTea',
    '#WarmCompress',
    '#YogaSession',
    '#Magnesium',
    '#Ibuprofen',
    '#Hydrated2L',
    '#LightWalk',
  ];

  const toggleSymptom = (sym: string) => {
    const key = sym.toLowerCase();
    if (selectedSymptoms[key]) {
      const copy = { ...selectedSymptoms };
      delete copy[key];
      setSelectedSymptoms(copy);
    } else {
      setSelectedSymptoms({ ...selectedSymptoms, [key]: 'moderate' });
    }
  };

  const setSymptomSeverity = (sym: string, severity: 'mild' | 'moderate' | 'severe') => {
    const key = sym.toLowerCase();
    setSelectedSymptoms({ ...selectedSymptoms, [key]: severity });
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveSymptom = () => {
    const symptomKeys = Object.keys(selectedSymptoms);
    addSymptomLog({
      date: selectedDate,
      symptoms: symptomKeys,
      mood: moodLevel,
      notes: `${symptomNotes} ${selectedTags.length > 0 ? `[Tags: ${selectedTags.join(', ')}]` : ''}`.trim(),
    });
    setSymptomSavedSuccess(true);
    setTimeout(() => setSymptomSavedSuccess(false), 2200);
  };

  const handleSavePeriod = () => {
    addCycleLog({
      startDate: selectedDate,
      flowLevel: periodFlow,
      notes: `${periodNotes} ${bbtTemp ? `[BBT: ${bbtTemp}°F]` : ''}`.trim(),
    });
    setPeriodNotes('');
    setPeriodSavedSuccess(true);
    setTimeout(() => setPeriodSavedSuccess(false), 2200);
  };

  const generateWeekDays = () => {
    const today = new Date();
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const isToday = i === 0;
      days.push({ iso, dayName, dayNum, isToday });
    }
    return days;
  };

  const weekDays = generateWeekDays();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Date Selector Strip */}
      <View style={styles.card}>
        <View style={styles.dateHeader}>
          <View style={styles.rowAlign}>
            <Calendar size={16} color="#E11D48" />
            <Text style={styles.dateTitleText}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.weekGrid}>
          {weekDays.map((day) => {
            const isSelected = selectedDate === day.iso;
            return (
              <TouchableOpacity
                key={day.iso}
                onPress={() => setSelectedDate(day.iso)}
                style={[
                  styles.dayBtn,
                  isSelected && styles.dayBtnSelected,
                ]}
              >
                <Text style={[styles.dayName, isSelected && styles.textWhite]}>
                  {day.dayName}
                </Text>
                <Text style={[styles.dayNum, isSelected && styles.textWhite]}>
                  {day.dayNum}
                </Text>
                {day.isToday && (
                  <View
                    style={[
                      styles.dotToday,
                      isSelected ? { backgroundColor: '#FFFFFF' } : { backgroundColor: '#E11D48' },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* SubTab Switcher Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveSubTab('symptoms')}
          style={[styles.tabBtn, activeSubTab === 'symptoms' && styles.tabBtnActive]}
        >
          <HeartPulse size={14} color={activeSubTab === 'symptoms' ? '#E11D48' : '#57534E'} />
          <Text style={[styles.tabLabel, activeSubTab === 'symptoms' && styles.tabLabelActive]}>
            Symptoms
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab('period')}
          style={[styles.tabBtn, activeSubTab === 'period' && styles.tabBtnActive]}
        >
          <Flame size={14} color={activeSubTab === 'period' ? '#E11D48' : '#57534E'} />
          <Text style={[styles.tabLabel, activeSubTab === 'period' && styles.tabLabelActive]}>
            Period
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab('discharge')}
          style={[styles.tabBtn, activeSubTab === 'discharge' && styles.tabBtnActive]}
        >
          <Droplets size={14} color={activeSubTab === 'discharge' ? '#0D9488' : '#57534E'} />
          <Text style={[styles.tabLabel, activeSubTab === 'discharge' && styles.tabLabelActiveTeal]}>
            Fluid
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab('history')}
          style={[styles.tabBtn, activeSubTab === 'history' && styles.tabBtnActive]}
        >
          <CalendarDays size={14} color={activeSubTab === 'history' ? '#E11D48' : '#57534E'} />
          <Text style={[styles.tabLabel, activeSubTab === 'history' && styles.tabLabelActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Symptoms SubTab */}
      {activeSubTab === 'symptoms' && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.headingMain}>Daily Symptoms & Mood</Text>
              <Text style={styles.subText}>
                Log state for: <Text style={{ fontWeight: '700', color: '#1C1917' }}>{selectedDate}</Text>
              </Text>
            </View>
          </View>

          {/* Mood Spectrum */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>1. EMOTIONAL SPECTRUM</Text>
            <View style={styles.moodGrid}>
              {[
                { level: 0, label: 'Low', icon: Frown },
                { level: 1, label: 'Sensitive', icon: Frown },
                { level: 2, label: 'Balanced', icon: Meh },
                { level: 3, label: 'Energetic', icon: Smile },
                { level: 4, label: 'Radiant', icon: Sparkles },
              ].map((m) => {
                const isSelected = moodLevel === m.level;
                return (
                  <TouchableOpacity
                    key={m.level}
                    onPress={() => setMoodLevel(m.level)}
                    style={[styles.moodBtn, isSelected && styles.moodBtnSelected]}
                  >
                    <m.icon size={18} color={isSelected ? '#FFFFFF' : '#44403C'} />
                    <Text style={[styles.moodLabel, isSelected && styles.textWhite]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Energy Score */}
          <View style={styles.energyBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.energyTitle}>Vitality & Energy Score</Text>
              <Text style={styles.energyValue}>Level {energyLevel}/5</Text>
            </View>
            <View style={styles.energyBarRow}>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  onPress={() => setEnergyLevel(lvl)}
                  style={[
                    styles.energySegment,
                    lvl <= energyLevel ? { backgroundColor: '#F59E0B' } : { backgroundColor: '#E7E5E4' },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Physical Categories */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>2. PHYSICAL & COGNITIVE SYMPTOMS</Text>
            {symptomCategories.map((cat) => (
              <View key={cat.title} style={{ marginBottom: 12 }}>
                <View style={styles.catTitleRow}>
                  <cat.icon size={14} color="#E11D48" />
                  <Text style={styles.catTitle}>{cat.title}</Text>
                </View>

                <View style={styles.tagWrap}>
                  {cat.items.map((sym) => {
                    const key = sym.toLowerCase();
                    const isSelected = !!selectedSymptoms[key];

                    return (
                      <TouchableOpacity
                        key={sym}
                        onPress={() => toggleSymptom(sym)}
                        style={[styles.symChip, isSelected && styles.symChipSelected]}
                      >
                        {isSelected && <Check size={12} color="#BE123C" />}
                        <Text style={[styles.symChipText, isSelected && styles.symChipTextSelected]}>
                          {sym}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>3. SELF-CARE REMEDIES & TAGS</Text>
            <View style={styles.tagWrap}>
              {quickTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                  >
                    <Text style={[styles.tagPillText, isSelected && styles.tagPillTextSelected]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Journal Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>4. PERSONAL HEALTH JOURNAL</Text>
            <TextInput
              multiline
              numberOfLines={2}
              value={symptomNotes}
              onChangeText={setSymptomNotes}
              placeholder="e.g. Drank chamomile tea, cramp severity reduced by 50%..."
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity
            onPress={handleSaveSymptom}
            style={styles.saveBtn}
          >
            {symptomSavedSuccess ? (
              <View style={styles.rowAlign}>
                <CheckCircle2 size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Symptoms & Mood Saved!</Text>
              </View>
            ) : (
              <Text style={styles.saveBtnText}>Save Symptoms Log</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Period SubTab */}
      {activeSubTab === 'period' && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.headingMain}>Record Period Flow</Text>
              <Text style={styles.subText}>
                Bleeding & BBT for date: <Text style={{ fontWeight: '700', color: '#1C1917' }}>{selectedDate}</Text>
              </Text>
            </View>
            <Flame size={20} color="#E11D48" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>FLOW INTENSITY</Text>
            <View style={styles.grid2}>
              {[
                { id: 'spotting', label: 'Spotting', desc: 'Minimal droplets' },
                { id: 'light', label: 'Light', desc: '1-2 pads / tampons' },
                { id: 'medium', label: 'Medium', desc: 'Standard flow rate' },
                { id: 'heavy', label: 'Heavy', desc: 'Frequent pad changes' },
              ].map((f) => {
                const isSelected = periodFlow === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => setPeriodFlow(f.id as any)}
                    style={[styles.flowCard, isSelected && styles.flowCardSelected]}
                  >
                    <Text style={[styles.flowTitle, isSelected && styles.textWhite]}>{f.label}</Text>
                    <Text style={[styles.flowDesc, isSelected && { color: '#FFE4E6' }]}>{f.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.bbtBox}>
            <View>
              <Text style={styles.bbtTitle}>Basal Body Temp (BBT)</Text>
              <Text style={styles.bbtSub}>Track slight temperature rise post-ovulation</Text>
            </View>
            <View style={styles.rowAlign}>
              <TextInput
                value={bbtTemp}
                onChangeText={setBbtTemp}
                placeholder="98.4"
                style={styles.bbtInput}
              />
              <Text style={styles.bbtUnit}>°F</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>CYCLE NOTES</Text>
            <TextInput
              multiline
              numberOfLines={2}
              value={periodNotes}
              onChangeText={setPeriodNotes}
              placeholder="e.g. Day 1 heavy flow morning..."
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity onPress={handleSavePeriod} style={styles.saveBtn}>
            {periodSavedSuccess ? (
              <View style={styles.rowAlign}>
                <CheckCircle2 size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Period Log Saved!</Text>
              </View>
            ) : (
              <Text style={styles.saveBtnText}>Save Period Log Entry</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Discharge SubTab */}
      {activeSubTab === 'discharge' && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.headingMain}>Cervical Fluid & Ovulation</Text>
              <Text style={styles.subText}>
                Assess mucus consistency for fertile windows & wellness.
              </Text>
            </View>
            <Droplets size={20} color="#0D9488" />
          </View>

          <TouchableOpacity
            onPress={() => setIsDischargeModalOpen(true)}
            style={styles.analyzerBanner}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.analyzerTitle}>Clinical Fluid Assessment</Text>
              <Text style={styles.analyzerSub}>
                Analyse color, texture, and scent for instant medical insights.
              </Text>
            </View>
            <View style={styles.analyzerBtn}>
              <Stethoscope size={14} color="#0F766E" />
              <Text style={styles.analyzerBtnText}>Open Analyzer</Text>
            </View>
          </TouchableOpacity>

          <View style={{ marginTop: 16 }}>
            <Text style={styles.fieldLabel}>RECENT CERVICAL LOGS</Text>

            {dischargeLogs.length === 0 ? (
              <Text style={styles.emptyItalic}>
                No cervical fluid entries logged yet. Click "Open Analyzer" above.
              </Text>
            ) : (
              <View style={{ gap: 8 }}>
                {dischargeLogs.map((log) => (
                  <View key={log.id} style={styles.logCard}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.logDate}>{log.date}</Text>
                      <Text style={styles.badgeTeal}>{log.resultStatus}</Text>
                    </View>
                    <Text style={styles.logSub}>
                      {log.color} • {log.consistency} • {log.odor}
                    </Text>
                    <Text style={styles.logNote}>{log.resultMessage}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* History SubTab */}
      {activeSubTab === 'history' && (
        <View style={{ gap: 12 }}>
          <View style={styles.filterBar}>
            {(['all', 'period', 'symptoms', 'discharge'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setHistoryFilter(f)}
                style={[styles.filterBtn, historyFilter === f && styles.filterBtnActive]}
              >
                <Text
                  style={[
                    styles.filterText,
                    historyFilter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {(historyFilter === 'all' || historyFilter === 'period') && (
            <View style={styles.card}>
              <Text style={styles.historySectionTitle}>Period Logs ({cycleLogs.length})</Text>
              {cycleLogs.map((log) => (
                <View key={log.id} style={styles.historyRow}>
                  <View>
                    <Text style={styles.logDate}>{log.startDate}</Text>
                    <Text style={styles.logSub}>Flow: {log.flowLevel}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteCycleLog(log.id)}>
                    <Trash2 size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {(historyFilter === 'all' || historyFilter === 'symptoms') && (
            <View style={styles.card}>
              <Text style={styles.historySectionTitle}>Symptom Logs ({symptomLogs.length})</Text>
              {symptomLogs.map((log) => (
                <View key={log.id} style={styles.logCard}>
                  <Text style={styles.logDate}>{log.date}</Text>
                  <Text style={styles.logSub}>{log.symptoms.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    padding: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  dayBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
  },
  dayBtnSelected: {
    backgroundColor: '#E11D48',
  },
  dayName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A8A29E',
    textTransform: 'uppercase',
  },
  dayNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
    marginTop: 2,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  dotToday: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E7E5E4',
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#57534E',
  },
  tabLabelActive: {
    color: '#E11D48',
  },
  tabLabelActiveTeal: {
    color: '#0D9488',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
    paddingBottom: 10,
    marginBottom: 12,
  },
  headingMain: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2438',
  },
  subText: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 2,
  },
  formGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#78716C',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  moodGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  moodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    alignItems: 'center',
    gap: 4,
  },
  moodBtnSelected: {
    backgroundColor: '#E11D48',
    borderColor: '#BE123C',
  },
  moodLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#44403C',
  },
  energyBox: {
    padding: 12,
    backgroundColor: '#FAF7F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 14,
  },
  energyTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#44403C',
  },
  energyValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  energyBarRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  energySegment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  catTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  catTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#44403C',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  symChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  symChipSelected: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FECDD3',
  },
  symChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#44403C',
  },
  symChipTextSelected: {
    color: '#9F1239',
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  tagPillSelected: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57534E',
  },
  tagPillTextSelected: {
    color: '#78350F',
  },
  textInput: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    fontSize: 12,
    color: '#1C1917',
  },
  saveBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flowCard: {
    width: '48%',
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  flowCardSelected: {
    backgroundColor: '#E11D48',
    borderColor: '#BE123C',
  },
  flowTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  flowDesc: {
    fontSize: 10,
    color: '#78716C',
    marginTop: 2,
  },
  bbtBox: {
    padding: 12,
    backgroundColor: '#FAF7F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  bbtTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  bbtSub: {
    fontSize: 10,
    color: '#78716C',
  },
  bbtInput: {
    width: 60,
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6D3D1',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  bbtUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#57534E',
  },
  analyzerBanner: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#0D9488',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  analyzerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  analyzerSub: {
    fontSize: 11,
    color: '#CCFBF1',
    marginTop: 2,
  },
  analyzerBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  analyzerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  emptyItalic: {
    fontSize: 12,
    color: '#A8A29E',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  logCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 4,
  },
  logDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  badgeTeal: {
    backgroundColor: '#CCFBF1',
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  logSub: {
    fontSize: 11,
    color: '#57534E',
  },
  logNote: {
    fontSize: 11,
    color: '#78716C',
    fontStyle: 'italic',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#E7E5E4',
    borderRadius: 12,
    padding: 2,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57534E',
  },
  filterTextActive: {
    color: '#1C1917',
    fontWeight: '700',
  },
  historySectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FAF7F2',
    marginBottom: 6,
  },
});
