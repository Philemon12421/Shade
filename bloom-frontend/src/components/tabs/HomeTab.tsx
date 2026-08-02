import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {
  Heart,
  Droplets,
  MessageSquare,
  ArrowRight,
  Zap,
  CheckCircle,
  Calendar,
  Activity,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import { useBloomStore } from '../../store/useBloomStore';
import { CycleRing } from '../ui/CycleRing';
import { HEALTH_ARTICLES } from '../../data/articles';

export const HomeTab: React.FC = () => {
  const {
    userProfile,
    symptomLogs,
    setActiveTab,
    setIsDischargeModalOpen,
    setIsNewPostModalOpen,
    setSelectedArticleId,
  } = useBloomStore();

  const calculateCycle = () => {
    const today = new Date();
    const lastDate = userProfile.lastPeriodDate
      ? new Date(userProfile.lastPeriodDate)
      : new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const cycleLength = userProfile.avgCycleLength || 28;
    const currentDay = ((diffDays - 1) % cycleLength) + 1;

    let phase = 'Follicular';
    let phaseDesc =
      'Rising estrogen boosts energy, focus, and collagen synthesis. Ideal window for high-impact activity and strategic work.';
    let fertileStatus = 'Low Fertility';

    if (currentDay <= userProfile.avgPeriodLength) {
      phase = 'Menstrual';
      phaseDesc =
        'Uterine lining shedding. Rest, stay warm, and consume iron-rich foods (dark leafy greens, lentils, cacao).';
      fertileStatus = 'Unlikely Fertile';
    } else if (currentDay >= 12 && currentDay <= 16) {
      phase = 'Ovulatory';
      phaseDesc =
        'Peak LH surge triggering ovulation. High energy, radiant skin, and peak fertility window.';
      fertileStatus = 'Peak Fertility';
    } else if (currentDay > 16) {
      phase = 'Luteal';
      phaseDesc =
        'Progesterone dominance. Prioritize steady sleep, complex carbohydrates, and gentle strength routines.';
      fertileStatus = 'Low Fertility';
    }

    const daysLeft = cycleLength - currentDay;

    const nextDateObj = new Date(lastDate);
    nextDateObj.setDate(nextDateObj.getDate() + cycleLength);
    const nextDateStr = nextDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const ovDateObj = new Date(lastDate);
    ovDateObj.setDate(ovDateObj.getDate() + 14);
    const ovDateStr = ovDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return {
      currentDay,
      cycleLength,
      phase,
      phaseDesc,
      daysLeft,
      nextDateStr,
      ovDateStr,
      fertileStatus,
    };
  };

  const cycleData = calculateCycle();
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySymptom = symptomLogs.find((s) => s.date === todayStr);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.greetingText}>Welcome back, {userProfile.name} ✨</Text>
            <Text style={styles.greetingSub}>Your personal cycle intelligence dashboard</Text>
          </View>
          <View style={styles.todayPill}>
            <Sparkles size={12} color="#E11D48" />
            <Text style={styles.todayPillText}>{cycleData.phase} Phase</Text>
          </View>
        </View>
      </View>

      {/* Live Cycle Dashboard Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.statusRow}>
            <View style={styles.dotPulse} />
            <Text style={styles.sectionHeading}>CYCLE STATUS OVERVIEW</Text>
          </View>

          <View style={styles.badgeNext}>
            <Text style={styles.badgeNextText}>Next Period: {cycleData.nextDateStr}</Text>
          </View>
        </View>

        <CycleRing
          cycleDay={cycleData.currentDay}
          cycleLength={cycleData.cycleLength}
          phaseLabel={cycleData.phase}
          daysUntilPeriod={cycleData.daysLeft}
          nextPeriodDateStr={cycleData.nextDateStr}
          onLogClick={() => setActiveTab('track')}
        />

        <View style={styles.grid2}>
          <View style={styles.gridBox}>
            <Text style={styles.boxLabel}>ESTIMATED OVULATION</Text>
            <View style={styles.boxValRow}>
              <Calendar size={16} color="#9333EA" />
              <Text style={styles.boxValText}>{cycleData.ovDateStr}</Text>
            </View>
            <Text style={styles.purpleSub}>{cycleData.fertileStatus}</Text>
          </View>

          <View style={styles.gridBox}>
            <Text style={styles.boxLabel}>AVERAGE CYCLE LENGTH</Text>
            <View style={styles.boxValRow}>
              <Activity size={16} color="#F43F5E" />
              <Text style={styles.boxValText}>{userProfile.avgCycleLength || 28} Days</Text>
            </View>
            <Text style={styles.boxSub}>Flow ~ {userProfile.avgPeriodLength || 5} days</Text>
          </View>
        </View>

        <View style={styles.strategyBox}>
          <View style={styles.strategyHeader}>
            <View style={styles.strategyTitleRow}>
              <Zap size={16} color="#D97706" />
              <Text style={styles.strategyTitle}>{cycleData.phase} Phase Strategy</Text>
            </View>
            <View style={styles.phaseBadge}>
              <Text style={styles.phaseBadgeText}>Day {cycleData.currentDay}</Text>
            </View>
          </View>
          <Text style={styles.strategyDesc}>{cycleData.phaseDesc}</Text>
        </View>
      </View>

      {/* Wellness Log Widget */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.symptomTitleRow}>
            <Heart size={16} color="#F43F5E" fill="#F43F5E" />
            <Text style={styles.cardTitle}>Today's Wellness Log</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('track')}
            style={styles.linkRow}
          >
            <Text style={styles.linkText}>
              {todaySymptom ? 'Update Entry' : 'Log Today'}
            </Text>
            <ArrowRight size={14} color="#E11D48" />
          </TouchableOpacity>
        </View>

        {todaySymptom ? (
          <View style={styles.loggedBox}>
            <CheckCircle size={20} color="#059669" />
            <View style={{ flex: 1 }}>
              <Text style={styles.loggedTitle}>
                Logged for Today ({todaySymptom.date})
              </Text>
              <View style={styles.chipRow}>
                {todaySymptom.symptoms.map((sym) => (
                  <View key={sym} style={styles.chip}>
                    <Text style={styles.chipText}>{sym}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyLoggedBox}>
            <Text style={styles.emptyText}>
              No mood or physical symptoms logged for today yet.
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setActiveTab('track')}
              style={styles.btnPrimary}
            >
              <Text style={styles.btnPrimaryText}>Log Symptoms</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quick Tools Grid */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeadingMargin}>HEALTH & CLINICAL TOOLS</Text>
        <View style={styles.grid2}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsDischargeModalOpen(true)}
            style={[styles.toolCard, { borderColor: '#A7F3D0' }]}
          >
            <View style={[styles.toolIcon, { backgroundColor: '#CCFBF1' }]}>
              <Droplets size={20} color="#0D9488" />
            </View>
            <Text style={styles.toolTitle}>Discharge Analyzer</Text>
            <Text style={styles.toolSub}>Assess fluid & fertility</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsNewPostModalOpen(true)}
            style={[styles.toolCard, { borderColor: '#E9D5FF' }]}
          >
            <View style={[styles.toolIcon, { backgroundColor: '#F3E8FF' }]}>
              <MessageSquare size={20} color="#9333EA" />
            </View>
            <Text style={styles.toolTitle}>Sisterhood Forum</Text>
            <Text style={styles.toolSub}>Post anonymous questions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recommended Medical Guides */}
      <View style={styles.sectionContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionHeading}>CLINICALLY REVIEWED GUIDES</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('learn')}
            style={styles.linkRow}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#D97706' }}>Explore All</Text>
            <ChevronRight size={14} color="#D97706" />
          </TouchableOpacity>
        </View>

        <View style={styles.grid2}>
          {HEALTH_ARTICLES.slice(0, 2).map((art) => (
            <TouchableOpacity
              key={art.id}
              activeOpacity={0.85}
              onPress={() => setSelectedArticleId(art.id)}
              style={styles.articleCard}
            >
              <View>
                <View style={styles.artBadgeRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{art.category}</Text>
                  </View>
                  <Text style={styles.readTimeText}>{art.readTime}</Text>
                </View>
                <Text style={styles.articleTitle} numberOfLines={1}>{art.title}</Text>
                <Text style={styles.articleSummary} numberOfLines={2}>{art.summary}</Text>
              </View>

              <View style={styles.articleFooter}>
                <View style={styles.reviewedRow}>
                  <ShieldCheck size={12} color="#047857" />
                  <Text style={styles.reviewedText}>Medically Reviewed</Text>
                </View>
                <View style={styles.readRow}>
                  <Text style={styles.readText}>Read</Text>
                  <ArrowRight size={12} color="#D97706" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 110,
    gap: 16,
  },
  welcomeBanner: {
    marginBottom: 4,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.3,
  },
  greetingSub: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 2,
  },
  todayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  todayPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(231, 229, 228, 0.8)',
    padding: 18,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11D48',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A8A29E',
    letterSpacing: 0.8,
  },
  sectionContainer: {
    marginTop: 4,
  },
  sectionHeadingMargin: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A8A29E',
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  badgeNext: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  badgeNextText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BE123C',
  },
  grid2: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  gridBox: {
    flex: 1,
    backgroundColor: '#FAF7F5',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  boxLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A8A29E',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  boxValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boxValText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1917',
  },
  purpleSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9333EA',
    marginTop: 4,
  },
  boxSub: {
    fontSize: 10,
    color: '#78716C',
    marginTop: 4,
  },
  strategyBox: {
    marginTop: 14,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  strategyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strategyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#78350F',
  },
  phaseBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  phaseBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  strategyDesc: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  symptomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1917',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },
  loggedBox: {
    padding: 14,
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  loggedTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    textTransform: 'capitalize',
  },
  emptyLoggedBox: {
    padding: 14,
    backgroundColor: '#FAF7F5',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyText: {
    fontSize: 12,
    color: '#78716C',
    flex: 1,
    marginRight: 10,
  },
  btnPrimary: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  toolCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1917',
  },
  toolSub: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 2,
  },
  articleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    justifyContent: 'space-between',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
  },
  artBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
  },
  readTimeText: {
    fontSize: 10,
    color: '#A8A29E',
  },
  articleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 4,
  },
  articleSummary: {
    fontSize: 11,
    color: '#78716C',
    lineHeight: 16,
  },
  articleFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
});

