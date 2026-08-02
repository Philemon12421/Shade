import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Pressable, StyleSheet } from 'react-native';
import { X, MessageSquare, Check } from 'lucide-react-native';
import { useBloomStore } from '../../store/useBloomStore';

export const NewPostModal: React.FC = () => {
  const {
    isNewPostModalOpen,
    setIsNewPostModalOpen,
    addPost,
    selectedChannel,
    userProfile,
  } = useBloomStore();

  const [channel, setChannel] = useState(selectedChannel || 'general');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isNewPostModalOpen) return null;

  const channels = [
    { id: 'general', label: 'General Lounge' },
    { id: 'cramps', label: 'Cramps & Relief' },
    { id: 'discharge', label: 'Cervical Fluid' },
    { id: 'mental-health', label: 'Hormones & Mood' },
  ];

  const handleSubmit = () => {
    if (!content.trim()) return;

    addPost(channel, content.trim(), isAnonymous);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setContent('');
      setIsNewPostModalOpen(false);
    }, 1000);
  };

  return (
    <Modal
      visible={isNewPostModalOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsNewPostModalOpen(false)}
    >
      <Pressable style={styles.overlay} onPress={() => setIsNewPostModalOpen(false)}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <MessageSquare size={20} color="#9333EA" />
              <Text style={styles.headerTitle}>Post to Sisterhood Community</Text>
            </View>
            <TouchableOpacity onPress={() => setIsNewPostModalOpen(false)}>
              <X size={20} color="#78716C" />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 14 }}>
            {/* Channel selection */}
            <View>
              <Text style={styles.fieldLabel}>SELECT DISCUSSION CHANNEL</Text>
              <View style={styles.tagWrap}>
                {channels.map((ch) => {
                  const isSelected = channel === ch.id;
                  return (
                    <TouchableOpacity
                      key={ch.id}
                      onPress={() => setChannel(ch.id)}
                      style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                    >
                      <Text style={[styles.tagPillText, isSelected && styles.textWhite]}>
                        {ch.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Content Input */}
            <View>
              <Text style={styles.fieldLabel}>QUESTION OR EXPERIENCE</Text>
              <TextInput
                multiline
                numberOfLines={4}
                value={content}
                onChangeText={setContent}
                placeholder="Ask about cramps, mood, supplements..."
                style={styles.textInput}
              />
            </View>

            {/* Anon Toggle */}
            <TouchableOpacity
              onPress={() => setIsAnonymous(!isAnonymous)}
              style={styles.anonCard}
            >
              <View>
                <Text style={styles.anonTitle}>Post Anonymously</Text>
                <Text style={styles.anonSub}>Display as "{userProfile.anonymousName}"</Text>
              </View>
              <View style={[styles.checkbox, isAnonymous && styles.checkboxActive]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
              {isSaved ? (
                <View style={styles.rowAlign}>
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>Posted to Forum!</Text>
                </View>
              ) : (
                <Text style={styles.submitBtnText}>Publish Post</Text>
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
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#78716C',
    letterSpacing: 0.8,
    marginBottom: 6,
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
    backgroundColor: '#9333EA',
    borderColor: '#7E22CE',
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57534E',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    fontSize: 12,
    color: '#1C1917',
    textAlignVertical: 'top',
  },
  anonCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  anonTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  anonSub: {
    fontSize: 10,
    color: '#78716C',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9333EA',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#9333EA',
  },
  submitBtn: {
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
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
