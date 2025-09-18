import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  updateRoadmapProgress,
  updateDSAProgress,
  updateQuizProgress,
  updateEmailProgress,
  updateInterviewProgress,
  updateCommunityProgress,
  syncProgressFromCollections
} from '../services/unifiedProgressService';

export const useProgressTracking = () => {
  const { user } = useAuth();

  const trackRoadmapProgress = useCallback(async (
    roadmapId: string, 
    progress: number, 
    title: string
  ): Promise<boolean> => {
    if (!user?.uid) return false;
    return await updateRoadmapProgress(user.uid, roadmapId, progress, title);
  }, [user?.uid]);

  const trackDSAProgress = useCallback(async (problemData: {
    difficulty: string;
    topic: string;
    timeSpent: number;
    completed: boolean;
  }): Promise<boolean> => {
    if (!user?.uid) return false;
    return await updateDSAProgress(user.uid, problemData);
  }, [user?.uid]);

  const trackQuizProgress = useCallback(async (quizData: {
    questions: number;
    correct: number;
    company: string;
    domain: string;
    timeSpent: number;
  }): Promise<boolean> => {
    if (!user?.uid) return false;
    return await updateQuizProgress(user.uid, quizData);
  }, [user?.uid]);

  const trackEmailProgress = useCallback(async (emailData: {
    words: number;
    template: string;
    timeSpent: number;
  }): Promise<boolean> => {
    if (!user?.uid) return false;
    return await updateEmailProgress(user.uid, emailData);
  }, [user?.uid]);

  const trackInterviewProgress = useCallback(async (interviewData: {
    sessionTime: number;
    topic: string;
    score?: number;
    completed: boolean;
  }): Promise<boolean> => {
    if (!user?.uid) return false;
    return await updateInterviewProgress(user.uid, interviewData);
  }, [user?.uid]);

  const trackCommunityActivity = useCallback(async (
    action: 'post' | 'comment' | 'like' | 'share' | 'follow'
  ): Promise<boolean> => {
    if (!user?.uid) return false;
    return await updateCommunityProgress(user.uid, action);
  }, [user?.uid]);

  const syncExistingProgress = useCallback(async (): Promise<boolean> => {
    if (!user?.uid) return false;
    return await syncProgressFromCollections(user.uid);
  }, [user?.uid]);

  return {
    trackRoadmapProgress,
    trackDSAProgress,
    trackQuizProgress,
    trackEmailProgress,
    trackInterviewProgress,
    trackCommunityActivity,
    syncExistingProgress,
    isAuthenticated: !!user?.uid
  };
};