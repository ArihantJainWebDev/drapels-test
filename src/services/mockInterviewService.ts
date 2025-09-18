import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { 
  MockInterviewSession, 
  InterviewResponse, 
  MockInterviewStats,
  InterviewConfig 
} from '@/types/mockInterview';
import { AIInterviewerService } from './aiInterviewerService';

export class MockInterviewService {
  private static readonly SESSIONS_COLLECTION = 'mockInterviewSessions';
  private static readonly RESPONSES_COLLECTION = 'mockInterviewResponses';
  private static readonly STORAGE_PATH = 'mock-interview-recordings';

  static async createSession(
    userId: string,
    config: {
      company: string;
      role: string;
      interviewType: string;
      difficulty: string;
      interviewConfig: InterviewConfig;
    }
  ): Promise<string> {
    try {
      // Generate questions for the interview
      const questions = await AIInterviewerService.generateQuestions(
        config.company,
        config.role,
        config.interviewType,
        config.difficulty,
        config.interviewConfig.questionCount
      );

      const sessionData: Partial<MockInterviewSession> = {
        userId,
        company: config.company,
        role: config.role,
        interviewType: config.interviewType as any,
        difficulty: config.difficulty as any,
        startTime: new Date(),
        duration: 0,
        status: 'setup',
        config: config.interviewConfig,
        questions,
        currentQuestionIndex: 0,
        responses: [],
        overallScore: 0,
        feedback: {
          overallScore: 0,
          categoryScores: {},
          strengths: [],
          improvementAreas: [],
          detailedFeedback: '',
          nextSteps: []
        },
        metrics: {
          totalSpeakingTime: 0,
          averageResponseTime: 0,
          pauseCount: 0,
          fillerWordCount: 0,
          confidenceScore: 0,
          clarityScore: 0,
          structureScore: 0
        }
      };

      const docRef = await addDoc(collection(db, this.SESSIONS_COLLECTION), {
        ...sessionData,
        startTime: Timestamp.fromDate(sessionData.startTime!),
        createdAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating mock interview session:', error);
      throw new Error('Failed to create interview session');
    }
  }

  static async getSession(sessionId: string): Promise<MockInterviewSession | null> {
    try {
      const docRef = doc(db, this.SESSIONS_COLLECTION, sessionId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        startTime: data.startTime?.toDate() || new Date(),
        endTime: data.endTime?.toDate(),
      } as MockInterviewSession;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw new Error('Failed to fetch interview session');
    }
  }

  static async updateSession(
    sessionId: string,
    updates: Partial<MockInterviewSession>
  ): Promise<void> {
    try {
      const sessionRef = doc(db, this.SESSIONS_COLLECTION, sessionId);
      const updateData = { ...updates };

      // Convert dates to Firestore timestamps
      if (updates.endTime) {
        (updateData as any).endTime = Timestamp.fromDate(updates.endTime);
      }

      await updateDoc(sessionRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating session:', error);
      throw new Error('Failed to update interview session');
    }
  }

  static async startSession(sessionId: string): Promise<void> {
    await this.updateSession(sessionId, {
      status: 'in-progress',
      startTime: new Date()
    });
  }

  static async completeSession(
    sessionId: string,
    responses: InterviewResponse[],
    videoBlob?: Blob,
    audioBlob?: Blob
  ): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Calculate overall score
      const overallScore = responses.length > 0 
        ? responses.reduce((sum, r) => sum + r.score, 0) / responses.length
        : 0;

      // Generate session summary
      const summary = await AIInterviewerService.generateSessionSummary(session, responses);

      // Calculate duration
      const duration = Math.floor((new Date().getTime() - session.startTime.getTime()) / 1000);

      // Generate performance analysis
      const { PerformanceAnalysisService } = await import('./performanceAnalysisService');
      const performanceAnalysis = await PerformanceAnalysisService.analyzeMockInterview(
        session,
        responses,
        videoBlob,
        audioBlob
      );

      await this.updateSession(sessionId, {
        status: 'completed',
        endTime: new Date(),
        duration,
        responses,
        overallScore: performanceAnalysis.overallScore,
        feedback: {
          overallScore: performanceAnalysis.overallScore,
          categoryScores: this.calculateCategoryScores(responses),
          strengths: performanceAnalysis.detailedFeedback.strengths,
          improvementAreas: performanceAnalysis.detailedFeedback.weaknesses,
          detailedFeedback: performanceAnalysis.detailedFeedback.overallSummary,
          nextSteps: performanceAnalysis.improvementSuggestions.map(s => s.suggestion)
        },
        // Store performance analysis data
        performanceAnalysis
      });
    } catch (error) {
      console.error('Error completing session:', error);
      throw new Error('Failed to complete interview session');
    }
  }

  static async saveResponse(
    sessionId: string,
    response: Omit<InterviewResponse, 'audioResponse' | 'videoResponse'>,
    audioBlob?: Blob,
    videoBlob?: Blob
  ): Promise<void> {
    try {
      let audioUrl: string | undefined;
      let videoUrl: string | undefined;

      // Upload audio if provided
      if (audioBlob) {
        audioUrl = await this.uploadRecording(sessionId, audioBlob, 'audio');
      }

      // Upload video if provided
      if (videoBlob) {
        videoUrl = await this.uploadRecording(sessionId, videoBlob, 'video');
      }

      // Save response to Firestore
      const responseData = {
        ...response,
        sessionId,
        audioUrl,
        videoUrl,
        startTime: Timestamp.fromDate(response.startTime),
        endTime: Timestamp.fromDate(response.endTime),
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, this.RESPONSES_COLLECTION), responseData);

      // Update session with the new response
      const session = await this.getSession(sessionId);
      if (session) {
        const updatedResponses = [...session.responses, response];
        await this.updateSession(sessionId, {
          responses: updatedResponses,
          currentQuestionIndex: session.currentQuestionIndex + 1
        });
      }
    } catch (error) {
      console.error('Error saving response:', error);
      throw new Error('Failed to save interview response');
    }
  }

  static async uploadRecording(
    sessionId: string,
    blob: Blob,
    type: 'audio' | 'video'
  ): Promise<string> {
    try {
      const extension = type === 'video' ? 'webm' : 'webm';
      const fileName = `${sessionId}-${type}-${Date.now()}.${extension}`;
      const storageRef = ref(storage, `${this.STORAGE_PATH}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error(`Error uploading ${type} recording:`, error);
      throw new Error(`Failed to upload ${type} recording`);
    }
  }

  static async getUserSessions(
    userId: string,
    limitCount: number = 50
  ): Promise<MockInterviewSession[]> {
    try {
      const q = query(
        collection(db, this.SESSIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const sessions: MockInterviewSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate(),
        } as MockInterviewSession);
      });

      return sessions;
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw new Error('Failed to fetch interview sessions');
    }
  }

  /**
   * Get session with media URLs for playback
   */
  static async getSessionWithMedia(sessionId: string): Promise<MockInterviewSession | null> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) return null;

      // Media URLs are already stored in the session from upload
      return session;
    } catch (error) {
      console.error('Error fetching session with media:', error);
      throw new Error('Failed to fetch session with media');
    }
  }

  /**
   * Delete a session and its associated media
   */
  static async deleteSession(sessionId: string): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // TODO: Delete associated media files from storage
      // This would require implementing storage cleanup

      // Delete session document
      const sessionRef = doc(db, this.SESSIONS_COLLECTION, sessionId);
      await deleteDoc(sessionRef);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to delete session');
    }
  }

  /**
   * Get sessions by date range
   */
  static async getSessionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MockInterviewSession[]> {
    try {
      const q = query(
        collection(db, this.SESSIONS_COLLECTION),
        where('userId', '==', userId),
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        where('startTime', '<=', Timestamp.fromDate(endDate)),
        orderBy('startTime', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const sessions: MockInterviewSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate(),
        } as MockInterviewSession);
      });

      return sessions;
    } catch (error) {
      console.error('Error fetching sessions by date range:', error);
      throw new Error('Failed to fetch sessions by date range');
    }
  }

  static async getUserStats(userId: string): Promise<MockInterviewStats> {
    try {
      const sessions = await this.getUserSessions(userId, 1000);
      
      const completedSessions = sessions.filter(s => s.status === 'completed');
      const totalSessions = sessions.length;
      const completedCount = completedSessions.length;
      
      // Calculate averages
      const averageScore = completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + s.overallScore, 0) / completedSessions.length
        : 0;

      const averageDuration = completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length
        : 0;

      // Calculate improvement trend (last 5 vs previous 5)
      const recentSessions = completedSessions.slice(0, 5);
      const previousSessions = completedSessions.slice(5, 10);
      
      const recentAvg = recentSessions.length > 0 
        ? recentSessions.reduce((sum, s) => sum + s.overallScore, 0) / recentSessions.length
        : 0;
      
      const previousAvg = previousSessions.length > 0
        ? previousSessions.reduce((sum, s) => sum + s.overallScore, 0) / previousSessions.length
        : 0;

      const improvementTrend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

      // Category performance
      const categoryPerformance: Record<string, any> = {};
      completedSessions.forEach(session => {
        const type = session.interviewType;
        if (!categoryPerformance[type]) {
          categoryPerformance[type] = { sessions: 0, scores: [], improvement: 0 };
        }
        categoryPerformance[type].sessions++;
        categoryPerformance[type].scores.push(session.overallScore);
      });

      // Calculate category averages and improvements
      Object.keys(categoryPerformance).forEach(category => {
        const scores = categoryPerformance[category].scores;
        categoryPerformance[category].averageScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
        
        // Calculate improvement (recent vs older sessions)
        const recentCategoryScores = scores.slice(0, Math.ceil(scores.length / 2));
        const olderCategoryScores = scores.slice(Math.ceil(scores.length / 2));
        
        if (olderCategoryScores.length > 0 && recentCategoryScores.length > 0) {
          const recentCategoryAvg = recentCategoryScores.reduce((sum: number, score: number) => sum + score, 0) / recentCategoryScores.length;
          const olderCategoryAvg = olderCategoryScores.reduce((sum: number, score: number) => sum + score, 0) / olderCategoryScores.length;
          categoryPerformance[category].improvement = ((recentCategoryAvg - olderCategoryAvg) / olderCategoryAvg) * 100;
        }
        
        delete categoryPerformance[category].scores;
      });

      // Company performance
      const companyPerformance: Record<string, any> = {};
      completedSessions.forEach(session => {
        const company = session.company;
        if (!companyPerformance[company]) {
          companyPerformance[company] = { sessions: 0, scores: [], successCount: 0 };
        }
        companyPerformance[company].sessions++;
        companyPerformance[company].scores.push(session.overallScore);
        if (session.overallScore >= 7) { // Consider 7+ as success
          companyPerformance[company].successCount++;
        }
      });

      Object.keys(companyPerformance).forEach(company => {
        const data = companyPerformance[company];
        data.averageScore = data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length;
        data.successRate = (data.successCount / data.sessions) * 100;
        delete data.scores;
        delete data.successCount;
      });

      // Performance trend data (last 10 sessions)
      const performanceTrend = completedSessions
        .slice(0, 10)
        .reverse()
        .map(session => ({
          date: session.endTime?.toISOString().split('T')[0] || session.startTime.toISOString().split('T')[0],
          score: session.overallScore
        }));

      return {
        totalSessions,
        completedSessions: completedCount,
        averageScore,
        averageDuration,
        improvementTrend,
        categoryPerformance,
        companyPerformance,
        recentSessions: sessions.slice(0, 5),
        performanceTrend
      };
    } catch (error) {
      console.error('Error calculating user stats:', error);
      throw new Error('Failed to calculate interview statistics');
    }
  }

  static async getSessionsByCompany(
    userId: string,
    company: string
  ): Promise<MockInterviewSession[]> {
    try {
      const q = query(
        collection(db, this.SESSIONS_COLLECTION),
        where('userId', '==', userId),
        where('company', '==', company),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const sessions: MockInterviewSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate(),
        } as MockInterviewSession);
      });

      return sessions;
    } catch (error) {
      console.error('Error fetching sessions by company:', error);
      throw new Error('Failed to fetch sessions by company');
    }
  }

  private static calculateCategoryScores(responses: InterviewResponse[]): Record<string, number> {
    const categoryScores: Record<string, number[]> = {};
    
    responses.forEach(response => {
      const category = response.question.split(' ')[0]; // Simple category extraction
      if (!categoryScores[category]) {
        categoryScores[category] = [];
      }
      categoryScores[category].push(response.score);
    });

    const result: Record<string, number> = {};
    Object.keys(categoryScores).forEach(category => {
      const scores = categoryScores[category];
      result[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    return result;
  }
}