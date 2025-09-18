import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { SimpleInterviewSession } from '../services/simpleInterviewService';

export interface InterviewSessionsState {
  sessions: SimpleInterviewSession[];
  loading: boolean;
  error: string | null;
}

export const useInterviewSessions = () => {
  const { user } = useAuth();
  const [state, setState] = useState<InterviewSessionsState>({
    sessions: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!user?.uid) {
      setState({
        sessions: [],
        loading: false,
        error: null
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    const sessionsQuery = query(
      collection(db, 'interviewSessions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      sessionsQuery,
      (snapshot) => {
        const sessions: SimpleInterviewSession[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          sessions.push({
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as SimpleInterviewSession);
        });

        setState({
          sessions,
          loading: false,
          error: null
        });
      },
      (error) => {
        console.error('Error fetching interview sessions:', error);
        setState({
          sessions: [],
          loading: false,
          error: error.message
        });
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const calculateStats = () => {
    const { sessions } = state;
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        totalTimeMinutes: 0,
        averageScore: 0,
        categoryStats: {},
        lastSessionDate: null
      };
    }

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed).length;
    const totalTime = sessions.reduce((sum, s) => sum + s.timeSpent, 0);
    
    const scoredSessions = sessions.filter(s => s.aiScore !== undefined);
    const averageScore = scoredSessions.length > 0 
      ? scoredSessions.reduce((sum, s) => sum + (s.aiScore || 0), 0) / scoredSessions.length 
      : 0;
    
    // Category breakdown
    const categoryStats = sessions.reduce((acc, session) => {
      if (!acc[session.category]) {
        acc[session.category] = { total: 0, completed: 0 };
      }
      acc[session.category].total++;
      if (session.completed) {
        acc[session.category].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);
    
    return {
      totalSessions,
      completedSessions,
      totalTimeMinutes: Math.round(totalTime / 60),
      averageScore: Math.round(averageScore * 10) / 10,
      categoryStats,
      lastSessionDate: sessions[0]?.createdAt || null
    };
  };

  return {
    ...state,
    stats: calculateStats()
  };
};