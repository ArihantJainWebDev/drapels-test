import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  UserPerformanceData,
  DomainPerformance,
  CompanyPerformance,
  DifficultyPerformance,
  WeaknessArea,
  RecentPerformance,
  LearningPath,
  AdaptiveAdjustment,
} from "@/services/adaptiveDifficultyService";

export class AdaptiveQuizFirebaseService {
  /**
   * Get user performance data from Firebase
   */
  static async getUserPerformanceData(
    userId: string
  ): Promise<UserPerformanceData> {
    try {
      const userPerformanceRef = doc(db, "userAdaptivePerformance", userId);
      const docSnap = await getDoc(userPerformanceRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Convert Firestore timestamps to Date objects
        return {
          ...data,
          domainPerformance:
            data.domainPerformance?.map((dp: any) => ({
              ...dp,
              lastAttempted: dp.lastAttempted?.toDate() || new Date(),
            })) || [],
          companyPerformance:
            data.companyPerformance?.map((cp: any) => ({
              ...cp,
              lastAttempted: cp.lastAttempted?.toDate() || new Date(),
            })) || [],
          recentPerformance:
            data.recentPerformance?.map((rp: any) => ({
              ...rp,
              date: rp.date?.toDate() || new Date(),
            })) || [],
        } as UserPerformanceData;
      } else {
        // Return default performance data for new users
        return this.createDefaultPerformanceData(userId);
      }
    } catch (error) {
      console.error("Error getting user performance data:", error);
      throw new Error("Failed to load user performance data");
    }
  }

  /**
   * Save user performance data to Firebase
   */
  static async saveUserPerformanceData(
    data: UserPerformanceData
  ): Promise<void> {
    try {
      const userPerformanceRef = doc(
        db,
        "userAdaptivePerformance",
        data.userId
      );

      // Convert Date objects to Firestore timestamps for storage
      const firestoreData = {
        ...data,
        domainPerformance: data.domainPerformance.map((dp) => ({
          ...dp,
          lastAttempted: dp.lastAttempted,
        })),
        companyPerformance: data.companyPerformance.map((cp) => ({
          ...cp,
          lastAttempted: cp.lastAttempted,
        })),
        recentPerformance: data.recentPerformance.map((rp) => ({
          ...rp,
          date: rp.date,
        })),
        lastUpdated: serverTimestamp(),
      };

      await setDoc(userPerformanceRef, firestoreData, { merge: true });
    } catch (error) {
      console.error("Error saving user performance data:", error);
      throw new Error("Failed to save user performance data");
    }
  }

  /**
   * Update performance data after quiz completion
   */
  static async updatePerformanceAfterQuiz(
    userId: string,
    quizResults: {
      quizParams: any;
      questions: any[];
      userAnswers: string[];
      timeSpent: number[];
      difficulty: string;
      score: number;
      totalQuestions: number;
    }
  ): Promise<UserPerformanceData> {
    try {
      // Get current performance data
      const currentData = await this.getUserPerformanceData(userId);

      // Calculate quiz metrics
      const correctCount = quizResults.score;
      const totalTime = quizResults.timeSpent.reduce(
        (sum, time) => sum + time,
        0
      );
      const averageTime = totalTime / quizResults.questions.length;

      // Update overall statistics
      const updatedData: UserPerformanceData = {
        ...currentData,
        totalQuizzes: currentData.totalQuizzes + 1,
        totalQuestions: currentData.totalQuestions + quizResults.totalQuestions,
        correctAnswers: currentData.correctAnswers + correctCount,
        accuracy:
          ((currentData.correctAnswers + correctCount) /
            (currentData.totalQuestions + quizResults.totalQuestions)) *
          100,
      };

      // Update domain performance
      updatedData.domainPerformance = this.updateDomainPerformance(
        updatedData.domainPerformance,
        quizResults.quizParams.domain,
        correctCount,
        quizResults.totalQuestions,
        averageTime,
        quizResults.difficulty
      );

      // Update company performance
      updatedData.companyPerformance = this.updateCompanyPerformance(
        updatedData.companyPerformance,
        quizResults.quizParams.company,
        correctCount,
        quizResults.totalQuestions,
        averageTime
      );

      // Update difficulty performance
      updatedData.difficultyPerformance = this.updateDifficultyPerformance(
        updatedData.difficultyPerformance,
        quizResults.difficulty,
        correctCount,
        quizResults.totalQuestions,
        averageTime
      );

      // Update weakness areas
      updatedData.weaknessAreas = this.updateWeaknessAreas(
        updatedData.weaknessAreas,
        quizResults,
        correctCount
      );

      // Add to recent performance
      updatedData.recentPerformance = this.updateRecentPerformance(
        updatedData.recentPerformance,
        quizResults,
        correctCount,
        totalTime
      );

      // Recalculate learning velocity and consistency
      updatedData.learningVelocity = this.calculateLearningVelocity(
        updatedData.recentPerformance
      );
      updatedData.consistencyScore = this.calculateConsistencyScore(
        updatedData.recentPerformance
      );

      // Save updated data
      await this.saveUserPerformanceData(updatedData);

      return updatedData;
    } catch (error) {
      console.error("Error updating performance after quiz:", error);
      throw new Error("Failed to update performance data");
    }
  }

  /**
   * Save learning path to Firebase
   */
  static async saveLearningPath(learningPath: LearningPath): Promise<void> {
    try {
      const learningPathRef = doc(db, "userLearningPaths", learningPath.pathId);

      const firestoreData = {
        ...learningPath,
        milestones: learningPath.milestones.map((milestone) => ({
          ...milestone,
          completedDate: milestone.completedDate || null,
        })),
        adaptiveAdjustments: learningPath.adaptiveAdjustments.map(
          (adjustment) => ({
            ...adjustment,
            date: adjustment.date,
          })
        ),
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      };

      await setDoc(learningPathRef, firestoreData);
    } catch (error) {
      console.error("Error saving learning path:", error);
      throw new Error("Failed to save learning path");
    }
  }

  /**
   * Get user's learning paths
   */
  static async getUserLearningPaths(userId: string): Promise<LearningPath[]> {
    try {
      const learningPathsQuery = query(
        collection(db, "userLearningPaths"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      const querySnapshot = await getDocs(learningPathsQuery);
      const learningPaths: LearningPath[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        learningPaths.push({
          ...data,
          milestones:
            data.milestones?.map((milestone: any) => ({
              ...milestone,
              completedDate: milestone.completedDate?.toDate() || undefined,
            })) || [],
          adaptiveAdjustments:
            data.adaptiveAdjustments?.map((adjustment: any) => ({
              ...adjustment,
              date: adjustment.date?.toDate() || new Date(),
            })) || [],
        } as LearningPath);
      });

      return learningPaths;
    } catch (error) {
      console.error("Error getting user learning paths:", error);
      throw new Error("Failed to load learning paths");
    }
  }

  /**
   * Save adaptive quiz session data
   */
  static async saveAdaptiveQuizSession(
    userId: string,
    sessionData: {
      quizParams: any;
      adaptiveData: any;
      results: any;
      difficultyAdjustments: AdaptiveAdjustment[];
    }
  ): Promise<string> {
    try {
      const sessionRef = doc(collection(db, "adaptiveQuizSessions"));

      const firestoreData = {
        userId,
        ...sessionData,
        difficultyAdjustments: sessionData.difficultyAdjustments.map((adj) => ({
          ...adj,
          date: adj.date,
        })),
        createdAt: serverTimestamp(),
      };

      await setDoc(sessionRef, firestoreData);
      return sessionRef.id;
    } catch (error) {
      console.error("Error saving adaptive quiz session:", error);
      throw new Error("Failed to save quiz session");
    }
  }

  /**
   * Get user's adaptive quiz history
   */
  static async getAdaptiveQuizHistory(
    userId: string,
    limitCount: number = 20
  ): Promise<any[]> {
    try {
      const historyQuery = query(
        collection(db, "adaptiveQuizSessions"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(historyQuery);
      const history: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          difficultyAdjustments:
            data.difficultyAdjustments?.map((adj: any) => ({
              ...adj,
              date: adj.date?.toDate() || new Date(),
            })) || [],
        });
      });

      return history;
    } catch (error) {
      console.error("Error getting adaptive quiz history:", error);
      throw new Error("Failed to load quiz history");
    }
  }

  // Private helper methods

  private static createDefaultPerformanceData(
    userId: string
  ): UserPerformanceData {
    return {
      userId,
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      domainPerformance: [],
      companyPerformance: [],
      difficultyPerformance: [],
      weaknessAreas: [],
      recentPerformance: [],
      learningVelocity: 50, // Default neutral velocity
      consistencyScore: 50,
      averageScore: 0,
      recentScores: 0,
    };
  }

  private static updateDomainPerformance(
    domainPerformance: DomainPerformance[],
    domain: string,
    correctCount: number,
    totalQuestions: number,
    averageTime: number,
    difficulty: string
  ): DomainPerformance[] {
    const existingIndex = domainPerformance.findIndex(
      (dp) => dp.domain === domain
    );

    if (existingIndex >= 0) {
      const existing = domainPerformance[existingIndex];
      const updatedDomain: DomainPerformance = {
        ...existing,
        questionsAnswered: existing.questionsAnswered + totalQuestions,
        correctAnswers: existing.correctAnswers + correctCount,
        accuracy:
          ((existing.correctAnswers + correctCount) /
            (existing.questionsAnswered + totalQuestions)) *
          100,
        averageTimeSpent:
          (existing.averageTimeSpent * existing.questionsAnswered +
            averageTime * totalQuestions) /
          (existing.questionsAnswered + totalQuestions),
        lastAttempted: new Date(),
        difficultyDistribution: {
          ...existing.difficultyDistribution,
          [difficulty]: (existing.difficultyDistribution[difficulty] || 0) + 1,
        },
      };

      return [
        ...domainPerformance.slice(0, existingIndex),
        updatedDomain,
        ...domainPerformance.slice(existingIndex + 1),
      ];
    } else {
      const newDomain: DomainPerformance = {
        domain,
        questionsAnswered: totalQuestions,
        correctAnswers: correctCount,
        accuracy: (correctCount / totalQuestions) * 100,
        averageTimeSpent: averageTime,
        lastAttempted: new Date(),
        difficultyDistribution: { [difficulty]: 1 },
      };

      return [...domainPerformance, newDomain];
    }
  }

  private static updateCompanyPerformance(
    companyPerformance: CompanyPerformance[],
    company: string,
    correctCount: number,
    totalQuestions: number,
    averageTime: number
  ): CompanyPerformance[] {
    const existingIndex = companyPerformance.findIndex(
      (cp) => cp.company === company
    );

    if (existingIndex >= 0) {
      const existing = companyPerformance[existingIndex];
      const updatedCompany: CompanyPerformance = {
        ...existing,
        questionsAnswered: existing.questionsAnswered + totalQuestions,
        correctAnswers: existing.correctAnswers + correctCount,
        accuracy:
          ((existing.correctAnswers + correctCount) /
            (existing.questionsAnswered + totalQuestions)) *
          100,
        averageTimeSpent:
          (existing.averageTimeSpent * existing.questionsAnswered +
            averageTime * totalQuestions) /
          (existing.questionsAnswered + totalQuestions),
        lastAttempted: new Date(),
      };

      return [
        ...companyPerformance.slice(0, existingIndex),
        updatedCompany,
        ...companyPerformance.slice(existingIndex + 1),
      ];
    } else {
      const newCompany: CompanyPerformance = {
        company,
        questionsAnswered: totalQuestions,
        correctAnswers: correctCount,
        accuracy: (correctCount / totalQuestions) * 100,
        averageTimeSpent: averageTime,
        lastAttempted: new Date(),
        preferredTopics: [],
      };

      return [...companyPerformance, newCompany];
    }
  }

  private static updateDifficultyPerformance(
    difficultyPerformance: DifficultyPerformance[],
    difficulty: string,
    correctCount: number,
    totalQuestions: number,
    averageTime: number
  ): DifficultyPerformance[] {
    const existingIndex = difficultyPerformance.findIndex(
      (dp) => dp.difficulty === difficulty
    );

    if (existingIndex >= 0) {
      const existing = difficultyPerformance[existingIndex];
      const newAccuracy =
        ((existing.correctAnswers + correctCount) /
          (existing.questionsAnswered + totalQuestions)) *
        100;

      const updatedDifficulty: DifficultyPerformance = {
        ...existing,
        questionsAnswered: existing.questionsAnswered + totalQuestions,
        correctAnswers: existing.correctAnswers + correctCount,
        accuracy: newAccuracy,
        averageTimeSpent:
          (existing.averageTimeSpent * existing.questionsAnswered +
            averageTime * totalQuestions) /
          (existing.questionsAnswered + totalQuestions),
        confidenceLevel: Math.min(
          100,
          existing.confidenceLevel + (correctCount / totalQuestions) * 10
        ),
        masteryLevel: this.calculateMasteryLevel(
          existing.questionsAnswered + totalQuestions,
          newAccuracy
        ),
      };

      return [
        ...difficultyPerformance.slice(0, existingIndex),
        updatedDifficulty,
        ...difficultyPerformance.slice(existingIndex + 1),
      ];
    } else {
      const accuracy = (correctCount / totalQuestions) * 100;
      const newDifficulty: DifficultyPerformance = {
        difficulty,
        questionsAnswered: totalQuestions,
        correctAnswers: correctCount,
        accuracy,
        averageTimeSpent: averageTime,
        confidenceLevel: (correctCount / totalQuestions) * 50 + 25, // Scale to 25-75 range initially
        masteryLevel: this.calculateMasteryLevel(totalQuestions, accuracy),
      };

      return [...difficultyPerformance, newDifficulty];
    }
  }

  private static calculateMasteryLevel(
    questionsAnswered: number,
    accuracy: number
  ): "novice" | "developing" | "proficient" | "advanced" | "expert" {
    if (questionsAnswered >= 50 && accuracy >= 85) return "expert";
    if (questionsAnswered >= 30 && accuracy >= 75) return "advanced";
    if (questionsAnswered >= 20 && accuracy >= 65) return "proficient";
    if (questionsAnswered >= 10 && accuracy >= 50) return "developing";
    return "novice";
  }

  private static updateWeaknessAreas(
    weaknessAreas: WeaknessArea[],
    quizResults: any,
    correctCount: number
  ): WeaknessArea[] {
    const accuracy = (correctCount / quizResults.totalQuestions) * 100;

    // If accuracy is below 60%, consider it a weakness area
    if (accuracy < 60) {
      const domain = quizResults.quizParams.domain;
      const existingIndex = weaknessAreas.findIndex((wa) => wa.area === domain);

      if (existingIndex >= 0) {
        const existing = weaknessAreas[existingIndex];
        const updatedWeakness: WeaknessArea = {
          ...existing,
          questionsAttempted:
            existing.questionsAttempted + quizResults.totalQuestions,
          accuracy:
            (existing.accuracy * existing.questionsAttempted +
              accuracy * quizResults.totalQuestions) /
            (existing.questionsAttempted + quizResults.totalQuestions),
          improvementTrend: accuracy - existing.accuracy, // Simple trend calculation
          severity: this.calculateWeaknessSeverity(accuracy),
          recommendedActions: this.generateRecommendedActions(domain, accuracy),
          targetDifficulty: accuracy < 40 ? "Easy" : "Medium",
        };

        return [
          ...weaknessAreas.slice(0, existingIndex),
          updatedWeakness,
          ...weaknessAreas.slice(existingIndex + 1),
        ];
      } else {
        const newWeakness: WeaknessArea = {
          area: domain,
          severity: this.calculateWeaknessSeverity(accuracy),
          questionsAttempted: quizResults.totalQuestions,
          accuracy,
          improvementTrend: 0,
          recommendedActions: this.generateRecommendedActions(domain, accuracy),
          targetDifficulty: accuracy < 40 ? "Easy" : "Medium",
        };

        return [...weaknessAreas, newWeakness];
      }
    }

    return weaknessAreas;
  }

  private static calculateWeaknessSeverity(
    accuracy: number
  ): "low" | "medium" | "high" | "critical" {
    if (accuracy < 30) return "critical";
    if (accuracy < 45) return "high";
    if (accuracy < 60) return "medium";
    return "low";
  }

  private static generateRecommendedActions(
    domain: string,
    accuracy: number
  ): string[] {
    const actions: string[] = [];

    if (accuracy < 40) {
      actions.push(`Review fundamental concepts in ${domain}`);
      actions.push("Start with easier questions to build confidence");
      actions.push("Take more time to understand each question");
    } else if (accuracy < 60) {
      actions.push(`Practice more questions in ${domain}`);
      actions.push("Focus on understanding explanations");
      actions.push("Review incorrect answers carefully");
    }

    return actions;
  }

  private static updateRecentPerformance(
    recentPerformance: RecentPerformance[],
    quizResults: any,
    correctCount: number,
    totalTime: number
  ): RecentPerformance[] {
    const newPerformance: RecentPerformance = {
      date: new Date(),
      quizId: `quiz_${Date.now()}`,
      score: (correctCount / quizResults.totalQuestions) * 100,
      difficulty: quizResults.difficulty,
      domain: quizResults.quizParams.domain,
      company: quizResults.quizParams.company,
      timeSpent: totalTime,
      questionsCorrect: correctCount,
      totalQuestions: quizResults.totalQuestions,
    };

    const updated = [newPerformance, ...recentPerformance];

    // Keep only the last 20 performances
    return updated.slice(0, 20);
  }

  private static calculateLearningVelocity(
    recentPerformance: RecentPerformance[]
  ): number {
    if (recentPerformance.length < 5) return 50; // Default for insufficient data

    const recent5 = recentPerformance.slice(0, 5);
    const older5 = recentPerformance.slice(5, 10);

    if (older5.length === 0) return 50;

    const recentAvg =
      recent5.reduce((sum, p) => sum + p.score, 0) / recent5.length;
    const olderAvg =
      older5.reduce((sum, p) => sum + p.score, 0) / older5.length;

    // Convert improvement to 0-100 scale
    const improvement = recentAvg - olderAvg;
    return Math.max(0, Math.min(100, 50 + improvement));
  }

  private static calculateConsistencyScore(
    recentPerformance: RecentPerformance[]
  ): number {
    if (recentPerformance.length < 3) return 50; // Default for insufficient data

    const scores = recentPerformance.slice(0, 10).map((p) => p.score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      scores.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to 0-100 scale where lower deviation = higher consistency
    return Math.max(0, 100 - standardDeviation * 2);
  }
}

// Export the service for use in AdaptiveDifficultyService
export default AdaptiveQuizFirebaseService;
