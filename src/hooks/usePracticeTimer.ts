import { useState, useRef, useCallback, useEffect } from 'react';
import { PracticeTimer } from '@/types/practice';

export const usePracticeTimer = (initialTime: number = 0) => {
  const [timer, setTimer] = useState<PracticeTimer>({
    isActive: false,
    timeRemaining: initialTime,
    totalTime: initialTime,
    isPaused: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((timeInMinutes?: number) => {
    const timeInSeconds = timeInMinutes ? timeInMinutes * 60 : timer.totalTime;
    
    setTimer(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      timeRemaining: timeInSeconds,
      totalTime: timeInSeconds,
    }));
  }, [timer.totalTime]);

  const pauseTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  const stopTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
    }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback((newTime?: number) => {
    const timeToSet = newTime ? newTime * 60 : timer.totalTime;
    
    setTimer(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      timeRemaining: timeToSet,
      totalTime: timeToSet,
    }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timer.totalTime]);

  const addTime = useCallback((minutes: number) => {
    const additionalSeconds = minutes * 60;
    setTimer(prev => ({
      ...prev,
      timeRemaining: prev.timeRemaining + additionalSeconds,
      totalTime: prev.totalTime + additionalSeconds,
    }));
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timer.isActive && !timer.isPaused && timer.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          if (newTimeRemaining <= 0) {
            return {
              ...prev,
              timeRemaining: 0,
              isActive: false,
            };
          }
          
          return {
            ...prev,
            timeRemaining: newTimeRemaining,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isActive, timer.isPaused, timer.timeRemaining]);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const getProgress = useCallback((): number => {
    if (timer.totalTime === 0) return 0;
    return ((timer.totalTime - timer.timeRemaining) / timer.totalTime) * 100;
  }, [timer.totalTime, timer.timeRemaining]);

  const getTimeStatus = useCallback((): 'normal' | 'warning' | 'critical' => {
    const percentage = (timer.timeRemaining / timer.totalTime) * 100;
    if (percentage <= 10) return 'critical';
    if (percentage <= 25) return 'warning';
    return 'normal';
  }, [timer.timeRemaining, timer.totalTime]);

  const isTimeUp = timer.timeRemaining === 0 && timer.isActive === false;

  return {
    ...timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    addTime,
    formatTime,
    getProgress,
    getTimeStatus,
    isTimeUp,
    formattedTime: formatTime(timer.timeRemaining),
    formattedTotalTime: formatTime(timer.totalTime),
  };
};