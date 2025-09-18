export interface ATSScore {
  overall: number; // 0-100
  breakdown: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
    length: number;
  };
  suggestions: ATSSuggestion[];
  passesATS: boolean;
}

export interface ATSSuggestion {
  id: string;
  type: 'critical' | 'warning' | 'improvement';
  category: 'formatting' | 'keywords' | 'structure' | 'readability' | 'length';
  title: string;
  description: string;
  impact: number; // potential score improvement
}

export interface ATSKeyword {
  keyword: string;
  importance: number; // 1-5
  found: boolean;
  variations: string[];
}

export interface ATSAnalysis {
  score: ATSScore;
  keywords: ATSKeyword[];
  formatIssues: string[];
  structureIssues: string[];
  recommendations: string[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  atsScore: number; // base ATS compatibility score
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  features: string[];
  preview: string; // preview image URL
}

export interface SkillAssessment {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
  source: 'quiz' | 'dsa' | 'project' | 'manual';
  score?: number;
  completedAt: Date;
}

export interface ExportFormat {
  format: 'pdf' | 'docx' | 'txt' | 'json';
  name: string;
  description: string;
  atsOptimized: boolean;
}