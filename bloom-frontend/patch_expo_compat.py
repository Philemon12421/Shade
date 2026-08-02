from pathlib import Path
import re
import json

root = Path('.')
files = [
    'src/App.tsx',
    'src/components/Header.tsx',
    'src/components/BottomNavbar.tsx',
    'src/components/SplashScreen.tsx',
    'src/components/modals/ProfileModal.tsx',
    'src/components/modals/NewPostModal.tsx',
    'src/components/modals/DischargeModal.tsx',
    'src/components/modals/ArticleModal.tsx',
    'src/components/tabs/HomeTab.tsx',
    'src/components/tabs/LearnTab.tsx',
    'src/components/tabs/TrackTab.tsx',
    'src/components/tabs/CommunityTab.tsx',
    'src/components/ui/CycleRing.tsx',
    'src/store/useBloomStore.ts',
]

rewrites = {
    'src/components/SplashScreen.tsx': '''import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Heart } from 'lucide-react-native';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    }, 1800);
    return () => clearTimeout(timer);
  }, [opacity]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}> 
      <View style={styles.container}>
        <View style={styles.logoBadge}>
          <Heart size={36} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Bloom</Text>
        <Text style={styles.subtitle}>Intelligent Cycle & Health Companion</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#E85D88',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#E85D88',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D2438',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  progressTrack: {
    width: 120,
    height: 4,
    backgroundColor: '#E7E5E4',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F472B6',
  },
});
''',
    'src/components/ui/CycleRing.tsx': '''import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Flame, Heart } from 'lucide-react-native';

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
  return (
    <View style={styles.wrapper}>
      <View style={styles.circlePlaceholder}>
        <Text style={styles.circleDay}>{daysUntilPeriod <= 0 ? 'Period Due' : `${daysUntilPeriod} Days`}</Text>
        <Text style={styles.circleLabel}>{daysUntilPeriod <= 0 ? 'Log period flow' : 'until next period'}</Text>
      </View>

      <View style={styles.badgeRow}>
        <Heart size={12} color="#E11D48" />
        <Text style={styles.badgeText}>{phaseLabel}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Day</Text>
          <Text style={styles.statValue}>{cycleDay}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Length</Text>
          <Text style={styles.statValue}>{cycleLength}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onLogClick}>
        <Flame size={14} color="#E11D48" />
        <Text style={styles.buttonText}>Log Symptoms or Flow</Text>
      </TouchableOpacity>

      <Text style={styles.nextText}>Next period: {nextPeriodDateStr}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  circlePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  circleDay: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D2438',
  },
  circleLabel: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: '#E11D48',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2438',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#2D2438',
    fontWeight: '700',
    fontSize: 12,
  },
  nextText: {
    color: '#6B7280',
    fontSize: 12,
  },
});
''',
}

for rel in files:
    path = root / rel
    if not path.exists():
        print('MISSING', rel)
        continue
    if rel in rewrites:
        path.write_text(rewrites[rel], encoding='utf-8')
        print('rewrote', rel)
        continue
    text = path.read_text(encoding='utf-8')
    # remove motion imports
    text = re.sub(r"import \{[^}]*\bAnimatePresence\b[^}]*\} from 'motion/react';\n", '', text)
    text = re.sub(r"import \{[^}]*\bmotion\b[^}]*\} from 'motion/react';\n", '', text)
    # update lucide imports
    text = re.sub(r"from 'lucide-react'", "from 'lucide-react-native'", text)
    # remove className attributes
    text = re.sub(r'className=\"[^\"]*\"', '', text)
    text = re.sub(r"className='[^']*'", '', text)
    text = re.sub(r'className=\{[^}]*\}', '', text)
    if rel == 'src/App.tsx':
        text = text.replace('<AnimatePresence mode="wait">\n          {renderActiveTab()}\n        </AnimatePresence>', '{renderActiveTab()}')
        text = text.replace('<AnimatePresence mode="wait">', '')
        text = text.replace('</AnimatePresence>', '')
    path.write_text(text, encoding='utf-8')
    print('patched', rel)

# Patch useBloomStore.ts
store_path = root / 'src/store/useBloomStore.ts'
if store_path.exists():
    text = store_path.read_text(encoding='utf-8')
    if 'const hasLocalStorage' not in text:
        text = text.replace('import { create } from \'zustand\';\n', 'import { create } from \'zustand\';\n\nconst hasLocalStorage = typeof window !== \"undefined\" && typeof window.localStorage !== \"undefined\";\n')
    text = re.sub(
        r'const STORAGE_KEYS = \{',
        'const STORAGE_KEYS = {',
        text,
    )
    # wrap initial fetches
    text = re.sub(
        r'const getStoredProfile = \(\): UserProfile => \{\n  try \{\n    const saved = localStorage.getItem\(STORAGE_KEYS.PROFILE\);\n    if \(saved\) return JSON\.parse\(saved\);\n  \} catch \(e\) \{\n    console\.error\(\'Failed to parse user profile\', e\);\n  \}\n  return \{',
        'const getStoredProfile = (): UserProfile => {\n  if (hasLocalStorage) {\n    try {\n      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);\n      if (saved) return JSON.parse(saved);\n    } catch (e) {\n      console.error(\'Failed to parse user profile\', e);\n    }\n  }\n  return {',
        text,
        flags=re.MULTILINE,
    )
    for key in ['CYCLE_LOGS', 'SYMPTOM_LOGS', 'DISCHARGE_LOGS', 'POSTS']:
        pattern = (
            r'const getStored' + key.title().replace('_', '') + r' = \(\): [A-Za-z<>\[\]]+ => \{\n  try \{\n    const saved = localStorage\.getItem\(STORAGE_KEYS\.' + key + r'\);\n    if \(saved\) return JSON\.parse\(saved\);\n  \} catch \(e\) \{\n    console\.error\(e\);\n  \}\n  return \['
        )
        repl = (
            'const getStored' + key.title().replace('_', '') + ' = (): ' + ('CommunityPost[]' if key == 'POSTS' else ('DischargeLog[]' if key == 'DISCHARGE_LOGS' else ('SymptomLog[]' if key == 'SYMPTOM_LOGS' else 'CycleLog[]'))) + ' => {\n  if (hasLocalStorage) {\n    try {\n      const saved = localStorage.getItem(STORAGE_KEYS.' + key + ');\n      if (saved) return JSON.parse(saved);\n    } catch (e) {\n      console.error(e);\n    }\n  }\n  return ['
        )
        text = re.sub(pattern, repl, text, flags=re.MULTILINE)
    # guard setItem calls
    text = re.sub(r'localStorage\.setItem\(([^)]+)\);', r'if (hasLocalStorage) { localStorage.setItem(\1); }', text)
    store_path.write_text(text, encoding='utf-8')
    print('patched useBloomStore.ts')

# update package manifest
pkg_path = root / 'package.json'
if pkg_path.exists():
    pkg_text = pkg_path.read_text(encoding='utf-8')
    pkg = json.loads(pkg_text)
    deps = pkg.get('dependencies', {})
    if 'lucide-react' in deps:
        deps.pop('lucide-react')
        deps['lucide-react-native'] = '^0.546.0'
    if 'react-native-svg' not in deps:
        deps['react-native-svg'] = '^14.0.0'
    pkg['dependencies'] = deps
    pkg_path.write_text(json.dumps(pkg, indent=2) + '\n', encoding='utf-8')
    print('updated package.json')

# ensure Expo config exists
app_json = root / 'app.json'
if not app_json.exists():
    app_json.write_text('''{
  "expo": {
    "name": "Bloom",
    "slug": "bloom-frontend",
    "version": "1.0.0",
    "sdkVersion": "54.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android", "web"],
    "assetBundlePatterns": ["**/*"],
    "jsEngine": "hermes"
  }
}
''', encoding='utf-8')
    print('created app.json')
