import { SkillAssessment } from '@/types/ats';

interface QuizResult {
  topic: string;
  score: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completedAt: Date;
  questionsAnswered: number;
  totalQuestions: number;
}

interface DSAProgress {
  problemId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  solved: boolean;
  attempts: number;
  lastAttempt: Date;
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface ProjectData {
  name: string;
  technologies: string[];
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  completedAt: Date;
}

class SkillIntegrationService {
  private readonly SKILL_MAPPINGS = {
    // Programming Languages
    'JavaScript': ['javascript', 'js', 'ecmascript', 'es6', 'node.js', 'nodejs'],
    'TypeScript': ['typescript', 'ts'],
    'Python': ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy'],
    'Java': ['java', 'spring', 'spring boot', 'hibernate'],
    'C++': ['c++', 'cpp', 'stl'],
    'C#': ['c#', 'csharp', '.net', 'asp.net'],
    'Go': ['go', 'golang'],
    'Rust': ['rust'],
    'PHP': ['php', 'laravel', 'symfony'],
    'Ruby': ['ruby', 'rails', 'ruby on rails'],
    'Swift': ['swift', 'ios'],
    'Kotlin': ['kotlin', 'android'],
    
    // Frontend Technologies
    'React': ['react', 'reactjs', 'react.js', 'jsx', 'hooks'],
    'Vue.js': ['vue', 'vuejs', 'vue.js', 'nuxt'],
    'Angular': ['angular', 'angularjs', 'typescript'],
    'HTML/CSS': ['html', 'css', 'html5', 'css3', 'sass', 'scss', 'less'],
    'Responsive Design': ['responsive', 'mobile-first', 'bootstrap', 'tailwind'],
    
    // Backend Technologies
    'Node.js': ['node', 'nodejs', 'express', 'nestjs'],
    'REST APIs': ['rest', 'api', 'restful', 'http'],
    'GraphQL': ['graphql', 'apollo'],
    'Microservices': ['microservices', 'distributed systems'],
    
    // Databases
    'SQL': ['sql', 'mysql', 'postgresql', 'sqlite', 'oracle'],
    'NoSQL': ['mongodb', 'nosql', 'cassandra', 'dynamodb'],
    'Redis': ['redis', 'caching'],
    
    // Cloud & DevOps
    'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
    'Docker': ['docker', 'containerization'],
    'Kubernetes': ['kubernetes', 'k8s', 'orchestration'],
    'CI/CD': ['jenkins', 'github actions', 'gitlab ci', 'continuous integration'],
    
    // Tools & Methodologies
    'Git': ['git', 'github', 'gitlab', 'version control'],
    'Agile': ['agile', 'scrum', 'kanban', 'sprint'],
    'Testing': ['unit testing', 'integration testing', 'jest', 'cypress', 'selenium'],
    
    // Data & Analytics
    'Data Analysis': ['data analysis', 'analytics', 'statistics'],
    'Machine Learning': ['machine learning', 'ml', 'ai', 'tensorflow', 'pytorch'],
    'Data Visualization': ['visualization', 'charts', 'd3.js', 'tableau']
  };

  private readonly ROLE_SKILL_REQUIREMENTS = {
    'frontend developer': [
      'JavaScript', 'React', 'HTML/CSS', 'Responsive Design', 'Git', 'REST APIs'
    ],
    'backend developer': [
      'Node.js', 'Python', 'Java', 'SQL', 'REST APIs', 'Git', 'AWS'
    ],
    'full stack developer': [
      'JavaScript', 'React', 'Node.js', 'SQL', 'REST APIs', 'Git', 'HTML/CSS'
    ],
    'data scientist': [
      'Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Data Visualization'
    ],
    'devops engineer': [
      'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux'
    ],
    'mobile developer': [
      'React Native', 'Swift', 'Kotlin', 'JavaScript', 'Git', 'REST APIs'
    ]
  };

  async getUserSkillAssessments(userId: string): Promise<SkillAssessment[]> {
    try {
      // In a real implementation, this would fetch from your backend
      // For now, we'll simulate with localStorage and mock data
      const assessments: SkillAssessment[] = [];

      // Get quiz results
      const quizResults = this.getQuizResults(userId);
      assessments.push(...this.convertQuizToAssessments(quizResults));

      // Get DSA progress
      const dsaProgress = this.getDSAProgress(userId);
      assessments.push(...this.convertDSAToAssessments(dsaProgress));

      // Get project data
      const projects = this.getProjectData(userId);
      assessments.push(...this.convertProjectsToAssessments(projects));

      return this.deduplicateAndRankAssessments(assessments);
    } catch (error) {
      console.error('Failed to get skill assessments:', error);
      return this.getMockAssessments();
    }
  }

  suggestSkillsForResume(assessments: SkillAssessment[], targetRole?: string): string[] {
    const suggestions = new Set<string>();

    // Add verified skills from assessments
    assessments
      .filter(assessment => assessment.verified && assessment.level !== 'beginner')
      .forEach(assessment => {
        suggestions.add(assessment.skill);
        
        // Add related skills based on mappings
        const relatedSkills = this.getRelatedSkills(assessment.skill);
        relatedSkills.forEach(skill => suggestions.add(skill));
      });

    // Add role-specific recommendations
    if (targetRole) {
      const roleSkills = this.getRoleSpecificSkills(targetRole);
      roleSkills.forEach(skill => {
        // Only suggest if user has some proficiency
        const hasRelatedAssessment = assessments.some(a => 
          this.isSkillRelated(a.skill, skill) && a.level !== 'beginner'
        );
        if (hasRelatedAssessment) {
          suggestions.add(skill);
        }
      });
    }

    return Array.from(suggestions).slice(0, 20); // Limit to top 20 suggestions
  }

  getSkillProficiencyLevel(skill: string, assessments: SkillAssessment[]): 'beginner' | 'intermediate' | 'advanced' | 'expert' | null {
    const relatedAssessments = assessments.filter(a => 
      this.isSkillRelated(a.skill, skill)
    );

    if (relatedAssessments.length === 0) return null;

    // Calculate weighted average based on source reliability
    const weights = { quiz: 0.4, dsa: 0.3, project: 0.2, manual: 0.1 };
    let totalWeight = 0;
    let weightedScore = 0;

    relatedAssessments.forEach(assessment => {
      const weight = weights[assessment.source] || 0.1;
      const levelScore = this.getLevelScore(assessment.level);
      
      totalWeight += weight;
      weightedScore += levelScore * weight;
    });

    const averageScore = weightedScore / totalWeight;
    return this.getScoreLevel(averageScore);
  }

  generateSkillRecommendations(currentSkills: string[], targetRole?: string): {
    missing: string[];
    emerging: string[];
    complementary: string[];
  } {
    const currentSkillsLower = currentSkills.map(s => s.toLowerCase());
    const recommendations = {
      missing: [] as string[],
      emerging: [] as string[],
      complementary: [] as string[]
    };

    if (targetRole) {
      const roleSkills = this.getRoleSpecificSkills(targetRole);
      
      roleSkills.forEach(skill => {
        const hasSkill = currentSkillsLower.some(current => 
          this.isSkillRelated(current, skill.toLowerCase())
        );
        
        if (!hasSkill) {
          recommendations.missing.push(skill);
        }
      });
    }

    // Add emerging technologies
    const emergingTech = [
      'Next.js', 'Svelte', 'Deno', 'WebAssembly', 'GraphQL', 
      'Serverless', 'Edge Computing', 'Web3', 'AI/ML'
    ];
    
    emergingTech.forEach(tech => {
      const hasSkill = currentSkillsLower.some(current => 
        this.isSkillRelated(current, tech.toLowerCase())
      );
      
      if (!hasSkill) {
        recommendations.emerging.push(tech);
      }
    });

    // Add complementary skills based on current skills
    currentSkills.forEach(skill => {
      const complementary = this.getComplementarySkills(skill);
      complementary.forEach(comp => {
        const hasSkill = currentSkillsLower.some(current => 
          this.isSkillRelated(current, comp.toLowerCase())
        );
        
        if (!hasSkill && !recommendations.complementary.includes(comp)) {
          recommendations.complementary.push(comp);
        }
      });
    });

    return {
      missing: recommendations.missing.slice(0, 5),
      emerging: recommendations.emerging.slice(0, 3),
      complementary: recommendations.complementary.slice(0, 5)
    };
  }

  private getQuizResults(userId: string): QuizResult[] {
    // Mock implementation - in real app, fetch from backend
    return [
      {
        topic: 'JavaScript',
        score: 85,
        difficulty: 'advanced',
        completedAt: new Date('2024-01-15'),
        questionsAnswered: 17,
        totalQuestions: 20
      },
      {
        topic: 'React',
        score: 78,
        difficulty: 'intermediate',
        completedAt: new Date('2024-01-10'),
        questionsAnswered: 15,
        totalQuestions: 20
      }
    ];
  }

  private getDSAProgress(userId: string): DSAProgress[] {
    // Mock implementation - in real app, fetch from backend
    return [
      {
        problemId: 'two-sum',
        title: 'Two Sum',
        difficulty: 'easy',
        topics: ['Array', 'Hash Table'],
        solved: true,
        attempts: 2,
        lastAttempt: new Date('2024-01-12'),
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
      }
    ];
  }

  private getProjectData(userId: string): ProjectData[] {
    // Mock implementation - in real app, fetch from backend
    return [
      {
        name: 'E-commerce Platform',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        description: 'Full-stack e-commerce application',
        completedAt: new Date('2024-01-01')
      }
    ];
  }

  private convertQuizToAssessments(quizResults: QuizResult[]): SkillAssessment[] {
    return quizResults.map(quiz => ({
      skill: quiz.topic,
      level: this.scoreToLevel(quiz.score),
      verified: true,
      source: 'quiz' as const,
      score: quiz.score,
      completedAt: quiz.completedAt
    }));
  }

  private convertDSAToAssessments(dsaProgress: DSAProgress[]): SkillAssessment[] {
    const skillCounts = new Map<string, { solved: number; total: number }>();
    
    dsaProgress.forEach(problem => {
      problem.topics.forEach(topic => {
        const current = skillCounts.get(topic) || { solved: 0, total: 0 };
        current.total++;
        if (problem.solved) current.solved++;
        skillCounts.set(topic, current);
      });
    });

    return Array.from(skillCounts.entries()).map(([skill, stats]) => ({
      skill: `Data Structures - ${skill}`,
      level: this.solveRateToLevel(stats.solved / stats.total),
      verified: true,
      source: 'dsa' as const,
      score: Math.round((stats.solved / stats.total) * 100),
      completedAt: new Date()
    }));
  }

  private convertProjectsToAssessments(projects: ProjectData[]): SkillAssessment[] {
    const skillCounts = new Map<string, number>();
    
    projects.forEach(project => {
      project.technologies.forEach(tech => {
        skillCounts.set(tech, (skillCounts.get(tech) || 0) + 1);
      });
    });

    return Array.from(skillCounts.entries()).map(([skill, count]) => ({
      skill,
      level: count >= 3 ? 'advanced' : count >= 2 ? 'intermediate' : 'beginner',
      verified: true,
      source: 'project' as const,
      completedAt: new Date()
    }));
  }

  private deduplicateAndRankAssessments(assessments: SkillAssessment[]): SkillAssessment[] {
    const skillMap = new Map<string, SkillAssessment>();
    
    assessments.forEach(assessment => {
      const existing = skillMap.get(assessment.skill);
      if (!existing || this.isHigherPriority(assessment, existing)) {
        skillMap.set(assessment.skill, assessment);
      }
    });

    return Array.from(skillMap.values()).sort((a, b) => {
      const levelOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };
      return levelOrder[b.level] - levelOrder[a.level];
    });
  }

  private isHigherPriority(a: SkillAssessment, b: SkillAssessment): boolean {
    const sourceOrder = { quiz: 4, dsa: 3, project: 2, manual: 1 };
    const levelOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };
    
    if (levelOrder[a.level] !== levelOrder[b.level]) {
      return levelOrder[a.level] > levelOrder[b.level];
    }
    
    return sourceOrder[a.source] > sourceOrder[b.source];
  }

  private getRelatedSkills(skill: string): string[] {
    for (const [mainSkill, variations] of Object.entries(this.SKILL_MAPPINGS)) {
      if (variations.some(v => v.toLowerCase() === skill.toLowerCase()) || 
          mainSkill.toLowerCase() === skill.toLowerCase()) {
        return [mainSkill];
      }
    }
    return [];
  }

  private getRoleSpecificSkills(role: string): string[] {
    const roleLower = role.toLowerCase();
    for (const [roleKey, skills] of Object.entries(this.ROLE_SKILL_REQUIREMENTS)) {
      if (roleLower.includes(roleKey)) {
        return skills;
      }
    }
    return [];
  }

  private getComplementarySkills(skill: string): string[] {
    const complementaryMap: Record<string, string[]> = {
      'React': ['Redux', 'Next.js', 'TypeScript', 'Jest'],
      'Node.js': ['Express', 'MongoDB', 'Redis', 'Docker'],
      'Python': ['Django', 'Flask', 'Pandas', 'NumPy'],
      'JavaScript': ['TypeScript', 'React', 'Node.js', 'Jest'],
      'AWS': ['Docker', 'Kubernetes', 'Terraform', 'Jenkins']
    };
    
    return complementaryMap[skill] || [];
  }

  private isSkillRelated(skill1: string, skill2: string): boolean {
    const s1 = skill1.toLowerCase();
    const s2 = skill2.toLowerCase();
    
    if (s1 === s2) return true;
    
    for (const variations of Object.values(this.SKILL_MAPPINGS)) {
      if (variations.includes(s1) && variations.includes(s2)) {
        return true;
      }
    }
    
    return false;
  }

  private scoreToLevel(score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (score >= 90) return 'expert';
    if (score >= 75) return 'advanced';
    if (score >= 60) return 'intermediate';
    return 'beginner';
  }

  private solveRateToLevel(rate: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (rate >= 0.9) return 'expert';
    if (rate >= 0.7) return 'advanced';
    if (rate >= 0.5) return 'intermediate';
    return 'beginner';
  }

  private getLevelScore(level: string): number {
    const scores = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    return scores[level as keyof typeof scores] || 1;
  }

  private getScoreLevel(score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (score >= 3.5) return 'expert';
    if (score >= 2.5) return 'advanced';
    if (score >= 1.5) return 'intermediate';
    return 'beginner';
  }

  private getMockAssessments(): SkillAssessment[] {
    return [
      {
        skill: 'JavaScript',
        level: 'advanced',
        verified: true,
        source: 'quiz',
        score: 85,
        completedAt: new Date()
      },
      {
        skill: 'React',
        level: 'intermediate',
        verified: true,
        source: 'project',
        completedAt: new Date()
      }
    ];
  }
}

export const skillIntegrationService = new SkillIntegrationService();