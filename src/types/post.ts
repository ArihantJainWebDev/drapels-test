import { Timestamp } from 'firebase/firestore';

export interface SavedPost {
  id: string;
  authorId: string;
  content: string;
  images?: string[];
  videoUrl?: string;
  linkUrl?: string;
  tags?: string[];
  communityId?: string;
  communityName?: string;
  createdAt: Timestamp;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  likedBy: string[];
  savedBy: string[];
  isVerified?: boolean;
}

export interface PostSnapshot {
  docs: {
    id: string;
    data(): SavedPost;
  }[];
}
