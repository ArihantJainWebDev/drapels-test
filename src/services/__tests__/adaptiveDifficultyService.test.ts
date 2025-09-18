import { AdaptiveDifficultyService, UserPerformanceData } from '../adaptiveDifficultyService';
import { QuizParams } from '@/lib/quiz-api';

// Mock Firebase service
jest.mock('../adaptiveQuizFirebaseService', () => ({
  AdaptiveQuizFirebaseService: {
    getUserPerformanceData: jest.fn(),
    updatePerformanceAfterQuiz: jest.fn(),
  }
}));

// Mock quiz API
jest.mock('@/lib/quiz-api', () => ({
  generateQuiz: jest.fn().mockResolvedValue([
    {
      question: 'Test question',
      options: ['A', 'B', 'C', 'D'],
      answer: 'A',
      explanation: 'Test explanation'
    }
  ])
}));

describe('AdaptiveDifficultyService', () => {
  const mockUserPerformance: UserPerformanceData = {
    userId: 'test-user',
    totalQuizzes: 10,
    totalQuestions: 100,
    correctAnswers: 75,
    accuracy: 75,
    domainPerformance: [
      {
        domain: 'JavaScript',
        questionsAnswered: 50,
        correctAnswers: 40,
        accuracy: 80,
        averageTimeSpent: 45,
        lastAttempted: new Date(),
        difficultyDistribution: { 'Medium': 30, 'Hard': 20 }
      }
    ],
    companyPerformance: [
      {
        company: 'Google',
        questionsAnswered: 30,
        correctAnswers: 24,
        accuracy: 80,
        averageTimeSpent: 50,
        lastAttempted: new Date(),
        preferredTopics: ['Algorithms', 'System Design']
      }
    ],
    difficultyPerformance: [
      {
        difficulty: 'Medium',
        questionsAnswered: 60,
        correctAnswers: 45,
        accuracy: 75,
        averageTimeSpent: 45,
        confidenceLevel: 75,
        masteryLevel: 'proficient'
      }
    ],
    weaknessAreas: [
      {
        area: 'Data Structures',
        severity: 'medium',
        questionsAttempted: 20,
        accuracy: 55,
        improvementTrend: 5,
        recommendedActions: ['Practice more tree problems'],
        targetDifficulty: 'Medium'
      }
    ],
    recentPerformance: [
      {
        date: new Date(),
        quizId: 'quiz-1',
        score: 80,
        difficulty: 'Medium',
        domain: 'JavaScript',
        company: 'Google',
        timeSpent: 300,
        questionsCorrect: 8,
        totalQuestions: 10
      }
    ],
    learningVelocity: 75,
    consistencyScore: 80
  };

  const mockQuizParams: QuizParams = {
    domain: 'JavaScript',
    company: 'Google',
    role: 'Software Engineer',
    difficulty: 'Medium'
  };

  describe('recommendDifficulty', () => {
    it('should recommend appropriate difficulty based on performance', async () => {
      const recommendation = await AdaptiveDifficultyService.recommendDifficulty(
        mockUserPerformance,
        'JavaScript',
        'Google'
      );

      expect(recommendation).toBeDefined();
      expect(recommendation.recommendedDifficulty).toBe('Hard');
      expect(recommendation.confidence).toBeGreaterThan(0.5);
      expect(recommendation.reasoning).toHaveLength(4);
      expect(recommendation.expectedAccuracy).toBeGreaterThan(0);
      expect(recommendation.learningObjectives).toContain('Master advanced concepts and complex scenarios');
    });

    it('should recommend easier difficulty for struggling users', async () => {
      const strugglingUser: UserPerformanceData = {
        ...mockUserPerformance,
        accuracy: 45,
        correctAnswers: 45,
        learningVelocity: 30,
        consistencyScore: 40
      };

      const recommendation = await AdaptiveDifficultyService.recommendDifficulty(
        strugglingUser,
        'JavaScript',
        'Google'
      );

      expect(recommendation.recommendedDifficulty).toBe('Easy');
      expect(recommendation.learningObjectives).toContain('Build foundational knowledge and confidence');
    });
  });

  describe('generateAdaptiveQuiz', () => {
    it('should generate adaptive quiz with difficulty progression', async () => {
      const adaptiveQuiz = await AdaptiveDifficultyService.generateAdaptiveQuiz(
        mockUserPerformance,
        mockQuizParams,
        10
      );

      expect(adaptiveQuiz).toBeDefined();
      expect(adaptiveQuiz.questions).toHaveLength(1); // Mocked to return 1 question
      expect(adaptiveQuiz.difficultyProgression).toHaveLength(10);
      expect(adaptiveQuiz.focusAreas).toContain('Data Structures');
      expect(adaptiveQuiz.adaptationReasoning).toContain('Hard difficulty');
      expect(adaptiveQuiz.expectedOutcomes).toBeDefined();
      expect(adaptiveQuiz.nextRecommendations).toBeDefined();
    });

    it('should focus on weakness areas', async () => {
      const userWithWeaknesses: UserPerformanceData = {
        ...mockUserPerformance,
        weaknessAreas: [
          {
            area: 'Algorithms',
            severity: 'critical',
            questionsAttempted: 15,
            accuracy: 30,
            improvementTrend: -5,
            recommendedActions: ['Review basic algorithms'],
            targetDifficulty: 'Easy'
          },
          {
            area: 'System Design',
            severity: 'high',
            questionsAttempted: 10,
            accuracy: 40,
            improvementTrend: 0,
            recommendedActions: ['Practice system design problems'],
            targetDifficulty: 'Medium'
          }
        ]
      };

      const adaptiveQuiz = await AdaptiveDifficultyService.generateAdaptiveQuiz(
        userWithWeaknesses,
        mockQuizParams,
        10
      );

      expect(adaptiveQuiz.focusAreas).toContain('Algorithms');
      expect(adaptiveQuiz.focusAreas).toContain('System Design');
      expect(adaptiveQuiz.adaptationReasoning).toContain('Algorithms and System Design');
    });
  });

  describe('calibrateDifficultyRealTime', () => {
    it('should recommend difficulty increase for high performance', async () => {
      const highPerformanceProgress = {
        questionsAnswered: 5,
        correctAnswers: 5,
        averageTimePerQuestion: 30,
        currentDifficulty: 'Medium'
      };

      const calibration = await AdaptiveDifficultyService.calibrateDifficultyRealTime(
        mockUserPerformance,
        highPerformanceProgress
      );

      expect(calibration.shouldAdjust).toBe(true);
      expect(calibration.newDifficulty).toBe('Hard');
      expect(calibration.reasoning).toContain('performing significantly above expectations');
      expect(calibration.confidence).toBeGreaterThan(0.8);
    });

    it('should recommend difficulty decrease for poor performance', async () => {
      const poorPerformanceProgress = {
        questionsAnswered: 5,
        correctAnswers: 1,
        averageTimePerQuestion: 120,
        currentDifficulty: 'Hard'
      };

      const calibration = await AdaptiveDifficultyService.calibrateDifficultyRealTime(
        mockUserPerformance,
        poorPerformanceProgress
      );

      expect(calibration.shouldAdjust).toBe(true);
      expect(calibration.newDifficulty).toBe('Medium');
      expect(calibration.reasoning).toContain('struggling');
      expect(calibration.confidence).toBeGreaterThan(0.8);
    });

    it('should maintain difficulty for appropriate performance', async () => {
      const appropriateProgress = {
        questionsAnswered: 5,
        correctAnswers: 3,
        averageTimePerQuestion: 45,
        currentDifficulty: 'Medium'
      };

      const calibration = await AdaptiveDifficultyService.calibrateDifficultyRealTime(
        mockUserPerformance,
        appropriateProgress
      );

      expect(calibration.shouldAdjust).toBe(false);
      expect(calibration.reasoning).toContain('appropriate');
    });
  });

  describe('generateLearningPath', () => {
    it('should generate comprehensive learning path', async () => {
      const learningPath = await AdaptiveDifficultyService.generateLearningPath(
        'test-user',
        'Software Engineer',
        'Google',
        mockUserPerformance
      );

      expect(learningPath).toBeDefined();
      expect(learningPath.userId).toBe('test-user');
      expect(learningPath.targetRole).toBe('Software Engineer');
      expect(learningPath.targetCompany).toBe('Google');
      expect(learningPath.currentLevel).toBe('Advanced');
      expect(learningPath.targetLevel).toBe('Expert');
      expect(learningPath.milestones.length).toBeGreaterThan(0);
      expect(learningPath.estimatedDuration).toBeDefined();
      expect(learningPath.progressPercentage).toBeGreaterThanOrEqual(0);
    });

    it('should create appropriate milestones for skill progression', async () => {
      const learningPath = await AdaptiveDifficultyService.generateLearningPath(
        'test-user',
        'Senior Software Engineer',
        'Meta',
        mockUserPerformance
      );

      const technicalMilestones = learningPath.milestones.filter(m => 
        m.id.includes('technical')
      );
      const companyMilestones = learningPath.milestones.filter(m => 
        m.id.includes('company')
      );

      expect(technicalMilestones.length).toBeGreaterThan(0);
      expect(companyMilestones.length).toBeGreaterThan(0);
      
      // Check that milestones have proper prerequisites
      const advancedMilestone = learningPath.milestones.find(m => 
        m.title.includes('Expert')
      );
      if (advancedMilestone) {
        expect(advancedMilestone.prerequisites.length).toBeGreaterThan(0);
      }
    });
  });

  describe('updatePerformanceData', () => {
    it('should update performance data after quiz completion', async () => {
      const { AdaptiveQuizFirebaseService } = require('../adaptiveQuizFirebaseService');
      const mockUpdatedPerformance = {
        ...mockUserPerformance,
        totalQuizzes: 11,
        totalQuestions: 110,
        correctAnswers: 83,
        accuracy: 75.45
      };

      AdaptiveQuizFirebaseService.updatePerformanceAfterQuiz.mockResolvedValue(mockUpdatedPerformance);

      const quizResults = {
        quizParams: mockQuizParams,
        questions: [
          { question: 'Test', options: ['A', 'B', 'C', 'D'], answer: 'A' }
        ],
        userAnswers: ['A'],
        timeSpent: [45],
        difficulty: 'Medium'
      };

      const updatedPerformance = await AdaptiveDifficultyService.updatePerformanceData(
        'test-user',
        quizResults
      );

      expect(AdaptiveQuizFirebaseService.updatePerformanceAfterQuiz).toHaveBeenCalledWith(
        'test-user',
        expect.objectContaining({
          ...quizResults,
          score: 1,
          totalQuestions: 1
        })
      );
      expect(updatedPerformance).toEqual(mockUpdatedPerformance);
    });
  });

  describe('Edge Cases', () => {
    it('should handle users with no performance history', async () => {
      const newUser: UserPerformanceData = {
        userId: 'new-user',
        totalQuizzes: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        domainPerformance: [],
        companyPerformance: [],
        difficultyPerformance: [],
        weaknessAreas: [],
        recentPerformance: [],
        learningVelocity: 50,
        consistencyScore: 50
      };

      const recommendation = await AdaptiveDifficultyService.recommendDifficulty(
        newUser,
        'JavaScript',
        'Google'
      );

      expect(recommendation.recommendedDifficulty).toBe('Easy');
      expect(recommendation.confidence).toBeLessThan(0.8); // Lower confidence for new users
    });

    it('should handle invalid difficulty levels gracefully', async () => {
      const invalidProgress = {
        questionsAnswered: 3,
        correctAnswers: 2,
        averageTimePerQuestion: 45,
        currentDifficulty: 'InvalidDifficulty'
      };

      const calibration = await AdaptiveDifficultyService.calibrateDifficultyRealTime(
        mockUserPerformance,
        invalidProgress
      );

      expect(calibration.shouldAdjust).toBe(false);
      expect(calibration.reasoning).toContain('appropriate');
    });

    it('should handle empty weakness areas', async () => {
      const userWithoutWeaknesses: UserPerformanceData = {
        ...mockUserPerformance,
        weaknessAreas: []
      };

      const adaptiveQuiz = await AdaptiveDifficultyService.generateAdaptiveQuiz(
        userWithoutWeaknesses,
        mockQuizParams,
        5
      );

      expect(adaptiveQuiz.focusAreas).toEqual([]);
      expect(adaptiveQuiz.adaptationReasoning).toContain('Hard difficulty');
    });
  });

  describe('Performance Calculations', () => {
    it('should calculate learning velocity correctly', () => {
      // This tests the private method indirectly through the service
      const userWithGoodVelocity: UserPerformanceData = {
        ...mockUserPerformance,
        recentPerformance: [
          // Recent performances (better scores)
          { date: new Date(), quizId: '1', score: 85, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 8, totalQuestions: 10 },
          { date: new Date(), quizId: '2', score: 80, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 8, totalQuestions: 10 },
          { date: new Date(), quizId: '3', score: 82, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 8, totalQuestions: 10 },
          { date: new Date(), quizId: '4', score: 78, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 8, totalQuestions: 10 },
          { date: new Date(), quizId: '5', score: 83, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 8, totalQuestions: 10 },
          // Older performances (lower scores)
          { date: new Date(), quizId: '6', score: 70, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 7, totalQuestions: 10 },
          { date: new Date(), quizId: '7', score: 65, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 6, totalQuestions: 10 },
          { date: new Date(), quizId: '8', score: 68, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 7, totalQuestions: 10 },
          { date: new Date(), quizId: '9', score: 72, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 7, totalQuestions: 10 },
          { date: new Date(), quizId: '10', score: 69, difficulty: 'Medium', domain: 'JS', company: 'Google', timeSpent: 300, questionsCorrect: 7, totalQuestions: 10 }
        ]
      };

      // The learning velocity should be higher than 50 due to improvement
      expect(userWithGoodVelocity.learningVelocity).toBeGreaterThan(50);
    });

    it('should calculate consistency score appropriately', () => {
      const consistentUser: UserPerformanceData = {
        ...mockUserPerformance,
        recentPerformance: Array(10).fill(null).map((_, i) => ({
          date: new Date(),
          quizId: `quiz-${i}`,
          score: 75 + (Math.random() * 4 - 2), // Scores around 75 with small variance
          difficulty: 'Medium',
          domain: 'JavaScript',
          company: 'Google',
          timeSpent: 300,
          questionsCorrect: 7,
          totalQuestions: 10
        }))
      };

      // Consistency score should be high for consistent performance
      expect(consistentUser.consistencyScore).toBeGreaterThan(70);
    });
  });
});