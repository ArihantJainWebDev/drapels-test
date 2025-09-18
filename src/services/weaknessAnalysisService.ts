import { AdaptiveDifficultyService, UserPerformanceData } from './adaptiveDifficultyService';

export interface WeaknessArea {
  category: string;
  accuracy: number;
  questionsAttempted: number;
  improvement: number;
  priority: 'high' | 'medium' | 'low';
  recommendedActions: string[];
}

export interface StudyRecommendation {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  category: string;
  priority: number;
  resources: {
    type: 'quiz' | 'practice' | 'reading';
    url?: string;
    description: string;
  }[];
}

export interface AnalyticsData {
  weaknessAreas: WeaknessArea[];
  recommendations: StudyRecommendation[];
  overallStats: {
    totalQuizzes: number;
    averageScore: number;
    improvementTrend: number;
    strongestCategory: string;
    weakestCategory: string;
  };
}

export class WeaknessAnalysisService {
  /**
   * Analyze user performance to identify weakness areas
   */
  static async identifyWeaknesses(
    userId: string,
    performanceData: UserPerformanceData
  ): Promise<WeaknessArea[]> {
    try {
      const weaknesses: WeaknessArea[] = [];

      // Analyze domain performance
      if (performanceData.domainPerformance) {
        Object.entries(performanceData.domainPerformance).forEach(([domain, perf]) => {
          if (perf.accuracy < 70 && perf.questionsAnswered > 5) {
            const improvement = this.calculateImprovement(perf.recentScores || []);
            
            weaknesses.push({
              category: domain,
              accuracy: perf.accuracy,
              questionsAttempted: perf.questionsAnswered,
              improvement,
              priority: this.determinePriority(perf.accuracy, perf.questionsAnswered),
              recommendedActions: this.generateRecommendedActions(domain, perf.accuracy)
            });
          }
        });
      }

      // Sort by priority and accuracy
      return weaknesses.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return a.accuracy - b.accuracy;
      });

    } catch (error) {
      console.error('Error identifying weaknesses:', error);
      throw new Error('Failed to analyze weaknesses');
    }
  }

  /**
   * Generate personalized study recommendations
   */
  static async generateRecommendations(
    userId: string,
    weaknessAreas: WeaknessArea[],
    performanceData: UserPerformanceData
  ): Promise<StudyRecommendation[]> {
    try {
      const recommendations: StudyRecommendation[] = [];

      // Generate recommendations for each weakness area
      weaknessAreas.slice(0, 5).forEach((weakness, index) => {
        const rec = this.createRecommendationForWeakness(weakness, index + 1);
        recommendations.push(rec);
      });

      // Add general improvement recommendations
      if (performanceData.averageScore < 80) {
        recommendations.push({
          id: 'general-improvement',
          title: 'Comprehensive Review Session',
          description: 'Review fundamental concepts across all categories to build a stronger foundation',
          estimatedTime: '3-4 hours',
          difficulty: 'Medium',
          category: 'General',
          priority: recommendations.length + 1,
          resources: [
            {
              type: 'reading',
              description: 'Review core computer science concepts'
            },
            {
              type: 'practice',
              description: 'Mixed difficulty practice problems'
            }
          ]
        });
      }

      return recommendations;

    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate study recommendations');
    }
  }

  /**
   * Get comprehensive analytics data
   */
  static async getAnalyticsData(userId: string): Promise<AnalyticsData> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get user performance data
      const performanceData = await AdaptiveDifficultyService.getUserPerformanceData(userId);
      
      // Identify weaknesses
      const weaknessAreas = await this.identifyWeaknesses(userId, performanceData);
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(userId, weaknessAreas, performanceData);
      
      // Calculate overall stats
      const overallStats = this.calculateOverallStats(performanceData, weaknessAreas);

      return {
        weaknessAreas,
        recommendations,
        overallStats
      };

    } catch (error) {
      console.error('Error getting analytics data:', error);
      throw new Error('Failed to load analytics data');
    }
  }

  private static calculateImprovement(recentScores: number[]): number {
    if (recentScores.length < 2) return 0;
    
    const recent = recentScores.slice(-3);
    const older = recentScores.slice(-6, -3);
    
    if (older.length === 0) return 0;
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    return Math.round(recentAvg - olderAvg);
  }

  private static determinePriority(accuracy: number, questionsAttempted: number): 'high' | 'medium' | 'low' {
    if (accuracy < 60 && questionsAttempted > 10) return 'high';
    if (accuracy < 70 && questionsAttempted > 5) return 'medium';
    return 'low';
  }

  private static generateRecommendedActions(category: string, accuracy: number): string[] {
    const actions = [];
    
    if (accuracy < 50) {
      actions.push('Review fundamental concepts');
      actions.push('Start with easier problems');
    } else if (accuracy < 70) {
      actions.push('Practice medium difficulty problems');
      actions.push('Focus on common patterns');
    }
    
    actions.push(`Take targeted ${category} quizzes`);
    actions.push('Review incorrect answers');
    
    return actions;
  }

  private static createRecommendationForWeakness(weakness: WeaknessArea, priority: number): StudyRecommendation {
    const difficultyMap = {
      high: 'Easy',
      medium: 'Medium',
      low: 'Hard'
    };

    const timeMap = {
      high: '4-6 hours',
      medium: '2-3 hours',
      low: '1-2 hours'
    };

    return {
      id: `weakness-${weakness.category.toLowerCase().replace(/\s+/g, '-')}`,
      title: `Improve ${weakness.category} Skills`,
      description: `Focus on ${weakness.category} fundamentals and practice targeted problems`,
      estimatedTime: timeMap[weakness.priority],
      difficulty: difficultyMap[weakness.priority],
      category: weakness.category,
      priority,
      resources: [
        {
          type: 'quiz',
          description: `Take ${weakness.category} focused quizzes`
        },
        {
          type: 'practice',
          description: `Practice ${weakness.category} problems`
        }
      ]
    };
  }

  private static calculateOverallStats(
    performanceData: UserPerformanceData,
    weaknessAreas: WeaknessArea[]
  ) {
    const domainPerfs = Object.values(performanceData.domainPerformance || {});
    
    let strongestCategory = 'N/A';
    let weakestCategory = 'N/A';
    
    if (domainPerfs.length > 0) {
      const strongest = domainPerfs.reduce((a, b) => a.accuracy > b.accuracy ? a : b);
      const weakest = domainPerfs.reduce((a, b) => a.accuracy < b.accuracy ? a : b);
      
      strongestCategory = Object.keys(performanceData.domainPerformance || {})
        .find((key: any) => performanceData.domainPerformance![key] === strongest) || 'N/A';
      weakestCategory = Object.keys(performanceData.domainPerformance || {})
        .find((key: any) => performanceData.domainPerformance![key] === weakest) || 'N/A';
    }

    return {
      totalQuizzes: performanceData.totalQuizzes,
      averageScore: Math.round(performanceData.averageScore),
      improvementTrend: this.calculateImprovement((performanceData.recentScores || []) as number[]),
      strongestCategory,
      weakestCategory
    };
  }
}

export default WeaknessAnalysisService;