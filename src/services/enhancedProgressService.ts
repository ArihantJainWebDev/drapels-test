import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment,
  arrayUnion,
  writeBatch,
  runTransaction,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ProgressEvent {
  id: string;
  userId: string;
  type: 'dsa' | 'quiz' | 'community' | 'roadmap' | 'email' | 'interview' | 'compiler';
  action: string;
  data: any;
  timestamp: Date;
  xpGained: number;
  milestoneReached?: string;
  achievementUnlocked?: string;
}

export interface ProgressInsight {
  type: 'strength' | 'weakness' | 'trend' | 'recommendation';
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestedAction?: string;
}

export interface ProgressSummary {
  daily: {
    activitiesCompleted: number;
    xpGained: number;
    timeSpent: number;
    streak: number;
  };
  weekly: {
    activitiesCompleted: number;
    xpGained: number;
    timeSpent: number;
    topCategory: string;
  };
  monthly: {
    activitiesCompleted: number;
    xpGained: number;
    timeSpent: number;
    growthRate: number;
  };
}

class EnhancedProgressService {
  private progressCache = new Map<string, any>();
  private eventListeners = new Map<string, Function[]>();

  // Real-time progress synchronization
  async syncProgressAcrossFeatures(userId: string, event: Omit<ProgressEvent, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      return await runTransaction(db, async (transaction) => {
        const userProgressRef = doc(db, 'userProgress', userId);
        const progressDoc = await transaction.get(userProgressRef);
        
        if (!progressDoc.exists()) {
          throw new Error('User progress document not found');
        }

        const currentProgress = progressDoc.data();
        const updates: any = {
          lastUpdated: serverTimestamp(),
          'overall.totalActivities': increment(1),
          'overall.experience': increment(event.xpGained)
        };

        // Feature-specific updates
        switch (event.type) {
          case 'dsa':
            await this.handleDSAEvent(event, updates, currentProgress);
            break;
          case 'quiz':
            await this.handleQuizEvent(event, updates, currentProgress);
            break;
          case 'community':
            await this.handleCommunityEvent(event, updates, currentProgress);
            break;
          case 'roadmap':
            await this.handleRoadmapEvent(event, updates, currentProgress);
            break;
          case 'email':
            await this.handleEmailEvent(event, updates, currentProgress);
            break;
          case 'interview':
            await this.handleInterviewEvent(event, updates, currentProgress);
            break;
          case 'compiler':
            await this.handleCompilerEvent(event, updates, currentProgress);
            break;
        }

        // Update progress document
        transaction.update(userProgressRef, updates);

        // Log progress event
        const eventRef = doc(collection(db, 'progressEvents'));
        transaction.set(eventRef, {
          ...event,
          id: eventRef.id,
          timestamp: serverTimestamp(),
          userId
        });

        // Check for level ups and achievements
        await this.checkLevelUpAndAchievements(userId, currentProgress, updates, transaction);

        return true;
      });
    } catch (error) {
      console.error('Error syncing progress:', error);
      return false;
    }
  }

  private async handleDSAEvent(event: any, updates: any, currentProgress: any) {
    const { action, data } = event;
    
    switch (action) {
      case 'problem_solved':
        updates['dsa.completedProblems'] = increment(1);
        updates['dsa.lastSolvedDate'] = serverTimestamp();
        updates['dsa.totalTimeSpent'] = increment(data.timeSpent || 0);
        
        if (data.difficulty === 'Easy') {
          updates['dsa.easySolved'] = increment(1);
        } else if (data.difficulty === 'Medium') {
          updates['dsa.mediumSolved'] = increment(1);
        } else if (data.difficulty === 'Hard') {
          updates['dsa.hardSolved'] = increment(1);
        }
        
        if (data.topic) {
          updates['dsa.favoriteTopics'] = arrayUnion(data.topic);
        }
        break;
        
      case 'problem_attempted':
        updates['dsa.totalTimeSpent'] = increment(data.timeSpent || 0);
        break;
        
      case 'streak_updated':
        updates['dsa.streakDays'] = data.streakDays;
        break;
    }
  }

  private async handleQuizEvent(event: any, updates: any, currentProgress: any) {
    const { action, data } = event;
    
    switch (action) {
      case 'quiz_completed':
        updates['quiz.totalQuizzes'] = increment(1);
        updates['quiz.totalQuestions'] = increment(data.questions || 0);
        updates['quiz.correctAnswers'] = increment(data.correct || 0);
        updates['quiz.lastQuizDate'] = serverTimestamp();
        updates['quiz.totalTimeSpent'] = increment(data.timeSpent || 0);
        
        if (data.company) {
          updates['quiz.favoriteCompanies'] = arrayUnion(data.company);
        }
        if (data.domain) {
          updates['quiz.favoriteDomains'] = arrayUnion(data.domain);
        }
        
        // Recalculate accuracy
        const newTotalQuestions = (currentProgress.quiz?.totalQuestions || 0) + (data.questions || 0);
        const newCorrectAnswers = (currentProgress.quiz?.correctAnswers || 0) + (data.correct || 0);
        updates['quiz.accuracy'] = newTotalQuestions > 0 ? (newCorrectAnswers / newTotalQuestions) * 100 : 0;
        break;
    }
  }

  private async handleCommunityEvent(event: any, updates: any, currentProgress: any) {
    const { action, data } = event;
    
    switch (action) {
      case 'post_created':
        updates['community.totalPosts'] = increment(1);
        updates['community.lastActivity'] = serverTimestamp();
        break;
        
      case 'comment_created':
        updates['community.totalComments'] = increment(1);
        updates['community.lastActivity'] = serverTimestamp();
        break;
        
      case 'like_given':
        updates['community.totalLikes'] = increment(1);
        updates['community.lastActivity'] = serverTimestamp();
        break;
        
      case 'follow_action':
        if (data.action === 'follow') {
          updates['community.following'] = increment(1);
        } else if (data.action === 'unfollow') {
          updates['community.following'] = increment(-1);
        }
        break;
    }
  }

  private async handleRoadmapEvent(event: any, updates: any, currentProgress: any) {
    const { action, data } = event;
    
    switch (action) {
      case 'roadmap_created':
        updates['roadmaps.totalCreated'] = increment(1);
        updates['roadmaps.inProgress'] = increment(1);
        break;
        
      case 'roadmap_progress_updated':
        // Handle roadmap progress updates
        const currentRoadmaps = currentProgress.roadmaps?.currentRoadmaps || [];
        const roadmapIndex = currentRoadmaps.findIndex((r: any) => r.id === data.roadmapId);
        
        if (roadmapIndex >= 0) {
          currentRoadmaps[roadmapIndex].progress = data.progress;
          currentRoadmaps[roadmapIndex].lastActivity = new Date();
        } else {
          currentRoadmaps.push({
            id: data.roadmapId,
            title: data.title,
            progress: data.progress,
            lastActivity: new Date()
          });
        }
        
        updates['roadmaps.currentRoadmaps'] = currentRoadmaps;
        
        // Update completion counts
        const completed = currentRoadmaps.filter((r: any) => r.progress >= 100).length;
        const inProgress = currentRoadmaps.filter((r: any) => r.progress < 100 && r.progress > 0).length;
        
        updates['roadmaps.totalCompleted'] = completed;
        updates['roadmaps.inProgress'] = inProgress;
        break;
    }
  }

  private async handleEmailEvent(event: any, updates: any, currentProgress: any) {
    const { action, data } = event;
    
    switch (action) {
      case 'email_generated':
        updates['email.totalEmailsGenerated'] = increment(1);
        updates['email.totalWordsWritten'] = increment(data.words || 0);
        updates['email.lastGeneratedDate'] = serverTimestamp();
        updates['email.totalTimeSpent'] = increment(data.timeSpent || 0);
        
        if (data.template) {
          updates['email.favoriteTemplates'] = arrayUnion(data.template);
        }
        break;
    }
  }

  private async handleInterviewEvent(event: any, updates: any, currentProgress: any) {
    const { action, data } = event;
    
    switch (action) {
      case 'interview_session_completed':
        updates['interview.totalSessions'] = increment(1);
        updates['interview.totalTimeSpent'] = increment(data.sessionTime || 0);
        updates['interview.lastSessionDate'] = serverTimestamp();
        
        if (data.topic) {
          updates['interview.favoriteTopics'] = arrayUnion(data.topic);
        }
        
        if (data.isMockInterview && data.score !== undefined) {
          updates['interview.mockInterviewsCompleted'] = increment(1);
          // Update average score logic would go here
        }
        break;
    }
  }

  private async handleCompilerEvent(event: any, updates: any, currentProgress: any) {
    const { action, data } = event;
    
    switch (action) {
      case 'code_executed':
        updates['overall.totalTimeSpent'] = increment(data.timeSpent || 0);
        // Could track compiler-specific metrics here
        break;
        
      case 'code_debugged':
        // Track debugging activities
        break;
    }
  }

  private async checkLevelUpAndAchievements(userId: string, currentProgress: any, updates: any, transaction: any) {
    const currentLevel = currentProgress.overall?.level || 1;
    const currentXP = currentProgress.overall?.experience || 0;
    const xpGain = updates['overall.experience']?.operand || 0;
    const newXP = currentXP + xpGain;
    
    // Check for level up
    const newLevel = Math.floor(newXP / 100) + 1;
    if (newLevel > currentLevel) {
      updates['overall.level'] = newLevel;
      updates['overall.lastLevelUp'] = serverTimestamp();
      
      // Could trigger level up notification here
    }
    
    // Check for new achievements
    const newAchievements = this.calculateNewAchievements(currentProgress, updates);
    if (newAchievements.length > 0) {
      const currentAchievements = currentProgress.overall?.achievements || [];
      updates['overall.achievements'] = [...currentAchievements, ...newAchievements];
    }
  }

  private calculateNewAchievements(currentProgress: any, updates: any): string[] {
    const achievements: string[] = [];
    const currentAchievements = currentProgress.overall?.achievements || [];
    
    // DSA achievements
    const newDSACompleted = (currentProgress.dsa?.completedProblems || 0) + (updates['dsa.completedProblems']?.operand || 0);
    
    if (newDSACompleted >= 10 && !currentAchievements.includes('DSA Beginner')) {
      achievements.push('DSA Beginner');
    }
    if (newDSACompleted >= 50 && !currentAchievements.includes('DSA Enthusiast')) {
      achievements.push('DSA Enthusiast');
    }
    if (newDSACompleted >= 100 && !currentAchievements.includes('DSA Master')) {
      achievements.push('DSA Master');
    }
    
    // Quiz achievements
    const newQuizTotal = (currentProgress.quiz?.totalQuizzes || 0) + (updates['quiz.totalQuizzes']?.operand || 0);
    
    if (newQuizTotal >= 5 && !currentAchievements.includes('Quiz Taker')) {
      achievements.push('Quiz Taker');
    }
    if (newQuizTotal >= 20 && !currentAchievements.includes('Quiz Enthusiast')) {
      achievements.push('Quiz Enthusiast');
    }
    
    // Community achievements
    const newPosts = (currentProgress.community?.totalPosts || 0) + (updates['community.totalPosts']?.operand || 0);
    
    if (newPosts >= 5 && !currentAchievements.includes('Community Contributor')) {
      achievements.push('Community Contributor');
    }
    if (newPosts >= 20 && !currentAchievements.includes('Community Leader')) {
      achievements.push('Community Leader');
    }
    
    return achievements;
  }

  // Generate progress insights
  async generateProgressInsights(userId: string): Promise<ProgressInsight[]> {
    try {
      const userProgressRef = doc(db, 'userProgress', userId);
      const progressDoc = await getDoc(userProgressRef);
      
      if (!progressDoc.exists()) {
        return [];
      }
      
      const progress = progressDoc.data();
      const insights: ProgressInsight[] = [];
      
      // Analyze DSA progress
      if (progress.dsa?.completedProblems > 0) {
        const easyRatio = progress.dsa.easySolved / progress.dsa.completedProblems;
        const hardRatio = progress.dsa.hardSolved / progress.dsa.completedProblems;
        
        if (easyRatio > 0.7) {
          insights.push({
            type: 'recommendation',
            title: 'Challenge Yourself More',
            description: 'You\'ve been solving mostly easy problems. Try tackling more medium and hard problems to accelerate your growth.',
            category: 'dsa',
            priority: 'medium',
            actionable: true,
            suggestedAction: 'Solve 3 medium problems this week'
          });
        }
        
        if (hardRatio > 0.3) {
          insights.push({
            type: 'strength',
            title: 'Strong Problem Solver',
            description: 'You\'re consistently tackling hard problems. This shows excellent problem-solving skills!',
            category: 'dsa',
            priority: 'high',
            actionable: false
          });
        }
      }
      
      // Analyze quiz performance
      if (progress.quiz?.totalQuizzes > 5) {
        if (progress.quiz.accuracy > 85) {
          insights.push({
            type: 'strength',
            title: 'Excellent Quiz Performance',
            description: `Your ${Math.round(progress.quiz.accuracy)}% accuracy shows strong conceptual understanding.`,
            category: 'quiz',
            priority: 'high',
            actionable: false
          });
        } else if (progress.quiz.accuracy < 60) {
          insights.push({
            type: 'weakness',
            title: 'Quiz Accuracy Needs Improvement',
            description: 'Consider reviewing fundamental concepts before taking more quizzes.',
            category: 'quiz',
            priority: 'high',
            actionable: true,
            suggestedAction: 'Review documentation for your weakest topics'
          });
        }
      }
      
      // Analyze community engagement
      const communityActivity = (progress.community?.totalPosts || 0) + (progress.community?.totalComments || 0);
      if (communityActivity === 0) {
        insights.push({
          type: 'recommendation',
          title: 'Join the Community',
          description: 'Engaging with the community can accelerate your learning through discussions and knowledge sharing.',
          category: 'community',
          priority: 'medium',
          actionable: true,
          suggestedAction: 'Make your first post or comment'
        });
      }
      
      // Analyze learning consistency
      const daysSinceLastActivity = this.getDaysSinceLastActivity(progress);
      if (daysSinceLastActivity > 3) {
        insights.push({
          type: 'trend',
          title: 'Maintain Learning Momentum',
          description: `It's been ${daysSinceLastActivity} days since your last activity. Consistent practice leads to better results.`,
          category: 'overall',
          priority: 'high',
          actionable: true,
          suggestedAction: 'Complete at least one activity today'
        });
      }
      
      return insights;
    } catch (error) {
      console.error('Error generating progress insights:', error);
      return [];
    }
  }

  private getDaysSinceLastActivity(progress: any): number {
    const now = new Date();
    const lastActivities = [
      progress.dsa?.lastSolvedDate?.toDate?.(),
      progress.quiz?.lastQuizDate?.toDate?.(),
      progress.community?.lastActivity?.toDate?.(),
      progress.interview?.lastSessionDate?.toDate?.(),
      progress.email?.lastGeneratedDate?.toDate?.()
    ].filter(Boolean);
    
    if (lastActivities.length === 0) return 0;
    
    const mostRecent = new Date(Math.max(...lastActivities.map(d => d.getTime())));
    return Math.floor((now.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Get progress summary for different time periods
  async getProgressSummary(userId: string): Promise<ProgressSummary> {
    try {
      // This would typically query progress events for accurate time-based data
      // For now, we'll return a simplified version
      const userProgressRef = doc(db, 'userProgress', userId);
      const progressDoc = await getDoc(userProgressRef);
      
      if (!progressDoc.exists()) {
        throw new Error('Progress document not found');
      }
      
      const progress = progressDoc.data();
      
      return {
        daily: {
          activitiesCompleted: 0, // Would need daily tracking
          xpGained: 0,
          timeSpent: 0,
          streak: progress.dsa?.streakDays || 0
        },
        weekly: {
          activitiesCompleted: 0, // Would need weekly tracking
          xpGained: 0,
          timeSpent: 0,
          topCategory: this.getTopCategory(progress)
        },
        monthly: {
          activitiesCompleted: progress.overall?.totalActivities || 0,
          xpGained: progress.overall?.experience || 0,
          timeSpent: progress.overall?.totalTimeSpent || 0,
          growthRate: 0 // Would need historical data
        }
      };
    } catch (error) {
      console.error('Error getting progress summary:', error);
      throw error;
    }
  }

  private getTopCategory(progress: any): string {
    const categories: { [key: string]: number; } = {
      dsa: progress.dsa?.completedProblems || 0,
      quiz: progress.quiz?.totalQuizzes || 0,
      community: (progress.community?.totalPosts || 0) + (progress.community?.totalComments || 0),
      roadmap: progress.roadmaps?.totalCompleted || 0
    };

    return Object.entries(categories).reduce((a, b) => categories[a[0]] > categories[b[0]] ? a : b)[0];
  }

  // Subscribe to progress updates
  subscribeToProgress(userId: string, callback: (progress: any) => void): () => void {
    const userProgressRef = doc(db, 'userProgress', userId);
    
    return onSnapshot(userProgressRef, (doc) => {
      if (doc.exists()) {
        const progress = doc.data();
        this.progressCache.set(userId, progress);
        callback(progress);
      }
    });
  }

  // Batch update progress for multiple activities
  async batchUpdateProgress(userId: string, events: Omit<ProgressEvent, 'id' | 'timestamp' | 'userId'>[]): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      const userProgressRef = doc(db, 'userProgress', userId);
      
      // Process all events and accumulate updates
      const accumulatedUpdates: any = {
        lastUpdated: serverTimestamp()
      };
      
      for (const event of events) {
        // Process each event and merge updates
        // This would involve similar logic to syncProgressAcrossFeatures
        // but accumulated into a single batch update
      }
      
      batch.update(userProgressRef, accumulatedUpdates);
      
      // Log all events
      for (const event of events) {
        const eventRef = doc(collection(db, 'progressEvents'));
        batch.set(eventRef, {
          ...event,
          id: eventRef.id,
          timestamp: serverTimestamp(),
          userId
        });
      }
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error batch updating progress:', error);
      return false;
    }
  }
}

export const enhancedProgressService = new EnhancedProgressService();