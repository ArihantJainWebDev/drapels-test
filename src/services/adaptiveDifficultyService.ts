import { QuizQuestion, QuizParams } from "@/lib/quiz-api";
import { generateQuiz } from "@/lib/quiz-api";

export interface UserPerformanceData {
  userId: string;
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  domainPerformance: DomainPerformance[];
  companyPerformance: CompanyPerformance[];
  difficultyPerformance: DifficultyPerformance[];
  weaknessAreas: WeaknessArea[];
  recentPerformance: RecentPerformance[];
  learningVelocity: number;
  consistencyScore: number;
  averageScore: number;
  recentScores: number;
}

export interface DomainPerformance {
  domain: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageTimeSpent: number;
  lastAttempted: Date;
  difficultyDistribution: { [key: string]: number };
  recentScores?: number[];
}

export interface CompanyPerformance {
  company: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageTimeSpent: number;
  lastAttempted: Date;
  preferredTopics: string[];
}

export interface DifficultyPerformance {
  difficulty: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageTimeSpent: number;
  confidenceLevel: number;
  masteryLevel: "novice" | "developing" | "proficient" | "advanced" | "expert";
}

export interface WeaknessArea {
  area: string;
  severity: "low" | "medium" | "high" | "critical";
  questionsAttempted: number;
  accuracy: number;
  improvementTrend: number;
  recommendedActions: string[];
  targetDifficulty: string;
}

export interface RecentPerformance {
  date: Date;
  quizId: string;
  score: number;
  difficulty: string;
  domain: string;
  company: string;
  timeSpent: number;
  questionsCorrect: number;
  totalQuestions: number;
}

export interface AdaptiveDifficultyRecommendation {
  recommendedDifficulty: string;
  confidence: number;
  reasoning: string[];
  alternativeDifficulties: string[];
  expectedAccuracy: number;
  learningObjectives: string[];
  estimatedTimeToMastery: string;
}

export interface AdaptiveQuizGeneration {
  questions: QuizQuestion[];
  difficultyProgression: string[];
  focusAreas: string[];
  adaptationReasoning: string;
  expectedOutcomes: string[];
  nextRecommendations: string[];
}

export interface LearningPath {
  pathId: string;
  userId: string;
  targetRole: string;
  targetCompany: string;
  currentLevel: string;
  targetLevel: string;
  milestones: LearningMilestone[];
  estimatedDuration: string;
  adaptiveAdjustments: AdaptiveAdjustment[];
  progressPercentage: number;
}

export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  targetDifficulty: string;
  requiredAccuracy: number;
  estimatedQuizzes: number;
  skills: string[];
  prerequisites: string[];
  isCompleted: boolean;
  completedDate?: Date;
  actualQuizzesTaken?: number;
  actualAccuracy?: number;
}

export interface AdaptiveAdjustment {
  date: Date;
  reason: string;
  previousDifficulty: string;
  newDifficulty: string;
  adjustmentType: "increase" | "decrease" | "maintain" | "skip";
  confidence: number;
  expectedImpact: string;
}

export class AdaptiveDifficultyService {
  /**
   * Analyze user performance and recommend optimal difficulty
   */
  static async recommendDifficulty(
    userPerformance: UserPerformanceData,
    targetDomain: string,
    targetCompany: string
  ): Promise<AdaptiveDifficultyRecommendation> {
    try {
      // Get domain-specific performance
      const domainPerf = userPerformance.domainPerformance.find(
        (d) => d.domain === targetDomain
      );
      const companyPerf = userPerformance.companyPerformance.find(
        (c) => c.company === targetCompany
      );

      // Calculate base difficulty from overall performance
      let baseDifficulty = this.calculateBaseDifficulty(userPerformance);

      // Adjust based on domain performance
      if (domainPerf) {
        baseDifficulty = this.adjustForDomainPerformance(
          baseDifficulty,
          domainPerf
        );
      }

      // Adjust based on company performance
      if (companyPerf) {
        baseDifficulty = this.adjustForCompanyPerformance(
          baseDifficulty,
          companyPerf
        );
      }

      // Consider learning velocity and consistency
      baseDifficulty = this.adjustForLearningPattern(
        baseDifficulty,
        userPerformance
      );

      // Generate recommendation
      const recommendation = this.generateDifficultyRecommendation(
        baseDifficulty,
        userPerformance,
        domainPerf,
        companyPerf
      );

      return recommendation;
    } catch (error) {
      console.error("Error recommending difficulty:", error);
      throw new Error("Failed to recommend adaptive difficulty");
    }
  }

  /**
   * Generate adaptive quiz with difficulty progression
   */
  static async generateAdaptiveQuiz(
    userPerformance: UserPerformanceData,
    quizParams: QuizParams,
    questionCount: number = 10
  ): Promise<AdaptiveQuizGeneration> {
    try {
      // Get difficulty recommendation
      const difficultyRec = await this.recommendDifficulty(
        userPerformance,
        quizParams.domain,
        quizParams.company
      );

      // Identify focus areas based on weaknesses
      const focusAreas = this.identifyFocusAreas(
        userPerformance,
        quizParams.domain
      );

      // Create difficulty progression
      const difficultyProgression = this.createDifficultyProgression(
        difficultyRec.recommendedDifficulty,
        questionCount,
        userPerformance
      );

      // Generate questions with adaptive difficulty
      const questions = await this.generateProgressiveQuestions(
        quizParams,
        difficultyProgression,
        focusAreas
      );

      // Generate adaptation reasoning
      const adaptationReasoning = this.generateAdaptationReasoning(
        difficultyRec,
        focusAreas,
        difficultyProgression
      );

      return {
        questions,
        difficultyProgression,
        focusAreas,
        adaptationReasoning,
        expectedOutcomes: this.generateExpectedOutcomes(
          difficultyProgression,
          focusAreas
        ),
        nextRecommendations: this.generateNextRecommendations(
          userPerformance,
          difficultyRec
        ),
      };
    } catch (error) {
      console.error("Error generating adaptive quiz:", error);
      throw new Error("Failed to generate adaptive quiz");
    }
  }

  /**
   * Update user performance after quiz completion
   */
  static async updatePerformanceData(
    userId: string,
    quizResults: {
      quizParams: QuizParams;
      questions: QuizQuestion[];
      userAnswers: string[];
      timeSpent: number[];
      difficulty: string;
    }
  ): Promise<UserPerformanceData> {
    try {
      const { AdaptiveQuizFirebaseService } = await import(
        "./adaptiveQuizFirebaseService"
      );

      // Calculate score
      const correctCount = quizResults.userAnswers.reduce(
        (count, answer, index) => {
          return (
            count + (answer === quizResults.questions[index]?.answer ? 1 : 0)
          );
        },
        0
      );

      // Use Firebase service to update performance
      return await AdaptiveQuizFirebaseService.updatePerformanceAfterQuiz(
        userId,
        {
          ...quizResults,
          score: correctCount,
          totalQuestions: quizResults.questions.length,
        }
      );
    } catch (error) {
      console.error("Error updating performance data:", error);
      throw new Error("Failed to update performance data");
    }
  }

  /**
   * Generate personalized learning path
   */
  static async generateLearningPath(
    userId: string,
    targetRole: string,
    targetCompany: string,
    userPerformance: UserPerformanceData
  ): Promise<LearningPath> {
    try {
      // Determine current and target levels
      const currentLevel = this.assessCurrentLevel(userPerformance);
      const targetLevel = this.determineTargetLevel(targetRole, targetCompany);

      // Generate milestones
      const milestones = this.generateLearningMilestones(
        currentLevel,
        targetLevel,
        targetRole,
        targetCompany,
        userPerformance
      );

      // Estimate duration
      const estimatedDuration = this.estimatePathDuration(
        milestones,
        userPerformance
      );

      // Calculate progress
      const progressPercentage = this.calculatePathProgress(milestones);

      return {
        pathId: `path_${userId}_${Date.now()}`,
        userId,
        targetRole,
        targetCompany,
        currentLevel,
        targetLevel,
        milestones,
        estimatedDuration,
        adaptiveAdjustments: [],
        progressPercentage,
      };
    } catch (error) {
      console.error("Error generating learning path:", error);
      throw new Error("Failed to generate learning path");
    }
  }

  /**
   * Calibrate difficulty in real-time during quiz
   */
  static async calibrateDifficultyRealTime(
    userPerformance: UserPerformanceData,
    currentQuizProgress: {
      questionsAnswered: number;
      correctAnswers: number;
      averageTimePerQuestion: number;
      currentDifficulty: string;
    }
  ): Promise<{
    shouldAdjust: boolean;
    newDifficulty?: string;
    reasoning: string;
    confidence: number;
  }> {
    try {
      const currentAccuracy =
        currentQuizProgress.correctAnswers /
        currentQuizProgress.questionsAnswered;
      const expectedAccuracy = this.getExpectedAccuracy(
        userPerformance,
        currentQuizProgress.currentDifficulty
      );

      // Determine if adjustment is needed
      const accuracyDifference = currentAccuracy - expectedAccuracy;
      const timePerformance = this.analyzeTimePerformance(
        currentQuizProgress.averageTimePerQuestion,
        currentQuizProgress.currentDifficulty
      );

      // Decision logic for real-time adjustment
      if (accuracyDifference > 0.3 && timePerformance.isEfficient) {
        // User is performing much better than expected - increase difficulty
        return {
          shouldAdjust: true,
          newDifficulty: this.getNextDifficultyLevel(
            currentQuizProgress.currentDifficulty,
            "increase"
          ),
          reasoning:
            "User is performing significantly above expectations with efficient timing",
          confidence: 0.85,
        };
      } else if (accuracyDifference < -0.4 && !timePerformance.isEfficient) {
        // User is struggling - decrease difficulty
        return {
          shouldAdjust: true,
          newDifficulty: this.getNextDifficultyLevel(
            currentQuizProgress.currentDifficulty,
            "decrease"
          ),
          reasoning: "User is struggling with current difficulty level",
          confidence: 0.9,
        };
      } else {
        // Maintain current difficulty
        return {
          shouldAdjust: false,
          reasoning:
            "Current difficulty level is appropriate for user performance",
          confidence: 0.75,
        };
      }
    } catch (error) {
      console.error("Error calibrating difficulty:", error);
      return {
        shouldAdjust: false,
        reasoning: "Error in calibration - maintaining current difficulty",
        confidence: 0.5,
      };
    }
  }

  // Private helper methods

  private static calculateBaseDifficulty(
    userPerformance: UserPerformanceData
  ): string {
    const overallAccuracy = userPerformance.accuracy;
    const consistencyScore = userPerformance.consistencyScore;
    const learningVelocity = userPerformance.learningVelocity;

    // Weighted score calculation
    const weightedScore =
      overallAccuracy * 0.5 + consistencyScore * 0.3 + learningVelocity * 0.2;

    if (weightedScore >= 85) return "Expert";
    if (weightedScore >= 70) return "Hard";
    if (weightedScore >= 55) return "Medium";
    return "Easy";
  }

  private static adjustForDomainPerformance(
    baseDifficulty: string,
    domainPerf: DomainPerformance
  ): string {
    const domainAccuracy = domainPerf.accuracy;
    const difficultyLevels = ["Easy", "Medium", "Hard", "Expert"];
    const currentIndex = difficultyLevels.indexOf(baseDifficulty);

    if (domainAccuracy > 80 && currentIndex < difficultyLevels.length - 1) {
      return difficultyLevels[currentIndex + 1];
    } else if (domainAccuracy < 50 && currentIndex > 0) {
      return difficultyLevels[currentIndex - 1];
    }

    return baseDifficulty;
  }

  private static adjustForCompanyPerformance(
    baseDifficulty: string,
    companyPerf: CompanyPerformance
  ): string {
    const companyAccuracy = companyPerf.accuracy;
    const difficultyLevels = ["Easy", "Medium", "Hard", "Expert"];
    const currentIndex = difficultyLevels.indexOf(baseDifficulty);

    // Company-specific adjustment is more conservative
    if (companyAccuracy > 85 && currentIndex < difficultyLevels.length - 1) {
      return difficultyLevels[currentIndex + 1];
    } else if (companyAccuracy < 40 && currentIndex > 0) {
      return difficultyLevels[currentIndex - 1];
    }

    return baseDifficulty;
  }

  private static adjustForLearningPattern(
    baseDifficulty: string,
    userPerformance: UserPerformanceData
  ): string {
    const { learningVelocity, consistencyScore } = userPerformance;
    const difficultyLevels = ["Easy", "Medium", "Hard", "Expert"];
    const currentIndex = difficultyLevels.indexOf(baseDifficulty);

    // Fast learners with high consistency can handle higher difficulty
    if (
      learningVelocity > 80 &&
      consistencyScore > 75 &&
      currentIndex < difficultyLevels.length - 1
    ) {
      return difficultyLevels[currentIndex + 1];
    }

    // Inconsistent learners should stay at current or lower difficulty
    if (consistencyScore < 50 && currentIndex > 0) {
      return difficultyLevels[currentIndex - 1];
    }

    return baseDifficulty;
  }

  private static generateDifficultyRecommendation(
    recommendedDifficulty: string,
    userPerformance: UserPerformanceData,
    domainPerf?: DomainPerformance,
    companyPerf?: CompanyPerformance
  ): AdaptiveDifficultyRecommendation {
    const reasoning: string[] = [];
    const difficultyLevels = ["Easy", "Medium", "Hard", "Expert"];
    const currentIndex = difficultyLevels.indexOf(recommendedDifficulty);

    // Generate reasoning
    reasoning.push(
      `Overall accuracy of ${userPerformance.accuracy.toFixed(
        1
      )}% suggests ${recommendedDifficulty} level`
    );

    if (domainPerf) {
      reasoning.push(
        `Domain performance: ${domainPerf.accuracy.toFixed(1)}% accuracy in ${
          domainPerf.domain
        }`
      );
    }

    if (companyPerf) {
      reasoning.push(
        `Company-specific performance: ${companyPerf.accuracy.toFixed(
          1
        )}% accuracy for ${companyPerf.company}`
      );
    }

    reasoning.push(
      `Learning velocity: ${userPerformance.learningVelocity.toFixed(
        1
      )}% indicates ${
        userPerformance.learningVelocity > 70 ? "fast" : "steady"
      } progress`
    );

    // Calculate expected accuracy
    const expectedAccuracy = this.calculateExpectedAccuracy(
      recommendedDifficulty,
      userPerformance
    );

    // Generate alternative difficulties
    const alternatives: string[] = [];
    if (currentIndex > 0) alternatives.push(difficultyLevels[currentIndex - 1]);
    if (currentIndex < difficultyLevels.length - 1)
      alternatives.push(difficultyLevels[currentIndex + 1]);

    return {
      recommendedDifficulty,
      confidence: this.calculateRecommendationConfidence(
        userPerformance,
        domainPerf,
        companyPerf
      ),
      reasoning,
      alternativeDifficulties: alternatives,
      expectedAccuracy,
      learningObjectives: this.generateLearningObjectives(
        recommendedDifficulty,
        userPerformance
      ),
      estimatedTimeToMastery: this.estimateTimeToMastery(
        recommendedDifficulty,
        userPerformance
      ),
    };
  }

  private static calculateExpectedAccuracy(
    difficulty: string,
    userPerformance: UserPerformanceData
  ): number {
    const baseAccuracy = userPerformance.accuracy;
    const difficultyMultipliers: { [key: string]: number } = {
      Easy: 1.2,
      Medium: 1.0,
      Hard: 0.8,
      Expert: 0.6,
    };

    return Math.min(
      95,
      baseAccuracy * (difficultyMultipliers[difficulty] || 1.0)
    );
  }

  private static calculateRecommendationConfidence(
    userPerformance: UserPerformanceData,
    domainPerf?: DomainPerformance,
    companyPerf?: CompanyPerformance
  ): number {
    let confidence = 0.6; // Base confidence

    // Increase confidence based on data availability
    if (userPerformance.totalQuizzes > 10) confidence += 0.1;
    if (userPerformance.totalQuizzes > 25) confidence += 0.1;
    if (domainPerf && domainPerf.questionsAnswered > 20) confidence += 0.1;
    if (companyPerf && companyPerf.questionsAnswered > 15) confidence += 0.1;
    if (userPerformance.consistencyScore > 70) confidence += 0.1;

    return Math.min(0.95, confidence);
  }

  private static generateLearningObjectives(
    difficulty: string,
    userPerformance: UserPerformanceData
  ): string[] {
    const objectives: string[] = [];

    switch (difficulty) {
      case "Easy":
        objectives.push("Build foundational knowledge and confidence");
        objectives.push("Establish consistent study habits");
        objectives.push("Achieve 80%+ accuracy before advancing");
        break;
      case "Medium":
        objectives.push("Strengthen core concepts and problem-solving skills");
        objectives.push("Improve response time and efficiency");
        objectives.push("Maintain 70%+ accuracy consistently");
        break;
      case "Hard":
        objectives.push("Master advanced concepts and complex scenarios");
        objectives.push("Develop strategic thinking and optimization skills");
        objectives.push("Achieve 60%+ accuracy on challenging problems");
        break;
      case "Expert":
        objectives.push("Excel in cutting-edge and specialized topics");
        objectives.push("Demonstrate thought leadership and innovation");
        objectives.push("Maintain 50%+ accuracy on expert-level challenges");
        break;
    }

    // Add personalized objectives based on weakness areas
    userPerformance.weaknessAreas.forEach((weakness) => {
      if (weakness.severity === "high" || weakness.severity === "critical") {
        objectives.push(`Address weakness in ${weakness.area}`);
      }
    });

    return objectives;
  }

  private static estimateTimeToMastery(
    difficulty: string,
    userPerformance: UserPerformanceData
  ): string {
    const learningVelocity = userPerformance.learningVelocity;
    const baseTimeEstimates: { [key: string]: number } = {
      Easy: 2,
      Medium: 4,
      Hard: 8,
      Expert: 16,
    };

    const baseWeeks = baseTimeEstimates[difficulty] || 4;
    const adjustedWeeks = Math.max(
      1,
      Math.round(baseWeeks * (100 / Math.max(20, learningVelocity)))
    );

    if (adjustedWeeks === 1) return "1 week";
    if (adjustedWeeks < 4) return `${adjustedWeeks} weeks`;
    if (adjustedWeeks < 8)
      return `${Math.round(adjustedWeeks / 4)} month${
        adjustedWeeks >= 8 ? "s" : ""
      }`;
    return `${Math.round(adjustedWeeks / 4)} months`;
  }

  // Data persistence methods using Firebase
  static async getUserPerformanceData(
    userId: string
  ): Promise<UserPerformanceData> {
    const { AdaptiveQuizFirebaseService } = await import(
      "./adaptiveQuizFirebaseService"
    );
    return AdaptiveQuizFirebaseService.getUserPerformanceData(userId);
  }

  private static async saveUserPerformanceData(
    data: UserPerformanceData
  ): Promise<void> {
    const { AdaptiveQuizFirebaseService } = await import(
      "./adaptiveQuizFirebaseService"
    );
    return AdaptiveQuizFirebaseService.saveUserPerformanceData(data);
  }

  // Additional helper methods for real-time calibration and learning path generation

  private static identifyFocusAreas(
    userPerformance: UserPerformanceData,
    domain: string
  ): string[] {
    return userPerformance.weaknessAreas
      .filter((w) => w.severity === "high" || w.severity === "critical")
      .map((w) => w.area)
      .slice(0, 3); // Focus on top 3 weakness areas
  }

  private static mapLevelToDifficulty(level: string): string {
    const mapping: { [key: string]: string } = {
      Beginner: "Easy",
      Developing: "Easy",
      Intermediate: "Medium",
      Advanced: "Hard",
      Expert: "Expert",
    };
    return mapping[level] || "Medium";
  }

  private static getRequiredAccuracy(level: string): number {
    const requirements: { [key: string]: number } = {
      Beginner: 80,
      Developing: 80,
      Intermediate: 75,
      Advanced: 70,
      Expert: 65,
      // Additional levels
    };
    return requirements[level] || 70;
  }

  private static estimateQuizzesForLevel(
    level: string,
    userPerformance: UserPerformanceData
  ): number {
    const baseEstimates: { [key: string]: number } = {
      Beginner: 10,
      Developing: 15,
      Intermediate: 25,
      Advanced: 40,
      Expert: 60,
    };

    const baseQuizzes = baseEstimates[level] || 25;

    // Adjust based on learning velocity
    const velocityMultiplier = Math.max(
      0.5,
      Math.min(2.0, 100 / Math.max(20, userPerformance.learningVelocity))
    );

    return Math.ceil(baseQuizzes * velocityMultiplier);
  }

  private static getSkillsForLevel(
    level: string,
    targetRole: string
  ): string[] {
    interface LevelSkills {
      [key: string]: string[];
    }
    const levelSkills: LevelSkills = {
      Beginner: ["Basic syntax", "Simple algorithms", "Data types"],
      Developing: ["Control structures", "Functions", "Basic data structures"],
      Intermediate: [
        "Object-oriented programming",
        "Algorithms",
        "Problem solving",
      ],
      Advanced: ["System design", "Optimization", "Complex algorithms"],
      Expert: ["Architecture patterns", "Performance tuning", "Leadership"],
    };

    const roleSpecificSkills = {
      "Frontend Developer": [
        "React",
        "JavaScript",
        "CSS",
        "HTML",
        "TypeScript",
      ],
      "Backend Developer": [
        "APIs",
        "Databases",
        "Server architecture",
        "Security",
      ],
      "Full Stack Developer": [
        "Frontend frameworks",
        "Backend systems",
        "Databases",
        "DevOps",
      ],
      "Data Scientist": [
        "Statistics",
        "Machine learning",
        "Python",
        "Data analysis",
      ],
      "DevOps Engineer": [
        "CI/CD",
        "Infrastructure",
        "Monitoring",
        "Automation",
      ],
    };

    return [
      ...(levelSkills[level] || []),
      ...(
        roleSpecificSkills[targetRole as keyof typeof roleSpecificSkills] || []
      ).slice(0, 3),
    ];
  }

  private static getCompanySpecificSkills(
    company: string,
    role: string
  ): string[] {
    interface CompanySkills {
  [key: string]: string[];
}
    const companySkills: CompanySkills = {
      Google: ["System design", "Scalability", "Googleyness", "Leadership"],
      Amazon: [
        "Leadership principles",
        "Customer obsession",
        "Ownership",
        "Bias for action",
      ],
      Microsoft: [
        "Collaboration",
        "Growth mindset",
        "Customer focus",
        "Diversity",
      ],
      Meta: ["Move fast", "Be bold", "Focus on impact", "Be open"],
      Apple: [
        "Innovation",
        "Attention to detail",
        "User experience",
        "Quality",
      ],
    };

    return (
      companySkills[company] || ["Communication", "Problem solving", "Teamwork"]
    );
  }

  private static createDifficultyProgression(
    baseDifficulty: string,
    questionCount: number,
    userPerformance: UserPerformanceData
  ): string[] {
    const progression: string[] = [];
    const difficultyLevels = ["Easy", "Medium", "Hard", "Expert"];
    const baseIndex = difficultyLevels.indexOf(baseDifficulty);

    // Create a progression that starts easier and gradually increases
    for (let i = 0; i < questionCount; i++) {
      const progressRatio = i / (questionCount - 1);
      let difficultyIndex = baseIndex;

      // Gradually increase difficulty based on user's learning velocity
      if (userPerformance.learningVelocity > 70 && progressRatio > 0.3) {
        difficultyIndex = Math.min(difficultyLevels.length - 1, baseIndex + 1);
      }
      if (userPerformance.learningVelocity > 85 && progressRatio > 0.7) {
        difficultyIndex = Math.min(difficultyLevels.length - 1, baseIndex + 2);
      }

      progression.push(difficultyLevels[difficultyIndex]);
    }

    return progression;
  }

  private static async generateProgressiveQuestions(
    quizParams: QuizParams,
    difficultyProgression: string[],
    focusAreas: string[]
  ): Promise<QuizQuestion[]> {
    // For now, generate questions with the most common difficulty
    // In a full implementation, this would generate questions for each difficulty level
    const mostCommonDifficulty = this.getMostCommonDifficulty(
      difficultyProgression
    );
    const adaptedParams = { ...quizParams, difficulty: mostCommonDifficulty };

    return await generateQuiz(adaptedParams);
  }

  private static getMostCommonDifficulty(progression: string[]): string {
    const counts = progression.reduce((acc, diff) => {
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).reduce((a, b) =>
      counts[a[0]] > counts[b[0]] ? a : b
    )[0];
  }

  private static generateAdaptationReasoning(
    difficultyRec: AdaptiveDifficultyRecommendation,
    focusAreas: string[],
    difficultyProgression: string[]
  ): string {
    let reasoning = `Selected ${difficultyRec.recommendedDifficulty} difficulty based on your performance profile. `;

    if (focusAreas.length > 0) {
      reasoning += `Focusing on improvement areas: ${focusAreas.join(", ")}. `;
    }

    const uniqueDifficulties = [...new Set(difficultyProgression)];
    if (uniqueDifficulties.length > 1) {
      reasoning += `Questions will progress through ${uniqueDifficulties.join(
        " → "
      )} to challenge your growth.`;
    }

    return reasoning;
  }

  private static generateExpectedOutcomes(
    difficultyProgression: string[],
    focusAreas: string[]
  ): string[] {
    const outcomes: string[] = [];

    outcomes.push(
      `Improved performance in ${
        focusAreas.length > 0 ? focusAreas.join(" and ") : "target areas"
      }`
    );
    outcomes.push("Better understanding of your current skill level");
    outcomes.push("Personalized recommendations for continued learning");

    const hasProgression = new Set(difficultyProgression).size > 1;
    if (hasProgression) {
      outcomes.push("Experience with progressive difficulty challenges");
    }

    return outcomes;
  }

  private static generateNextRecommendations(
    userPerformance: UserPerformanceData,
    difficultyRec: AdaptiveDifficultyRecommendation
  ): string[] {
    const recommendations: string[] = [];

    recommendations.push(
      `Continue practicing at ${difficultyRec.recommendedDifficulty} level`
    );

    if (userPerformance.consistencyScore < 70) {
      recommendations.push("Focus on consistency by taking regular quizzes");
    }

    if (userPerformance.weaknessAreas.length > 0) {
      recommendations.push(
        `Address weakness areas: ${userPerformance.weaknessAreas
          .slice(0, 2)
          .map((w) => w.area)
          .join(", ")}`
      );
    }

    return recommendations;
  }

  // Additional helper methods for updating performance data
  private static updateOverallStats(
    data: UserPerformanceData,
    quizResults: any
  ): UserPerformanceData {
    const correctCount = quizResults.userAnswers.reduce(
      (count: number, answer: string, index: number) => {
        return count + (answer === quizResults.questions[index].answer ? 1 : 0);
      },
      0
    );

    data.totalQuizzes += 1;
    data.totalQuestions += quizResults.questions.length;
    data.correctAnswers += correctCount;
    data.accuracy = (data.correctAnswers / data.totalQuestions) * 100;

    return data;
  }

  private static updateDomainPerformance(
    data: UserPerformanceData,
    quizResults: any
  ): UserPerformanceData {
    const domain = quizResults.quizParams.domain;
    let domainPerf = data.domainPerformance.find((d) => d.domain === domain);

    if (!domainPerf) {
      domainPerf = {
        domain,
        questionsAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageTimeSpent: 0,
        lastAttempted: new Date(),
        difficultyDistribution: {},
      };
      data.domainPerformance.push(domainPerf);
    }

    const correctCount = quizResults.userAnswers.reduce(
      (count: number, answer: string, index: number) => {
        return count + (answer === quizResults.questions[index].answer ? 1 : 0);
      },
      0
    );

    domainPerf.questionsAnswered += quizResults.questions.length;
    domainPerf.correctAnswers += correctCount;
    domainPerf.accuracy =
      (domainPerf.correctAnswers / domainPerf.questionsAnswered) * 100;
    domainPerf.lastAttempted = new Date();

    // Update difficulty distribution
    const difficulty = quizResults.difficulty;
    domainPerf.difficultyDistribution[difficulty] =
      (domainPerf.difficultyDistribution[difficulty] || 0) + 1;

    return data;
  }

  private static updateCompanyPerformance(
    data: UserPerformanceData,
    quizResults: any
  ): UserPerformanceData {
    const company = quizResults.quizParams.company;
    let companyPerf = data.companyPerformance.find(
      (c) => c.company === company
    );

    if (!companyPerf) {
      companyPerf = {
        company,
        questionsAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageTimeSpent: 0,
        lastAttempted: new Date(),
        preferredTopics: [],
      };
      data.companyPerformance.push(companyPerf);
    }

    const correctCount = quizResults.userAnswers.reduce(
      (count: number, answer: string, index: number) => {
        return count + (answer === quizResults.questions[index].answer ? 1 : 0);
      },
      0
    );

    companyPerf.questionsAnswered += quizResults.questions.length;
    companyPerf.correctAnswers += correctCount;
    companyPerf.accuracy =
      (companyPerf.correctAnswers / companyPerf.questionsAnswered) * 100;
    companyPerf.lastAttempted = new Date();

    return data;
  }

  private static updateDifficultyPerformance(
    data: UserPerformanceData,
    quizResults: any
  ): UserPerformanceData {
    const difficulty = quizResults.difficulty;
    let diffPerf = data.difficultyPerformance.find(
      (d) => d.difficulty === difficulty
    );

    if (!diffPerf) {
      diffPerf = {
        difficulty,
        questionsAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageTimeSpent: 0,
        confidenceLevel: 50,
        masteryLevel: "novice",
      };
      data.difficultyPerformance.push(diffPerf);
    }

    const correctCount = quizResults.userAnswers.reduce(
      (count: number, answer: string, index: number) => {
        return count + (answer === quizResults.questions[index].answer ? 1 : 0);
      },
      0
    );

    diffPerf.questionsAnswered += quizResults.questions.length;
    diffPerf.correctAnswers += correctCount;
    diffPerf.accuracy =
      (diffPerf.correctAnswers / diffPerf.questionsAnswered) * 100;

    // Update mastery level based on accuracy and question count
    if (diffPerf.questionsAnswered >= 50 && diffPerf.accuracy >= 85) {
      diffPerf.masteryLevel = "expert";
    } else if (diffPerf.questionsAnswered >= 30 && diffPerf.accuracy >= 75) {
      diffPerf.masteryLevel = "advanced";
    } else if (diffPerf.questionsAnswered >= 20 && diffPerf.accuracy >= 65) {
      diffPerf.masteryLevel = "proficient";
    } else if (diffPerf.questionsAnswered >= 10 && diffPerf.accuracy >= 50) {
      diffPerf.masteryLevel = "developing";
    }

    return data;
  }

  private static updateWeaknessAreas(
    data: UserPerformanceData,
    quizResults: any
  ): UserPerformanceData {
    // Analyze incorrect answers to identify weakness patterns
    const incorrectQuestions = quizResults.questions.filter(
      (q: QuizQuestion, index: number) => {
        return quizResults.userAnswers[index] !== q.answer;
      }
    );

    // This is a simplified weakness detection - in practice, you'd analyze question topics/categories
    if (incorrectQuestions.length > quizResults.questions.length * 0.5) {
      const domain = quizResults.quizParams.domain;
      let weakness = data.weaknessAreas.find((w) => w.area === domain);

      if (!weakness) {
        weakness = {
          area: domain,
          severity: "medium",
          questionsAttempted: 0,
          accuracy: 0,
          improvementTrend: 0,
          recommendedActions: [],
          targetDifficulty: "Easy",
        };
        data.weaknessAreas.push(weakness);
      }

      weakness.questionsAttempted += quizResults.questions.length;
      const correctInDomain =
        quizResults.questions.length - incorrectQuestions.length;
      weakness.accuracy = (correctInDomain / weakness.questionsAttempted) * 100;

      // Update severity based on accuracy
      if (weakness.accuracy < 40) {
        weakness.severity = "critical";
      } else if (weakness.accuracy < 60) {
        weakness.severity = "high";
      } else if (weakness.accuracy < 75) {
        weakness.severity = "medium";
      } else {
        weakness.severity = "low";
      }
    }

    return data;
  }

  private static updateRecentPerformance(
    data: UserPerformanceData,
    quizResults: any
  ): UserPerformanceData {
    const correctCount = quizResults.userAnswers.reduce(
      (count: number, answer: string, index: number) => {
        return count + (answer === quizResults.questions[index].answer ? 1 : 0);
      },
      0
    );

    const recentPerf: RecentPerformance = {
      date: new Date(),
      quizId: `quiz_${Date.now()}`,
      score: (correctCount / quizResults.questions.length) * 100,
      difficulty: quizResults.difficulty,
      domain: quizResults.quizParams.domain,
      company: quizResults.quizParams.company,
      timeSpent: quizResults.timeSpent.reduce(
        (sum: number, time: number) => sum + time,
        0
      ),
      questionsCorrect: correctCount,
      totalQuestions: quizResults.questions.length,
    };

    data.recentPerformance.unshift(recentPerf);

    // Keep only last 20 performances
    if (data.recentPerformance.length > 20) {
      data.recentPerformance = data.recentPerformance.slice(0, 20);
    }

    return data;
  }

  private static recalculateMetrics(
    data: UserPerformanceData
  ): UserPerformanceData {
    // Calculate learning velocity based on recent performance trend
    if (data.recentPerformance.length >= 5) {
      const recent5 = data.recentPerformance.slice(0, 5);
      const older5 = data.recentPerformance.slice(5, 10);

      if (older5.length > 0) {
        const recentAvg =
          recent5.reduce((sum, p) => sum + p.score, 0) / recent5.length;
        const olderAvg =
          older5.reduce((sum, p) => sum + p.score, 0) / older5.length;
        data.learningVelocity = Math.max(
          0,
          Math.min(100, recentAvg - olderAvg + 50)
        );
      }
    }

    // Calculate consistency score based on score variance
    if (data.recentPerformance.length >= 3) {
      const scores = data.recentPerformance.map((p) => p.score);
      const mean =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const variance =
        scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
        scores.length;
      const standardDeviation = Math.sqrt(variance);

      // Convert to 0-100 scale where lower deviation = higher consistency
      data.consistencyScore = Math.max(0, 100 - standardDeviation * 2);
    }

    return data;
  }

  // Additional helper methods for real-time calibration
  private static getExpectedAccuracy(
    userPerformance: UserPerformanceData,
    difficulty: string
  ): number {
    const difficultyPerf = userPerformance.difficultyPerformance.find(
      (d) => d.difficulty === difficulty
    );
    if (difficultyPerf) {
      return difficultyPerf.accuracy / 100;
    }

    // Default expected accuracies by difficulty
    const defaults: { [key: string]: number } = {
      Easy: 0.8,
      Medium: 0.65,
      Hard: 0.5,
      Expert: 0.35,
    };

    return defaults[difficulty] || 0.65;
  }

  private static analyzeTimePerformance(
    averageTime: number,
    difficulty: string
  ): { isEfficient: boolean; analysis: string } {
    // Expected time ranges in seconds by difficulty
    const expectedTimes: { [key: string]: { min: number; max:  number; } } = {
      Easy: { min: 15, max: 45 },
      Medium: { min: 30, max: 90 },
      Hard: { min: 60, max: 180 },
      Expert: { min: 120, max: 300 },
    };

    const expected = expectedTimes[difficulty] || expectedTimes["Medium"];
    const isEfficient =
      averageTime >= expected.min && averageTime <= expected.max;

    let analysis = "";
    if (averageTime < expected.min) {
      analysis = "Answering too quickly - may indicate guessing";
    } else if (averageTime > expected.max) {
      analysis = "Taking longer than expected - may indicate difficulty";
    } else {
      analysis = "Time usage is appropriate for difficulty level";
    }

    return { isEfficient, analysis };
  }

  private static getNextDifficultyLevel(
    currentDifficulty: string,
    direction: "increase" | "decrease"
  ): string {
    const difficultyLevels = ["Easy", "Medium", "Hard", "Expert"];
    const currentIndex = difficultyLevels.indexOf(currentDifficulty);

    if (
      direction === "increase" &&
      currentIndex < difficultyLevels.length - 1
    ) {
      return difficultyLevels[currentIndex + 1];
    } else if (direction === "decrease" && currentIndex > 0) {
      return difficultyLevels[currentIndex - 1];
    }

    return currentDifficulty;
  }

  // Placeholder methods for learning path generation
  private static assessCurrentLevel(
    userPerformance: UserPerformanceData
  ): string {
    const accuracy = userPerformance.accuracy;
    if (accuracy >= 85) return "Advanced";
    if (accuracy >= 70) return "Intermediate";
    if (accuracy >= 50) return "Beginner";
    return "Novice";
  }

  private static determineTargetLevel(
    targetRole: string,
    targetCompany: string
  ): string {
    // This would be based on role/company requirements
    const seniorRoles = ["Senior", "Lead", "Principal", "Staff"];
    const topTierCompanies = ["Google", "Apple", "Microsoft", "Amazon", "Meta"];

    if (
      seniorRoles.some((role) => targetRole.includes(role)) ||
      topTierCompanies.includes(targetCompany)
    ) {
      return "Expert";
    }

    return "Advanced";
  }

  private static generateLearningMilestones(
    currentLevel: string,
    targetLevel: string,
    targetRole: string,
    targetCompany: string,
    userPerformance: UserPerformanceData
  ): LearningMilestone[] {
    const milestones: LearningMilestone[] = [];

    // This is a simplified milestone generation
    // In practice, this would be much more sophisticated

    milestones.push({
      id: "milestone_1",
      title: "Foundation Building",
      description: "Master fundamental concepts",
      targetDifficulty: "Easy",
      requiredAccuracy: 80,
      estimatedQuizzes: 10,
      skills: ["Basic Problem Solving", "Core Concepts"],
      prerequisites: [],
      isCompleted: false,
    });

    milestones.push({
      id: "milestone_2",
      title: "Intermediate Mastery",
      description: "Handle moderate complexity problems",
      targetDifficulty: "Medium",
      requiredAccuracy: 70,
      estimatedQuizzes: 15,
      skills: ["Advanced Problem Solving", "System Thinking"],
      prerequisites: ["milestone_1"],
      isCompleted: false,
    });

    if (targetLevel === "Advanced" || targetLevel === "Expert") {
      milestones.push({
        id: "milestone_3",
        title: "Advanced Proficiency",
        description: "Excel at complex scenarios",
        targetDifficulty: "Hard",
        requiredAccuracy: 60,
        estimatedQuizzes: 20,
        skills: ["Complex Problem Solving", "Optimization"],
        prerequisites: ["milestone_2"],
        isCompleted: false,
      });
    }

    if (targetLevel === "Expert") {
      milestones.push({
        id: "milestone_4",
        title: "Expert Level",
        description: "Master expert-level challenges",
        targetDifficulty: "Expert",
        requiredAccuracy: 50,
        estimatedQuizzes: 25,
        skills: ["Expert Problem Solving", "Innovation"],
        prerequisites: ["milestone_3"],
        isCompleted: false,
      });
    }

    return milestones;
  }

  private static estimatePathDuration(
    milestones: LearningMilestone[],
    userPerformance: UserPerformanceData
  ): string {
    const totalQuizzes = milestones.reduce(
      (sum, m) => sum + m.estimatedQuizzes,
      0
    );
    const learningVelocity = userPerformance.learningVelocity;

    // Assume 2-3 quizzes per week based on learning velocity
    const quizzesPerWeek = learningVelocity > 70 ? 3 : 2;
    const estimatedWeeks = Math.ceil(totalQuizzes / quizzesPerWeek);

    if (estimatedWeeks < 4) return `${estimatedWeeks} weeks`;
    if (estimatedWeeks < 12) return `${Math.round(estimatedWeeks / 4)} months`;
    return `${Math.round(estimatedWeeks / 12)} months`;
  }

  private static calculatePathProgress(
    milestones: LearningMilestone[]
  ): number {
    const completedMilestones = milestones.filter((m) => m.isCompleted).length;
    return milestones.length > 0
      ? (completedMilestones / milestones.length) * 100
      : 0;
  }
}
