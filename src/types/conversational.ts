// Conversational AI Types for Frontend

export interface DSAProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  constraints?: string[];
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
}

export interface LearningStep {
  stepNumber: number;
  stepType: 'understanding' | 'approach' | 'implementation' | 'optimization';
  description: string;
  completed: boolean;
}

export interface ProgressMetrics {
  understanding: number; // 0-100
  implementation: number; // 0-100
  optimization: number; // 0-100
  hintsUsed: number;
  conceptsLearned: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'question' | 'hint' | 'encouragement' | 'correction' | 'response';
  timestamp: Date;
  stepNumber: number;
  codeReview?: CodeReview;
  conceptsIntroduced?: string[];
}

export interface ConversationSession {
  id: string;
  userId: string;
  problem: DSAProblem;
  conversationHistory: Message[];
  currentStep: LearningStep;
  userProgress: ProgressMetrics;
  createdAt: Date;
  lastActivity: Date;
}

export interface ConversationContext {
  problemId: string;
  userId: string;
  sessionId: string;
  currentStep: number;
  userUnderstanding: 'low' | 'medium' | 'high';
  hintsUsed: number;
  codeAttempts: CodeAttempt[];
}

export interface AIResponse {
  message: string;
  type: 'question' | 'hint' | 'encouragement' | 'correction';
  nextStep?: LearningStep;
  codeReview?: CodeReview;
  conceptsIntroduced?: string[];
}

export interface CodeReview {
  correctness: string;
  suggestions: string[];
  edgeCases: string[];
  optimizations: string[];
  conceptsUsed: string[];
}

export interface CodeAttempt {
  code: string;
  language: string;
  timestamp: Date;
}

export type HintLevel = 'subtle' | 'moderate' | 'strong';

export type UnderstandingLevel = 'low' | 'medium' | 'high';

// UI State Types
export interface ConversationUIState {
  isLoading: boolean;
  isTyping: boolean;
  currentSessionId: string | null;
  error: string | null;
}

export interface ConversationMessage extends Message {
  isStreaming?: boolean;
  displayTimestamp?: string;
}

// Hook return types
export interface UseConversationalAI {
  // State
  session: ConversationSession | null;
  messages: ConversationMessage[];
  currentStep: LearningStep | null;
  progress: ProgressMetrics | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;

  // Actions
  startSession: (problem: DSAProblem) => Promise<void>;
  sendMessage: (message: string, context?: any) => Promise<void>;
  getHint: (level?: HintLevel) => Promise<string>;
  reviewCode: (code: string, language: string) => Promise<CodeReview>;
  clearError: () => void;
  resetSession: () => void;
  
  // Session Management
  loadSession: (sessionId: string) => void;
  getStoredSessions: () => any[];
  deleteStoredSession: (sessionId: string) => void;
  exportSession: (sessionId: string) => void;
  importSession: (file: File) => void;
}

// Component Props Types
export interface ConversationChatProps {
  messages: ConversationMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isTyping: boolean;
  className?: string;
}

export interface ConversationInputProps {
  onSendMessage: (message: string) => void;
  onGetHint: (level: HintLevel) => void;
  onReviewCode: (code: string, language: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface ProgressDisplayProps {
  progress: ProgressMetrics;
  currentStep: LearningStep;
  className?: string;
}

export interface HintButtonProps {
  onGetHint: (level: HintLevel) => void;
  hintsUsed: number;
  disabled?: boolean;
  className?: string;
}

export interface CodeReviewDisplayProps {
  codeReview: CodeReview;
  className?: string;
}