// Practice Questions System Types

export interface PracticeQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'system-design' | 'case-studies' | 'coding';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  company?: string;
  role?: string;
  topic?: string;
  timeLimit?: number; // in minutes
  exampleAnswer?: string;
  tips?: string[];
  followUpQuestions?: string[];
  type: 'verbal' | 'written' | 'coding';
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  size: 'startup' | 'medium' | 'large' | 'enterprise';
}

export interface Role {
  id: string;
  title: string;
  level: 'entry' | 'mid' | 'senior' | 'staff' | 'principal';
  department: 'engineering' | 'product' | 'design' | 'data' | 'devops';
}

export interface PracticeSession {
  id: string;
  userId: string;
  questionId: string;
  question: PracticeQuestion;
  userResponse: string;
  audioRecording?: Blob;
  startTime: Date;
  endTime?: Date;
  timeSpent: number; // in seconds
  completed: boolean;
  score?: number;
  feedback?: string;
  
  // Performance Analysis
  performanceAnalysis?: any; // PerformanceAnalysis type from service
}

export interface PracticeFilters {
  companies: string[];
  roles: string[];
  categories: string[];
  difficulties: string[];
  topics: string[];
  questionTypes: ('verbal' | 'written' | 'coding')[];
}

export interface PracticeStats {
  totalQuestions: number;
  completedQuestions: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  categoriesProgress: Record<string, {
    completed: number;
    total: number;
    averageScore: number;
  }>;
  companiesProgress: Record<string, {
    completed: number;
    total: number;
    averageScore: number;
  }>;
}

export interface AudioRecordingState {
  isRecording: boolean;
  isSupported: boolean;
  error: string | null;
  duration: number;
  audioBlob: Blob | null;
}

export interface PracticeTimer {
  isActive: boolean;
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  isPaused: boolean;
}