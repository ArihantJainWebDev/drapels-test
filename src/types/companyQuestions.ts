// Company-Focused Question System Types

export interface CompanyQuestionTag {
  id: string;
  name: string;
  category: 'technical' | 'behavioral' | 'company-culture' | 'role-specific' | 'industry';
  description?: string;
}

export interface CompanyInterviewPattern {
  id: string;
  companyId: string;
  patternType: 'question-style' | 'difficulty-progression' | 'time-allocation' | 'focus-areas';
  description: string;
  frequency: number; // How often this pattern appears (0-1)
  examples: string[];
  metadata: Record<string, any>;
}

export interface CompanyQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'system-design' | 'case-studies' | 'coding' | 'company-specific';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  
  // Company and role targeting
  companyId: string;
  roleIds: string[];
  
  // Enhanced tagging system
  tags: CompanyQuestionTag[];
  primaryTag: string; // Main tag ID
  
  // Company-specific metadata
  companySpecific: {
    interviewRound: 'phone' | 'technical' | 'onsite' | 'final' | 'any';
    frequency: number; // How often this question is asked (0-1)
    successRate: number; // Average success rate for this question (0-1)
    averageTime: number; // Average time to answer in minutes
    followUpLikelihood: number; // Likelihood of follow-up questions (0-1)
  };
  
  // Question content
  type: 'verbal' | 'written' | 'coding' | 'whiteboard';
  timeLimit?: number; // in minutes
  exampleAnswer?: string;
  tips?: string[];
  followUpQuestions?: string[];
  
  // Analysis and feedback
  commonMistakes?: string[];
  evaluationCriteria?: string[];
  companyExpectations?: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  source?: string; // Where this question came from
  verified: boolean; // Whether this question has been verified
}

export interface CompanyQuestionDatabase {
  companyId: string;
  companyName: string;
  totalQuestions: number;
  questionsByCategory: Record<string, number>;
  questionsByDifficulty: Record<string, number>;
  questionsByRole: Record<string, number>;
  interviewPatterns: CompanyInterviewPattern[];
  lastUpdated: Date;
}

export interface QuestionFilter {
  companies?: string[];
  roles?: string[];
  categories?: string[];
  difficulties?: string[];
  tags?: string[];
  interviewRounds?: string[];
  questionTypes?: string[];
  timeRange?: {
    min?: number;
    max?: number;
  };
  frequencyThreshold?: number;
  verified?: boolean;
}

export interface QuestionSearchResult {
  questions: CompanyQuestion[];
  totalCount: number;
  facets: {
    companies: Array<{ id: string; name: string; count: number }>;
    roles: Array<{ id: string; name: string; count: number }>;
    categories: Array<{ name: string; count: number }>;
    difficulties: Array<{ name: string; count: number }>;
    tags: Array<{ id: string; name: string; count: number }>;
  };
  patterns: CompanyInterviewPattern[];
}

export interface CompanyQuestionAnalytics {
  companyId: string;
  totalQuestions: number;
  averageDifficulty: number;
  mostCommonCategories: Array<{ category: string; percentage: number }>;
  mostCommonTags: Array<{ tag: CompanyQuestionTag; percentage: number }>;
  interviewPatterns: CompanyInterviewPattern[];
  difficultyDistribution: Record<string, number>;
  timeAllocationPattern: {
    behavioral: number;
    technical: number;
    systemDesign: number;
    coding: number;
  };
  successRateByCategory: Record<string, number>;
  recommendedPreparation: {
    focusAreas: string[];
    timeAllocation: Record<string, number>;
    keySkills: string[];
  };
}

export interface RoleBasedQuestionSet {
  roleId: string;
  roleName: string;
  companyId: string;
  questions: CompanyQuestion[];
  recommendedOrder: string[]; // Question IDs in recommended order
  estimatedDuration: number; // Total estimated time in minutes
  difficultyProgression: string[]; // How difficulty should progress
  focusAreas: string[]; // Key areas to focus on for this role
}

export interface QuestionGenerationRequest {
  companyId: string;
  roleId: string;
  categories: string[];
  difficulty: string;
  count: number;
  includePatterns?: boolean;
  customRequirements?: string;
}

export interface QuestionGenerationResponse {
  questions: CompanyQuestion[];
  patterns: CompanyInterviewPattern[];
  metadata: {
    generatedAt: Date;
    totalTime: number;
    difficulty: string;
    focusAreas: string[];
  };
}