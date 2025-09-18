import { UserPerformanceData, WeaknessArea, LearningPath, RecentPerformance, DomainPerformance, DifficultyPerformance } from './adaptiveDifficultyService';
import { QuizParams } from '@/lib/quiz-api';

export interface WeaknessIdentificationResult {
  criticalWeaknesses: IdentifiedWeakness[];
  moderateWeaknesses: IdentifiedWeakness[];
  improvingAreas: IdentifiedWeakness[];
  analysisConfidence: number;
  recommendedFocusAreas: string[];
}

export interface IdentifiedWeakness {
  area: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  accuracy: number;
  questionsAttempted: number;
  averageTimeSpent: number;
  difficultyDistribution: { [key: string]: number };
  trendAnalysis: TrendAnalysis;
  rootCauses: string[];
  impactScore: number;
  urgencyScore: number;
}

export interface TrendAnalysis {
  direction: 'improving' | 'declining' | 'stable';
  rate: number;
  confidence: number;
  recentPerformance: number[];
  projectedImprovement: number;
}

export interface PersonalizedStudyPlan {
  planId: string;
  userId: string;
  generatedAt: Date;
  targetGoals: StudyGoal[];
  weeklySchedule: WeeklySchedule[];
  milestones: StudyMilestone[];
  adaptiveAdjustments: PlanAdjustment[];
  estimatedDuration: string;
  difficultyProgression: DifficultyProgression;
  focusDistribution: FocusDistribution;
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetAccuracy: number;
  targetDifficulty: string;
  estimatedQuizzes: number;
  priority: 'high' | 'medium' | 'low';
  deadline: Date;
  prerequisites: string[];
  successCriteria: string[];
}

export interface WeeklySchedule {
  week: number;
  focusAreas: string[];
  recommendedQuizzes: number;
  difficultyMix: { [key: string]: number };
  practiceTime: number;
  reviewTime: number;
  goals: string[];
}

export interface StudyMilestone {
  id: string;
  title: string;
  description: string;
  targetWeek: number;
  requiredAccuracy: number;
  assessmentCriteria: string[];
  rewards: string[];
  isCompleted: boolean;
  completedAt?: Date;
}

export interface PlanAdjustment {
  date: Date;
  reason: string;
  adjustmentType: 'difficulty' | 'focus' | 'schedule' | 'goals';
  previousValue: any;
  newValue: any;
  expectedImpact: string;
}

export interface DifficultyProgression {
  startingDifficulty: string;
  targetDifficulty: string;
  progressionSteps: ProgressionStep[];
  adaptiveThresholds: { [key: string]: number };
}

export interface ProgressionStep {
  week: number;
  difficulty: string;
  requiredAccuracy: number;
  minimumQuizzes: number;
  advancementCriteria: string[];
}

export interface FocusDistribution {
  weaknessAreas: number;
  strengthReinforcement: number;
  newTopics: number;
  review: number;
}

export interface ProgressVisualization {
  overallProgress: ProgressMetric[];
  domainProgress: DomainProgressMetric[];
  difficultyProgress: DifficultyProgressMetric[];
  timeSeriesData: TimeSeriesPoint[];
  performanceHeatmap: HeatmapData[];
  comparisonMetrics: ComparisonMetric[];
}

export interface ProgressMetric {
  metric: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  changeRate: number;
  projectedTarget: number;
}

export interface DomainProgressMetric {
  domain: string;
  accuracy: number;
  questionsAnswered: number;
  timeSpent: number;
  masteryLevel: 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert';
  progressRate: number;
  nextMilestone: string;
}

export interface DifficultyProgressMetric {
  difficulty: string;
  accuracy: number;
  confidence: number;
  questionsAnswered: number;
  averageTime: number;
  masteryStatus: 'not-started' | 'learning' | 'practicing' | 'mastered';
  recommendedNext: boolean;
}

export interface TimeSeriesPoint {
  date: string;
  accuracy: number;
  questionsAnswered: number;
  averageTime: number;
  difficulty: string;
  domain: string;
}

export interface HeatmapData {
  domain: string;
  difficulty: string;
  accuracy: number;
  questionsCount: number;
  color: string;
}

export interface ComparisonMetric {
  metric: string;
  userValue: number;
  peerAverage: number;
  topPercentile: number;
  industryBenchmark: number;
  percentileRank: number;
}

export interface TargetedRecommendation {
  id: string;
  type: 'quiz' | 'practice' | 'review' | 'study';
  title: string;
  description: string;
  targetWeakness: string;
  difficulty: string;
  estimatedTime: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  expectedImprovement: number;
  prerequisites: string[];
  resources: RecommendationResource[];
  successMetrics: string[];
}

export interface RecommendationResource {
  type: 'quiz' | 'documentation' | 'practice' | 'video' | 'article';
  title: string;
  url: string;
  description: string;
  estimatedTime: number;
  difficulty: string;
}

interface TargetGoals {
  targetRole: string;
  targetCompany: string;
  timeframe: number;
  currentLevel: string;
  targetLevel: string;
}

export class AdvancedAnalyticsService {
  
  static async identifyWeaknesses(
    userPerformance: UserPerformanceData,
    recentQuizHistory?: any[]
  ): Promise<WeaknessIdentificationResult> {
    try {
      const criticalWeaknesses = await this.analyzeCriticalWeaknesses(userPerformance);
      const moderateWeaknesses = await this.analyzeModerateWeaknesses(userPerformance);
      const improvingAreas = await this.analyzeImprovingAreas(userPerformance);
      
      const analysisConfidence = this.calculateAnalysisConfidence(userPerformance);
      
      const recommendedFocusAreas = this.determineRecommendedFocusAreas(
        criticalWeaknesses,
        moderateWeaknesses,
        userPerformance
      );

      return {
        criticalWeaknesses,
        moderateWeaknesses,
        improvingAreas,
        analysisConfidence,
        recommendedFocusAreas
      };
    } catch (error) {
      console.error('Error identifying weaknesses:', error);
      throw new Error('Failed to identify user weaknesses');
    }
  }

  static async generatePersonalizedStudyPlan(
    userId: string,
    userPerformance: UserPerformanceData,
    targetGoals: TargetGoals,
    weaknessAnalysis: WeaknessIdentificationResult
  ): Promise<PersonalizedStudyPlan> {
    try {
      const studyGoals = await this.generateStudyGoals(
        targetGoals,
        weaknessAnalysis,
        userPerformance
      );
      
      const weeklySchedule = await this.createWeeklySchedule(
        studyGoals,
        targetGoals.timeframe,
        userPerformance
      );
      
      const milestones = await this.createStudyMilestones(
        studyGoals,
        targetGoals.timeframe
      );
      
      const difficultyProgression = this.createDifficultyProgression(
        targetGoals.currentLevel,
        targetGoals.targetLevel,
        targetGoals.timeframe
      );
      
      const focusDistribution = this.calculateFocusDistribution(weaknessAnalysis);

      return {
        planId: `plan_${userId}_${Date.now()}`,
        userId,
        generatedAt: new Date(),
        targetGoals: studyGoals,
        weeklySchedule,
        milestones,
        adaptiveAdjustments: [],
        estimatedDuration: `${targetGoals.timeframe} weeks`,
        difficultyProgression,
        focusDistribution
      };
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw new Error('Failed to generate personalized study plan');
    }
  }

  static async generateProgressVisualization(
    userPerformance: UserPerformanceData,
    timeframe: 'week' | 'month' | 'quarter' | 'all' = 'month'
  ): Promise<ProgressVisualization> {
    try {
      const overallProgress = this.generateOverallProgressMetrics(userPerformance);
      const domainProgress = this.generateDomainProgressMetrics(userPerformance);
      const difficultyProgress = this.generateDifficultyProgressMetrics(userPerformance);
      const timeSeriesData = this.generateTimeSeriesData(userPerformance, timeframe);
      const performanceHeatmap = this.generatePerformanceHeatmap(userPerformance);
      const comparisonMetrics = await this.generateComparisonMetrics(userPerformance);

      return {
        overallProgress,
        domainProgress,
        difficultyProgress,
        timeSeriesData,
        performanceHeatmap,
        comparisonMetrics
      };
    } catch (error) {
      console.error('Error generating progress visualization:', error);
      throw new Error('Failed to generate progress visualization');
    }
  }

  static async generateTargetedRecommendations(
    userPerformance: UserPerformanceData,
    weaknessAnalysis: WeaknessIdentificationResult,
    studyPlan?: PersonalizedStudyPlan
  ): Promise<TargetedRecommendation[]> {
    try {
      const recommendations: TargetedRecommendation[] = [];
      
      for (const weakness of weaknessAnalysis.criticalWeaknesses) {
        const recommendation = await this.createWeaknessRecommendation(
          weakness,
          'urgent',
          userPerformance
        );
        recommendations.push(recommendation);
      }
      
      for (const weakness of weaknessAnalysis.moderateWeaknesses.slice(0, 3)) {
        const recommendation = await this.createWeaknessRecommendation(
          weakness,
          'high',
          userPerformance
        );
        recommendations.push(recommendation);
      }
      
      const reinforcementRecs = await this.generateReinforcementRecommendations(
        userPerformance
      );
      recommendations.push(...reinforcementRecs);
      
      const explorationRecs = await this.generateExplorationRecommendations(
        userPerformance,
        studyPlan
      );
      recommendations.push(...explorationRecs);
      
      return recommendations.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.expectedImprovement - a.expectedImprovement;
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate targeted recommendations');
    }
  }

  // Private helper methods

  private static async analyzeCriticalWeaknesses(
    userPerformance: UserPerformanceData
  ): Promise<IdentifiedWeakness[]> {
    return userPerformance.weaknessAreas
      .filter(w => w.severity === 'critical' || w.severity === 'high')
      .map(weakness => this.enhanceWeaknessAnalysis(weakness, userPerformance))
      .sort((a, b) => b.impactScore - a.impactScore);
  }

  private static async analyzeModerateWeaknesses(
    userPerformance: UserPerformanceData
  ): Promise<IdentifiedWeakness[]> {
    return userPerformance.weaknessAreas
      .filter(w => w.severity === 'medium')
      .map(weakness => this.enhanceWeaknessAnalysis(weakness, userPerformance))
      .sort((a, b) => b.urgencyScore - a.urgencyScore);
  }

  private static async analyzeImprovingAreas(
    userPerformance: UserPerformanceData
  ): Promise<IdentifiedWeakness[]> {
    return userPerformance.weaknessAreas
      .filter(w => w.improvementTrend > 0)
      .map(weakness => this.enhanceWeaknessAnalysis(weakness, userPerformance))
      .sort((a, b) => b.trendAnalysis.rate - a.trendAnalysis.rate);
  }

  private static enhanceWeaknessAnalysis(
    weakness: WeaknessArea,
    userPerformance: UserPerformanceData
  ): IdentifiedWeakness {
    const trendAnalysis = this.calculateTrendAnalysis(weakness, userPerformance);
    const rootCauses = this.identifyRootCauses(weakness, userPerformance);
    const impactScore = this.calculateImpactScore(weakness, userPerformance);
    const urgencyScore = this.calculateUrgencyScore(weakness, userPerformance);
    const difficultyDistribution = this.getDifficultyDistribution(weakness, userPerformance);

    return {
      area: weakness.area,
      severity: weakness.severity,
      accuracy: weakness.accuracy,
      questionsAttempted: weakness.questionsAttempted,
      averageTimeSpent: this.calculateAverageTimeSpent(weakness, userPerformance),
      difficultyDistribution,
      trendAnalysis,
      rootCauses,
      impactScore,
      urgencyScore
    };
  }

  private static calculateTrendAnalysis(
    weakness: WeaknessArea,
    userPerformance: UserPerformanceData
  ): TrendAnalysis {
    const recentPerformance = userPerformance.recentPerformance
      .filter(p => p.domain.includes(weakness.area))
      .slice(-10)
      .map(p => (p.questionsCorrect / p.totalQuestions) * 100);

    if (recentPerformance.length < 3) {
      return {
        direction: 'stable',
        rate: 0,
        confidence: 0.3,
        recentPerformance,
        projectedImprovement: 0
      };
    }

    const firstHalf = recentPerformance.slice(0, Math.floor(recentPerformance.length / 2));
    const secondHalf = recentPerformance.slice(Math.floor(recentPerformance.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const rate = secondAvg - firstAvg;
    const direction = rate > 2 ? 'improving' : rate < -2 ? 'declining' : 'stable';
    
    const variance = recentPerformance.reduce((sum, val) => {
      const avg = recentPerformance.reduce((s, v) => s + v, 0) / recentPerformance.length;
      return sum + Math.pow(val - avg, 2);
    }, 0) / recentPerformance.length;
    
    const confidence = Math.max(0.3, Math.min(0.95, 1 - (variance / 1000)));

    return {
      direction,
      rate,
      confidence,
      recentPerformance,
      projectedImprovement: rate * 4
    };
  }

  private static identifyRootCauses(
    weakness: WeaknessArea,
    userPerformance: UserPerformanceData
  ): string[] {
    const causes: string[] = [];
    
    if (weakness.accuracy < 40) {
      causes.push('Fundamental knowledge gaps in core concepts');
    } else if (weakness.accuracy < 60) {
      causes.push('Inconsistent application of learned concepts');
    }
    
    if (weakness.questionsAttempted < 10) {
      causes.push('Insufficient practice volume');
    }
    
    const domainPerf = userPerformance.domainPerformance.find(d => 
      d.domain.toLowerCase().includes(weakness.area.toLowerCase())
    );
    
    if (domainPerf) {
      const easyQuestions = domainPerf.difficultyDistribution['Easy'] || 0;
      const hardQuestions = domainPerf.difficultyDistribution['Hard'] || 0;
      
      if (easyQuestions > hardQuestions * 3) {
        causes.push('Over-reliance on easy difficulty questions');
      }
      
      if (domainPerf.averageTimeSpent > 180) {
        causes.push('Time management issues affecting performance');
      }
    }
    
    if (weakness.improvementTrend < -0.1) {
      causes.push('Declining performance indicates need for strategy change');
    }

    return causes.length > 0 ? causes : ['Requires focused practice and review'];
  }

  private static calculateImpactScore(
    weakness: WeaknessArea,
    userPerformance: UserPerformanceData
  ): number {
    let score = 0;
    
    const severityScores: { [key: string]: number } = { 
      critical: 40, high: 30, medium: 20, low: 10 
    };
    score += severityScores[weakness.severity] || 10;
    
    const frequencyScore = Math.min(30, weakness.questionsAttempted * 2);
    score += frequencyScore;
    
    const accuracyImpact = Math.max(0, 30 - (weakness.accuracy * 0.3));
    score += accuracyImpact;
    
    return Math.min(100, score);
  }

  private static calculateUrgencyScore(
    weakness: WeaknessArea,
    userPerformance: UserPerformanceData
  ): number {
    let score = 0;
    
    const severityUrgency: { [key: string]: number } = { 
      critical: 50, high: 35, medium: 20, low: 10 
    };
    score += severityUrgency[weakness.severity] || 10;
    
    if (weakness.improvementTrend < -0.1) {
      score += 30;
    } else if (weakness.improvementTrend < 0) {
      score += 15;
    }
    
    const domainPerf = userPerformance.domainPerformance.find(d => 
      d.domain.toLowerCase().includes(weakness.area.toLowerCase())
    );
    
    if (domainPerf) {
      const daysSinceLastAttempt = Math.floor(
        (Date.now() - domainPerf.lastAttempted.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastAttempt < 7) {
        score += 20;
      } else if (daysSinceLastAttempt < 30) {
        score += 10;
      }
    }
    
    return Math.min(100, score);
  }

  private static getDifficultyDistribution(
    weakness: WeaknessArea,
    userPerformance: UserPerformanceData
  ): { [key: string]: number } {
    const domainPerf = userPerformance.domainPerformance.find(d => 
      d.domain.toLowerCase().includes(weakness.area.toLowerCase())
    );
    
    return domainPerf?.difficultyDistribution || { Easy: 0, Medium: 0, Hard: 0, Expert: 0 };
  }

  private static calculateAverageTimeSpent(
    weakness: WeaknessArea,
    userPerformance: UserPerformanceData
  ): number {
    const domainPerf = userPerformance.domainPerformance.find(d => 
      d.domain.toLowerCase().includes(weakness.area.toLowerCase())
    );
    
    return domainPerf?.averageTimeSpent || 0;
  }

  private static calculateAnalysisConfidence(userPerformance: UserPerformanceData): number {
    let confidence = 0.5;
    
    if (userPerformance.totalQuizzes > 20) confidence += 0.2;
    if (userPerformance.totalQuestions > 200) confidence += 0.1;
    
    const recentQuizzes = userPerformance.recentPerformance.filter(p => {
      const daysSince = (Date.now() - p.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 30;
    });
    
    if (recentQuizzes.length > 5) confidence += 0.1;
    if (userPerformance.consistencyScore > 70) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }

  private static determineRecommendedFocusAreas(
    criticalWeaknesses: IdentifiedWeakness[],
    moderateWeaknesses: IdentifiedWeakness[],
    userPerformance: UserPerformanceData
  ): string[] {
    const focusAreas: string[] = [];
    
    focusAreas.push(...criticalWeaknesses.slice(0, 2).map(w => w.area));
    
    const remainingSlots = 3 - focusAreas.length;
    if (remainingSlots > 0) {
      focusAreas.push(...moderateWeaknesses.slice(0, remainingSlots).map(w => w.area));
    }
    
    return focusAreas;
  }

  private static async generateStudyGoals(
    targetGoals: TargetGoals,
    weaknessAnalysis: WeaknessIdentificationResult,
    userPerformance: UserPerformanceData
  ): Promise<StudyGoal[]> {
    const goals: StudyGoal[] = [];
    
    weaknessAnalysis.criticalWeaknesses.forEach((weakness, index) => {
      goals.push({
        id: `goal_critical_${index}`,
        title: `Master ${weakness.area}`,
        description: `Improve accuracy in ${weakness.area} from ${weakness.accuracy.toFixed(1)}% to 75%+`,
        targetAccuracy: 75,
        targetDifficulty: weakness.severity === 'critical' ? 'Easy' : 'Medium',
        estimatedQuizzes: Math.max(15, Math.ceil(weakness.questionsAttempted * 1.5)),
        priority: 'high',
        deadline: new Date(Date.now() + (targetGoals.timeframe * 0.6 * 7 * 24 * 60 * 60 * 1000)),
        prerequisites: [],
        successCriteria: [
          `Achieve 75%+ accuracy in ${weakness.area}`,
          `Complete at least 15 practice questions`,
          `Demonstrate consistent improvement over 2 weeks`
        ]
      });
    });
    
    const currentLevel = targetGoals.currentLevel;
    const targetLevel = targetGoals.targetLevel;
    
    if (currentLevel !== targetLevel) {
      goals.push({
        id: 'goal_advancement',
        title: `Advance from ${currentLevel} to ${targetLevel}`,
        description: `Progress through difficulty levels to reach ${targetLevel} proficiency`,
        targetAccuracy: this.getTargetAccuracyForLevel(targetLevel),
        targetDifficulty: this.mapLevelToDifficulty(targetLevel),
        estimatedQuizzes: this.estimateQuizzesForAdvancement(currentLevel, targetLevel),
        priority: 'medium',
        deadline: new Date(Date.now() + (targetGoals.timeframe * 7 * 24 * 60 * 60 * 1000)),
        prerequisites: goals.filter(g => g.priority === 'high').map(g => g.id),
        successCriteria: [
          `Consistently perform at ${targetLevel} level`,
          `Master prerequisite skills`,
          `Demonstrate readiness for ${targetGoals.targetCompany} interviews`
        ]
      });
    }
    
    return goals;
  }

  private static async createWeeklySchedule(
    studyGoals: StudyGoal[],
    totalWeeks: number,
    userPerformance: UserPerformanceData
  ): Promise<WeeklySchedule[]> {
    const schedule: WeeklySchedule[] = [];
    
    for (let week = 1; week <= totalWeeks; week++) {
      const weekProgress = week / totalWeeks;
      
      const focusAreas = this.determineFocusAreasForWeek(studyGoals, weekProgress);
      
      const baseQuizzes = 8;
      const velocityMultiplier = Math.max(0.5, Math.min(1.5, userPerformance.learningVelocity / 70));
      const recommendedQuizzes = Math.round(baseQuizzes * velocityMultiplier);
      
      const difficultyMix = this.createDifficultyMixForWeek(weekProgress, userPerformance);
      
      const practiceTime = recommendedQuizzes * 45;
      const reviewTime = Math.round(practiceTime * 0.3);
      
      const weekGoals = studyGoals
        .filter(goal => {
          const goalWeek = Math.ceil((goal.deadline.getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000));
          return goalWeek >= totalWeeks - week;
        })
        .map(goal => goal.title);

      schedule.push({
        week,
        focusAreas,
        recommendedQuizzes,
        difficultyMix,
        practiceTime,
        reviewTime,
        goals: weekGoals
      });
    }
    
    return schedule;
  }

  private static async createStudyMilestones(
    studyGoals: StudyGoal[],
    totalWeeks: number
  ): Promise<StudyMilestone[]> {
    const milestones: StudyMilestone[] = [];
    
    const milestoneWeeks = [
      Math.ceil(totalWeeks * 0.25),
      Math.ceil(totalWeeks * 0.5),
      Math.ceil(totalWeeks * 0.75),
      totalWeeks
    ];
    
    milestoneWeeks.forEach((week, index) => {
      const progress = (index + 1) / 4;
      
      milestones.push({
        id: `milestone_${week}`,
        title: `Week ${week} Checkpoint`,
        description: `Assess progress and adjust study plan as needed`,
        targetWeek: week,
        requiredAccuracy: 60 + (progress * 20),
        assessmentCriteria: [
          `Complete ${Math.ceil(progress * 100)}% of planned quizzes`,
          `Achieve target accuracy in focus areas`,
          `Demonstrate improvement in identified weaknesses`
        ],
        rewards: [
          'Progress badge',
          'Personalized feedback report',
          'Next phase recommendations'
        ],
        isCompleted: false
      });
    });
    
    return milestones;
  }

  // Helper methods for calculation
  private static getTargetAccuracyForLevel(level: string): number {
    const accuracyMap: { [key: string]: number } = {
      'Beginner': 60,
      'Developing': 70,
      'Intermediate': 75,
      'Advanced': 80,
      'Expert': 85
    };
    return accuracyMap[level] || 70;
  }

  private static mapLevelToDifficulty(level: string): string {
    const difficultyMap: { [key: string]: string } = {
      'Beginner': 'Easy',
      'Developing': 'Medium',
      'Intermediate': 'Medium',
      'Advanced': 'Hard',
      'Expert': 'Expert'
    };
    return difficultyMap[level] || 'Medium';
  }

  private static estimateQuizzesForAdvancement(currentLevel: string, targetLevel: string): number {
    const levels = ['Beginner', 'Developing', 'Intermediate', 'Advanced', 'Expert'];
    const currentIndex = levels.indexOf(currentLevel);
    const targetIndex = levels.indexOf(targetLevel);
    const levelDiff = Math.max(1, targetIndex - currentIndex);
    return 20 * levelDiff;
  }

  private static determineFocusAreasForWeek(studyGoals: StudyGoal[], weekProgress: number): string[] {
    // Simplified implementation
    return studyGoals.slice(0, 3).map(goal => goal.title.replace('Master ', ''));
  }

  private static createDifficultyMixForWeek(weekProgress: number, userPerformance: UserPerformanceData): { [key: string]: number } {
    const baseEasy = 40 - (weekProgress * 20);
    const baseMedium = 40;
    const baseHard = 20 + (weekProgress * 20);
    
    return {
      Easy: Math.max(20, baseEasy),
      Medium: baseMedium,
      Hard: Math.min(40, baseHard)
    };
  }

  private static createDifficultyProgression(
    currentLevel: string,
    targetLevel: string,
    totalWeeks: number
  ): DifficultyProgression {
    const levels = ['Beginner', 'Developing', 'Intermediate', 'Advanced', 'Expert'];
    const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
    
    const currentIndex = levels.indexOf(currentLevel);
    const targetIndex = levels.indexOf(targetLevel);
    
    const progressionSteps: ProgressionStep[] = [];
    
    for (let week = 1; week <= totalWeeks; week++) {
      const progress = week / totalWeeks;
      const levelProgress = currentIndex + (progress * (targetIndex - currentIndex));
      const difficultyIndex = Math.min(difficulties.length - 1, Math.floor(levelProgress));
      
      progressionSteps.push({
        week,
        difficulty: difficulties[difficultyIndex],
        requiredAccuracy: 60 + (progress * 20),
        minimumQuizzes: Math.ceil(8 * (1 + progress * 0.5)),
        advancementCriteria: [
          `Maintain ${(60 + progress * 20).toFixed(0)}% accuracy`,
          `Complete minimum quiz requirements`,
          `Show consistent improvement trend`
        ]
      });
    }
    
    return {
      startingDifficulty: this.mapLevelToDifficulty(currentLevel),
      targetDifficulty: this.mapLevelToDifficulty(targetLevel),
      progressionSteps,
      adaptiveThresholds: {
        'Easy': 75,
        'Medium': 70,
        'Hard': 65,
        'Expert': 60
      }
    };
  }

  private static calculateFocusDistribution(
    weaknessAnalysis: WeaknessIdentificationResult
  ): FocusDistribution {
    const totalWeaknesses = weaknessAnalysis.criticalWeaknesses.length + 
                           weaknessAnalysis.moderateWeaknesses.length;
    
    if (totalWeaknesses === 0) {
      return {
        weaknessAreas: 30,
        strengthReinforcement: 40,
        newTopics: 20,
        review: 10
      };
    }
    
    // Adjust distribution based on weakness severity
    const criticalCount = weaknessAnalysis.criticalWeaknesses.length;
    const moderateCount = weaknessAnalysis.moderateWeaknesses.length;
    
    let weaknessPercentage = 40;
    if (criticalCount > 2) weaknessPercentage = 60;
    else if (criticalCount > 0) weaknessPercentage = 50;
    
    return {
      weaknessAreas: weaknessPercentage,
      strengthReinforcement: Math.max(20, 50 - weaknessPercentage),
      newTopics: Math.max(10, 30 - weaknessPercentage),
      review: 10
    };
  }

  private static generateOverallProgressMetrics(
    userPerformance: UserPerformanceData
  ): ProgressMetric[] {
    return [
      {
        metric: 'Overall Accuracy',
        current: userPerformance.accuracy,
        target: 80,
        trend: this.calculateTrend(userPerformance.accuracy, 75),
        changeRate: this.calculateChangeRate(userPerformance.recentPerformance, 'accuracy'),
        projectedTarget: this.projectTarget(userPerformance.accuracy, userPerformance.learningVelocity)
      },
      {
        metric: 'Learning Velocity',
        current: userPerformance.learningVelocity,
        target: 80,
        trend: this.calculateTrend(userPerformance.learningVelocity, 70),
        changeRate: this.calculateChangeRate(userPerformance.recentPerformance, 'velocity'),
        projectedTarget: Math.min(95, userPerformance.learningVelocity + 10)
      },
      {
        metric: 'Consistency Score',
        current: userPerformance.consistencyScore,
        target: 85,
        trend: this.calculateTrend(userPerformance.consistencyScore, 75),
        changeRate: 0,
        projectedTarget: Math.min(95, userPerformance.consistencyScore + 5)
      }
    ];
  }

  private static generateDomainProgressMetrics(
    userPerformance: UserPerformanceData
  ): DomainProgressMetric[] {
    return userPerformance.domainPerformance.map(domain => ({
      domain: domain.domain,
      accuracy: domain.accuracy,
      questionsAnswered: domain.questionsAnswered,
      timeSpent: domain.averageTimeSpent,
      masteryLevel: this.calculateMasteryLevel(domain.accuracy, domain.questionsAnswered),
      progressRate: this.calculateProgressRate(domain),
      nextMilestone: this.getNextMilestone(domain)
    }));
  }

  private static generateDifficultyProgressMetrics(
    userPerformance: UserPerformanceData
  ): DifficultyProgressMetric[] {
    return userPerformance.difficultyPerformance.map(difficulty => ({
      difficulty: difficulty.difficulty,
      accuracy: difficulty.accuracy,
      confidence: difficulty.confidenceLevel,
      questionsAnswered: difficulty.questionsAnswered,
      averageTime: difficulty.averageTimeSpent,
      masteryStatus: this.calculateMasteryStatus(difficulty),
      recommendedNext: this.shouldRecommendDifficulty(difficulty, userPerformance)
    }));
  }

  private static generateTimeSeriesData(
    userPerformance: UserPerformanceData,
    timeframe: string
  ): TimeSeriesPoint[] {
    return userPerformance.recentPerformance
      .filter(p => this.isWithinTimeframe(p.date, timeframe))
      .map(p => ({
        date: p.date.toISOString().split('T')[0],
        accuracy: (p.questionsCorrect / p.totalQuestions) * 100,
        questionsAnswered: p.totalQuestions,
        averageTime: p.timeSpent / p.totalQuestions,
        difficulty: p.difficulty,
        domain: p.domain
      }));
  }

  private static generatePerformanceHeatmap(
    userPerformance: UserPerformanceData
  ): HeatmapData[] {
    const heatmapData: HeatmapData[] = [];
    const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
    
    userPerformance.domainPerformance.forEach(domain => {
      difficulties.forEach(difficulty => {
        const questionsCount = domain.difficultyDistribution[difficulty] || 0;
        const accuracy = this.estimateAccuracyForDomainDifficulty(domain, difficulty, userPerformance);
        
        heatmapData.push({
          domain: domain.domain,
          difficulty,
          accuracy,
          questionsCount,
          color: this.getHeatmapColor(accuracy)
        });
      });
    });
    
    return heatmapData;
  }

  private static async generateComparisonMetrics(
    userPerformance: UserPerformanceData
  ): Promise<ComparisonMetric[]> {
    // Mock benchmark data - in real implementation, this would come from database
    const benchmarks = {
      accuracy: { peer: 65, top: 85, industry: 70 },
      velocity: { peer: 60, top: 90, industry: 65 },
      consistency: { peer: 70, top: 88, industry: 72 }
    };
    
    return [
      {
        metric: 'Overall Accuracy',
        userValue: userPerformance.accuracy,
        peerAverage: benchmarks.accuracy.peer,
        topPercentile: benchmarks.accuracy.top,
        industryBenchmark: benchmarks.accuracy.industry,
        percentileRank: this.calculatePercentileRank(userPerformance.accuracy, benchmarks.accuracy.peer)
      },
      {
        metric: 'Learning Velocity',
        userValue: userPerformance.learningVelocity,
        peerAverage: benchmarks.velocity.peer,
        topPercentile: benchmarks.velocity.top,
        industryBenchmark: benchmarks.velocity.industry,
        percentileRank: this.calculatePercentileRank(userPerformance.learningVelocity, benchmarks.velocity.peer)
      }
    ];
  }

  private static async createWeaknessRecommendation(
    weakness: IdentifiedWeakness,
    priority: 'urgent' | 'high' | 'medium' | 'low',
    userPerformance: UserPerformanceData
  ): Promise<TargetedRecommendation> {
    const estimatedTime = this.estimateTimeForWeakness(weakness);
    const expectedImprovement = this.calculateExpectedImprovement(weakness);
    
    return {
      id: `rec_${weakness.area.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      type: 'quiz',
      title: `Targeted Practice: ${weakness.area}`,
      description: `Focus on improving ${weakness.area} with adaptive difficulty progression`,
      targetWeakness: weakness.area,
      difficulty: this.getRecommendedDifficulty(weakness),
      estimatedTime,
      priority,
      expectedImprovement,
      prerequisites: this.getPrerequisites(weakness),
      resources: await this.generateResourcesForWeakness(weakness),
      successMetrics: [
        `Achieve 75%+ accuracy in ${weakness.area}`,
        `Complete 15+ practice questions`,
        `Reduce average time per question by 20%`
      ]
    };
  }

  private static async generateReinforcementRecommendations(
    userPerformance: UserPerformanceData
  ): Promise<TargetedRecommendation[]> {
    const strongDomains = userPerformance.domainPerformance
      .filter(d => d.accuracy > 75)
      .slice(0, 2);
    
    return strongDomains.map(domain => ({
      id: `rec_reinforce_${domain.domain.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      type: 'practice',
      title: `Reinforce Strength: ${domain.domain}`,
      description: `Maintain and enhance your strong performance in ${domain.domain}`,
      targetWeakness: '',
      difficulty: 'Hard',
      estimatedTime: 30,
      priority: 'medium' as const,
      expectedImprovement: 5,
      prerequisites: [],
      resources: [
        {
          type: 'quiz',
          title: `Advanced ${domain.domain} Practice`,
          url: `/quiz?domain=${encodeURIComponent(domain.domain)}&difficulty=Hard`,
          description: `Challenge yourself with advanced ${domain.domain} questions`,
          estimatedTime: 45,
          difficulty: 'Hard'
        }
      ],
      successMetrics: [
        `Maintain 80%+ accuracy`,
        `Attempt harder difficulty levels`,
        `Reduce time per question`
      ]
    }));
  }

  private static async generateExplorationRecommendations(
    userPerformance: UserPerformanceData,
    studyPlan?: PersonalizedStudyPlan
  ): Promise<TargetedRecommendation[]> {
    // Identify domains with low question counts (unexplored areas)
    const unexploredDomains = ['System Design', 'Database Design', 'API Design']
      .filter(domain => !userPerformance.domainPerformance.some(d => d.domain === domain));
    
    return unexploredDomains.slice(0, 2).map(domain => ({
      id: `rec_explore_${domain.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      type: 'study',
      title: `Explore New Area: ${domain}`,
      description: `Begin learning ${domain} concepts and fundamentals`,
      targetWeakness: '',
      difficulty: 'Easy',
      estimatedTime: 60,
      priority: 'low' as const,
      expectedImprovement: 15,
      prerequisites: [],
      resources: [
        {
          type: 'documentation',
          title: `${domain} Fundamentals`,
          url: `/documentation?topic=${encodeURIComponent(domain)}`,
          description: `Learn the basics of ${domain}`,
          estimatedTime: 30,
          difficulty: 'Easy'
        },
        {
          type: 'quiz',
          title: `${domain} Practice Quiz`,
          url: `/quiz?domain=${encodeURIComponent(domain)}&difficulty=Easy`,
          description: `Practice ${domain} with beginner-friendly questions`,
          estimatedTime: 30,
          difficulty: 'Easy'
        }
      ],
      successMetrics: [
        `Complete introduction to ${domain}`,
        `Achieve basic understanding`,
        `Ready for intermediate topics`
      ]
    }));
  }

  // Missing helper methods implementation
  private static calculateTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
    const difference = current - previous;
    if (difference > 2) return 'up';
    if (difference < -2) return 'down';
    return 'stable';
  }

  private static calculateChangeRate(
    recentPerformance: RecentPerformance[],
    metric: 'accuracy' | 'velocity'
  ): number {
    if (recentPerformance.length < 2) return 0;
    
    const recent = recentPerformance.slice(0, 5);
    const older = recentPerformance.slice(5, 10);
    
    if (older.length === 0) return 0;
    
    const recentAvg = metric === 'accuracy' 
      ? recent.reduce((sum, p) => sum + (p.questionsCorrect / p.totalQuestions) * 100, 0) / recent.length
      : recent.reduce((sum, p) => sum + p.score, 0) / recent.length;
      
    const olderAvg = metric === 'accuracy'
      ? older.reduce((sum, p) => sum + (p.questionsCorrect / p.totalQuestions) * 100, 0) / older.length
      : older.reduce((sum, p) => sum + p.score, 0) / older.length;
    
    return recentAvg - olderAvg;
  }

  private static projectTarget(current: number, velocity: number): number {
    const improvementFactor = Math.max(0.1, Math.min(1.5, velocity / 70));
    return Math.min(95, current + (10 * improvementFactor));
  }

  private static calculateMasteryLevel(
    accuracy: number,
    questionsAnswered: number
  ): 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert' {
    if (questionsAnswered < 10) return 'novice';
    if (accuracy >= 85 && questionsAnswered >= 30) return 'expert';
    if (accuracy >= 75 && questionsAnswered >= 20) return 'advanced';
    if (accuracy >= 65 && questionsAnswered >= 15) return 'proficient';
    if (accuracy >= 50) return 'developing';
    return 'novice';
  }

  private static calculateProgressRate(domain: DomainPerformance): number {
    // Simplified calculation based on accuracy and question volume
    const accuracyFactor = Math.max(0, domain.accuracy - 50) / 50;
    const volumeFactor = Math.min(1, domain.questionsAnswered / 50);
    return Math.round((accuracyFactor * volumeFactor) * 100);
  }

  private static getNextMilestone(domain: DomainPerformance): string {
    if (domain.accuracy < 50) return 'Achieve 50% accuracy';
    if (domain.accuracy < 65) return 'Reach proficient level (65% accuracy)';
    if (domain.accuracy < 75) return 'Reach advanced level (75% accuracy)';
    if (domain.accuracy < 85) return 'Achieve expert level (85% accuracy)';
    return 'Maintain expert performance';
  }

  private static calculateMasteryStatus(
    difficulty: DifficultyPerformance
  ): 'not-started' | 'learning' | 'practicing' | 'mastered' {
    if (difficulty.questionsAnswered === 0) return 'not-started';
    if (difficulty.questionsAnswered < 10) return 'learning';
    if (difficulty.accuracy < 70) return 'practicing';
    return 'mastered';
  }

  private static shouldRecommendDifficulty(
    difficulty: DifficultyPerformance,
    userPerformance: UserPerformanceData
  ): boolean {
    // Recommend if user hasn't tried this difficulty much and has good overall performance
    return difficulty.questionsAnswered < 15 && userPerformance.accuracy > 60;
  }

  private static isWithinTimeframe(date: Date, timeframe: string): boolean {
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (timeframe) {
      case 'week': return daysDiff <= 7;
      case 'month': return daysDiff <= 30;
      case 'quarter': return daysDiff <= 90;
      case 'all': return true;
      default: return daysDiff <= 30;
    }
  }

  private static estimateAccuracyForDomainDifficulty(
    domain: DomainPerformance,
    difficulty: string,
    userPerformance: UserPerformanceData
  ): number {
    const questionsCount = domain.difficultyDistribution[difficulty] || 0;
    if (questionsCount === 0) {
      // Estimate based on overall domain performance and difficulty adjustment
      const difficultyMultipliers: { [key: string]: number } = {
        'Easy': 1.2,
        'Medium': 1.0,
        'Hard': 0.8,
        'Expert': 0.6
      };
      return Math.min(100, domain.accuracy * (difficultyMultipliers[difficulty] || 1.0));
    }
    
    // Use actual performance for this difficulty if available
    return domain.accuracy;
  }

  private static getHeatmapColor(accuracy: number): string {
    if (accuracy >= 80) return '#22c55e'; // Green
    if (accuracy >= 60) return '#eab308'; // Yellow
    if (accuracy >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  }

  private static calculatePercentileRank(userValue: number, peerAverage: number): number {
    // Simplified percentile calculation
    const ratio = userValue / Math.max(1, peerAverage);
    if (ratio >= 1.3) return 90;
    if (ratio >= 1.15) return 75;
    if (ratio >= 1.0) return 60;
    if (ratio >= 0.85) return 40;
    if (ratio >= 0.7) return 25;
    return 10;
  }

  private static estimateTimeForWeakness(weakness: IdentifiedWeakness): number {
    const severityMultipliers: { [key: string]: number } = {
      'critical': 90,
      'high': 60,
      'medium': 45,
      'low': 30
    };
    return severityMultipliers[weakness.severity] || 45;
  }

  private static calculateExpectedImprovement(weakness: IdentifiedWeakness): number {
    const baseImprovement = Math.max(5, (100 - weakness.accuracy) * 0.3);
    const severityBonus = weakness.severity === 'critical' ? 10 : weakness.severity === 'high' ? 5 : 0;
    return Math.min(30, Math.round(baseImprovement + severityBonus));
  }

  private static getRecommendedDifficulty(weakness: IdentifiedWeakness): string {
    if (weakness.accuracy < 40) return 'Easy';
    if (weakness.accuracy < 60) return 'Easy';
    if (weakness.accuracy < 75) return 'Medium';
    return 'Hard';
  }

  private static getPrerequisites(weakness: IdentifiedWeakness): string[] {
    if (weakness.severity === 'critical') {
      return ['Review fundamental concepts', 'Complete basic exercises'];
    }
    if (weakness.severity === 'high') {
      return ['Strengthen foundational knowledge'];
    }
    return [];
  }

  private static async generateResourcesForWeakness(
    weakness: IdentifiedWeakness
  ): Promise<RecommendationResource[]> {
    return [
      {
        type: 'quiz',
        title: `${weakness.area} Practice Quiz`,
        url: `/quiz?domain=${encodeURIComponent(weakness.area)}&difficulty=${this.getRecommendedDifficulty(weakness)}`,
        description: `Focused practice for ${weakness.area}`,
        estimatedTime: this.estimateTimeForWeakness(weakness),
        difficulty: this.getRecommendedDifficulty(weakness)
      },
      {
        type: 'documentation',
        title: `${weakness.area} Study Guide`,
        url: `/documentation?topic=${encodeURIComponent(weakness.area)}`,
        description: `Comprehensive guide for ${weakness.area}`,
        estimatedTime: 20,
        difficulty: 'Easy'
      }
    ];
  }
}