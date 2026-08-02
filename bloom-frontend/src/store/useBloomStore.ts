import { create } from 'zustand';

const hasLocalStorage = typeof window !== "undefined" && typeof window.localStorage !== "undefined";
import {
  UserProfile,
  CycleLog,
  SymptomLog,
  DischargeLog,
  CommunityPost,
} from '../types';

interface BloomState {
  // Navigation & UI state
  activeTab: 'home' | 'track' | 'community' | 'learn';
  setActiveTab: (tab: 'home' | 'track' | 'community' | 'learn') => void;

  // Modals state
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (isOpen: boolean) => void;
  isDischargeModalOpen: boolean;
  setIsDischargeModalOpen: (isOpen: boolean) => void;
  isNewPostModalOpen: boolean;
  setIsNewPostModalOpen: (isOpen: boolean) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;

  // User Profile Data
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setAvatarUrl: (url: string | null) => void;

  // Cycle Logs
  cycleLogs: CycleLog[];
  addCycleLog: (log: Omit<CycleLog, 'id'>) => void;
  deleteCycleLog: (id: string) => void;

  // Symptom Logs
  symptomLogs: SymptomLog[];
  addSymptomLog: (log: Omit<SymptomLog, 'id'>) => void;

  // Cervical Discharge Logs
  dischargeLogs: DischargeLog[];
  addDischargeLog: (log: Omit<DischargeLog, 'id'>) => void;

  // Community Posts
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  communityPosts: CommunityPost[];
  addPost: (channel: string, content: string, isAnonymous: boolean) => void;
  toggleUpvote: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
}

const STORAGE_KEYS = {
  PROFILE: 'bloom_user_profile_v2',
  CYCLE_LOGS: 'bloom_cycle_logs_v2',
  SYMPTOM_LOGS: 'bloom_symptom_logs_v2',
  DISCHARGE_LOGS: 'bloom_discharge_logs_v2',
  POSTS: 'bloom_posts_v2',
};

// Initial default state helpers
const getStoredProfile = (): UserProfile => {
  if (hasLocalStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse user profile', e);
    }
  }
  return {
    name: 'Sophia Miller',
    anonymousName: 'VelvetLotus88',
    avatarUrl: null,
    avgCycleLength: 28,
    avgPeriodLength: 5,
    lastPeriodDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0], // 14 days ago
  };
};

const getStoredCycleLogs = (): CycleLog[] => {
  if (hasLocalStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CYCLE_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    {
      id: 'c-1',
      startDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
      flowLevel: 'medium',
      notes: 'Normal flow, mild cramping on day 2.',
    },
    {
      id: 'c-0',
      startDate: new Date(Date.now() - 42 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() - 37 * 86400000).toISOString().split('T')[0],
      flowLevel: 'heavy',
      notes: 'Heavy flow on day 1 and 2.',
    },
  ];
};

const getStoredSymptomLogs = (): SymptomLog[] => {
  if (hasLocalStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYMPTOM_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    {
      id: 's-1',
      date: new Date().toISOString().split('T')[0],
      symptoms: ['cramps', 'fatigue'],
      mood: 3,
      notes: 'Slight energy dip in afternoon, drank ginger tea.',
    },
  ];
};

const getStoredDischargeLogs = (): DischargeLog[] => {
  if (hasLocalStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DISCHARGE_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    {
      id: 'd-1',
      date: new Date().toISOString().split('T')[0],
      color: 'Clear',
      consistency: 'Stretchy / Egg-white',
      odor: 'Odorless',
      resultStatus: 'Likely Normal',
      resultMessage: 'High estrogen signal during peak fertility window.',
    },
  ];
};

const getStoredPosts = (): CommunityPost[] => {
  if (hasLocalStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    {
      id: 'p-1',
      channel: 'general',
      authorName: 'Aria Rose',
      authorAvatar: null,
      isAnonymous: false,
      content:
        'Does anyone else experience high creative focus during the late follicular phase? I always feel so energised around day 10!',
      createdAt: '2 hours ago',
      upvotes: 14,
      userUpvoted: false,
      commentCount: 2,
      comments: [
        {
          id: 'cm-1',
          authorName: 'VelvetLotus88',
          content: 'Yes! Estrogen is rising which sharpens mental focus and energy.',
          createdAt: '1 hour ago',
        },
        {
          id: 'cm-2',
          authorName: 'Elena G',
          content: 'Same here, I plan all my big projects during this week!',
          createdAt: '30 mins ago',
        },
      ],
    },
    {
      id: 'p-2',
      channel: 'cramps',
      authorName: 'VelvetLotus88',
      authorAvatar: null,
      isAnonymous: true,
      content:
        'What is your go-to non-medication remedy for day 1 lower back cramps? Heat pads help but looking for tea recommendations!',
      createdAt: '5 hours ago',
      upvotes: 22,
      userUpvoted: true,
      commentCount: 1,
      comments: [
        {
          id: 'cm-3',
          authorName: 'Maya K.',
          content: 'Warm ginger and chamomile tea with a pinch of cinnamon works wonders!',
          createdAt: '3 hours ago',
        },
      ],
    },
  ];
};

export const useBloomStore = create<BloomState>((set, get) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  isProfileModalOpen: false,
  setIsProfileModalOpen: (isOpen) => set({ isProfileModalOpen: isOpen }),
  isDischargeModalOpen: false,
  setIsDischargeModalOpen: (isOpen) => set({ isDischargeModalOpen: isOpen }),
  isNewPostModalOpen: false,
  setIsNewPostModalOpen: (isOpen) => set({ isNewPostModalOpen: isOpen }),
  selectedArticleId: null,
  setSelectedArticleId: (id) => set({ selectedArticleId: id }),

  userProfile: getStoredProfile(),
  updateUserProfile: (profile) =>
    set((state) => {
      const updated = { ...state.userProfile, ...profile };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return { userProfile: updated };
    }),

  setAvatarUrl: (url) =>
    set((state) => {
      const updated = { ...state.userProfile, avatarUrl: url };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return { userProfile: updated };
    }),

  cycleLogs: getStoredCycleLogs(),
  addCycleLog: (log) =>
    set((state) => {
      const newLog: CycleLog = { ...log, id: `c-${Date.now()}` };
      const updated = [newLog, ...state.cycleLogs];
      localStorage.setItem(STORAGE_KEYS.CYCLE_LOGS, JSON.stringify(updated));
      const updatedProfile = { ...state.userProfile, lastPeriodDate: log.startDate };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
      return { cycleLogs: updated, userProfile: updatedProfile };
    }),
  deleteCycleLog: (id) =>
    set((state) => {
      const updated = state.cycleLogs.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CYCLE_LOGS, JSON.stringify(updated));
      return { cycleLogs: updated };
    }),

  symptomLogs: getStoredSymptomLogs(),
  addSymptomLog: (log) =>
    set((state) => {
      const existingIdx = state.symptomLogs.findIndex((s) => s.date === log.date);
      let updated: SymptomLog[];
      if (existingIdx >= 0) {
        updated = [...state.symptomLogs];
        updated[existingIdx] = { ...log, id: state.symptomLogs[existingIdx].id };
      } else {
        updated = [{ ...log, id: `s-${Date.now()}` }, ...state.symptomLogs];
      }
      localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(updated));
      return { symptomLogs: updated };
    }),

  dischargeLogs: getStoredDischargeLogs(),
  addDischargeLog: (log) =>
    set((state) => {
      const newLog: DischargeLog = { ...log, id: `d-${Date.now()}` };
      const updated = [newLog, ...state.dischargeLogs];
      localStorage.setItem(STORAGE_KEYS.DISCHARGE_LOGS, JSON.stringify(updated));
      return { dischargeLogs: updated };
    }),

  selectedChannel: 'general',
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),

  communityPosts: getStoredPosts(),
  addPost: (channel, content, isAnonymous) =>
    set((state) => {
      const user = state.userProfile;
      const newPost: CommunityPost = {
        id: `p-${Date.now()}`,
        channel,
        authorName: isAnonymous ? user.anonymousName : user.name,
        authorAvatar: isAnonymous ? null : user.avatarUrl,
        isAnonymous,
        content,
        createdAt: 'Just now',
        upvotes: 1,
        userUpvoted: true,
        commentCount: 0,
        comments: [],
      };
      const updated = [newPost, ...state.communityPosts];
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
      return { communityPosts: updated };
    }),

  toggleUpvote: (postId) =>
    set((state) => {
      const updated = state.communityPosts.map((p) => {
        if (p.id === postId) {
          const isUpvoted = p.userUpvoted;
          return {
            ...p,
            userUpvoted: !isUpvoted,
            upvotes: isUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
      return { communityPosts: updated };
    }),

  addComment: (postId, content) =>
    set((state) => {
      const user = state.userProfile;
      const updated = state.communityPosts.map((p) => {
        if (p.id === postId) {
          const newCm = {
            id: `cm-${Date.now()}`,
            authorName: user.name,
            authorAvatar: user.avatarUrl,
            content,
            createdAt: 'Just now',
          };
          const comments = [...(p.comments || []), newCm];
          return {
            ...p,
            comments,
            commentCount: comments.length,
          };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
      return { communityPosts: updated };
    }),
}));
