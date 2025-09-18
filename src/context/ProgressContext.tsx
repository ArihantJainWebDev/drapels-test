import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { enhancedProgressService, ProgressEvent, ProgressInsight, ProgressSummary } from '../services/enhancedProgressService';
import { type UserProgress } from '../services/progressService';
import { useUserProgress } from '../hooks/useUserProgress';

interface ProgressContextType {
  progress: UserProgress | null;
  loading: boolean;
  error: string | null;
  insights: ProgressInsight[];
  summary: ProgressSummary | null;
  
  // Actions
  trackActivity: (event: Omit<ProgressEvent, 'id' | 'timestamp' | 'userId'>) => Promise<boolean>;
  batchTrackActivities: (events: Omit<ProgressEvent, 'id' | 'timestamp' | 'userId'>[]) => Promise<boolean>;
  refreshProgress: () => Promise<void>;
  generateInsights: () => Promise<void>;
  
  // Convenience methods for common activities
  trackDSAProblem: (data: { difficulty: string; topic: string; timeSpent: number; completed: boolean }) => Promise<boolean>;
  trackQuizCompletion: (data: { questions: number; correct: number; company: string; domain: string; timeSpent: number }) => Promise<boolean>;
  trackCommunityActivity: (action: 'post' | 'comment' | 'like' | 'share' | 'follow') => Promise<boolean>;
  trackRoadmapProgress: (data: { roadmapId: string; title: string; progress: number }) => Promise<boolean>;
  trackEmailGeneration: (data: { words: number; template: string; timeSpent: number }) => Promise<boolean>;
  trackInterviewSession: (data: { sessionTime: number; topic: string; score?: number; completed: boolean; isMockInterview?: boolean }) => Promise<boolean>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: React.ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { progress, loading: progressLoading, error: progressError } = useUserProgress(user?.uid);
  
  const [insights, setInsights] = useState<ProgressInsight[]>([]);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track activity with enhanced service
  const trackActivity = useCallback(async (event: Omit<ProgressEvent, 'id' | 'timestamp' | 'userId'>): Promise<boolean> => {
    if (!user?.uid) return false;
    
    try {
      setLoading(true);
      const success = await enhancedProgressService.syncProgressAcrossFeatures(user.uid, event as Omit<ProgressEvent, "id" | "timestamp">);
      if (success) {
        // Refresh insights after successful activity tracking
        await generateInsights();
      }
      return success;
    } catch (err) {
      console.error('Error tracking activity:', err);
      setError('Failed to track activity');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Batch track multiple activities
  const batchTrackActivities = useCallback(async (events: Omit<ProgressEvent, 'id' | 'timestamp' | 'userId'>[]): Promise<boolean> => {
    if (!user?.uid) return false;
    
    try {
      setLoading(true);
      const success = await enhancedProgressService.batchUpdateProgress(user.uid, events);
      if (success) {
        await generateInsights();
      }
      return success;
    } catch (err) {
      console.error('Error batch tracking activities:', err);
      setError('Failed to track activities');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Generate progress insights
  const generateInsights = useCallback(async (): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      const newInsights = await enhancedProgressService.generateProgressInsights(user.uid);
      setInsights(newInsights);
    } catch (err) {
      console.error('Error generating insights:', err);
    }
  }, [user?.uid]);

  // Refresh progress data
  const refreshProgress = useCallback(async (): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      await Promise.all([
        generateInsights(),
        loadProgressSummary()
      ]);
    } catch (err) {
      console.error('Error refreshing progress:', err);
      setError('Failed to refresh progress');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Load progress summary
  const loadProgressSummary = useCallback(async (): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      const progressSummary = await enhancedProgressService.getProgressSummary(user.uid);
      setSummary(progressSummary);
    } catch (err) {
      console.error('Error loading progress summary:', err);
    }
  }, [user?.uid]);

  // Convenience methods for common activities
  const trackDSAProblem = useCallback(async (data: { difficulty: string; topic: string; timeSpent: number; completed: boolean }): Promise<boolean> => {
    const xpGained = data.completed ? (data.difficulty === 'Hard' ? 20 : data.difficulty === 'Medium' ? 15 : 10) : 5;
    
    return trackActivity({
      type: 'dsa',
      action: data.completed ? 'problem_solved' : 'problem_attempted',
      data,
      xpGained
    });
  }, [trackActivity]);

  const trackQuizCompletion = useCallback(async (data: { questions: number; correct: number; company: string; domain: string; timeSpent: number }): Promise<boolean> => {
    const xpGained = data.correct * 5;
    
    return trackActivity({
      type: 'quiz',
      action: 'quiz_completed',
      data,
      xpGained
    });
  }, [trackActivity]);

  const trackCommunityActivity = useCallback(async (action: 'post' | 'comment' | 'like' | 'share' | 'follow'): Promise<boolean> => {
    const xpMap = { post: 5, comment: 2, like: 1, share: 3, follow: 2 };
    const xpGained = xpMap[action];
    
    return trackActivity({
      type: 'community',
      action: `${action}_created`,
      data: { action },
      xpGained
    });
  }, [trackActivity]);

  const trackRoadmapProgress = useCallback(async (data: { roadmapId: string; title: string; progress: number }): Promise<boolean> => {
    const xpGained = 5; // Base XP for roadmap progress
    
    return trackActivity({
      type: 'roadmap',
      action: 'roadmap_progress_updated',
      data,
      xpGained
    });
  }, [trackActivity]);

  const trackEmailGeneration = useCallback(async (data: { words: number; template: string; timeSpent: number }): Promise<boolean> => {
    const xpGained = 3;
    
    return trackActivity({
      type: 'email',
      action: 'email_generated',
      data,
      xpGained
    });
  }, [trackActivity]);

  const trackInterviewSession = useCallback(async (data: { sessionTime: number; topic: string; score?: number; completed: boolean; isMockInterview?: boolean }): Promise<boolean> => {
    const xpGained = data.completed ? (data.isMockInterview ? 15 : 8) : 3;
    
    return trackActivity({
      type: 'interview',
      action: 'interview_session_completed',
      data,
      xpGained
    });
  }, [trackActivity]);

  // Load initial data when user changes
  useEffect(() => {
    if (user?.uid && progress) {
      generateInsights();
      loadProgressSummary();
    }
  }, [user?.uid, progress, generateInsights, loadProgressSummary]);

  // Clear data when user logs out
  useEffect(() => {
    if (!user) {
      setInsights([]);
      setSummary(null);
      setError(null);
    }
  }, [user]);

  const contextValue: ProgressContextType = {
    progress,
    loading: progressLoading || loading,
    error: progressError || error,
    insights,
    summary,
    
    // Actions
    trackActivity,
    batchTrackActivities,
    refreshProgress,
    generateInsights,
    
    // Convenience methods
    trackDSAProblem,
    trackQuizCompletion,
    trackCommunityActivity,
    trackRoadmapProgress,
    trackEmailGeneration,
    trackInterviewSession
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
};