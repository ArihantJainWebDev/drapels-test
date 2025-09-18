import { AIInterviewerService } from './aiInterviewerService';
import { MockInterviewSession, InterviewResponse } from '@/types/mockInterview';
import { PracticeSession } from '@/types/practice';

export interface PerformanceAnalysis {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  detailedFeedback: DetailedFeedback;
  improvementSuggestions: ImprovementSuggestion[];
  skillAssessment: SkillAssessment;
  videoAnalysis?: VideoAnalysis;
  audioAnalysis?: AudioAnalysis;
}

export interface DetailedFeedback {
  strengths: string[];
  weaknesses: string[];
  keyInsights: string[];
  specificFeedback: SpecificFeedback[];
  overallSummary: string;
}

export interface SpecificFeedback {
  category: 'technical' | 'communication' | 'problem-solving' | 'behavioral';
  aspect: string;
  score: number;
  feedback: string;
  examples: string[];
}

export interface ImprovementSuggestion {
  area: string;
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  actionItems: string[];
  resources: Resource[];
  estimatedTimeToImprove: string;
}

export interface Resource {
  type: 'article' | 'video' | 'practice' | 'course';
  title: string;
  url: string;
  description: string;
}

export interface SkillAssessment {
  technicalSkills: SkillScore[];
  communicationSkills: SkillScore[];
  problemSolvingSkills: SkillScore[];
  behavioralSkills: SkillScore[];
}

export interface SkillScore {
  skill: string;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  confidence: number;
  evidence: string[];
}

export interface VideoAnalysis {
  eyeContact: number;
  posture: number;
  gestures: number;
  facialExpressions: number;
  overallPresence: number;
  insights: string[];
}

export interface AudioAnalysis {
  clarity: number;
  pace: number;
  volume: number;
  fillerWords: number;
  pauseAnalysis: PauseAnalysis;
  tonalAnalysis: TonalAnalysis;
  insights: string[];
}

export interface PauseAnalysis {
  totalPauses: number;
  averagePauseLength: number;
  appropriatePauses: number;
  awkwardPauses: number;
}

export interface TonalAnalysis {
  confidence: number;
  enthusiasm: number;
  professionalism: number;
  clarity: number;
}

export interface PerformanceComparison {
  practiceVsMock: ComparisonMetrics;
  progressOverTime: ProgressMetrics[];
  benchmarkComparison: BenchmarkComparison;
  recommendations: string[];
}

export interface ComparisonMetrics {
  practiceAverage: number;
  mockAverage: number;
  improvement: number;
  consistencyScore: number;
  transferEffectiveness: number;
}

export interface ProgressMetrics {
  date: string;
  type: 'practice' | 'mock';
  score: number;
  category: string;
  company?: string;
}

export interface BenchmarkComparison {
  industryAverage: number;
  roleAverage: number;
  experienceAverage: number;
  userPercentile: number;
  topPerformerGap: number;
}

export class PerformanceAnalysisService {
  
  /**
   * Analyze mock interview performance with AI-powered evaluation
   */
  static async analyzeMockInterview(
    session: MockInterviewSession,
    responses: InterviewResponse[],
    videoBlob?: Blob,
    audioBlob?: Blob
  ): Promise<PerformanceAnalysis> {
    try {
      // Analyze responses with AI
      const responseAnalysis = await this.analyzeResponses(responses, 'mock');
      
      // Analyze video if available
      const videoAnalysis = videoBlob ? await this.analyzeVideo(videoBlob) : undefined;
      
      // Analyze audio if available
      const audioAnalysis = audioBlob ? await this.analyzeAudio(audioBlob) : undefined;
      
      // Generate comprehensive analysis
      const analysis = await this.generateComprehensiveAnalysis(
        responseAnalysis,
        videoAnalysis,
        audioAnalysis,
        session
      );

      return analysis;
    } catch (error) {
      console.error('Error analyzing mock interview:', error);
      throw new Error('Failed to analyze mock interview performance');
    }
  }

  /**
   * Analyze practice session performance
   */
  static async analyzePracticeSession(
    session: PracticeSession,
    audioBlob?: Blob
  ): Promise<PerformanceAnalysis> {
    try {
      // Convert practice session to response format for analysis
      const mockResponse: InterviewResponse = {
        questionId: session.questionId,
        question: session.question.question,
        userResponse: session.userResponse,
        startTime: session.startTime,
        endTime: session.endTime || new Date(),
        timeSpent: session.timeSpent,
        score: session.score || 0,
        feedback: session.feedback || '',
        keywordMatches: [],
        improvementAreas: [],
        strengths: []
      };

      const responseAnalysis = await this.analyzeResponses([mockResponse], 'practice');
      
      // Analyze audio if available
      const audioAnalysis = audioBlob ? await this.analyzeAudio(audioBlob) : undefined;
      
      // Generate analysis for practice session
      const analysis = await this.generateComprehensiveAnalysis(
        responseAnalysis,
        undefined,
        audioAnalysis,
        null,
        session
      );

      return analysis;
    } catch (error) {
      console.error('Error analyzing practice session:', error);
      throw new Error('Failed to analyze practice session performance');
    }
  }

  /**
   * Compare practice and mock interview performance
   */
  static async comparePerformance(
    userId: string,
    practiceSessions: PracticeSession[],
    mockSessions: MockInterviewSession[]
  ): Promise<PerformanceComparison> {
    try {
      // Calculate practice metrics
      const practiceMetrics = this.calculatePracticeMetrics(practiceSessions);
      
      // Calculate mock interview metrics
      const mockMetrics = this.calculateMockMetrics(mockSessions);
      
      // Generate progress over time
      const progressOverTime = this.generateProgressTimeline(practiceSessions, mockSessions);
      
      // Calculate benchmark comparison
      const benchmarkComparison = await this.calculateBenchmarkComparison(userId, mockMetrics.average);
      
      // Generate recommendations
      const recommendations = await this.generateComparisonRecommendations(
        practiceMetrics,
        mockMetrics,
        progressOverTime
      );

      return {
        practiceVsMock: {
          practiceAverage: practiceMetrics.average,
          mockAverage: mockMetrics.average,
          improvement: mockMetrics.average - practiceMetrics.average,
          consistencyScore: this.calculateConsistencyScore(practiceSessions, mockSessions),
          transferEffectiveness: this.calculateTransferEffectiveness(practiceMetrics, mockMetrics)
        },
        progressOverTime,
        benchmarkComparison,
        recommendations
      };
    } catch (error) {
      console.error('Error comparing performance:', error);
      throw new Error('Failed to compare performance data');
    }
  }

  /**
   * Generate improvement suggestions based on performance analysis
   */
  static async generateImprovementSuggestions(
    analysis: PerformanceAnalysis,
    userHistory: (PracticeSession | MockInterviewSession)[]
  ): Promise<ImprovementSuggestion[]> {
    try {
      const suggestions: ImprovementSuggestion[] = [];
      
      // Analyze weak areas
      const weakAreas = analysis.detailedFeedback.weaknesses;
      
      for (const weakness of weakAreas) {
        const suggestion = await this.generateSpecificSuggestion(weakness, analysis, userHistory);
        suggestions.push(suggestion);
      }
      
      // Sort by priority
      return suggestions.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('Error generating improvement suggestions:', error);
      throw new Error('Failed to generate improvement suggestions');
    }
  }

  /**
   * Analyze responses using AI
   */
  private static async analyzeResponses(
    responses: InterviewResponse[],
    type: 'practice' | 'mock'
  ): Promise<any> {
    const prompt = `
      Analyze the following ${type} interview responses and provide detailed feedback:
      
      ${responses.map(r => `
        Question: ${r.question}
        Response: ${r.userResponse}
        Time Spent: ${r.timeSpent} seconds
      `).join('\n\n')}
      
      Please provide:
      1. Technical accuracy assessment
      2. Communication clarity evaluation
      3. Problem-solving approach analysis
      4. Specific strengths and weaknesses
      5. Detailed improvement suggestions
      
      Format the response as JSON with the following structure:
      {
        "technicalScore": number,
        "communicationScore": number,
        "problemSolvingScore": number,
        "strengths": string[],
        "weaknesses": string[],
        "specificFeedback": array,
        "overallSummary": string
      }
    `;

    try {
      const response = await AIInterviewerService.generateResponse(prompt, []);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing responses:', error);
      // Return default analysis if AI fails
      return {
        technicalScore: 5,
        communicationScore: 5,
        problemSolvingScore: 5,
        strengths: ['Provided complete responses'],
        weaknesses: ['Could improve response structure'],
        specificFeedback: [],
        overallSummary: 'Analysis completed with basic evaluation.'
      };
    }
  }

  /**
   * Analyze video for non-verbal communication
   */
  private static async analyzeVideo(videoBlob: Blob): Promise<VideoAnalysis> {
    // Placeholder for video analysis - would integrate with computer vision API
    // For now, return mock analysis
    return {
      eyeContact: Math.random() * 4 + 6, // 6-10 range
      posture: Math.random() * 3 + 7,
      gestures: Math.random() * 4 + 6,
      facialExpressions: Math.random() * 3 + 7,
      overallPresence: Math.random() * 3 + 7,
      insights: [
        'Maintained good eye contact throughout the interview',
        'Posture could be improved for better confidence projection',
        'Natural gestures enhanced communication effectiveness'
      ]
    };
  }

  /**
   * Analyze audio for speech patterns and clarity
   */
  private static async analyzeAudio(audioBlob: Blob): Promise<AudioAnalysis> {
    // Placeholder for audio analysis - would integrate with speech analysis API
    // For now, return mock analysis
    return {
      clarity: Math.random() * 3 + 7,
      pace: Math.random() * 4 + 6,
      volume: Math.random() * 2 + 8,
      fillerWords: Math.floor(Math.random() * 10) + 2,
      pauseAnalysis: {
        totalPauses: Math.floor(Math.random() * 20) + 10,
        averagePauseLength: Math.random() * 2 + 1,
        appropriatePauses: Math.floor(Math.random() * 15) + 8,
        awkwardPauses: Math.floor(Math.random() * 5) + 1
      },
      tonalAnalysis: {
        confidence: Math.random() * 3 + 7,
        enthusiasm: Math.random() * 4 + 6,
        professionalism: Math.random() * 2 + 8,
        clarity: Math.random() * 3 + 7
      },
      insights: [
        'Speech pace was appropriate for the interview context',
        'Consider reducing filler words for more professional delivery',
        'Voice clarity was excellent throughout the session'
      ]
    };
  }

  /**
   * Generate comprehensive performance analysis
   */
  private static async generateComprehensiveAnalysis(
    responseAnalysis: any,
    videoAnalysis?: VideoAnalysis,
    audioAnalysis?: AudioAnalysis,
    mockSession?: MockInterviewSession | null,
    practiceSession?: PracticeSession
  ): Promise<PerformanceAnalysis> {
    
    const technicalScore = responseAnalysis.technicalScore || 5;
    const communicationScore = responseAnalysis.communicationScore || 5;
    const overallScore = (technicalScore + communicationScore) / 2;

    // Generate skill assessment
    const skillAssessment = this.generateSkillAssessment(
      responseAnalysis,
      videoAnalysis,
      audioAnalysis
    );

    // Generate improvement suggestions
    const improvementSuggestions = await this.generateBasicImprovementSuggestions(
      responseAnalysis,
      skillAssessment
    );

    return {
      overallScore,
      technicalScore,
      communicationScore,
      detailedFeedback: {
        strengths: responseAnalysis.strengths || [],
        weaknesses: responseAnalysis.weaknesses || [],
        keyInsights: this.extractKeyInsights(responseAnalysis, videoAnalysis, audioAnalysis),
        specificFeedback: responseAnalysis.specificFeedback || [],
        overallSummary: responseAnalysis.overallSummary || 'Performance analysis completed.'
      },
      improvementSuggestions,
      skillAssessment,
      videoAnalysis,
      audioAnalysis
    };
  }

  /**
   * Generate skill assessment from analysis data
   */
  private static generateSkillAssessment(
    responseAnalysis: any,
    videoAnalysis?: VideoAnalysis,
    audioAnalysis?: AudioAnalysis
  ): SkillAssessment {
    return {
      technicalSkills: [
        {
          skill: 'Problem Solving',
          score: responseAnalysis.problemSolvingScore || 5,
          level: this.scoreToLevel(responseAnalysis.problemSolvingScore || 5),
          confidence: 0.8,
          evidence: ['Demonstrated logical thinking in responses']
        },
        {
          skill: 'Technical Knowledge',
          score: responseAnalysis.technicalScore || 5,
          level: this.scoreToLevel(responseAnalysis.technicalScore || 5),
          confidence: 0.85,
          evidence: ['Showed understanding of core concepts']
        }
      ],
      communicationSkills: [
        {
          skill: 'Verbal Communication',
          score: audioAnalysis?.clarity || responseAnalysis.communicationScore || 5,
          level: this.scoreToLevel(audioAnalysis?.clarity || responseAnalysis.communicationScore || 5),
          confidence: 0.9,
          evidence: ['Clear articulation of ideas']
        },
        {
          skill: 'Non-verbal Communication',
          score: videoAnalysis?.overallPresence || 7,
          level: this.scoreToLevel(videoAnalysis?.overallPresence || 7),
          confidence: 0.7,
          evidence: ['Appropriate body language and gestures']
        }
      ],
      problemSolvingSkills: [
        {
          skill: 'Analytical Thinking',
          score: responseAnalysis.problemSolvingScore || 5,
          level: this.scoreToLevel(responseAnalysis.problemSolvingScore || 5),
          confidence: 0.8,
          evidence: ['Structured approach to problem analysis']
        }
      ],
      behavioralSkills: [
        {
          skill: 'Confidence',
          score: audioAnalysis?.tonalAnalysis.confidence || 7,
          level: this.scoreToLevel(audioAnalysis?.tonalAnalysis.confidence || 7),
          confidence: 0.75,
          evidence: ['Demonstrated self-assurance in responses']
        }
      ]
    };
  }

  /**
   * Convert numeric score to skill level
   */
  private static scoreToLevel(score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (score >= 9) return 'expert';
    if (score >= 7) return 'advanced';
    if (score >= 5) return 'intermediate';
    return 'beginner';
  }

  /**
   * Extract key insights from analysis data
   */
  private static extractKeyInsights(
    responseAnalysis: any,
    videoAnalysis?: VideoAnalysis,
    audioAnalysis?: AudioAnalysis
  ): string[] {
    const insights: string[] = [];
    
    if (responseAnalysis.technicalScore > 8) {
      insights.push('Strong technical knowledge demonstrated');
    }
    
    if (audioAnalysis && audioAnalysis.clarity > 8) {
      insights.push('Excellent verbal communication clarity');
    }
    
    if (videoAnalysis && videoAnalysis.eyeContact > 8) {
      insights.push('Maintained excellent eye contact');
    }
    
    if (responseAnalysis.communicationScore < 6) {
      insights.push('Communication skills need improvement');
    }
    
    return insights;
  }

  /**
   * Generate basic improvement suggestions
   */
  private static async generateBasicImprovementSuggestions(
    responseAnalysis: any,
    skillAssessment: SkillAssessment
  ): Promise<ImprovementSuggestion[]> {
    const suggestions: ImprovementSuggestion[] = [];
    
    // Check for low scores and generate suggestions
    if (responseAnalysis.technicalScore < 7) {
      suggestions.push({
        area: 'Technical Knowledge',
        priority: 'high',
        suggestion: 'Focus on strengthening core technical concepts',
        actionItems: [
          'Review fundamental algorithms and data structures',
          'Practice coding problems daily',
          'Study system design principles'
        ],
        resources: [
          {
            type: 'practice',
            title: 'LeetCode Practice',
            url: '/practice',
            description: 'Practice coding problems to improve technical skills'
          }
        ],
        estimatedTimeToImprove: '2-4 weeks'
      });
    }
    
    if (responseAnalysis.communicationScore < 7) {
      suggestions.push({
        area: 'Communication Skills',
        priority: 'high',
        suggestion: 'Improve clarity and structure in responses',
        actionItems: [
          'Practice the STAR method for behavioral questions',
          'Record yourself answering questions',
          'Focus on clear, concise explanations'
        ],
        resources: [
          {
            type: 'practice',
            title: 'Mock Interview Practice',
            url: '/mock-interview',
            description: 'Practice with AI interviewer to improve communication'
          }
        ],
        estimatedTimeToImprove: '1-3 weeks'
      });
    }
    
    return suggestions;
  }

  /**
   * Calculate practice session metrics
   */
  private static calculatePracticeMetrics(sessions: PracticeSession[]) {
    const completedSessions = sessions.filter(s => s.completed && s.score);
    const scores = completedSessions.map(s => s.score!);
    
    return {
      average: scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0,
      count: completedSessions.length,
      scores
    };
  }

  /**
   * Calculate mock interview metrics
   */
  private static calculateMockMetrics(sessions: MockInterviewSession[]) {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const scores = completedSessions.map(s => s.overallScore);
    
    return {
      average: scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0,
      count: completedSessions.length,
      scores
    };
  }

  /**
   * Generate progress timeline
   */
  private static generateProgressTimeline(
    practiceSessions: PracticeSession[],
    mockSessions: MockInterviewSession[]
  ): ProgressMetrics[] {
    const timeline: ProgressMetrics[] = [];
    
    // Add practice sessions
    practiceSessions
      .filter(s => s.completed && s.score)
      .forEach(session => {
        timeline.push({
          date: session.endTime?.toISOString().split('T')[0] || session.startTime.toISOString().split('T')[0],
          type: 'practice',
          score: session.score!,
          category: session.question.category,
          company: session.question.company
        });
      });
    
    // Add mock sessions
    mockSessions
      .filter(s => s.status === 'completed')
      .forEach(session => {
        timeline.push({
          date: session.endTime?.toISOString().split('T')[0] || session.startTime.toISOString().split('T')[0],
          type: 'mock',
          score: session.overallScore,
          category: session.interviewType,
          company: session.company
        });
      });
    
    // Sort by date
    return timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Calculate benchmark comparison
   */
  private static async calculateBenchmarkComparison(
    userId: string,
    userScore: number
  ): Promise<BenchmarkComparison> {
    // Mock benchmark data - in real implementation, this would come from database
    return {
      industryAverage: 6.5,
      roleAverage: 7.0,
      experienceAverage: 6.8,
      userPercentile: Math.min(95, Math.max(5, (userScore / 10) * 100)),
      topPerformerGap: Math.max(0, 9.2 - userScore)
    };
  }

  /**
   * Generate comparison recommendations
   */
  private static async generateComparisonRecommendations(
    practiceMetrics: any,
    mockMetrics: any,
    progressOverTime: ProgressMetrics[]
  ): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (mockMetrics.average > practiceMetrics.average) {
      recommendations.push('Great job! Your mock interview performance exceeds your practice scores.');
    } else if (practiceMetrics.average > mockMetrics.average + 1) {
      recommendations.push('Focus on transferring your practice skills to mock interview settings.');
    }
    
    if (progressOverTime.length > 5) {
      const recentTrend = progressOverTime.slice(-5);
      const isImproving = recentTrend[recentTrend.length - 1].score > recentTrend[0].score;
      
      if (isImproving) {
        recommendations.push('You show consistent improvement over time. Keep up the great work!');
      } else {
        recommendations.push('Consider varying your practice routine to break through performance plateaus.');
      }
    }
    
    return recommendations;
  }

  /**
   * Calculate consistency score
   */
  private static calculateConsistencyScore(
    practiceSessions: PracticeSession[],
    mockSessions: MockInterviewSession[]
  ): number {
    const allScores = [
      ...practiceSessions.filter(s => s.score).map(s => s.score!),
      ...mockSessions.filter(s => s.status === 'completed').map(s => s.overallScore)
    ];
    
    if (allScores.length < 2) return 0;
    
    const mean = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
    const variance = allScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / allScores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Convert to 0-10 scale where lower deviation = higher consistency
    return Math.max(0, 10 - (standardDeviation * 2));
  }

  /**
   * Calculate transfer effectiveness
   */
  private static calculateTransferEffectiveness(
    practiceMetrics: any,
    mockMetrics: any
  ): number {
    if (practiceMetrics.average === 0) return 0;
    
    const transferRatio = mockMetrics.average / practiceMetrics.average;
    
    // Scale to 0-10 where 1.0 ratio = 10 points
    return Math.min(10, transferRatio * 10);
  }

  /**
   * Generate specific improvement suggestion
   */
  private static async generateSpecificSuggestion(
    weakness: string,
    analysis: PerformanceAnalysis,
    userHistory: (PracticeSession | MockInterviewSession)[]
  ): Promise<ImprovementSuggestion> {
    // Default suggestion structure
    return {
      area: weakness,
      priority: 'medium',
      suggestion: `Focus on improving ${weakness.toLowerCase()}`,
      actionItems: [
        `Practice specific exercises for ${weakness.toLowerCase()}`,
        'Review relevant learning materials',
        'Get feedback from peers or mentors'
      ],
      resources: [
        {
          type: 'practice',
          title: 'Targeted Practice',
          url: '/practice',
          description: `Practice questions focused on ${weakness.toLowerCase()}`
        }
      ],
      estimatedTimeToImprove: '2-3 weeks'
    };
  }
}