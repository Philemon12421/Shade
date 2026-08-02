import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable, StyleSheet } from 'react-native';
import {
  X,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
} from 'lucide-react-native';
import { useBloomStore } from '../../store/useBloomStore';

export const DischargeModal: React.FC = () => {
  const {
    isDischargeModalOpen,
    setIsDischargeModalOpen,
    addDischargeLog,
  } = useBloomStore();

  const [color, setColor] = useState('Clear');
  const [consistency, setConsistency] = useState('Stretchy / Egg-white');
  const [odor, setOdor] = useState('Odorless');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  if (!isDischargeModalOpen) return null;

  const colorOptions = [
    { name: 'Clear', desc: 'Typical during ovulation window' },
    { name: 'Creamy / White', desc: 'Common early/late cycle' },
    { name: 'Pale Yellow / Green', desc: 'Possible sign of irritation or infection' },
    { name: 'Brown / Spotting', desc: 'Old blood, pre/post period' },
  ];

  const consistencyOptions = [
    { name: 'Stretchy / Egg-white', badge: 'Peak Fertile', desc: 'Slippery, extends between fingers' },
    { name: 'Lotion / Creamy', badge: 'Progesterone Phase', desc: 'Smooth, milk-like consistency' },
    { name: 'Watery / Thin', badge: 'High Estrogen', desc: 'Light, clear fluid' },
    { name: 'Thick Clumpy (Cottage)', badge: 'Yeast Warning', desc: 'Chalky or curdy texture' },
    { name: 'Sticky / Dry', badge: 'Low Fertility', desc: 'Pasty, non-elastic' },
  ];

  const odorOptions = [
    { name: 'Odorless', desc: 'Normal healthy flora' },
    { name: 'Mild Sour / Tangy', desc: 'Normal lactobacilli environment' },
    { name: 'Strong Fishy / Foul', desc: 'Bacterial imbalance indicator' },
  ];

  const toggleSymptom = (sym: string) => {
    if (associatedSymptoms.includes(sym)) {
      setAssociatedSymptoms(associatedSymptoms.filter((s) => s !== sym));
    } else {
      setAssociatedSymptoms([...associatedSymptoms, sym]);
    }
  };

  const analyzeDischarge = () => {
    const isFishy = odor.includes('Fishy') || odor.includes('Foul');
    const isGreenish = color.includes('Yellow') || color.includes('Green');
    const isClumpy = consistency.includes('Thick Clumpy');
    const hasItch = associatedSymptoms.includes('Itching / Burning');

    if (isFishy || isGreenish) {
      return {
        status: 'Medical Evaluation Advised' as const,
        bg: '#FFF1F2',
        borderColor: '#FECDD3',
        icon: AlertTriangle,
        iconColor: '#E11D48',
        title: 'Potential Bacterial Imbalance (BV / STI)',
        message:
          'Strong fishy odors, foul scents, or greenish fluid can signal Bacterial Vaginosis (BV) or Trichomoniasis. These respond well to standard prescription antibiotics.',
        tips: [
          'Avoid douching or scented soaps',
          'Wear loose, breathable cotton underwear',
          'Consult a gynecologist or telehealth clinic',
        ],
      };
    }

    if (isClumpy || hasItch) {
      return {
        status: 'Yeast Balance Warning' as const,
        bg: '#FEF3C7',
        borderColor: '#FDE68A',
        icon: Info,
        iconColor: '#D97706',
        title: 'Possible Candida / Yeast Overgrowth',
        message:
          'Thick cottage-cheese texture paired with vaginal itching or redness is a hallmark sign of a yeast imbalance. Often triggered by antibiotic use, stress, or hormonal shifts.',
        tips: [
          'Consider OTC antifungal treatments or oral probiotics',
          'Avoid tight synthetic clothing',
          'Reduce refined sugar intake temporarily',
        ],
      };
    }

    return {
      status: 'Healthy Cervical Fluid' as const,
      bg: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: ShieldCheck,
      iconColor: '#059669',
      title: 'Normal Hormonal Secretion',
      message:
        'Clear or white fluid with egg-white or lotion consistency is a healthy indicator of standard estrogen & progesterone production supporting your cycle.',
      tips: [
        'Maintain daily hydration (2+ Liters water)',
        'Track changes across your ovulation window',
        'Use breathable panty liners if necessary',
      ],
    };
  };

  const analysis = analyzeDischarge();

  const handleSave = () => {
    addDischargeLog({
      date: new Date().toISOString().split('T')[0],
      color,
      consistency,
      odor,
      resultStatus: analysis.status === 'Medical Evaluation Advised' ? 'See a Doctor' : analysis.status === 'Yeast Balance Warning' ? 'Worth Monitoring' : 'Likely Normal',
      resultMessage: analysis.message,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsDischargeModalOpen(false);
    }, 1200);
  };

  return (
    <Modal
      visible={isDischargeModalOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsDischargeModalOpen(false)}
    >
      <Pressable style={styles.overlay} onPress={() => setIsDischargeModalOpen(false)}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <ScrollView contentContainerStyle={{ gap: 16 }}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerTitleRow}>
                <Droplets size={20} color="#0D9488" />
                <Text style={styles.headerTitle}>Cervical Fluid Analyzer</Text>
              </View>
              <TouchableOpacity onPress={() => setIsDischargeModalOpen(false)}>
                <X size={20} color="#78716C" />
              </TouchableOpacity>
            </View>

            {/* 1. Color */}
            <View>
              <Text style={styles.fieldLabel}>1. FLUID COLOR & HUE</Text>
              <View style={{ gap: 6 }}>
                {colorOptions.map((c) => {
                  const isSelected = color === c.name;
                  return (
                    <TouchableOpacity
                      key={c.name}
                      onPress={() => setColor(c.name)}
                      style={[styles.optCard, isSelected && styles.optCardSelected]}
                    >
                      <Text style={[styles.optTitle, isSelected && styles.textWhite]}>{c.name}</Text>
                      <Text style={[styles.optDesc, isSelected && { color: '#CCFBF1' }]}>{c.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. Consistency */}
            <View>
              <Text style={styles.fieldLabel}>2. CONSISTENCY & TEXTURE</Text>
              <View style={{ gap: 6 }}>
                {consistencyOptions.map((cn) => {
                  const isSelected = consistency === cn.name;
                  return (
                    <TouchableOpacity
                      key={cn.name}
                      onPress={() => setConsistency(cn.name)}
                      style={[styles.optCardRow, isSelected && styles.optCardSelected]}
                    >
                      <View>
                        <Text style={[styles.optTitle, isSelected && styles.textWhite]}>{cn.name}</Text>
                        <Text style={[styles.optDesc, isSelected && { color: '#CCFBF1' }]}>{cn.desc}</Text>
                      </View>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cn.badge}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Odor */}
            <View>
              <Text style={styles.fieldLabel}>3. SCENT PROFILE</Text>
              <View style={{ gap: 6 }}>
                {odorOptions.map((o) => {
                  const isSelected = odor === o.name;
                  return (
                    <TouchableOpacity
                      key={o.name}
                      onPress={() => setOdor(o.name)}
                      style={[styles.optCard, isSelected && styles.optCardSelected]}
                    >
                      <Text style={[styles.optTitle, isSelected && styles.textWhite]}>{o.name}</Text>
                      <Text style={[styles.optDesc, isSelected && { color: '#CCFBF1' }]}>{o.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. Symptoms */}
            <View>
              <Text style={styles.fieldLabel}>4. ASSOCIATED SENSATIONS</Text>
              <View style={styles.tagWrap}>
                {['Itching / Burning', 'Pelvic Tightness', 'Redness', 'Painful Urination', 'None'].map((sym) => {
                  const isSelected = associatedSymptoms.includes(sym);
                  return (
                    <TouchableOpacity
                      key={sym}
                      onPress={() => toggleSymptom(sym)}
                      style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                    >
                      <Text style={[styles.tagPillText, isSelected && styles.tagPillTextSelected]}>{sym}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Analysis Box */}
            <View style={[styles.analysisCard, { backgroundColor: analysis.bg, borderColor: analysis.borderColor }]}>
              <View style={styles.rowBetween}>
                <Text style={styles.analysisTitle}>{analysis.title}</Text>
                <Text style={styles.analysisStatus}>{analysis.status}</Text>
              </View>
              <Text style={styles.analysisMsg}>{analysis.message}</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              {isSaved ? (
                <View style={styles.rowAlign}>
                  <CheckCircle2 size={16} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Saved to Health History!</Text>
                </View>
              ) : (
                <View style={styles.rowAlign}>
                  <Stethoscope size={16} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Save Cervical Log Entry</Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FAF7F2',
    borderRadius: 24,
    padding: 20,
    maxWidth: 480,
    width: '100%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E5E4',
    paddingBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#78716C',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  optCard: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  optCardRow: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optCardSelected: {
    backgroundColor: '#0D9488',
    borderColor: '#0F766E',
  },
  optTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  optDesc: {
    fontSize: 10,
    color: '#78716C',
    marginTop: 2,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0F766E',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  tagPillSelected: {
    backgroundColor: '#CCFBF1',
    borderColor: '#99F6E4',
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57534E',
  },
  tagPillTextSelected: {
    color: '#0F766E',
  },
  analysisCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analysisTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1C1917',
  },
  analysisStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
  },
  analysisMsg: {
    fontSize: 11,
    color: '#44403C',
    lineHeight: 16,
  },
  saveBtn: {
    backgroundColor: '#0D9488',
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
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
