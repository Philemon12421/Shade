import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import {
  BookOpen,
  Clock,
  ShieldCheck,
  Search,
  ArrowRight,
} from 'lucide-react-native';
import { useBloomStore } from '../../store/useBloomStore';
import { HEALTH_ARTICLES } from '../../data/articles';

export const LearnTab: React.FC = () => {
  const { setSelectedArticleId } = useBloomStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Cycle basics', 'Discharge', 'Pain relief', 'PCOS & Hormones'];

  const filteredArticles = HEALTH_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <View style={styles.badgeBanner}>
          <Text style={styles.badgeBannerText}>Evidence-Based Gynecological Knowledge</Text>
        </View>
        <Text style={styles.bannerTitle}>Medical Health Library</Text>
        <Text style={styles.bannerSub}>
          Explore clinically reviewed articles on cycle biology, hormonal balance, pain management, and reproductive wellness.
        </Text>
      </View>

      {/* Category Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.catChip, isSelected && styles.catChipSelected]}
            >
              <Text style={[styles.catChipText, isSelected && styles.textWhite]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Search size={16} color="#A8A29E" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search articles on cramps, progesterone, PCOS..."
          style={styles.searchInput}
        />
      </View>

      {/* Article Cards Grid */}
      <View style={{ gap: 12 }}>
        {filteredArticles.length === 0 ? (
          <View style={styles.emptyCard}>
            <BookOpen size={32} color="#D6D3D1" />
            <Text style={styles.emptyText}>No medical articles match your search criteria.</Text>
          </View>
        ) : (
          filteredArticles.map((art) => (
            <TouchableOpacity
              key={art.id}
              onPress={() => setSelectedArticleId(art.id)}
              style={styles.articleCard}
            >
              <View style={{ gap: 8 }}>
                <View style={styles.rowBetween}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{art.category}</Text>
                  </View>
                  <View style={styles.readTimeRow}>
                    <Clock size={12} color="#A8A29E" />
                    <Text style={styles.readTimeText}>{art.readTime}</Text>
                  </View>
                </View>

                <Text style={styles.artTitle}>{art.title}</Text>
                <Text style={styles.artSummary} numberOfLines={3}>{art.summary}</Text>
              </View>

              <View style={styles.artFooter}>
                <View style={styles.reviewedBadge}>
                  <ShieldCheck size={12} color="#047857" />
                  <Text style={styles.reviewedText}>Medically Reviewed</Text>
                </View>

                <View style={styles.readMoreRow}>
                  <Text style={styles.readMoreText}>Read Article</Text>
                  <ArrowRight size={14} color="#B45309" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 100,
    gap: 16,
  },
  banner: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#78350F',
    gap: 8,
  },
  badgeBanner: {
    backgroundColor: '#92400E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeBannerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FDE68A',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerSub: {
    fontSize: 11,
    color: '#FEF3C7',
    lineHeight: 16,
  },
  catRow: {
    flexDirection: 'row',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  catChipSelected: {
    backgroundColor: '#B45309',
    borderColor: '#92400E',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#44403C',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#1C1917',
    paddingVertical: 6,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 12,
    color: '#78716C',
  },
  articleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    padding: 16,
    justifyContent: 'space-between',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 10,
    color: '#A8A29E',
  },
  artTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  artSummary: {
    fontSize: 11,
    color: '#57534E',
    lineHeight: 16,
  },
  artFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
});
