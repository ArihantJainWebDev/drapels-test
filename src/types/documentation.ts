export interface LearningPath {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  prerequisites: string[];
  topics: LearningTopic[];
  completionRate?: number;
  userProgress?: UserProgress;
}

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  content: string;
  codeExamples?: CodeExample[];
  exercises?: Exercise[];
  resources?: Resource[];
  completed?: boolean;
  order: number;
}

export interface CodeExample {
  id: string;
  title: string;
  code: string;
  language: string;
  explanation: string;
  runnable?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solution?: string;
  hints?: string[];
  testCases?: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'documentation' | 'tutorial' | 'book';
  url: string;
  description?: string;
  duration?: number;
}

export interface UserProgress {
  pathId: string;
  completedTopics: string[];
  currentTopic?: string;
  startedAt: Date;
  lastAccessedAt: Date;
  totalTimeSpent: number;
  completionPercentage: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: Date;
  type: 'completion' | 'streak' | 'speed' | 'mastery';
}

export interface DocumentationFilter {
  languages: string[];
  difficulties: string[];
  topics: string[];
  types: string[];
  searchQuery: string;
}

export interface DocumentationStats {
  totalPaths: number;
  totalTopics: number;
  completedPaths: number;
  completedTopics: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
}