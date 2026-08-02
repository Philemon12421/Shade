import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, StyleSheet } from 'react-native';
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Plus,
  Lock,
  Search,
} from 'lucide-react-native';
import { useBloomStore } from '../../store/useBloomStore';

export const CommunityTab: React.FC = () => {
  const {
    selectedChannel,
    setSelectedChannel,
    communityPosts,
    toggleUpvote,
    addComment,
    setIsNewPostModalOpen,
    userProfile,
  } = useBloomStore();

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const channels = [
    { id: 'general', label: 'General Lounge', desc: 'Lifestyle, wellness, daily chat' },
    { id: 'cramps', label: 'Cramps & Pain Relief', desc: 'Teas, heat pads, supplements' },
    { id: 'discharge', label: 'Cervical Fluid', desc: 'Ovulation & health signals' },
    { id: 'mental-health', label: 'Hormones & Mood', desc: 'PMS, anxiety, luteal phase' },
  ];

  const filteredPosts = communityPosts.filter((post) => {
    const matchesChannel = post.channel === selectedChannel;
    if (!matchesChannel) return false;
    if (!searchQuery.trim()) return true;
    return (
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    addComment(postId, text.trim());
    setCommentInputs({ ...commentInputs, [postId]: '' });
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Community Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerTopRow}>
          <View style={styles.safeBadge}>
            <Lock size={12} color="#D8B4FE" />
            <Text style={styles.safeBadgeText}>Safe Sisterhood Space</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsNewPostModalOpen(true)}
            style={styles.postBtn}
          >
            <Plus size={14} color="#3B0764" />
            <Text style={styles.postBtnText}>Post Question</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.bannerTitle}>Sisterhood Community Forum</Text>
        <Text style={styles.bannerSub}>
          Ask questions, share cycle experiences, or connect anonymously as "{userProfile.anonymousName}".
        </Text>
      </View>

      {/* Channel Switcher */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.channelRow}>
        {channels.map((ch) => {
          const isSelected = selectedChannel === ch.id;
          return (
            <TouchableOpacity
              key={ch.id}
              onPress={() => setSelectedChannel(ch.id)}
              style={[styles.channelChip, isSelected && styles.channelChipSelected]}
            >
              <Text style={[styles.channelChipText, isSelected && styles.textWhite]}>
                {ch.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search size={16} color="#A8A29E" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search threads..."
          style={styles.searchInput}
        />
      </View>

      {/* Feed List */}
      <View style={{ gap: 12 }}>
        {filteredPosts.length === 0 ? (
          <View style={styles.emptyCard}>
            <MessageSquare size={32} color="#D6D3D1" />
            <Text style={styles.emptyText}>No discussions found in this channel yet.</Text>
            <TouchableOpacity
              onPress={() => setIsNewPostModalOpen(true)}
              style={styles.btnPurple}
            >
              <Text style={styles.btnPurpleText}>Start the first thread</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsOpen = activeCommentsPostId === post.id;
            return (
              <View key={post.id} style={styles.postCard}>
                {/* Author Bar */}
                <View style={styles.authorRow}>
                  <View style={styles.authorLeft}>
                    <View style={styles.avatarCircle}>
                      {post.authorAvatar ? (
                        <Image source={{ uri: post.authorAvatar }} style={styles.avatarImg} />
                      ) : (
                        <Text style={styles.avatarInitials}>{getInitials(post.authorName)}</Text>
                      )}
                    </View>
                    <View>
                      <View style={styles.rowAlign}>
                        <Text style={styles.authorName}>{post.authorName}</Text>
                        {post.isAnonymous && (
                          <View style={styles.anonBadge}>
                            <Text style={styles.anonText}>Anonymous</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.timeText}>{post.createdAt}</Text>
                    </View>
                  </View>
                </View>

                {/* Content */}
                <Text style={styles.postContent}>{post.content}</Text>

                {/* Action Footer */}
                <View style={styles.postFooter}>
                  <TouchableOpacity
                    onPress={() => toggleUpvote(post.id)}
                    style={[styles.actionBtn, post.userUpvoted && styles.actionBtnActive]}
                  >
                    <ThumbsUp size={14} color={post.userUpvoted ? '#6B21A8' : '#57534E'} />
                    <Text style={[styles.actionBtnText, post.userUpvoted && { color: '#6B21A8' }]}>
                      {post.upvotes} Upvotes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setActiveCommentsPostId(isCommentsOpen ? null : post.id)
                    }
                    style={styles.actionBtn}
                  >
                    <MessageSquare size={14} color="#57534E" />
                    <Text style={styles.actionBtnText}>{post.commentCount} Comments</Text>
                  </TouchableOpacity>
                </View>

                {/* Comments Thread */}
                {isCommentsOpen && (
                  <View style={styles.commentsBox}>
                    <Text style={styles.commentsTitle}>REPLIES & EXPERIENCES</Text>

                    {(!post.comments || post.comments.length === 0) ? (
                      <Text style={styles.emptyItalic}>No comments yet. Be the first to reply!</Text>
                    ) : (
                      <View style={{ gap: 6 }}>
                        {post.comments.map((cm) => (
                          <View key={cm.id} style={styles.commentItem}>
                            <View style={styles.rowBetween}>
                              <Text style={styles.commentAuthor}>{cm.authorName}</Text>
                              <Text style={styles.timeText}>{cm.createdAt}</Text>
                            </View>
                            <Text style={styles.commentText}>{cm.content}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.replyRow}>
                      <TextInput
                        value={commentInputs[post.id] || ''}
                        onChangeText={(t) =>
                          setCommentInputs({ ...commentInputs, [post.id]: t })
                        }
                        placeholder="Write a supportive reply..."
                        style={styles.replyInput}
                      />
                      <TouchableOpacity
                        onPress={() => handleCommentSubmit(post.id)}
                        style={styles.sendBtn}
                      >
                        <Send size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })
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
    backgroundColor: '#4C1D95',
    gap: 8,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  safeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#581C87',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  safeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E9D5FF',
    textTransform: 'uppercase',
  },
  postBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B0764',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerSub: {
    fontSize: 11,
    color: '#E9D5FF',
    lineHeight: 16,
  },
  channelRow: {
    flexDirection: 'row',
    gap: 8,
  },
  channelChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  channelChipSelected: {
    backgroundColor: '#9333EA',
    borderColor: '#7E22CE',
  },
  channelChipText: {
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
  btnPurple: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  btnPurpleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  postCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    padding: 16,
    gap: 12,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7E22CE',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  anonBadge: {
    backgroundColor: '#F5F5F4',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  anonText: {
    fontSize: 9,
    color: '#78716C',
  },
  timeText: {
    fontSize: 10,
    color: '#A8A29E',
  },
  postContent: {
    fontSize: 12,
    color: '#292524',
    lineHeight: 18,
  },
  postFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    paddingTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  actionBtnActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#E9D5FF',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#57534E',
  },
  commentsBox: {
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  commentsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#581C87',
    letterSpacing: 0.8,
  },
  emptyItalic: {
    fontSize: 11,
    color: '#A8A29E',
    fontStyle: 'italic',
  },
  commentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    gap: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1917',
  },
  commentText: {
    fontSize: 11,
    color: '#44403C',
  },
  replyRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  sendBtn: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
