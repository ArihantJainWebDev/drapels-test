// Mock Interview System Types

export interface MockInterviewSession {
  id: string;
  userId: string;
  company: string;
  role: string;
  interviewType: 'behavioral' | 'technical' | 'system-design' | 'coding' | 'mixed';
  difficulty: 'entry' | 'mid' | 'senior' | 'staff';
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  status: 'setup' | 'in-progress' | 'completed' | 'cancelled';
  
  // Interview Configuration
  config: InterviewConfig;
  
  // Session Data
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  responses: InterviewResponse[];
  
  // Media
  videoRecording?: string; // URL to recorded video
  audioRecording?: string; // URL to recorded audio
  
  // AI Analysis
  overallScore: number;
  feedback: InterviewFeedback;
  
  // Performance Metrics
  metrics: InterviewMetrics;
  
  // Performance Analysis
  performanceAnalysis?: any; // PerformanceAnalysis type from service
}

export interface InterviewConfig {
  enableCamera: boolean;
  enableMicrophone: boolean;
  enableScreenShare: boolean;
  enableWhiteboard: boolean;
  recordVideo: boolean;
  recordAudio: boolean;
  timeLimit: number; // in minutes
  questionCount: number;
  allowPause: boolean;
  showTimer: boolean;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  timeLimit: number; // in seconds
  followUpQuestions?: string[];
  expectedKeywords?: string[];
  rubric?: QuestionRubric;
}

export interface QuestionRubric {
  criteria: RubricCriteria[];
  maxScore: number;
}

export interface RubricCriteria {
  name: string;
  description: string;
  weight: number;
  maxPoints: number;
}

export interface InterviewResponse {
  questionId: string;
  question: string;
  userResponse: string;
  audioResponse?: Blob;
  videoResponse?: Blob;
  whiteboardData?: string; // JSON string of whiteboard content
  startTime: Date;
  endTime: Date;
  timeSpent: number; // in seconds
  
  // AI Analysis
  score: number;
  feedback: string;
  keywordMatches: string[];
  improvementAreas: string[];
  strengths: string[];
}

export interface InterviewFeedback {
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  improvementAreas: string[];
  detailedFeedback: string;
  nextSteps: string[];
  comparisonToPeers?: PeerComparison;
}

export interface PeerComparison {
  percentile: number;
  averageScore: number;
  topPerformers: {
    score: number;
    keyStrengths: string[];
  };
}

export interface InterviewMetrics {
  totalSpeakingTime: number;
  averageResponseTime: number;
  pauseCount: number;
  fillerWordCount: number;
  confidenceScore: number;
  clarityScore: number;
  structureScore: number;
}

export interface AIInterviewer {
  id: string;
  name: string;
  avatar: string;
  personality: 'friendly' | 'professional' | 'challenging' | 'supportive';
  company: string;
  role: string;
  experience: string;
  specialties: string[];
}

export interface InterviewEnvironment {
  type: 'video-call' | 'in-person' | 'phone' | 'whiteboard';
  background: string;
  layout: 'split-screen' | 'full-screen' | 'picture-in-picture';
  tools: EnvironmentTool[];
}

export interface EnvironmentTool {
  id: string;
  name: string;
  type: 'whiteboard' | 'code-editor' | 'screen-share' | 'document' | 'calculator';
  enabled: boolean;
  config?: Record<string, any>;
}

export interface WhiteboardState {
  elements: WhiteboardElement[];
  currentTool: 'pen' | 'eraser' | 'text' | 'shapes';
  strokeColor: string;
  strokeWidth: number;
  backgroundColor: string;
}

export interface WhiteboardElement {
  id: string;
  type: 'path' | 'text' | 'rectangle' | 'circle' | 'arrow';
  data: any;
  style: {
    color: string;
    width: number;
    fill?: string;
  };
}

export interface VideoRecordingState {
  isRecording: boolean;
  isSupported: boolean;
  error: string | null;
  duration: number;
  videoBlob: Blob | null;
  stream: MediaStream | null;
}

export interface ScreenShareState {
  isSharing: boolean;
  isSupported: boolean;
  error: string | null;
  stream: MediaStream | null;
}

export interface InterviewAnalytics {
  sessionId: string;
  userId: string;
  timestamp: Date;
  
  // Performance Data
  responseQuality: number;
  technicalAccuracy: number;
  communicationSkills: number;
  problemSolvingApproach: number;
  
  // Behavioral Metrics
  eyeContact: number;
  posture: number;
  gestures: number;
  voiceClarity: number;
  
  // Time Management
  timeUtilization: number;
  pacing: number;
  
  // Comparison Data
  industryBenchmark: number;
  roleBenchmark: number;
  experienceBenchmark: number;
}

export interface MockInterviewFilters {
  companies: string[];
  roles: string[];
  interviewTypes: string[];
  difficulties: string[];
  duration: {
    min: number;
    max: number;
  };
}

export interface MockInterviewStats {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  averageDuration: number;
  improvementTrend: number;
  
  // Category Breakdown
  categoryPerformance: Record<string, {
    sessions: number;
    averageScore: number;
    improvement: number;
  }>;
  
  // Company Performance
  companyPerformance: Record<string, {
    sessions: number;
    averageScore: number;
    successRate: number;
  }>;
  
  // Recent Performance
  recentSessions: MockInterviewSession[];
  performanceTrend: {
    date: string;
    score: number;
  }[];
}