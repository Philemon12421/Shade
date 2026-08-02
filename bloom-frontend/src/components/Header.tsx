import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Heart, Sparkles } from 'lucide-react-native';
import { useBloomStore } from '../store/useBloomStore';

export const Header: React.FC = () => {
  const { userProfile, setIsProfileModalOpen } = useBloomStore();

  const getInitials = (name: string) => {
    if (!name) return 'B';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {/* App Title & Logo */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Heart size={18} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitle}>Bloom</Text>
              <View style={styles.proBadge}>
                <Sparkles size={9} color="#BE123C" />
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>Cycle & Women's Health</Text>
          </View>
        </View>

        {/* Profile Avatar Trigger Button */}
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => setIsProfileModalOpen(true)}
          style={styles.profileButton}
        >
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              {userProfile.avatarUrl ? (
                <Image
                  source={{ uri: userProfile.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {getInitials(userProfile.name)}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.profileTextWrapper}>
            <Text style={styles.profileName} numberOfLines={1}>
              {userProfile.name}
            </Text>
            <Text style={styles.profileSub}>Profile & Settings</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(231, 229, 228, 0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    zIndex: 40,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px -3px rgba(225, 29, 72, 0.35)',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.3,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#BE123C',
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  avatarRing: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FB7185',
    padding: 2,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
  },
  profileTextWrapper: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
    maxWidth: 100,
  },
  profileSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#A8A29E',
  },
});

