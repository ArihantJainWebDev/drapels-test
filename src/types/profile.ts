export interface UserProfile {
  uid?: string;
  displayName?: string;
  username?: string;
  email?: string;
  photoURL?: string;
  profilePic?: string;
  title?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  role?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
  joinedDate?: string;
  communityInterests?: string[];
  preferredCommunities?: string[];
  contributionAreas?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: 'dsa' | 'interview' | 'community' | 'learning';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LearningStats {
  dsa: {
    problemsSolved: number;
    hoursSpent: number;
    lastActive: Date;
  };
  interview: {
    sessionsCompleted: number;
    hoursSpent: number;
    lastSession: Date;
  };
  community: {
    posts: number;
    interactions: number;
    lastActivity: Date;
  };
}