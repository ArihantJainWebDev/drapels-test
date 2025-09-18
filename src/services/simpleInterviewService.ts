import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// Simple interview session interface
export interface SimpleInterviewSession {
  id: string;
  userId: string;
  questionId: string;
  question: string;
  category: string;
  difficulty: string;
  userAnswer: string;
  aiScore?: number;
  aiFeedback?: string;
  timeSpent: number; // in seconds
  completed: boolean;
  createdAt: Date;
}

const SESSIONS_COLLECTION = 'interviewSessions';

// Save a simple interview session
export const saveSimpleInterviewSession = async (
  userId: string,
  sessionData: Omit<SimpleInterviewSession, 'id' | 'userId' | 'createdAt'>
): Promise<boolean> => {
  try {
    console.log('Saving simple interview session for user:', userId);
    
    const sessionId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    
    await setDoc(sessionRef, {
      id: sessionId,
      userId,
      ...sessionData,
      createdAt: serverTimestamp()
    });
    
    console.log('Interview session saved successfully:', sessionId);
    return true;
  } catch (error) {
    console.error('Error saving interview session:', error);
    return false;
  }
};

// Get user's interview sessions (simple version)
export const getSimpleInterviewSessions = async (
  userId: string, 
  limitCount: number = 20
): Promise<SimpleInterviewSession[]> => {
  try {
    const sessionsQuery = query(
      collection(db, SESSIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(sessionsQuery);
    const sessions: SimpleInterviewSession[] = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      sessions.push({
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as SimpleInterviewSession);
    });
    
    return sessions;
  } catch (error) {
    console.error('Error fetching interview sessions:', error);
    return [];
  }
};

// Get simple statistics
export const getSimpleInterviewStats = async (userId: string) => {
  try {
    const sessions = await getSimpleInterviewSessions(userId, 100);
    
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
  } catch (error) {
    console.error('Error getting interview statistics:', error);
    return null;
  }
};