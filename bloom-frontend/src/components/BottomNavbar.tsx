import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import {
  Home,
  CalendarDays,
  Users,
  BookOpen,
  Plus,
  X,
  HeartPulse,
  Flame,
  Droplets,
  MessageSquare,
  Sparkles,
} from 'lucide-react-native';
import { useBloomStore } from '../store/useBloomStore';

export const BottomNavbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsDischargeModalOpen,
    setIsNewPostModalOpen,
  } = useBloomStore();

  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  return (
    <>
      {/* Floating Quick Actions Menu */}
      <Modal
        visible={isPlusMenuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPlusMenuOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsPlusMenuOpen(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <View style={styles.menuTitleRow}>
                <Sparkles size={14} color="#E11D48" />
                <Text style={styles.menuTitle}>QUICK WELLNESS ACTIONS</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsPlusMenuOpen(false)}
                style={styles.closeBtn}
              >
                <X size={18} color="#78716C" />
              </TouchableOpacity>
            </View>

            <View style={styles.gridContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setActiveTab('track');
                  setIsPlusMenuOpen(false);
                }}
                style={styles.gridCard}
              >
                <View style={[styles.cardIcon, { backgroundColor: '#FFE4E6' }]}>
                  <HeartPulse size={18} color="#E11D48" />
                </View>
                <Text style={styles.cardTitle}>Symptoms & Mood</Text>
                <Text style={styles.cardSub}>Log daily feelings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setActiveTab('track');
                  setIsPlusMenuOpen(false);
                }}
                style={styles.gridCard}
              >
                <View style={[styles.cardIcon, { backgroundColor: '#FFF1F2' }]}>
                  <Flame size={18} color="#F43F5E" />
                </View>
                <Text style={styles.cardTitle}>Period Entry</Text>
                <Text style={styles.cardSub}>Record flow & date</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setIsDischargeModalOpen(true);
                  setIsPlusMenuOpen(false);
                }}
                style={styles.gridCard}
              >
                <View style={[styles.cardIcon, { backgroundColor: '#CCFBF1' }]}>
                  <Droplets size={18} color="#0D9488" />
                </View>
                <Text style={styles.cardTitle}>Fluid Analyzer</Text>
                <Text style={styles.cardSub}>Cervical assessment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setIsNewPostModalOpen(true);
                  setIsPlusMenuOpen(false);
                }}
                style={styles.gridCard}
              >
                <View style={[styles.cardIcon, { backgroundColor: '#F3E8FF' }]}>
                  <MessageSquare size={18} color="#9333EA" />
                </View>
                <Text style={styles.cardTitle}>Ask Community</Text>
                <Text style={styles.cardSub}>Post a thread</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Main Bottom Bar */}
      <View style={styles.navBar}>
        <View style={styles.navInner}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setActiveTab('home');
              setIsPlusMenuOpen(false);
            }}
            style={styles.navItem}
          >
            <Home size={22} color={activeTab === 'home' ? '#E11D48' : '#A8A29E'} />
            <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
              Home
            </Text>
            {activeTab === 'home' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setActiveTab('track');
              setIsPlusMenuOpen(false);
            }}
            style={styles.navItem}
          >
            <CalendarDays size={22} color={activeTab === 'track' ? '#E11D48' : '#A8A29E'} />
            <Text style={[styles.navLabel, activeTab === 'track' && styles.navLabelActive]}>
              Track
            </Text>
            {activeTab === 'track' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          {/* Center Floating Plus Button */}
          <View style={styles.plusWrapper}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
              style={[styles.plusButton, isPlusMenuOpen && styles.plusButtonOpen]}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setActiveTab('community');
              setIsPlusMenuOpen(false);
            }}
            style={styles.navItem}
          >
            <Users size={22} color={activeTab === 'community' ? '#E11D48' : '#A8A29E'} />
            <Text style={[styles.navLabel, activeTab === 'community' && styles.navLabelActive]}>
              Community
            </Text>
            {activeTab === 'community' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setActiveTab('learn');
              setIsPlusMenuOpen(false);
            }}
            style={styles.navItem}
          >
            <BookOpen size={22} color={activeTab === 'learn' ? '#E11D48' : '#A8A29E'} />
            <Text style={[styles.navLabel, activeTab === 'learn' && styles.navLabelActive]}>
              Learn
            </Text>
            {activeTab === 'learn' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(231, 229, 228, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 40,
    boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.04)',
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
    position: 'relative',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A8A29E',
    marginTop: 3,
  },
  navLabelActive: {
    color: '#E11D48',
    fontWeight: '800',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E11D48',
  },
  plusWrapper: {
    top: -14,
  },
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px -3px rgba(225, 29, 72, 0.45)',
  },
  plusButtonOpen: {
    backgroundColor: '#1C1917',
    boxShadow: '0 8px 24px -3px rgba(28, 25, 23, 0.4)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.45)',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 96,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#F5F5F4',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
    paddingBottom: 10,
    marginBottom: 14,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78716C',
    letterSpacing: 0.8,
  },
  closeBtn: {
    padding: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FAF7F5',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  cardSub: {
    fontSize: 10,
    color: '#78716C',
    marginTop: 2,
  },
});

