import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { PracticeSession, PracticeStats } from "@/types/practice";

export class PracticeService {
  private static readonly COLLECTION_NAME = "practiceSessions";
  private static readonly STORAGE_PATH = "practice-recordings";

  static async createSession(
    userId: string,
    questionId: string,
    question: any
  ): Promise<string> {
    try {
      const sessionData = {
        userId,
        questionId,
        question,
        userResponse: "",
        startTime: Timestamp.now(),
        timeSpent: 0,
        completed: false,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(
        collection(db, this.COLLECTION_NAME),
        sessionData
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating practice session:", error);
      throw new Error("Failed to create practice session");
    }
  }

  static async updateSession(
    sessionId: string,
    updates: Partial<PracticeSession> & { endTime?: Date }
  ): Promise<void> {
    try {
      const sessionRef = doc(db, this.COLLECTION_NAME, sessionId);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      if (updates.endTime instanceof Timestamp) {
        updateData.endTime = updates.endTime;
      }

      await updateDoc(sessionRef, updateData);
    } catch (error) {
      console.error("Error updating practice session:", error);
      throw new Error("Failed to update practice session");
    }
  }

  static async completeSession(
    sessionId: string,
    userResponse: string,
    timeSpent: number,
    score?: number,
    feedback?: string,
    audioRecording?: Blob
  ): Promise<void> {
    try {
      let audioUrl: string | undefined;

      // Upload audio recording if provided
      if (audioRecording) {
        audioUrl = await this.uploadAudioRecording(sessionId, audioRecording);
      }

      // Generate performance analysis for the session
      const session = await this.getSessionById(sessionId);
      if (session) {
        const { PerformanceAnalysisService } = await import(
          "./performanceAnalysisService"
        );

        // Update session with response data first
        const updatedSession = {
          ...session,
          userResponse,
          timeSpent,
          completed: true,
          endTime: new Date(),
          score: score || 0,
          feedback: feedback || "",
        };

        const performanceAnalysis =
          await PerformanceAnalysisService.analyzePracticeSession(
            updatedSession,
            audioRecording
          );

        const updates: Partial<PracticeSession> = {
          userResponse,
          timeSpent,
          completed: true,
          endTime: new Date(),
          score: performanceAnalysis.overallScore,
          feedback: performanceAnalysis.detailedFeedback.overallSummary,
          // Store performance analysis data
          performanceAnalysis,
        };

        if (audioUrl) {
          (updates as any).audioUrl = audioUrl;
        }

        await this.updateSession(sessionId, updates);
      }
    } catch (error) {
      console.error("Error completing practice session:", error);
      throw new Error("Failed to complete practice session");
    }
  }

  static async getSessionById(
    sessionId: string
  ): Promise<PracticeSession | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, sessionId);
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
      } as PracticeSession;
    } catch (error) {
      console.error("Error fetching session:", error);
      return null;
    }
  }

  static async uploadAudioRecording(
    sessionId: string,
    audioBlob: Blob
  ): Promise<string> {
    try {
      const fileName = `${sessionId}-${Date.now()}.webm`;
      const storageRef = ref(storage, `${this.STORAGE_PATH}/${fileName}`);

      const snapshot = await uploadBytes(storageRef, audioBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading audio recording:", error);
      throw new Error("Failed to upload audio recording");
    }
  }

  static async getUserSessions(
    userId: string,
    limitCount: number = 50
  ): Promise<PracticeSession[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const sessions: PracticeSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate(),
        } as PracticeSession);
      });

      return sessions;
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      throw new Error("Failed to fetch practice sessions");
    }
  }

  static async getUserStats(userId: string): Promise<PracticeStats> {
    try {
      const sessions = await this.getUserSessions(userId, 1000); // Get more for stats

      const completedSessions = sessions.filter((s) => s.completed);
      const totalQuestions = sessions.length;
      const completedQuestions = completedSessions.length;

      // Calculate average score
      const sessionsWithScores = completedSessions.filter(
        (s) => s.score !== undefined
      );
      const averageScore =
        sessionsWithScores.length > 0
          ? sessionsWithScores.reduce((sum, s) => sum + (s.score || 0), 0) /
            sessionsWithScores.length
          : 0;

      // Calculate total time spent (in minutes)
      const totalTimeSpent =
        completedSessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / 60;

      // Calculate categories progress
      const categoriesProgress: Record<string, any> = {};
      const companiesProgress: Record<string, any> = {};

      sessions.forEach((session) => {
        const category = session.question.category;
        const company = session.question.company;

        // Categories progress
        if (!categoriesProgress[category]) {
          categoriesProgress[category] = { completed: 0, total: 0, scores: [] };
        }
        categoriesProgress[category].total++;
        if (session.completed) {
          categoriesProgress[category].completed++;
          if (session.score !== undefined) {
            categoriesProgress[category].scores.push(session.score);
          }
        }

        // Companies progress
        if (company) {
          if (!companiesProgress[company]) {
            companiesProgress[company] = { completed: 0, total: 0, scores: [] };
          }
          companiesProgress[company].total++;
          if (session.completed) {
            companiesProgress[company].completed++;
            if (session.score !== undefined) {
              companiesProgress[company].scores.push(session.score);
            }
          }
        }
      });

      // Calculate average scores for categories and companies
      Object.keys(categoriesProgress).forEach((category) => {
        const scores = categoriesProgress[category].scores;
        categoriesProgress[category].averageScore =
          scores.length > 0
            ? scores.reduce((sum: number, score: number) => sum + score, 0) /
              scores.length
            : 0;
        delete categoriesProgress[category].scores;
      });

      Object.keys(companiesProgress).forEach((company) => {
        const scores = companiesProgress[company].scores;
        companiesProgress[company].averageScore =
          scores.length > 0
            ? scores.reduce((sum: number, score: number) => sum + score, 0) /
              scores.length
            : 0;
        delete companiesProgress[company].scores;
      });

      return {
        totalQuestions,
        completedQuestions,
        averageScore,
        totalTimeSpent,
        categoriesProgress,
        companiesProgress,
      };
    } catch (error) {
      console.error("Error calculating user stats:", error);
      throw new Error("Failed to calculate practice statistics");
    }
  }

  static async getSessionsByCategory(
    userId: string,
    category: string
  ): Promise<PracticeSession[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("userId", "==", userId),
        where("question.category", "==", category),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const sessions: PracticeSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate(),
        } as PracticeSession);
      });

      return sessions;
    } catch (error) {
      console.error("Error fetching sessions by category:", error);
      throw new Error("Failed to fetch sessions by category");
    }
  }

  static async getSessionsByCompany(
    userId: string,
    company: string
  ): Promise<PracticeSession[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("userId", "==", userId),
        where("question.company", "==", company),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const sessions: PracticeSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate(),
        } as PracticeSession);
      });

      return sessions;
    } catch (error) {
      console.error("Error fetching sessions by company:", error);
      throw new Error("Failed to fetch sessions by company");
    }
  }
}
