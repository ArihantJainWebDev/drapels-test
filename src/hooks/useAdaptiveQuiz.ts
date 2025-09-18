import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { QuizParams } from '@/lib/quiz-api';
import { 
  AdaptiveDifficultyService, 
  UserPerformanceData, 
  AdaptiveDifficultyRecommendation,
  AdaptiveQuizGeneration,
  LearningPath
} from '@/services/adaptiveDifficultyService';

export interface UseAdaptiveQuizOptions {
  userId: string;
  autoLoadPerformance?: boolean;
  enableRealTimeCalibration?: boolean;
}

export interface AdaptiveQuizState {
  userPerformance: UserPerformanceData | null;
  difficultyRecommendation: AdaptiveDifficultyRecommendation | null;
  adaptiveQuiz: AdaptiveQuizGeneration | null;
  learningPath: LearningPath | null;
  isLoading: boolean;
  error: string | null;
}

export interface QuizCalibrationResult {
  shouldAdjust: boolean;
  newDifficulty?: string;
  reasoning: string;
  confidence: number;
}

export const useAdaptiveQuiz = (options: UseAdaptiveQuizOptions) => {
  const { userId, autoLoadPerformance = true, enableRealTimeCalibration = true } = options;
  const { toast } = useToast();

  // State
  const [state, setState] = useState<AdaptiveQuizState>({
    userPerformance: null,
    difficultyRecommendation: null,
    adaptiveQuiz: null,
    learningPath: null,
    isLoading: false,
    error: null
  });

  // Load user performance data
  const loadUserPerformance = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const performanceData = await AdaptiveDifficultyService['getUserPerformanceData'](userId);
      setState(prev => ({ 
        ...prev, 
        userPerformance: performanceData,
        isLoading: false 
      }));
      return performanceData;
    } catch (error) {
      const errorMessage = 'Failed to load user performance data';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [userId, toast]);

  // Get difficulty recommendation
  const getDifficultyRecommendation = useCallback(async (
    domain: string, 
    company: string,
    performanceData?: UserPerformanceData
  ) => {
    const userData = performanceData || state.userPerformance;
    if (!userData) {
      throw new Error('User performance data not available');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const recommendation = await AdaptiveDifficultyService.recommendDifficulty(
        userData,
        domain,
        company
      );
      
      setState(prev => ({ 
        ...prev, 
        difficultyRecommendation: recommendation,
        isLoading: false 
      }));
      
      return recommendation;
    } catch (error) {
      const errorMessage = 'Failed to get difficulty recommendation';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [state.userPerformance, toast]);

  // Generate adaptive quiz
  const generateAdaptiveQuiz = useCallback(async (
    quizParams: QuizParams,
    questionCount: number = 10,
    performanceData?: UserPerformanceData
  ) => {
    const userData = performanceData || state.userPerformance;
    if (!userData) {
      throw new Error('User performance data not available');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const adaptiveQuiz = await AdaptiveDifficultyService.generateAdaptiveQuiz(
        userData,
        quizParams,
        questionCount
      );
      
      setState(prev => ({ 
        ...prev, 
        adaptiveQuiz,
        isLoading: false 
      }));
      
      return adaptiveQuiz;
    } catch (error) {
      const errorMessage = 'Failed to generate adaptive quiz';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [state.userPerformance, toast]);

  // Generate learning path
  const generateLearningPath = useCallback(async (
    targetRole: string,
    targetCompany: string,
    performanceData?: UserPerformanceData
  ) => {
    const userData = performanceData || state.userPerformance;
    if (!userData) {
      throw new Error('User performance data not available');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const learningPath = await AdaptiveDifficultyService.generateLearningPath(
        userId,
        targetRole,
        targetCompany,
        userData
      );
      
      setState(prev => ({ 
        ...prev, 
        learningPath,
        isLoading: false 
      }));
      
      return learningPath;
    } catch (error) {
      const errorMessage = 'Failed to generate learning path';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [userId, state.userPerformance, toast]);

  // Real-time difficulty calibration
  const calibrateDifficulty = useCallback(async (
    currentProgress: {
      questionsAnswered: number;
      correctAnswers: number;
      averageTimePerQuestion: number;
      currentDifficulty: string;
    },
    performanceData?: UserPerformanceData
  ): Promise<QuizCalibrationResult> => {
    if (!enableRealTimeCalibration) {
      return {
        shouldAdjust: false,
        reasoning: 'Real-time calibration is disabled',
        confidence: 0
      };
    }

    const userData = performanceData || state.userPerformance;
    if (!userData) {
      throw new Error('User performance data not available');
    }

    try {
      const calibration = await AdaptiveDifficultyService.calibrateDifficultyRealTime(
        userData,
        currentProgress
      );
      
      return calibration;
    } catch (error) {
      console.error('Error in difficulty calibration:', error);
      return {
        shouldAdjust: false,
        reasoning: 'Calibration error - maintaining current difficulty',
        confidence: 0
      };
    }
  }, [enableRealTimeCalibration, state.userPerformance]);

  // Update performance after quiz completion
  const updatePerformance = useCallback(async (quizResults: {
    quizParams: QuizParams;
    questions: any[];
    userAnswers: string[];
    timeSpent: number[];
    difficulty: string;
  }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedPerformance = await AdaptiveDifficultyService.updatePerformanceData(
        userId,
        quizResults
      );
      
      setState(prev => ({ 
        ...prev, 
        userPerformance: updatedPerformance,
        isLoading: false 
      }));
      
      toast({
        title: 'Performance Updated',
        description: 'Your learning progress has been recorded and analyzed.'
      });
      
      return updatedPerformance;
    } catch (error) {
      const errorMessage = 'Failed to update performance data';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [userId, toast]);

  // Initialize adaptive system
  const initializeAdaptiveSystem = useCallback(async (
    quizParams: QuizParams,
    questionCount: number = 10
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Load performance data
      const performanceData = await loadUserPerformance();
      
      // Get difficulty recommendation
      const recommendation = await getDifficultyRecommendation(
        quizParams.domain,
        quizParams.company,
        performanceData
      );
      
      // Generate learning path if user has sufficient data
      let learningPath = null;
      if (performanceData.totalQuizzes > 5) {
        learningPath = await generateLearningPath(
          quizParams.role,
          quizParams.company,
          performanceData
        );
      }
      
      // Generate adaptive quiz
      const adaptiveQuiz = await generateAdaptiveQuiz(
        {
          ...quizParams,
          difficulty: recommendation.recommendedDifficulty
        },
        questionCount,
        performanceData
      );
      
      setState(prev => ({ 
        ...prev, 
        userPerformance: performanceData,
        difficultyRecommendation: recommendation,
        adaptiveQuiz,
        learningPath,
        isLoading: false 
      }));
      
      return {
        performanceData,
        recommendation,
        adaptiveQuiz,
        learningPath
      };
    } catch (error) {
      const errorMessage = 'Failed to initialize adaptive system';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false 
      }));
      throw error;
    }
  }, [loadUserPerformance, getDifficultyRecommendation, generateLearningPath, generateAdaptiveQuiz]);

  // Reset state
  const resetState = useCallback(() => {
    setState({
      userPerformance: null,
      difficultyRecommendation: null,
      adaptiveQuiz: null,
      learningPath: null,
      isLoading: false,
      error: null
    });
  }, []);

  // Auto-load performance data on mount
  useEffect(() => {
    if (autoLoadPerformance && userId) {
      loadUserPerformance().catch(console.error);
    }
  }, [autoLoadPerformance, userId, loadUserPerformance]);

  // Utility functions
  const getPerformanceSummary = useCallback(() => {
    if (!state.userPerformance) return null;
    
    const { userPerformance } = state;
    return {
      totalQuizzes: userPerformance.totalQuizzes,
      overallAccuracy: userPerformance.accuracy,
      learningVelocity: userPerformance.learningVelocity,
      consistencyScore: userPerformance.consistencyScore,
      weaknessCount: userPerformance.weaknessAreas.length,
      strongDomains: userPerformance.domainPerformance
        .filter(d => d.accuracy > 75)
        .map(d => d.domain),
      improvementAreas: userPerformance.weaknessAreas
        .filter(w => w.severity === 'high' || w.severity === 'critical')
        .map(w => w.area)
    };
  }, [state.userPerformance]);

  const getDifficultyInsights = useCallback(() => {
    if (!state.userPerformance) return null;
    
    const difficultyPerf = state.userPerformance.difficultyPerformance;
    return {
      masteredDifficulties: difficultyPerf
        .filter(d => d.masteryLevel === 'advanced' || d.masteryLevel === 'expert')
        .map(d => d.difficulty),
      currentLevel: difficultyPerf
        .sort((a, b) => b.accuracy - a.accuracy)[0]?.difficulty || 'Easy',
      recommendedNext: state.difficultyRecommendation?.recommendedDifficulty,
      confidenceLevel: state.difficultyRecommendation?.confidence
    };
  }, [state.userPerformance, state.difficultyRecommendation]);

  const getLearningPathProgress = useCallback(() => {
    if (!state.learningPath) return null;
    
    const { learningPath } = state;
    const completedMilestones = learningPath.milestones.filter(m => m.isCompleted);
    const nextMilestone = learningPath.milestones.find(m => !m.isCompleted);
    
    return {
      overallProgress: learningPath.progressPercentage,
      completedMilestones: completedMilestones.length,
      totalMilestones: learningPath.milestones.length,
      nextMilestone: nextMilestone ? {
        title: nextMilestone.title,
        difficulty: nextMilestone.targetDifficulty,
        estimatedQuizzes: nextMilestone.estimatedQuizzes
      } : null,
      estimatedCompletion: learningPath.estimatedDuration
    };
  }, [state.learningPath]);

  return {
    // State
    ...state,
    
    // Actions
    loadUserPerformance,
    getDifficultyRecommendation,
    generateAdaptiveQuiz,
    generateLearningPath,
    calibrateDifficulty,
    updatePerformance,
    initializeAdaptiveSystem,
    resetState,
    
    // Utilities
    getPerformanceSummary,
    getDifficultyInsights,
    getLearningPathProgress,
    
    // Computed properties
    isReady: !!state.userPerformance,
    hasRecommendation: !!state.difficultyRecommendation,
    hasAdaptiveQuiz: !!state.adaptiveQuiz,
    hasLearningPath: !!state.learningPath,
    canStartQuiz: !!state.userPerformance && !!state.difficultyRecommendation
  };
};

export default useAdaptiveQuiz;