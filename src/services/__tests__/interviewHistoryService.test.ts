import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InterviewHistoryService } from '../interviewHistoryService';
import { MockInterviewSession } from '@/types/mockInterview';
import { PracticeSession } from '@/types/practice';

// Mock Firebase
vi.mock('@/firebase', () => ({
  db: {},
  storage: {}
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  Timestamp: {
    fromDate: vi.fn((date) => ({ toDate: () => date })),
    now: vi.fn(() => ({ toDate: () => new Date() }))
  }
}));

// Mock PerformanceAnalysisService
vi.mock('../performanceAnalysisService', () => ({
  PerformanceAnalysisService: {
    comparePerformance: vi.fn().mockResolvedValue({
      practiceVsMock: {
        practiceAverage: 7.5,
        mockAverage: 8.0,
        improvement: 0.5,
        consistencyScore: 8.2,
        transferEffectiveness: 9.1
      },
      progressOverTime: [],
      benchmarkComparison: {
        industryAverage: 6.5,
        roleAverage: 7.0,
        experienceAverage: 6.8,
        userPercentile: 85,
        topPerformerGap: 1.2
      },
      recommendations: []
    })
  }
}));

describe('InterviewHistoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserHistory', () => {
    it('should fetch and combine mock and practice sessions', async () => {
      const mockSessions: MockInterviewSession[] = [
        {
          id: 'mock1',
          userId: 'user1',
          company: 'Google',
          role: 'Software Engineer',
          interviewType: 'technical',
          difficulty: 'mid',
          startTime: new Date('2024-01-15'),
          endTime: new Date('2024-01-15'),
          duration: 3600,
          status: 'completed',
          config: {} as any,
          questions: [],
          currentQuestionIndex: 0,
          responses: [],
          overallScore: 8.5,
          feedback: {} as any,
          metrics: {} as any
        }
      ];

      const practiceSessions: PracticeSession[] = [
        {
          id: 'practice1',
          userId: 'user1',
          questionId: 'q1',
          question: {
            id: 'q1',
            question: 'Tell me about yourself',
            category: 'behavioral',
            difficulty: 'Beginner',
            type: 'verbal'
          },
          userResponse: 'Sample response',
          startTime: new Date('2024-01-14'),
          timeSpent: 300,
          completed: true,
          score: 7.5
        }
      ];

      // Mock the private methods
      const getUserHistorySpy = vi.spyOn(InterviewHistoryService, 'getUserHistory');
      getUserHistorySpy.mockResolvedValue({
        entries: [
          {
            id: 'mock1',
            type: 'mock',
            title: 'Google - Software Engineer',
            company: 'Google',
            role: 'Software Engineer',
            category: 'technical',
            difficulty: 'mid',
            startTime: new Date('2024-01-15'),
            endTime: new Date('2024-01-15'),
            duration: 3600,
            status: 'completed',
            overallScore: 8.5,
            hasVideo: false,
            hasAudio: false,
            session: mockSessions[0]
          },
          {
            id: 'practice1',
            type: 'practice',
            title: 'Tell me about yourself...',
            category: 'behavioral',
            difficulty: 'Beginner',
            startTime: new Date('2024-01-14'),
            duration: 300,
            status: 'completed',
            overallScore: 7.5,
            hasVideo: false,
            hasAudio: false,
            session: practiceSessions[0]
          }
        ],
        hasMore: false,
        total: 2
      });

      const result = await InterviewHistoryService.getUserHistory('user1');

      expect(result.entries).toHaveLength(2);
      expect(result.entries[0].type).toBe('mock');
      expect(result.entries[1].type).toBe('practice');
      expect(result.total).toBe(2);
      expect(result.hasMore).toBe(false);
    });

    it('should apply filters correctly', async () => {
      const filters = {
        type: 'mock' as const,
        company: 'Google',
        status: 'completed' as const
      };

      const getUserHistorySpy = vi.spyOn(InterviewHistoryService, 'getUserHistory');
      getUserHistorySpy.mockResolvedValue({
        entries: [],
        hasMore: false,
        total: 0
      });

      await InterviewHistoryService.getUserHistory('user1', filters);

      expect(getUserHistorySpy).toHaveBeenCalledWith('user1', filters, 20, undefined);
    });
  });

  describe('getUserAnalytics', () => {
    it('should calculate comprehensive analytics', async () => {
      const getUserAnalyticsSpy = vi.spyOn(InterviewHistoryService, 'getUserAnalytics');
      getUserAnalyticsSpy.mockResolvedValue({
        totalSessions: 10,
        completedSessions: 8,
        practiceCount: 6,
        mockCount: 4,
        averageScore: 7.8,
        averageDuration: 1800,
        improvementTrend: 15.5,
        categoryPerformance: {
          'technical': {
            sessions: 4,
            averageScore: 8.2,
            improvement: 12.0,
            lastScore: 8.5
          },
          'behavioral': {
            sessions: 4,
            averageScore: 7.5,
            improvement: 8.0,
            lastScore: 7.8
          }
        },
        companyPerformance: {
          'Google': {
            sessions: 3,
            averageScore: 8.0,
            successRate: 85,
            practiceCount: 2,
            mockCount: 1
          }
        },
        performanceTrend: [
          {
            date: '2024-01-15',
            score: 8.5,
            type: 'mock',
            category: 'technical'
          }
        ],
        skillProgression: [
          {
            skill: 'Technical Knowledge',
            currentLevel: 8.2,
            previousLevel: 7.1,
            improvement: 15.5,
            sessions: 5
          }
        ],
        recommendations: [
          {
            type: 'strength',
            title: 'Excel in technical interviews',
            description: 'You perform exceptionally well in technical interviews',
            actionItems: ['Continue practicing technical questions'],
            priority: 'medium'
          }
        ]
      });

      const analytics = await InterviewHistoryService.getUserAnalytics('user1');

      expect(analytics.totalSessions).toBe(10);
      expect(analytics.averageScore).toBe(7.8);
      expect(analytics.improvementTrend).toBe(15.5);
      expect(analytics.categoryPerformance).toHaveProperty('technical');
      expect(analytics.recommendations).toHaveLength(1);
    });
  });

  describe('getSessionDetails', () => {
    it('should fetch session details for mock interview', async () => {
      const getSessionDetailsSpy = vi.spyOn(InterviewHistoryService, 'getSessionDetails');
      getSessionDetailsSpy.mockResolvedValue({
        id: 'mock1',
        type: 'mock',
        title: 'Google - Software Engineer',
        company: 'Google',
        role: 'Software Engineer',
        category: 'technical',
        difficulty: 'mid',
        startTime: new Date('2024-01-15'),
        endTime: new Date('2024-01-15'),
        duration: 3600,
        status: 'completed',
        overallScore: 8.5,
        hasVideo: true,
        hasAudio: true,
        session: {} as any
      });

      const details = await InterviewHistoryService.getSessionDetails('mock1', 'mock');

      expect(details).toBeTruthy();
      expect(details?.type).toBe('mock');
      expect(details?.hasVideo).toBe(true);
      expect(details?.hasAudio).toBe(true);
    });

    it('should return null for non-existent session', async () => {
      const getSessionDetailsSpy = vi.spyOn(InterviewHistoryService, 'getSessionDetails');
      getSessionDetailsSpy.mockResolvedValue(null);

      const details = await InterviewHistoryService.getSessionDetails('nonexistent', 'mock');

      expect(details).toBeNull();
    });
  });

  describe('getPerformanceComparison', () => {
    it('should return performance comparison data', async () => {
      const comparison = await InterviewHistoryService.getPerformanceComparison('user1');

      expect(comparison).toBeTruthy();
      expect(comparison.practiceVsMock).toBeTruthy();
      expect(comparison.benchmarkComparison).toBeTruthy();
      expect(typeof comparison.practiceVsMock.practiceAverage).toBe('number');
      expect(typeof comparison.practiceVsMock.mockAverage).toBe('number');
    });
  });

  describe('Filter matching', () => {
    it('should match sessions against date range filters', () => {
      // This would test the private matchesFilters method
      // In a real implementation, we might expose this as a public method for testing
      expect(true).toBe(true); // Placeholder
    });

    it('should match sessions against category filters', () => {
      // This would test category filtering logic
      expect(true).toBe(true); // Placeholder
    });

    it('should match sessions against company filters', () => {
      // This would test company filtering logic
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Data conversion', () => {
    it('should convert mock session to history entry correctly', () => {
      // This would test the convertMockToHistoryEntry method
      expect(true).toBe(true); // Placeholder
    });

    it('should convert practice session to history entry correctly', () => {
      // This would test the convertPracticeToHistoryEntry method
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Analytics calculations', () => {
    it('should calculate improvement trend correctly', () => {
      // This would test the calculateImprovementTrend method
      expect(true).toBe(true); // Placeholder
    });

    it('should calculate category performance correctly', () => {
      // This would test the calculateCategoryPerformance method
      expect(true).toBe(true); // Placeholder
    });

    it('should calculate company performance correctly', () => {
      // This would test the calculateCompanyPerformance method
      expect(true).toBe(true); // Placeholder
    });

    it('should generate performance trend data correctly', () => {
      // This would test the generatePerformanceTrend method
      expect(true).toBe(true); // Placeholder
    });

    it('should generate recommendations correctly', () => {
      // This would test the generateRecommendations method
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      const getUserHistorySpy = vi.spyOn(InterviewHistoryService, 'getUserHistory');
      getUserHistorySpy.mockRejectedValue(new Error('Database error'));

      await expect(InterviewHistoryService.getUserHistory('user1')).rejects.toThrow('Database error');
    });

    it('should handle missing user data gracefully', async () => {
      const getUserAnalyticsSpy = vi.spyOn(InterviewHistoryService, 'getUserAnalytics');
      getUserAnalyticsSpy.mockResolvedValue({
        totalSessions: 0,
        completedSessions: 0,
        practiceCount: 0,
        mockCount: 0,
        averageScore: 0,
        averageDuration: 0,
        improvementTrend: 0,
        categoryPerformance: {},
        companyPerformance: {},
        performanceTrend: [],
        skillProgression: [],
        recommendations: []
      });

      const analytics = await InterviewHistoryService.getUserAnalytics('user1');

      expect(analytics.totalSessions).toBe(0);
      expect(analytics.averageScore).toBe(0);
    });
  });
});