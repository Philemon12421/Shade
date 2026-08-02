import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Flame, Sparkles, Heart } from 'lucide-react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CycleRingProps {
  cycleDay: number;
  cycleLength: number;
  phaseLabel: string;
  daysUntilPeriod: number;
  nextPeriodDateStr: string;
  onLogClick?: () => void;
}

export const CycleRing: React.FC<CycleRingProps> = ({
  cycleDay,
  cycleLength,
  phaseLabel,
  daysUntilPeriod,
  nextPeriodDateStr,
  onLogClick,
}) => {
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(cycleDay / (cycleLength || 28), 0), 1);
  const strokeDashoffset = circumference - progress * circumference;

  // Determine active phase color accent
  const getPhaseGradient = () => {
    switch (phaseLabel) {
      case 'Menstrual':
        return '#E11D48';
      case 'Ovulatory':
        return '#9333EA';
      case 'Luteal':
        return '#D97706';
      default:
        return '#E11D48';
    }
  };

  const activeColor = getPhaseGradient();

  return (
    <View style={styles.wrapper}>
      {/* Dynamic SVG Circular Ring Container */}
      <View style={styles.circleContainer}>
        <Svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: [{ rotate: '-90deg' }] }}>
          <Defs>
            <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F43F5E" />
              <Stop offset="50%" stopColor="#FB7185" />
              <Stop offset="100%" stopColor="#E11D48" />
            </LinearGradient>
          </Defs>
          {/* Background Ring Track */}
          <Circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#F5F3F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Cycle Progress Arc */}
          <Circle
            cx="110"
            cy="110"
            r={radius}
            stroke="url(#ringGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>

        {/* Center Content Inside Ring */}
        <View style={styles.ringCenterContent}>
          <View style={[styles.phaseTag, { backgroundColor: 'rgba(225, 29, 72, 0.08)' }]}>
            <Heart size={11} color={activeColor} fill={activeColor} />
            <Text style={[styles.phaseTagText, { color: activeColor }]}>{phaseLabel}</Text>
          </View>

          <Text style={styles.centerNumber}>
            {daysUntilPeriod <= 0 ? 'Period Due' : `${daysUntilPeriod}`}
          </Text>
          
          <Text style={styles.centerLabel}>
            {daysUntilPeriod <= 0 ? 'Log flow today' : daysUntilPeriod === 1 ? 'day until period' : 'days until period'}
          </Text>

          <View style={styles.dayProgressPill}>
            <Text style={styles.dayProgressText}>Day {cycleDay} of {cycleLength}</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>CYCLE DAY</Text>
          <Text style={styles.statValue}>{cycleDay}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>AVG LENGTH</Text>
          <Text style={styles.statValue}>{cycleLength}d</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>NEXT PERIOD</Text>
          <Text style={styles.statValueSmall}>{nextPeriodDateStr}</Text>
        </View>
      </View>

      {/* Primary Log Button */}
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.actionBtn}
        onPress={onLogClick}
      >
        <Flame size={16} color="#FFFFFF" />
        <Text style={styles.actionBtnText}>Log Symptoms or Period Flow</Text>
        <Sparkles size={14} color="#FFE4E6" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231, 229, 228, 0.8)',
    boxShadow: '0 12px 30px -10px rgba(225, 29, 72, 0.08)',
  },
  circleContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  ringCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  phaseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 4,
  },
  phaseTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  centerNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.5,
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
    textAlign: 'center',
  },
  dayProgressPill: {
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  dayProgressText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#57534E',
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FAF7F5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5F5F4',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E7E5E4',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A8A29E',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  statValueSmall: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E11D48',
  },
  actionBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E11D48',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    boxShadow: '0 8px 20px -4px rgba(225, 29, 72, 0.4)',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
});

