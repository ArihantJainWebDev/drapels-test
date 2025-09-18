import { UserProgress, Achievement, DocumentationStats } from '@/types/documentation';

class DocumentationProgressService {
  private readonly STORAGE_KEY = 'documentation_progress';
  private readonly STATS_KEY = 'documentation_stats';

  // Get user progress for a specific learning path
  getPathProgress(pathId: string): UserProgress | null {
    const allProgress = this.getAllProgress();
    return allProgress.find(progress => progress.pathId === pathId) || null;
  }

  // Get all user progress
  getAllProgress(): UserProgress[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading progress:', error);
      return [];
    }
  }

  // Update progress for a specific path
  updatePathProgress(pathId: string, updates: Partial<UserProgress>): void {
    const allProgress = this.getAllProgress();
    const existingIndex = allProgress.findIndex(p => p.pathId === pathId);

    if (existingIndex >= 0) {
      allProgress[existingIndex] = { ...allProgress[existingIndex], ...updates };
    } else {
      const newProgress: UserProgress = {
        pathId,
        completedTopics: [],
        startedAt: new Date(),
        lastAccessedAt: new Date(),
        totalTimeSpent: 0,
        completionPercentage: 0,
        achievements: [],
        ...updates
      };
      allProgress.push(newProgress);
    }

    this.saveProgress(allProgress);
    this.updateStats();
  }

  // Mark a topic as completed
  completeTopicInPath(pathId: string, topicId: string, timeSpent: number = 0): void {
    const progress = this.getPathProgress(pathId);
    const completedTopics = progress?.completedTopics || [];
    
    if (!completedTopics.includes(topicId)) {
      completedTopics.push(topicId);
      
      this.updatePathProgress(pathId, {
        completedTopics,
        lastAccessedAt: new Date(),
        totalTimeSpent: (progress?.totalTimeSpent || 0) + timeSpent
      });

      // Check for achievements
      this.checkAndAwardAchievements(pathId);
    }
  }

  // Calculate completion percentage for a path
  calculateCompletionPercentage(pathId: string, totalTopics: number): number {
    const progress = this.getPathProgress(pathId);
    if (!progress || totalTopics === 0) return 0;
    
    return Math.round((progress.completedTopics.length / totalTopics) * 100);
  }

  // Update current topic being studied
  setCurrentTopic(pathId: string, topicId: string): void {
    this.updatePathProgress(pathId, {
      currentTopic: topicId,
      lastAccessedAt: new Date()
    });
  }

  // Award achievement
  awardAchievement(pathId: string, achievement: Achievement): void {
    const progress = this.getPathProgress(pathId);
    if (!progress) return;

    const existingAchievements = progress.achievements || [];
    if (!existingAchievements.find(a => a.id === achievement.id)) {
      existingAchievements.push(achievement);
      this.updatePathProgress(pathId, { achievements: existingAchievements });
    }
  }

  // Check and award achievements based on progress
  private checkAndAwardAchievements(pathId: string): void {
    const progress = this.getPathProgress(pathId);
    if (!progress) return;

    const completedCount = progress.completedTopics.length;

    // First topic completion
    if (completedCount === 1) {
      this.awardAchievement(pathId, {
        id: 'first-topic',
        title: 'Getting Started',
        description: 'Completed your first topic!',
        iconName: 'Play',
        unlockedAt: new Date(),
        type: 'completion'
      });
    }

    // 5 topics completion
    if (completedCount === 5) {
      this.awardAchievement(pathId, {
        id: 'five-topics',
        title: 'Making Progress',
        description: 'Completed 5 topics in a learning path!',
        iconName: 'Target',
        unlockedAt: new Date(),
        type: 'completion'
      });
    }

    // Path completion (assuming 10+ topics for full path)
    if (completedCount >= 10) {
      this.awardAchievement(pathId, {
        id: 'path-master',
        title: 'Path Master',
        description: 'Completed an entire learning path!',
        iconName: 'Trophy',
        unlockedAt: new Date(),
        type: 'mastery'
      });
    }
  }

  // Get documentation statistics
  getStats(): DocumentationStats {
    try {
      const stored = localStorage.getItem(this.STATS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultStats();
    } catch (error) {
      console.error('Error loading stats:', error);
      return this.getDefaultStats();
    }
  }

  // Update statistics
  private updateStats(): void {
    const allProgress = this.getAllProgress();
    const stats: DocumentationStats = {
      totalPaths: 0, // Will be set by the component that knows total paths
      totalTopics: 0, // Will be set by the component that knows total topics
      completedPaths: allProgress.filter(p => p.completionPercentage === 100).length,
      completedTopics: allProgress.reduce((sum, p) => sum + p.completedTopics.length, 0),
      totalTimeSpent: allProgress.reduce((sum, p) => sum + p.totalTimeSpent, 0),
      currentStreak: this.calculateCurrentStreak(),
      longestStreak: this.calculateLongestStreak()
    };

    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  // Calculate current learning streak
  private calculateCurrentStreak(): number {
    const allProgress = this.getAllProgress();
    if (allProgress.length === 0) return 0;

    // Sort by last accessed date
    const sortedProgress = allProgress.sort((a, b) => 
      new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const progress of sortedProgress) {
      const lastAccessed = new Date(progress.lastAccessedAt);
      lastAccessed.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Calculate longest learning streak
  private calculateLongestStreak(): number {
    // This is a simplified implementation
    // In a real app, you'd track daily activity more precisely
    return Math.max(this.calculateCurrentStreak(), 0);
  }

  // Get default stats
  private getDefaultStats(): DocumentationStats {
    return {
      totalPaths: 0,
      totalTopics: 0,
      completedPaths: 0,
      completedTopics: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      longestStreak: 0
    };
  }

  // Save progress to localStorage
  private saveProgress(progress: UserProgress[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  // Reset all progress (for testing/admin purposes)
  resetAllProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STATS_KEY);
  }

  // Export progress data
  exportProgress(): string {
    const progress = this.getAllProgress();
    const stats = this.getStats();
    return JSON.stringify({ progress, stats }, null, 2);
  }

  // Import progress data
  importProgress(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.progress && Array.isArray(parsed.progress)) {
        this.saveProgress(parsed.progress);
        if (parsed.stats) {
          localStorage.setItem(this.STATS_KEY, JSON.stringify(parsed.stats));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing progress:', error);
      return false;
    }
  }
}

export const documentationProgressService = new DocumentationProgressService();