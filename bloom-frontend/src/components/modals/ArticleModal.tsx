import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable, StyleSheet } from 'react-native';
import { X, Clock, ShieldCheck } from 'lucide-react-native';
import { useBloomStore } from '../../store/useBloomStore';
import { HEALTH_ARTICLES } from '../../data/articles';

export const ArticleModal: React.FC = () => {
  const { selectedArticleId, setSelectedArticleId } = useBloomStore();

  if (!selectedArticleId) return null;

  const article = HEALTH_ARTICLES.find((a) => a.id === selectedArticleId);
  if (!article) return null;

  return (
    <Modal
      visible={!!selectedArticleId}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setSelectedArticleId(null)}
    >
      <Pressable style={styles.overlay} onPress={() => setSelectedArticleId(null)}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <ScrollView contentContainerStyle={{ gap: 16 }}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.rowAlign}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{article.category}</Text>
                </View>
                <View style={styles.rowAlign}>
                  <Clock size={12} color="#A8A29E" />
                  <Text style={styles.readTimeText}>{article.readTime}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedArticleId(null)}>
                <X size={20} color="#78716C" />
              </TouchableOpacity>
            </View>

            {/* Title & Author */}
            <View style={{ gap: 6 }}>
              <Text style={styles.artTitle}>{article.title}</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.authorText}>{article.author}</Text>
                {article.medicallyReviewed && (
                  <View style={styles.reviewedBadge}>
                    <ShieldCheck size={12} color="#047857" />
                    <Text style={styles.reviewedText}>Medically Reviewed</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Summary Box */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>"{article.summary}"</Text>
            </View>

            {/* Content Body */}
            <Text style={styles.contentBody}>{article.content}</Text>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setSelectedArticleId(null)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeBtnText}>Close Article</Text>
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
    maxWidth: 520,
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
  catBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  readTimeText: {
    fontSize: 10,
    color: '#A8A29E',
  },
  artTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
  },
  authorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57534E',
  },
  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  reviewedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  summaryBox: {
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#78350F',
    lineHeight: 16,
  },
  contentBody: {
    fontSize: 12,
    color: '#292524',
    lineHeight: 20,
  },
  closeBtn: {
    backgroundColor: '#B45309',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
