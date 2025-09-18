import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { DSAProblem as DSASheetProblem } from "@/lib/DSAProblemsData";
import { ProgressMetrics, ConversationSession } from "@/types/conversational";

export interface NeuronProgress {
  problemId: string;
  sessionId: string;
  completed: boolean;
  neuronSessionCompleted: boolean;
  lastNeuronSession: Date;
  conceptsLearned: string[];
  hintsUsed: number;
  timeSpent: number; // in minutes
  stepProgress: {
    understanding: number;
    approach: number;
    implementation: number;
    optimization: number;
  };
  achievements: string[];
}

export interface SyncedProgress {
  dsaProgress: Partial<DSASheetProblem>;
  neuronProgress: NeuronProgress;
  unifiedProgress: {
    totalProblemsCompleted: number;
    neuronSessionsCompleted: number;
    totalConceptsLearned: number;
    averageHintsUsed: number;
    totalTimeSpent: number;
  };
}

class NeuronProgressSyncService {
  private db = getFirestore();
  private readonly DSA_COLLECTION = "dsaProgress";
  private readonly NEURON_COLLECTION = "neuronProgress";
  private readonly UNIFIED_COLLECTION = "userProgress";

  /**
   * Sync progress from Neuron session to DSA sheet
   */
  async syncNeuronToDS(
    userId: string,
    problemId: string,
    neuronProgress: ProgressMetrics,
    sessionData: ConversationSession
  ): Promise<void> {
    try {
      // Update DSA progress
      const dsaRef = doc(this.db, this.DSA_COLLECTION, userId);
      const dsaDoc = await getDoc(dsaRef);

      let dsaData = dsaDoc.exists() ? dsaDoc.data() : { problems: [] };

      // Find and update the specific problem
      const problemIndex = dsaData.problems.findIndex(
        (p: any) => p.id === problemId
      );

      if (problemIndex >= 0) {
        dsaData.problems[problemIndex] = {
          ...dsaData.problems[problemIndex],
          completed: true,
          neuronSessionCompleted: true,
          lastNeuronSession: new Date(),
          neuronProgress: {
            understanding: neuronProgress.understanding,
            implementation: neuronProgress.implementation,
            optimization: neuronProgress.optimization,
            hintsUsed: neuronProgress.hintsUsed,
            conceptsLearned: neuronProgress.conceptsLearned,
          },
        };
      } else {
        // Add new problem entry
        dsaData.problems.push({
          id: problemId,
          completed: true,
          neuronSessionCompleted: true,
          lastNeuronSession: new Date(),
          neuronProgress: {
            understanding: neuronProgress.understanding,
            implementation: neuronProgress.implementation,
            optimization: neuronProgress.optimization,
            hintsUsed: neuronProgress.hintsUsed,
            conceptsLearned: neuronProgress.conceptsLearned,
          },
        });
      }

      await setDoc(dsaRef, dsaData, { merge: true });

      // Store detailed Neuron session data
      await this.storeNeuronSession(
        userId,
        problemId,
        sessionData,
        neuronProgress
      );

      // Update unified progress
      await this.updateUnifiedProgress(userId);
    } catch (error) {
      console.error("Error syncing Neuron progress to DSA:", error);
      throw error;
    }
  }

  /**
   * Store detailed Neuron session data
   */
  private async storeNeuronSession(
    userId: string,
    problemId: string,
    sessionData: ConversationSession,
    progress: ProgressMetrics
  ): Promise<void> {
    const sessionRef = doc(
      this.db,
      this.NEURON_COLLECTION,
      `${userId}_${sessionData.id}`
    );

    const neuronSessionData = {
      userId,
      problemId,
      sessionId: sessionData.id,
      problemTitle: sessionData.problem.title,
      difficulty: sessionData.problem.difficulty,
      tags: sessionData.problem.tags,
      startTime: sessionData.createdAt,
      endTime: new Date(),
      timeSpent: Math.floor(
        (Date.now() - sessionData.createdAt.getTime()) / 60000
      ), // minutes
      progress: {
        understanding: progress.understanding,
        implementation: progress.implementation,
        optimization: progress.optimization,
      },
      hintsUsed: progress.hintsUsed,
      conceptsLearned: progress.conceptsLearned,
      conversationLength: sessionData.conversationHistory.length,
      completed: true,
      achievements: this.calculateAchievements(progress, sessionData),
      updatedAt: serverTimestamp(),
    };

    await setDoc(sessionRef, neuronSessionData);
  }

  /**
   * Calculate achievements based on session performance
   */
  private calculateAchievements(
    progress: ProgressMetrics,
    sessionData: ConversationSession
  ): string[] {
    const achievements: string[] = [];

    // No hints used
    if (progress.hintsUsed === 0) {
      achievements.push("no-hints-master");
    }

    // High understanding score
    if (progress.understanding >= 90) {
      achievements.push("quick-learner");
    }

    // Perfect implementation
    if (progress.implementation >= 95) {
      achievements.push("implementation-expert");
    }

    // Optimization master
    if (progress.optimization >= 90) {
      achievements.push("optimization-guru");
    }

    // Concept collector
    if (progress.conceptsLearned.length >= 5) {
      achievements.push("concept-collector");
    }

    // Fast completion (less than 30 minutes)
    const sessionTime = Date.now() - sessionData.createdAt.getTime();
    if (sessionTime < 30 * 60 * 1000) {
      achievements.push("speed-demon");
    }

    return achievements;
  }

  /**
   * Update unified progress tracking
   */
  private async updateUnifiedProgress(userId: string): Promise<void> {
    try {
      const unifiedRef = doc(this.db, this.UNIFIED_COLLECTION, userId);
      const unifiedDoc = await getDoc(unifiedRef);

      // Get DSA progress
      const dsaRef = doc(this.db, this.DSA_COLLECTION, userId);
      const dsaDoc = await getDoc(dsaRef);
      const dsaData = dsaDoc.exists() ? dsaDoc.data() : { problems: [] };

      // Calculate unified metrics
      const completedProblems = dsaData.problems.filter(
        (p: any) => p.completed
      ).length;
      const neuronSessions = dsaData.problems.filter(
        (p: any) => p.neuronSessionCompleted
      ).length;

      let totalConceptsLearned = 0;
      let totalHintsUsed = 0;
      let totalTimeSpent = 0;

      dsaData.problems.forEach((p: any) => {
        if (p.neuronProgress) {
          totalConceptsLearned += p.neuronProgress.conceptsLearned?.length || 0;
          totalHintsUsed += p.neuronProgress.hintsUsed || 0;
        }
      });

      const unifiedData = {
        dsa: {
          totalProblems: dsaData.problems.length,
          completedProblems,
          neuronSessionsCompleted: neuronSessions,
          completionRate:
            dsaData.problems.length > 0
              ? (completedProblems / dsaData.problems.length) * 100
              : 0,
        },
        neuron: {
          totalSessions: neuronSessions,
          totalConceptsLearned,
          averageHintsUsed:
            neuronSessions > 0 ? totalHintsUsed / neuronSessions : 0,
          totalTimeSpent,
        },
        achievements: this.calculateUserAchievements(dsaData.problems),
        lastUpdated: serverTimestamp(),
      };

      await setDoc(unifiedRef, unifiedData, { merge: true });
    } catch (error) {
      console.error("Error updating unified progress:", error);
      throw error;
    }
  }

  /**
   * Calculate user-level achievements
   */
  private calculateUserAchievements(problems: any[]): string[] {
    const achievements: string[] = [];

    const completedCount = problems.filter((p) => p.completed).length;
    const neuronCount = problems.filter((p) => p.neuronSessionCompleted).length;

    // Milestone achievements
    if (completedCount >= 10) achievements.push("problem-solver-10");
    if (completedCount >= 50) achievements.push("problem-solver-50");
    if (completedCount >= 100) achievements.push("problem-solver-100");

    // Neuron achievements
    if (neuronCount >= 5) achievements.push("neuron-explorer");
    if (neuronCount >= 20) achievements.push("neuron-adept");
    if (neuronCount >= 50) achievements.push("neuron-master");

    // Consistency achievements
    const recentSessions = problems.filter((p) => {
      if (!p.lastNeuronSession) return false;
      const daysDiff =
        (Date.now() - new Date(p.lastNeuronSession).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    if (recentSessions >= 5) achievements.push("consistent-learner");

    return achievements;
  }

  /**
   * Get synced progress for a user
   */
  async getSyncedProgress(userId: string): Promise<SyncedProgress | null> {
    try {
      const [dsaDoc, unifiedDoc] = await Promise.all([
        getDoc(doc(this.db, this.DSA_COLLECTION, userId)),
        getDoc(doc(this.db, this.UNIFIED_COLLECTION, userId)),
      ]);

      if (!dsaDoc.exists()) return null;

      const dsaData = dsaDoc.data();
      const unifiedData = unifiedDoc.exists()
        ? unifiedDoc.data()
        : ({
            totalProblemsCompleted: 0,
            neuronSessionsCompleted: 0,
            totalConceptsLearned: 0,
            averageHintsUsed: 0,
            totalTimeSpent: 0,
          } as {
            totalProblemsCompleted: number;
            neuronSessionsCompleted: number;
            totalConceptsLearned: number;
            averageHintsUsed: number;
            totalTimeSpent: number;
          });

      return {
        dsaProgress: dsaData,
        neuronProgress: dsaData.neuronProgress || {},
        unifiedProgress: (unifiedData as {
          totalProblemsCompleted: number;
          neuronSessionsCompleted: number;
          totalConceptsLearned: number;
          averageHintsUsed: number;
          totalTimeSpent: number;
        }) || {
          totalProblemsCompleted: 0,
          neuronSessionsCompleted: 0,
          totalConceptsLearned: 0,
          averageHintsUsed: 0,
          totalTimeSpent: 0,
        },
      };
    } catch (error) {
      console.error("Error getting synced progress:", error);
      return null;
    }
  }

  /**
   * Get Neuron session history for a problem
   */
  async getNeuronSessionHistory(
    userId: string,
    problemId: string
  ): Promise<any[]> {
    try {
      // This would typically use a query, but for simplicity we'll return empty array
      // In a real implementation, you'd query the neuronProgress collection
      return [];
    } catch (error) {
      console.error("Error getting Neuron session history:", error);
      return [];
    }
  }
}

export const neuronProgressSync = new NeuronProgressSyncService();
export default neuronProgressSync;
