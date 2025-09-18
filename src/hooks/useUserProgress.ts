// hooks/useUserProgress.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserProgress, initializeUserProgress, syncProgressFromCollections, type UserProgress } from '../services/progressService';

export const useUserProgress = (userId: string | null | undefined) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setProgress(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Set up real-time listener
    try {
      const unsubscribe = getUserProgress(userId, (progressData) => {
        // Only update state if component is still mounted
        if (!mountedRef.current) return;

        if (progressData) {
          console.log('Progress data updated:', progressData);
          setProgress(progressData);
          setError(null);
        } else {
          console.log('No progress data found');
          setError('No progress data available');
        }
        setLoading(false);
      });

      // Store unsubscribe function
      unsubscribeRef.current = unsubscribe;

    } catch (err) {
      console.error('Error setting up progress listener:', err);
      if (mountedRef.current) {
        setError('Failed to initialize progress tracking');
        setLoading(false);
      }
    }

    // Cleanup function
    return () => {
      if (unsubscribeRef.current && typeof unsubscribeRef.current === 'function') {
        console.log('Cleaning up progress listener');
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId || !mountedRef.current) return;
    
    setLoading(true);
    try {
      console.log('Manually refreshing progress data...');
      await syncProgressFromCollections(userId);
      // The real-time listener will automatically update the data
    } catch (err) {
      console.error('Error refreshing progress:', err);
      if (mountedRef.current) {
        setError('Failed to refresh progress');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  const forceRefresh = useCallback(() => {
    if (!userId) return;
    
    // Clean up existing listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    // Re-establish listener
    const unsubscribe = getUserProgress(userId, (progressData) => {
      if (!mountedRef.current) return;
      
      if (progressData) {
        setProgress(progressData);
        setError(null);
      } else {
        setError('No progress data available');
      }
      setLoading(false);
    });
    
    unsubscribeRef.current = unsubscribe;
  }, [userId]);

  return { 
    progress, 
    loading, 
    error, 
    refresh, 
    forceRefresh 
  };
};