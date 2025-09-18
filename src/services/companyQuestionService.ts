import { 
  CompanyQuestion, 
  CompanyQuestionDatabase, 
  CompanyInterviewPattern,
  CompanyQuestionTag,
  QuestionFilter,
  QuestionSearchResult,
  CompanyQuestionAnalytics,
  RoleBasedQuestionSet,
  QuestionGenerationRequest,
  QuestionGenerationResponse
} from '@/types/companyQuestions';
import { companies, roles } from '@/data/practiceQuestions';

export class CompanyQuestionService {
  private static questionDatabase: Map<string, CompanyQuestion[]> = new Map();
  private static patternDatabase: Map<string, CompanyInterviewPattern[]> = new Map();
  private static tagDatabase: CompanyQuestionTag[] = [];
  private static initialized = false;

  /**
   * Initialize the company question service with seed data
   */
  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize tag system
      await this.initializeTags();
      
      // Load company-specific questions
      await this.loadCompanyQuestions();
      
      // Load interview patterns
      await this.loadInterviewPatterns();
      
      this.initialized = true;
      console.log('Company Question Service initialized successfully');
    } catch (error) {
      console.error('Error initializing Company Question Service:', error);
      throw error;
    }
  }

  /**
   * Search questions with advanced filtering
   */
  static async searchQuestions(filter: QuestionFilter): Promise<QuestionSearchResult> {
    await this.ensureInitialized();

    let allQuestions: CompanyQuestion[] = [];
    
    // Collect questions from all companies or filtered companies
    const targetCompanies = filter.companies || companies.map(c => c.id);
    
    for (const companyId of targetCompanies) {
      const companyQuestions = this.questionDatabase.get(companyId) || [];
      allQuestions = allQuestions.concat(companyQuestions);
    }

    // Apply filters
    const filteredQuestions = this.applyFilters(allQuestions, filter);
    
    // Generate facets for UI
    const facets = this.generateFacets(filteredQuestions);
    
    // Get relevant patterns
    const patterns = this.getRelevantPatterns(targetCompanies, filter);

    return {
      questions: filteredQuestions,
      totalCount: filteredQuestions.length,
      facets,
      patterns
    };
  }

  /**
   * Get questions for a specific company
   */
  static async getCompanyQuestions(companyId: string, filter?: Partial<QuestionFilter>): Promise<CompanyQuestion[]> {
    await this.ensureInitialized();
    
    const companyQuestions = this.questionDatabase.get(companyId) || [];
    
    if (!filter) return companyQuestions;
    
    return this.applyFilters(companyQuestions, filter as QuestionFilter);
  }

  /**
   * Get role-based question set for a company
   */
  static async getRoleBasedQuestionSet(companyId: string, roleId: string): Promise<RoleBasedQuestionSet> {
    await this.ensureInitialized();
    
    const companyQuestions = this.questionDatabase.get(companyId) || [];
    const roleQuestions = companyQuestions.filter(q => q.roleIds.includes(roleId));
    
    const role = roles.find(r => r.id === roleId);
    const company = companies.find(c => c.id === companyId);
    
    if (!role || !company) {
      throw new Error(`Role ${roleId} or Company ${companyId} not found`);
    }

    // Generate recommended order based on difficulty and interview patterns
    const recommendedOrder = this.generateRecommendedOrder(roleQuestions, companyId);
    
    // Calculate estimated duration
    const estimatedDuration = roleQuestions.reduce((total, q) => total + (q.timeLimit || 5), 0);
    
    // Generate difficulty progression
    const difficultyProgression = this.generateDifficultyProgression(roleQuestions);
    
    // Identify focus areas
    const focusAreas = this.identifyFocusAreas(roleQuestions);

    return {
      roleId,
      roleName: role.title,
      companyId,
      questions: roleQuestions,
      recommendedOrder,
      estimatedDuration,
      difficultyProgression,
      focusAreas
    };
  }

  /**
   * Analyze company question patterns
   */
  static async analyzeCompanyPatterns(companyId: string): Promise<CompanyQuestionAnalytics> {
    await this.ensureInitialized();
    
    const questions = this.questionDatabase.get(companyId) || [];
    const patterns = this.patternDatabase.get(companyId) || [];
    
    if (questions.length === 0) {
      throw new Error(`No questions found for company ${companyId}`);
    }

    // Calculate analytics
    const totalQuestions = questions.length;
    const averageDifficulty = this.calculateAverageDifficulty(questions);
    const mostCommonCategories = this.getMostCommonCategories(questions);
    const mostCommonTags = this.getMostCommonTags(questions);
    const difficultyDistribution = this.getDifficultyDistribution(questions);
    const timeAllocationPattern = this.getTimeAllocationPattern(questions);
    const successRateByCategory = this.getSuccessRateByCategory(questions);
    const recommendedPreparation = this.generateRecommendedPreparation(questions, patterns);

    return {
      companyId,
      totalQuestions,
      averageDifficulty,
      mostCommonCategories,
      mostCommonTags,
      interviewPatterns: patterns,
      difficultyDistribution,
      timeAllocationPattern,
      successRateByCategory,
      recommendedPreparation
    };
  }

  /**
   * Generate AI-powered questions for a company and role
   */
  static async generateQuestions(request: QuestionGenerationRequest): Promise<QuestionGenerationResponse> {
    await this.ensureInitialized();
    
    const company = companies.find(c => c.id === request.companyId);
    const role = roles.find(r => r.id === request.roleId);
    
    if (!company || !role) {
      throw new Error('Invalid company or role ID');
    }

    try {
      // Use the existing quiz API to generate questions
      const { generateQuiz } = await import('@/lib/quiz-api');
      
      const quizParams = {
        company: company.name,
        role: role.title,
        domain: request.categories.join(', '),
        difficulty: request.difficulty
      };

      const generatedQuestions = await generateQuiz(quizParams);
      
      // Convert to CompanyQuestion format
      const companyQuestions: CompanyQuestion[] = generatedQuestions.map((q, index) => ({
        id: `generated_${request.companyId}_${Date.now()}_${index}`,
        question: q.question,
        category: this.inferCategory(q.question),
        difficulty: request.difficulty as any,
        companyId: request.companyId,
        roleIds: [request.roleId],
        tags: this.inferTags(q.question),
        primaryTag: this.inferPrimaryTag(q.question),
        companySpecific: {
          interviewRound: 'any',
          frequency: 0.5,
          successRate: 0.7,
          averageTime: 5,
          followUpLikelihood: 0.3
        },
        type: 'written',
        timeLimit: 5,
        exampleAnswer: q.explanation,
        tips: [],
        followUpQuestions: [],
        commonMistakes: [],
        evaluationCriteria: [],
        companyExpectations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'ai-generated',
        verified: false
      }));

      // Get relevant patterns if requested
      const patterns = request.includePatterns 
        ? this.patternDatabase.get(request.companyId) || []
        : [];

      return {
        questions: companyQuestions,
        patterns,
        metadata: {
          generatedAt: new Date(),
          totalTime: companyQuestions.reduce((sum, q) => sum + (q.timeLimit || 5), 0),
          difficulty: request.difficulty,
          focusAreas: request.categories
        }
      };
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions');
    }
  }

  /**
   * Get question tags
   */
  static getTags(): CompanyQuestionTag[] {
    return this.tagDatabase;
  }

  /**
   * Get company database summary
   */
  static async getCompanyDatabase(companyId: string): Promise<CompanyQuestionDatabase> {
    await this.ensureInitialized();
    
    const questions = this.questionDatabase.get(companyId) || [];
    const patterns = this.patternDatabase.get(companyId) || [];
    const company = companies.find(c => c.id === companyId);
    
    if (!company) {
      throw new Error(`Company ${companyId} not found`);
    }

    const questionsByCategory = this.groupByCategory(questions);
    const questionsByDifficulty = this.groupByDifficulty(questions);
    const questionsByRole = this.groupByRole(questions);

    return {
      companyId,
      companyName: company.name,
      totalQuestions: questions.length,
      questionsByCategory,
      questionsByDifficulty,
      questionsByRole,
      interviewPatterns: patterns,
      lastUpdated: new Date()
    };
  }

  // Private helper methods

  private static async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  private static async initializeTags(): Promise<void> {
    this.tagDatabase = [
      // Technical tags
      { id: 'algorithms', name: 'Algorithms', category: 'technical', description: 'Algorithm design and analysis' },
      { id: 'data-structures', name: 'Data Structures', category: 'technical', description: 'Arrays, trees, graphs, etc.' },
      { id: 'system-design', name: 'System Design', category: 'technical', description: 'Large-scale system architecture' },
      { id: 'coding', name: 'Coding', category: 'technical', description: 'Programming and implementation' },
      { id: 'debugging', name: 'Debugging', category: 'technical', description: 'Problem diagnosis and fixing' },
      
      // Behavioral tags
      { id: 'leadership', name: 'Leadership', category: 'behavioral', description: 'Leadership and management skills' },
      { id: 'teamwork', name: 'Teamwork', category: 'behavioral', description: 'Collaboration and team dynamics' },
      { id: 'communication', name: 'Communication', category: 'behavioral', description: 'Verbal and written communication' },
      { id: 'problem-solving', name: 'Problem Solving', category: 'behavioral', description: 'Analytical thinking and solutions' },
      { id: 'conflict-resolution', name: 'Conflict Resolution', category: 'behavioral', description: 'Managing disagreements' },
      
      // Company culture tags
      { id: 'innovation', name: 'Innovation', category: 'company-culture', description: 'Creative thinking and new ideas' },
      { id: 'customer-focus', name: 'Customer Focus', category: 'company-culture', description: 'Customer-centric approach' },
      { id: 'ownership', name: 'Ownership', category: 'company-culture', description: 'Taking responsibility and initiative' },
      { id: 'bias-for-action', name: 'Bias for Action', category: 'company-culture', description: 'Speed and decisiveness' },
      { id: 'learn-and-be-curious', name: 'Learn and Be Curious', category: 'company-culture', description: 'Continuous learning' },
      
      // Role-specific tags
      { id: 'frontend', name: 'Frontend', category: 'role-specific', description: 'UI/UX and client-side development' },
      { id: 'backend', name: 'Backend', category: 'role-specific', description: 'Server-side and infrastructure' },
      { id: 'mobile', name: 'Mobile', category: 'role-specific', description: 'Mobile app development' },
      { id: 'devops', name: 'DevOps', category: 'role-specific', description: 'Operations and deployment' },
      { id: 'security', name: 'Security', category: 'role-specific', description: 'Security and privacy' },
      
      // Industry tags
      { id: 'fintech', name: 'Fintech', category: 'industry', description: 'Financial technology' },
      { id: 'healthcare', name: 'Healthcare', category: 'industry', description: 'Healthcare and medical technology' },
      { id: 'e-commerce', name: 'E-commerce', category: 'industry', description: 'Online retail and marketplaces' },
      { id: 'social-media', name: 'Social Media', category: 'industry', description: 'Social networking platforms' },
      { id: 'enterprise', name: 'Enterprise', category: 'industry', description: 'Enterprise software solutions' }
    ];
  }

  private static async loadCompanyQuestions(): Promise<void> {
    // Initialize with seed data for major companies
    const seedQuestions = this.generateSeedQuestions();
    
    for (const [companyId, questions] of seedQuestions) {
      this.questionDatabase.set(companyId, questions);
    }
  }

  private static async loadInterviewPatterns(): Promise<void> {
    // Initialize with common interview patterns for major companies
    const seedPatterns = this.generateSeedPatterns();
    
    for (const [companyId, patterns] of seedPatterns) {
      this.patternDatabase.set(companyId, patterns);
    }
  }

  private static generateSeedQuestions(): Map<string, CompanyQuestion[]> {
    const seedData = new Map<string, CompanyQuestion[]>();
    
    // Google questions
    seedData.set('google', [
      {
        id: 'google_behavioral_1',
        question: 'Tell me about a time when you had to work with a difficult team member.',
        category: 'behavioral',
        difficulty: 'Intermediate',
        companyId: 'google',
        roleIds: ['swe-entry', 'swe-mid', 'swe-senior'],
        tags: [this.tagDatabase.find(t => t.id === 'teamwork')!],
        primaryTag: 'teamwork',
        companySpecific: {
          interviewRound: 'onsite',
          frequency: 0.8,
          successRate: 0.6,
          averageTime: 4,
          followUpLikelihood: 0.7
        },
        type: 'verbal',
        timeLimit: 5,
        exampleAnswer: 'I had a team member who consistently missed deadlines. I approached them privately to understand their challenges, offered help, and we established regular check-ins.',
        tips: ['Show empathy', 'Focus on solutions', 'Demonstrate leadership'],
        commonMistakes: ['Blaming the team member', 'Not showing initiative'],
        evaluationCriteria: ['Emotional intelligence', 'Leadership potential', 'Problem-solving approach'],
        companyExpectations: ['Googleyness', 'Collaboration', 'Growth mindset'],
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'interview-data',
        verified: true
      },
      {
        id: 'google_technical_1',
        question: 'Design a URL shortener like bit.ly',
        category: 'system-design',
        difficulty: 'Advanced',
        companyId: 'google',
        roleIds: ['swe-senior', 'swe-staff'],
        tags: [this.tagDatabase.find(t => t.id === 'system-design')!],
        primaryTag: 'system-design',
        companySpecific: {
          interviewRound: 'onsite',
          frequency: 0.9,
          successRate: 0.4,
          averageTime: 45,
          followUpLikelihood: 0.9
        },
        type: 'whiteboard',
        timeLimit: 45,
        exampleAnswer: 'Start with requirements, design the API, discuss database schema, address scalability with caching and load balancing.',
        tips: ['Start with requirements', 'Think about scale', 'Consider trade-offs'],
        commonMistakes: ['Jumping to implementation', 'Ignoring scalability'],
        evaluationCriteria: ['System thinking', 'Scalability awareness', 'Trade-off analysis'],
        companyExpectations: ['Technical depth', 'Scalability mindset', 'Clear communication'],
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'interview-data',
        verified: true
      }
    ]);

    // Amazon questions
    seedData.set('amazon', [
      {
        id: 'amazon_behavioral_1',
        question: 'Tell me about a time you had to make a decision with incomplete information.',
        category: 'behavioral',
        difficulty: 'Intermediate',
        companyId: 'amazon',
        roleIds: ['swe-entry', 'swe-mid', 'swe-senior'],
        tags: [this.tagDatabase.find(t => t.id === 'bias-for-action')!],
        primaryTag: 'bias-for-action',
        companySpecific: {
          interviewRound: 'any',
          frequency: 0.9,
          successRate: 0.5,
          averageTime: 6,
          followUpLikelihood: 0.8
        },
        type: 'verbal',
        timeLimit: 7,
        exampleAnswer: 'I had to choose a technology stack for a project with limited research time. I gathered available data, consulted experts, made a decision, and had a backup plan.',
        tips: ['Show decisiveness', 'Explain your reasoning', 'Mention risk mitigation'],
        commonMistakes: ['Analysis paralysis', 'Not showing ownership'],
        evaluationCriteria: ['Decision-making speed', 'Risk assessment', 'Ownership'],
        companyExpectations: ['Bias for Action', 'Ownership', 'Customer Obsession'],
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'interview-data',
        verified: true
      }
    ]);

    // Add more companies...
    return seedData;
  }

  private static generateSeedPatterns(): Map<string, CompanyInterviewPattern[]> {
    const patterns = new Map<string, CompanyInterviewPattern[]>();
    
    // Google patterns
    patterns.set('google', [
      {
        id: 'google_pattern_1',
        companyId: 'google',
        patternType: 'question-style',
        description: 'Focuses heavily on algorithmic thinking and system design',
        frequency: 0.9,
        examples: ['LeetCode-style problems', 'System design scenarios', 'Behavioral with STAR method'],
        metadata: { emphasis: 'technical-depth', followUpStyle: 'deep-dive' }
      },
      {
        id: 'google_pattern_2',
        companyId: 'google',
        patternType: 'difficulty-progression',
        description: 'Starts with medium difficulty, escalates quickly',
        frequency: 0.8,
        examples: ['Medium → Hard → Expert progression'],
        metadata: { startingDifficulty: 'medium', escalationRate: 'fast' }
      }
    ]);

    // Amazon patterns
    patterns.set('amazon', [
      {
        id: 'amazon_pattern_1',
        companyId: 'amazon',
        patternType: 'question-style',
        description: 'Heavy emphasis on leadership principles and behavioral questions',
        frequency: 0.95,
        examples: ['Customer Obsession scenarios', 'Ownership examples', 'Bias for Action situations'],
        metadata: { emphasis: 'leadership-principles', behavioralWeight: 0.6 }
      }
    ]);

    return patterns;
  }

  private static applyFilters(questions: CompanyQuestion[], filter: QuestionFilter): CompanyQuestion[] {
    return questions.filter(question => {
      // Company filter
      if (filter.companies?.length && !filter.companies.includes(question.companyId)) {
        return false;
      }

      // Role filter
      if (filter.roles?.length && !filter.roles.some(role => question.roleIds.includes(role))) {
        return false;
      }

      // Category filter
      if (filter.categories?.length && !filter.categories.includes(question.category)) {
        return false;
      }

      // Difficulty filter
      if (filter.difficulties?.length && !filter.difficulties.includes(question.difficulty)) {
        return false;
      }

      // Tag filter
      if (filter.tags?.length && !filter.tags.some(tag => question.tags.some(qTag => qTag.id === tag))) {
        return false;
      }

      // Interview round filter
      if (filter.interviewRounds?.length && !filter.interviewRounds.includes(question.companySpecific.interviewRound)) {
        return false;
      }

      // Question type filter
      if (filter.questionTypes?.length && !filter.questionTypes.includes(question.type)) {
        return false;
      }

      // Time range filter
      if (filter.timeRange) {
        const timeLimit = question.timeLimit || 5;
        if (filter.timeRange.min && timeLimit < filter.timeRange.min) return false;
        if (filter.timeRange.max && timeLimit > filter.timeRange.max) return false;
      }

      // Frequency threshold filter
      if (filter.frequencyThreshold && question.companySpecific.frequency < filter.frequencyThreshold) {
        return false;
      }

      // Verified filter
      if (filter.verified !== undefined && question.verified !== filter.verified) {
        return false;
      }

      return true;
    });
  }

  private static generateFacets(questions: CompanyQuestion[]) {
    const companyCounts = new Map<string, number>();
    const roleCounts = new Map<string, number>();
    const categoryCounts = new Map<string, number>();
    const difficultyCounts = new Map<string, number>();
    const tagCounts = new Map<string, number>();

    questions.forEach(question => {
      // Count companies
      companyCounts.set(question.companyId, (companyCounts.get(question.companyId) || 0) + 1);

      // Count roles
      question.roleIds.forEach(roleId => {
        roleCounts.set(roleId, (roleCounts.get(roleId) || 0) + 1);
      });

      // Count categories
      categoryCounts.set(question.category, (categoryCounts.get(question.category) || 0) + 1);

      // Count difficulties
      difficultyCounts.set(question.difficulty, (difficultyCounts.get(question.difficulty) || 0) + 1);

      // Count tags
      question.tags.forEach(tag => {
        tagCounts.set(tag.id, (tagCounts.get(tag.id) || 0) + 1);
      });
    });

    return {
      companies: Array.from(companyCounts.entries()).map(([id, count]) => ({
        id,
        name: companies.find(c => c.id === id)?.name || id,
        count
      })),
      roles: Array.from(roleCounts.entries()).map(([id, count]) => ({
        id,
        name: roles.find(r => r.id === id)?.title || id,
        count
      })),
      categories: Array.from(categoryCounts.entries()).map(([name, count]) => ({ name, count })),
      difficulties: Array.from(difficultyCounts.entries()).map(([name, count]) => ({ name, count })),
      tags: Array.from(tagCounts.entries()).map(([id, count]) => ({
        id,
        name: this.tagDatabase.find(t => t.id === id)?.name || id,
        count
      }))
    };
  }

  private static getRelevantPatterns(companyIds: string[], filter: QuestionFilter): CompanyInterviewPattern[] {
    const patterns: CompanyInterviewPattern[] = [];
    
    companyIds.forEach(companyId => {
      const companyPatterns = this.patternDatabase.get(companyId) || [];
      patterns.push(...companyPatterns);
    });

    return patterns;
  }

  private static generateRecommendedOrder(questions: CompanyQuestion[], companyId: string): string[] {
    // Sort by frequency (most common first), then by difficulty
    return questions
      .sort((a, b) => {
        if (a.companySpecific.frequency !== b.companySpecific.frequency) {
          return b.companySpecific.frequency - a.companySpecific.frequency;
        }
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      })
      .map(q => q.id);
  }

  private static generateDifficultyProgression(questions: CompanyQuestion[]): string[] {
    const difficulties = questions.map(q => q.difficulty);
    const uniqueDifficulties = Array.from(new Set(difficulties));
    return uniqueDifficulties.sort((a, b) => {
      const order = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
      return order[a] - order[b];
    });
  }

  private static identifyFocusAreas(questions: CompanyQuestion[]): string[] {
    const tagCounts = new Map<string, number>();
    
    questions.forEach(question => {
      question.tags.forEach(tag => {
        tagCounts.set(tag.name, (tagCounts.get(tag.name) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  }

  private static calculateAverageDifficulty(questions: CompanyQuestion[]): number {
    const difficultyValues = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
    const total = questions.reduce((sum, q) => sum + difficultyValues[q.difficulty], 0);
    return total / questions.length;
  }

  private static getMostCommonCategories(questions: CompanyQuestion[]) {
    const categoryCounts = new Map<string, number>();
    questions.forEach(q => {
      categoryCounts.set(q.category, (categoryCounts.get(q.category) || 0) + 1);
    });

    return Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, percentage: (count / questions.length) * 100 }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }

  private static getMostCommonTags(questions: CompanyQuestion[]) {
    const tagCounts = new Map<string, number>();
    questions.forEach(q => {
      q.tags.forEach(tag => {
        tagCounts.set(tag.id, (tagCounts.get(tag.id) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tagId, count]) => ({
        tag: this.tagDatabase.find(t => t.id === tagId)!,
        percentage: (count / questions.length) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }

  private static getDifficultyDistribution(questions: CompanyQuestion[]) {
    const distribution: Record<string, number> = {};
    questions.forEach(q => {
      distribution[q.difficulty] = (distribution[q.difficulty] || 0) + 1;
    });
    return distribution;
  }

  private static getTimeAllocationPattern(questions: CompanyQuestion[]) {
    const allocation = { behavioral: 0, technical: 0, systemDesign: 0, coding: 0 };
    
    questions.forEach(q => {
      const time = q.timeLimit || 5;
      switch (q.category) {
        case 'behavioral':
          allocation.behavioral += time;
          break;
        case 'technical':
          allocation.technical += time;
          break;
        case 'system-design':
          allocation.systemDesign += time;
          break;
        case 'coding':
          allocation.coding += time;
          break;
      }
    });

    return allocation;
  }

  private static getSuccessRateByCategory(questions: CompanyQuestion[]) {
    const categoryRates: Record<string, number[]> = {};
    
    questions.forEach(q => {
      if (!categoryRates[q.category]) {
        categoryRates[q.category] = [];
      }
      categoryRates[q.category].push(q.companySpecific.successRate);
    });

    const result: Record<string, number> = {};
    Object.entries(categoryRates).forEach(([category, rates]) => {
      result[category] = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    });

    return result;
  }

  private static generateRecommendedPreparation(questions: CompanyQuestion[], patterns: CompanyInterviewPattern[]) {
    const focusAreas = this.identifyFocusAreas(questions);
    const timeAllocation = this.getTimeAllocationPattern(questions);
    
    // Convert time allocation to percentages
    const totalTime = Object.values(timeAllocation).reduce((sum, time) => sum + time, 0);
    const timePercentages: Record<string, number> = {};
    Object.entries(timeAllocation).forEach(([category, time]) => {
      timePercentages[category] = (time / totalTime) * 100;
    });

    // Extract key skills from tags
    const keySkills = questions
      .flatMap(q => q.tags)
      .reduce((skills, tag) => {
        if (!skills.includes(tag.name)) {
          skills.push(tag.name);
        }
        return skills;
      }, [] as string[])
      .slice(0, 10);

    return {
      focusAreas,
      timeAllocation: timePercentages,
      keySkills
    };
  }

  private static groupByCategory(questions: CompanyQuestion[]): Record<string, number> {
    const groups: Record<string, number> = {};
    questions.forEach(q => {
      groups[q.category] = (groups[q.category] || 0) + 1;
    });
    return groups;
  }

  private static groupByDifficulty(questions: CompanyQuestion[]): Record<string, number> {
    const groups: Record<string, number> = {};
    questions.forEach(q => {
      groups[q.difficulty] = (groups[q.difficulty] || 0) + 1;
    });
    return groups;
  }

  private static groupByRole(questions: CompanyQuestion[]): Record<string, number> {
    const groups: Record<string, number> = {};
    questions.forEach(q => {
      q.roleIds.forEach(roleId => {
        groups[roleId] = (groups[roleId] || 0) + 1;
      });
    });
    return groups;
  }

  private static inferCategory(question: string): CompanyQuestion['category'] {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('design') || lowerQuestion.includes('system') || lowerQuestion.includes('architecture')) {
      return 'system-design';
    }
    if (lowerQuestion.includes('code') || lowerQuestion.includes('implement') || lowerQuestion.includes('algorithm')) {
      return 'coding';
    }
    if (lowerQuestion.includes('tell me about') || lowerQuestion.includes('describe a time')) {
      return 'behavioral';
    }
    if (lowerQuestion.includes('case') || lowerQuestion.includes('scenario')) {
      return 'case-studies';
    }
    
    return 'technical';
  }

  private static inferPrimaryTag(question: string): string {
    const tags = this.inferTags(question);
    return tags.length > 0 ? tags[0].id : 'general';
  }

  private static inferTags(question: string): CompanyQuestionTag[] {
    const lowerQuestion = question.toLowerCase();
    const matchedTags: CompanyQuestionTag[] = [];

    this.tagDatabase.forEach(tag => {
      if (lowerQuestion.includes(tag.name.toLowerCase()) || 
          lowerQuestion.includes(tag.id.replace('-', ' '))) {
        matchedTags.push(tag);
      }
    });

    // If no tags matched, return a default tag
    if (matchedTags.length === 0) {
      matchedTags.push(this.tagDatabase.find(t => t.id === 'problem-solving')!);
    }

    return matchedTags;
  }
}

export default CompanyQuestionService;