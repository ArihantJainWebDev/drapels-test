export interface Roadmap {
  id: string;
  title: string;
  description: string;
  params: {
    company: string;
    role: string;
    experience: string;
    timeframe: string;
    focusAreas: string[];
    currentSkills: string[];
  };
  topics: RoadmapTopic[];
  overallProgress: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  priority: string;
  difficulty: string;
  estimatedHours: number;
  progress: number;
  completed: boolean;
  subtopics: RoadmapSubtopic[];
}

export interface RoadmapSubtopic {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedHours: number;
  completed: boolean;
  resources: RoadmapResource[];
}

export interface RoadmapResource {
  type: 'video' | 'book' | 'course' | 'project' | 'practice';
  title: string;
  description: string;
  url?: string;
}
