export interface UserProfile {
  name: string;
  anonymousName: string;
  avatarUrl: string | null;
  avgCycleLength: number; // e.g. 28
  avgPeriodLength: number; // e.g. 5
  lastPeriodDate: string; // YYYY-MM-DD
}

export interface CycleLog {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  flowLevel: 'light' | 'medium' | 'heavy' | 'spotting';
  notes?: string;
}

export interface SymptomLog {
  id: string;
  date: string; // YYYY-MM-DD
  symptoms: string[]; // ['cramps', 'fatigue', 'bloating', etc.]
  mood: number; // 0 (Low) to 4 (Radiant)
  notes?: string;
}

export interface DischargeLog {
  id: string;
  date: string;
  color: string;
  consistency: string;
  odor: string;
  resultStatus: 'Likely Normal' | 'Worth Monitoring' | 'See a Doctor';
  resultMessage: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  channel: string; // 'general' | 'cramps' | 'discharge' | 'mental-health'
  authorName: string;
  authorAvatar?: string | null;
  isAnonymous: boolean;
  content: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  commentCount: number;
  comments?: PostComment[];
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
  author: string;
  medicallyReviewed: boolean;
}
