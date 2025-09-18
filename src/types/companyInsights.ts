export interface CompanyRole {
  id: string;
  title: string;
  skills: string[];
  experience: string;
  package: string;
  eligibility: string;
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  location?: string[];
  department?: string;
  level?: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Principal';
  remote?: boolean;
  postedDate?: Date;
  applicationDeadline?: Date;
  isActive?: boolean;
}

export interface InterviewExperience {
  id: string;
  userId: string;
  userName: string;
  role: string;
  date: Date;
  outcome: 'Offer' | 'Rejected' | 'In Progress';
  rounds: InterviewRound[];
  overallExperience: string;
  tips: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number; // 1-5
  anonymous: boolean;
}

export interface InterviewRound {
  roundNumber: number;
  type: 'Technical' | 'Behavioral' | 'System Design' | 'Coding' | 'HR' | 'Manager';
  duration: number; // in minutes
  questions: string[];
  feedback: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface InsiderTip {
  id: string;
  userId: string;
  userName: string;
  role?: string;
  department?: string;
  tip: string;
  category: 'Interview' | 'Culture' | 'Growth' | 'Compensation' | 'Work-Life' | 'General';
  upvotes: number;
  downvotes: number;
  date: Date;
  verified: boolean;
  anonymous: boolean;
}

export interface RoleRoadmap {
  id: string;
  roleId: string;
  companyId: string;
  title: string;
  description: string;
  estimatedDuration: string; // e.g., "3-6 months"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  learningPath: LearningStep[];
  resources: Resource[];
  milestones: Milestone[];
  createdBy: string;
  lastUpdated: Date;
}

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: 'Theory' | 'Practice' | 'Project' | 'Assessment';
  estimatedTime: string;
  resources: Resource[];
  skills: string[];
  order: number;
  isCompleted?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'Article' | 'Video' | 'Course' | 'Book' | 'Practice' | 'Documentation';
  url: string;
  description?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  free: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  criteria: string[];
  order: number;
  isCompleted?: boolean;
}

export interface JobApplication {
  id: string;
  userId: string;
  companyId: string;
  roleId: string;
  status: 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Interview Completed' | 'Offer' | 'Rejected' | 'Withdrawn';
  appliedDate: Date;
  lastUpdated: Date;
  notes: string;
  interviewDates: Date[];
  followUpReminders: Date[];
  documents: ApplicationDocument[];
  timeline: ApplicationEvent[];
}

export interface ApplicationDocument {
  id: string;
  type: 'Resume' | 'Cover Letter' | 'Portfolio' | 'Certificate' | 'Other';
  name: string;
  url: string;
  uploadDate: Date;
}

export interface ApplicationEvent {
  id: string;
  type: 'Applied' | 'Viewed' | 'Interview Scheduled' | 'Interview Completed' | 'Feedback Received' | 'Status Changed';
  date: Date;
  description: string;
  notes?: string;
}

export interface JobAlert {
  id: string;
  userId: string;
  companyIds: string[];
  keywords: string[];
  roles: string[];
  locations: string[];
  experienceLevel: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  remote: boolean;
  isActive: boolean;
  frequency: 'Immediate' | 'Daily' | 'Weekly';
  lastNotified?: Date;
  createdDate: Date;
}

export interface EnhancedCompanyProfile {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  industry: string;
  size: string;
  founded: number;
  headquarters: string;
  locations: string[];
  
  // Enhanced information
  roles: CompanyRole[];
  hiringProcess: HiringStep[];
  culture: CompanyCulture;
  aboutCompany: CompanyAbout;
  
  // New features
  interviewExperiences: InterviewExperience[];
  insiderTips: InsiderTip[];
  roleRoadmaps: RoleRoadmap[];
  
  // Metadata
  lastUpdated: Date;
  dataQuality: number; // 0-100 score
  verified: boolean;
}

export interface HiringStep {
  step: string;
  description: string;
  tips: string;
  duration?: string;
  order: number;
}

export interface CompanyCulture {
  workLife: string;
  workEnvironment: string;
  workingStyle: string;
  values: string[];
  benefits: string;
  careerGrowth: string;
  teamDynamics: string;
  perks: string[];
  diversityInclusion?: string;
  learningDevelopment?: string;
  workFromHome?: string;
}

export interface CompanyAbout {
  overview: string;
  businessAreas: string[];
  globalPresence: string;
  indiaOperations: string;
  techStack: TechStack;
  innovations: string;
  recentNews?: string[];
  awards?: string[];
  socialImpact?: string;
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];
  tools: string[];
  methodologies?: string[];
}