import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Pressable, StyleSheet, Image } from 'react-native';
import { X, User, Check } from 'lucide-react-native';
import { useBloomStore } from '../../store/useBloomStore';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    userProfile,
    updateUserProfile,
    setAvatarUrl,
  } = useBloomStore();

  const [name, setName] = useState(userProfile.name);
  const [anonymousName, setAnonymousName] = useState(userProfile.anonymousName);
  const [avgCycleLength, setAvgCycleLength] = useState(userProfile.avgCycleLength);
  const [avgPeriodLength, setAvgPeriodLength] = useState(userProfile.avgPeriodLength);
  const [lastPeriodDate, setLastPeriodDate] = useState(userProfile.lastPeriodDate);
  const [isSaved, setIsSaved] = useState(false);

  if (!isProfileModalOpen) return null;

  const handleSave = () => {
    updateUserProfile({
      name,
      anonymousName,
      avgCycleLength: Number(avgCycleLength),
      avgPeriodLength: Number(avgPeriodLength),
      lastPeriodDate,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsProfileModalOpen(false);
    }, 1200);
  };

  const getInitials = (str: string) => {
    if (!str) return 'B';
    return str
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Modal
      visible={isProfileModalOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsProfileModalOpen(false)}
    >
      <Pressable style={styles.overlay} onPress={() => setIsProfileModalOpen(false)}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <User size={20} color="#E11D48" />
              <Text style={styles.headerTitle}>User Profile & Health</Text>
            </View>
            <TouchableOpacity onPress={() => setIsProfileModalOpen(false)}>
              <X size={20} color="#78716C" />
            </TouchableOpacity>
          </View>

          {/* Avatar View */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              {userProfile.avatarUrl ? (
                <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarText}>{getInitials(name)}</Text>
              )}
            </View>
          </View>

          {/* Inputs */}
          <View style={{ gap: 12 }}>
            <View>
              <Text style={styles.fieldLabel}>PUBLIC NAME</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>

            <View>
              <Text style={styles.fieldLabel}>ANONYMOUS FORUM HANDLE</Text>
              <TextInput
                value={anonymousName}
                onChangeText={setAnonymousName}
                style={styles.input}
              />
            </View>

            <View style={styles.defaultsBox}>
              <Text style={styles.defaultsTitle}>Cycle Calculation Defaults</Text>
              <View style={styles.grid3}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.smallLabel}>Avg Cycle Days</Text>
                  <TextInput
                    value={String(avgCycleLength)}
                    onChangeText={(t) => setAvgCycleLength(Number(t) || 28)}
                    keyboardType="numeric"
                    style={styles.smallInput}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.smallLabel}>Avg Flow Days</Text>
                  <TextInput
                    value={String(avgPeriodLength)}
                    onChangeText={(t) => setAvgPeriodLength(Number(t) || 5)}
                    keyboardType="numeric"
                    style={styles.smallInput}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.smallLabel}>Last Period Date</Text>
                  <TextInput
                    value={lastPeriodDate}
                    onChangeText={setLastPeriodDate}
                    placeholder="YYYY-MM-DD"
                    style={styles.smallInput}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              {isSaved ? (
                <View style={styles.rowAlign}>
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Profile Saved!</Text>
                </View>
              ) : (
                <Text style={styles.saveBtnText}>Save Parameters</Text>
              )}
            </TouchableOpacity>
          </View>
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
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E5E4',
    paddingBottom: 12,
    marginBottom: 16,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E11D48',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#78716C',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    fontSize: 12,
    color: '#1C1917',
  },
  defaultsBox: {
    padding: 12,
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    gap: 8,
  },
  defaultsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9F1239',
  },
  grid3: {
    flexDirection: 'row',
    gap: 8,
  },
  smallLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#57534E',
    marginBottom: 2,
  },
  smallInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    fontSize: 11,
    color: '#1C1917',
  },
  saveBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
