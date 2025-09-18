// services/progressService.js
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
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

export interface UserProgress {
  userId: string;
  lastUpdated: Date;
  
  // Overall Stats - Fixed interface to match your usage
  overall: {
    totalTimeSpent: number;
    totalActivities: number;
    experience: number;
    level: number;
    nextLevelXP: number;
    achievements: string[];
    badges: string[];
    lastLevelUp: Date;
  };
  
  // Roadmap Progress
  roadmaps: {
    totalCreated: number;
    totalCompleted: number;
    inProgress: number;
    totalHoursSpent: number;
    currentRoadmaps: Array<{
      id: string;
      title: string;
      progress: number;
      lastActivity: Date;
    }>;
  };
  
  // DSA Progress
  dsa: {
    totalProblems: number;
    completedProblems: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    streakDays: number;
    lastSolvedDate: Date;
    favoriteTopics: string[];
    totalTimeSpent: number;
  };
  
  // Quiz Progress
  quiz: {
    totalQuizzes: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    lastQuizDate: Date;
    favoriteCompanies: string[];
    favoriteDomains: string[];
    totalTimeSpent: number;
  };
  
  // Community Progress
  community: {
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    totalShares: number;
    communitiesJoined: number;
    followers: number;
    following: number;
    lastActivity: Date;
  };
}

// Initialize user progress document with proper error handling
export const initializeUserProgress = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Initializing progress document for user: ${userId}`);
    
    const userProgressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(userProgressRef);
    
    if (!progressDoc.exists()) {
      const initialProgress = {
        userId,
        lastUpdated: serverTimestamp(),
        
        overall: {
          totalTimeSpent: 0,
          totalActivities: 0,
          experience: 0,
          level: 1,
          nextLevelXP: 100,
          achievements: [],
          badges: [],
          lastLevelUp: serverTimestamp()
        },
        
        roadmaps: {
          totalCreated: 0,
          totalCompleted: 0,
          inProgress: 0,
          totalHoursSpent: 0,
          currentRoadmaps: []
        },
        
        dsa: {
          totalProblems: 0,
          completedProblems: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          streakDays: 0,
          lastSolvedDate: serverTimestamp(),
          favoriteTopics: [],
          totalTimeSpent: 0
        },
        
        quiz: {
          totalQuizzes: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          lastQuizDate: serverTimestamp(),
          favoriteCompanies: [],
          favoriteDomains: [],
          totalTimeSpent: 0
        },
        
        community: {
          totalPosts: 0,
          totalComments: 0,
          totalLikes: 0,
          totalShares: 0,
          communitiesJoined: 0,
          followers: 0,
          following: 0,
          lastActivity: serverTimestamp()
        }
      };
      
      await setDoc(userProgressRef, initialProgress);
      console.log(`Progress document created successfully for user: ${userId}`);
      return true;
    }
    
    console.log(`Progress document already exists for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error initializing user progress:', error);
    return false;
  }
};

// Enhanced getUserProgress with proper real-time listener and error handling
export const getUserProgress = (userId: string, callback: (progress: UserProgress | null) => void) => {
  console.log(`Setting up real-time progress listener for user: ${userId}`);
  
  if (!userId) {
    console.error('No userId provided for progress listener');
    callback(null);
    return () => {};
  }

  const userProgressRef = doc(db, 'userProgress', userId);
  
  // Set up real-time listener with proper error handling
  const unsubscribe = onSnapshot(
    userProgressRef,
    async (docSnapshot) => {
      try {
        if (docSnapshot.exists()) {
          console.log(`Progress data found for user: ${userId}`);
          const data = docSnapshot.data();
          
          // Convert Firestore timestamps to Date objects
          const progressData: UserProgress = {
            ...data,
            userId,
            lastUpdated: data.lastUpdated?.toDate() || new Date(),
            
            overall: {
              ...data.overall,
              lastLevelUp: data.overall?.lastLevelUp?.toDate() || new Date(),
              nextLevelXP: data.overall?.nextLevelXP || ((data.overall?.level || 1) + 1) * 100
            },
            
            dsa: {
              ...data.dsa,
              lastSolvedDate: data.dsa?.lastSolvedDate?.toDate() || new Date(),
              favoriteTopics: data.dsa?.favoriteTopics || []
            },
            
            quiz: {
              ...data.quiz,
              lastQuizDate: data.quiz?.lastQuizDate?.toDate() || new Date(),
              favoriteCompanies: data.quiz?.favoriteCompanies || [],
              favoriteDomains: data.quiz?.favoriteDomains || []
            },
            
            community: {
              ...data.community,
              lastActivity: data.community?.lastActivity?.toDate() || new Date()
            },
            
            roadmaps: {
              ...data.roadmaps,
              currentRoadmaps: data.roadmaps?.currentRoadmaps?.map((roadmap: any) => ({
                ...roadmap,
                lastActivity: roadmap.lastActivity?.toDate() || new Date()
              })) || []
            }
          };
          
          callback(progressData);
        } else {
          console.log(`No progress document found for user: ${userId}, creating new one...`);
          
          // Initialize progress document if it doesn't exist
          const initialized = await initializeUserProgress(userId);
          if (!initialized) {
            console.error(`Failed to initialize progress for user: ${userId}`);
            callback(null);
          }
          // The listener will fire again after initialization
        }
      } catch (error) {
        console.error('Error processing progress snapshot:', error);
        callback(null);
      }
    },
    (error) => {
      console.error('Error in progress listener:', error);
      callback(null);
    }
  );

  return unsubscribe;
};

// Utility function to safely update progress with initialization check
const safeUpdateProgress = async (userId: string, updates: any): Promise<boolean> => {
  try {
    // Ensure document exists
    await initializeUserProgress(userId);
    
    const userProgressRef = doc(db, 'userProgress', userId);
    await updateDoc(userProgressRef, {
      ...updates,
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating progress:', error);
    return false;
  }
};

// Level calculation and achievement system
const calculateLevel = (experience: number): number => {
  return Math.floor(experience / 100) + 1;
};

const calculateAchievements = (progress: UserProgress): string[] => {
  const achievements: string[] = [];
  
  // DSA Achievements
  if (progress.dsa.completedProblems >= 10) achievements.push('DSA Beginner');
  if (progress.dsa.completedProblems >= 50) achievements.push('DSA Enthusiast');
  if (progress.dsa.completedProblems >= 100) achievements.push('DSA Master');
  if (progress.dsa.streakDays >= 7) achievements.push('Week Warrior');
  if (progress.dsa.streakDays >= 30) achievements.push('Monthly Master');
  
  // Quiz Achievements
  if (progress.quiz.totalQuizzes >= 5) achievements.push('Quiz Taker');
  if (progress.quiz.totalQuizzes >= 20) achievements.push('Quiz Enthusiast');
  if (progress.quiz.accuracy >= 80) achievements.push('High Accuracy');
  
  // Community Achievements
  if (progress.community.totalPosts >= 5) achievements.push('Community Contributor');
  if (progress.community.totalPosts >= 20) achievements.push('Community Leader');
  if (progress.community.followers >= 10) achievements.push('Influencer');
  
  // Overall Achievements
  if (progress.overall.totalActivities >= 50) achievements.push('Active Learner');
  if (progress.overall.level >= 5) achievements.push('Level 5 Achiever');
  if (progress.overall.level >= 10) achievements.push('Level 10 Master');
  
  return achievements;
};

// Update functions with automatic level and achievement updates
export const updateDSAProgress = async (userId: string, problemData: {
  difficulty: string;
  topic: string;
  timeSpent: number;
  completed: boolean;
}): Promise<boolean> => {
  try {
    console.log(`Updating DSA progress for user: ${userId}`);
    
    const updates: any = {
      'dsa.lastSolvedDate': serverTimestamp(),
      'dsa.totalTimeSpent': increment(problemData.timeSpent),
      'overall.totalTimeSpent': increment(problemData.timeSpent),
      'overall.totalActivities': increment(1)
    };
    
    if (problemData.completed) {
      updates['dsa.completedProblems'] = increment(1);
      updates['overall.experience'] = increment(10);
      
      // Difficulty-based updates
      if (problemData.difficulty === 'Easy') {
        updates['dsa.easySolved'] = increment(1);
      } else if (problemData.difficulty === 'Medium') {
        updates['dsa.mediumSolved'] = increment(1);
        updates['overall.experience'] = increment(5);
      } else if (problemData.difficulty === 'Hard') {
        updates['dsa.hardSolved'] = increment(1);
        updates['overall.experience'] = increment(10);
      }
      
      // Update favorite topics
      updates['dsa.favoriteTopics'] = arrayUnion(problemData.topic);
    }
    
    const success = await safeUpdateProgress(userId, updates);
    
    if (success) {
      // Update level and achievements after successful update
      await updateLevelAndAchievements(userId);
    }
    
    return success;
  } catch (error) {
    console.error('Error updating DSA progress:', error);
    return false;
  }
};

export const updateQuizProgress = async (userId: string, quizData: {
  questions: number;
  correct: number;
  company: string;
  domain: string;
  timeSpent: number;
}): Promise<boolean> => {
  try {
    console.log(`Updating quiz progress for user: ${userId}`);
    
    // Get current progress to calculate accuracy
    const userProgressRef = doc(db, 'userProgress', userId);
    const currentDoc = await getDoc(userProgressRef);
    
    let overallAccuracy = 0;
    if (currentDoc.exists()) {
      const currentData = currentDoc.data();
      const currentTotalQuestions = currentData.quiz?.totalQuestions || 0;
      const currentCorrectAnswers = currentData.quiz?.correctAnswers || 0;
      const newTotalQuestions = currentTotalQuestions + quizData.questions;
      const newCorrectAnswers = currentCorrectAnswers + quizData.correct;
      overallAccuracy = newTotalQuestions > 0 ? (newCorrectAnswers / newTotalQuestions) * 100 : 0;
    }
    
    const updates = {
      'quiz.totalQuizzes': increment(1),
      'quiz.totalQuestions': increment(quizData.questions),
      'quiz.correctAnswers': increment(quizData.correct),
      'quiz.accuracy': overallAccuracy,
      'quiz.lastQuizDate': serverTimestamp(),
      'quiz.totalTimeSpent': increment(quizData.timeSpent),
      'quiz.favoriteCompanies': arrayUnion(quizData.company),
      'quiz.favoriteDomains': arrayUnion(quizData.domain),
      'overall.totalTimeSpent': increment(quizData.timeSpent),
      'overall.totalActivities': increment(1),
      'overall.experience': increment(5 * quizData.correct)
    };
    
    const success = await safeUpdateProgress(userId, updates);
    
    if (success) {
      await updateLevelAndAchievements(userId);
    }
    
    return success;
  } catch (error) {
    console.error('Error updating quiz progress:', error);
    return false;
  }
};

export const updateCommunityProgress = async (userId: string, action: 'post' | 'comment' | 'like' | 'share' | 'follow'): Promise<boolean> => {
  try {
    console.log(`Updating community progress for user: ${userId}, action: ${action}`);
    
    const updates: any = {
      'community.lastActivity': serverTimestamp(),
      'overall.totalActivities': increment(1)
    };
    
    switch (action) {
      case 'post':
        updates['community.totalPosts'] = increment(1);
        updates['overall.experience'] = increment(5);
        break;
      case 'comment':
        updates['community.totalComments'] = increment(1);
        updates['overall.experience'] = increment(2);
        break;
      case 'like':
        updates['community.totalLikes'] = increment(1);
        updates['overall.experience'] = increment(1);
        break;
      case 'share':
        updates['community.totalShares'] = increment(1);
        updates['overall.experience'] = increment(3);
        break;
      case 'follow':
        updates['community.following'] = increment(1);
        updates['overall.experience'] = increment(2);
        break;
    }
    
    const success = await safeUpdateProgress(userId, updates);
    
    if (success) {
      await updateLevelAndAchievements(userId);
    }
    
    return success;
  } catch (error) {
    console.error('Error updating community progress:', error);
    return false;
  }
};

export const updateRoadmapProgress = async (userId: string, roadmapId: string, progress: number, title: string): Promise<boolean> => {
  try {
    console.log(`Updating roadmap progress for user: ${userId}, roadmap: ${roadmapId}`);
    
    await initializeUserProgress(userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    const progressDoc = await getDoc(userProgressRef);
    if (!progressDoc.exists()) return false;
    
    const currentData = progressDoc.data();
    const currentRoadmaps = currentData.roadmaps?.currentRoadmaps || [];
    
    const existingIndex = currentRoadmaps.findIndex((r: any) => r.id === roadmapId);
    let updates: any = {
      'roadmaps.lastActivity': serverTimestamp(),
      'overall.totalActivities': increment(1),
      'overall.experience': increment(5)
    };
    
    if (existingIndex >= 0) {
      currentRoadmaps[existingIndex] = {
        ...currentRoadmaps[existingIndex],
        progress,
        lastActivity: new Date()
      };
    } else {
      currentRoadmaps.push({
        id: roadmapId,
        title,
        progress,
        lastActivity: new Date()
      });
      updates['roadmaps.totalCreated'] = increment(1);
    }
    
    // Update completion counts
    const completed = currentRoadmaps.filter((r: any) => r.progress >= 100).length;
    const inProgress = currentRoadmaps.filter((r: any) => r.progress < 100 && r.progress > 0).length;
    
    updates['roadmaps.currentRoadmaps'] = currentRoadmaps;
    updates['roadmaps.totalCompleted'] = completed;
    updates['roadmaps.inProgress'] = inProgress;
    
    const success = await safeUpdateProgress(userId, updates);
    
    if (success) {
      await updateLevelAndAchievements(userId);
    }
    
    return success;
  } catch (error) {
    console.error('Error updating roadmap progress:', error);
    return false;
  }
};

// Update level and achievements after any progress change
const updateLevelAndAchievements = async (userId: string): Promise<void> => {
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(userProgressRef);
    
    if (!progressDoc.exists()) return;
    
    const data = progressDoc.data();
    const currentLevel = data.overall?.level || 1;
    const currentXP = data.overall?.experience || 0;
    
    // Calculate new level
    const newLevel = calculateLevel(currentXP);
    const nextLevelXP = (newLevel + 1) * 100;
    
    // Calculate achievements
    const currentProgress = {
      ...data,
      overall: { ...data.overall, level: newLevel }
    } as UserProgress;
    const newAchievements = calculateAchievements(currentProgress);
    
    const updates: any = {
      'overall.nextLevelXP': nextLevelXP
    };
    
    // Update level if changed
    if (newLevel > currentLevel) {
      updates['overall.level'] = newLevel;
      updates['overall.lastLevelUp'] = serverTimestamp();
      console.log(`User ${userId} leveled up to level ${newLevel}!`);
    }
    
    // Update achievements if changed
    const currentAchievements = data.overall?.achievements || [];
    if (JSON.stringify(newAchievements.sort()) !== JSON.stringify(currentAchievements.sort())) {
      updates['overall.achievements'] = newAchievements;
      console.log(`User ${userId} achievements updated:`, newAchievements);
    }
    
    if (Object.keys(updates).length > 1) { // More than just nextLevelXP
      await updateDoc(userProgressRef, updates);
    }
  } catch (error) {
    console.error('Error updating level and achievements:', error);
  }
};

// Sync existing data from other collections (one-time migration)
export const syncProgressFromCollections = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Syncing progress from collections for user: ${userId}`);
    
    await initializeUserProgress(userId);
    const batch = writeBatch(db);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    // Initialize counters
    let stats = {
      dsa: { completed: 0, easy: 0, medium: 0, hard: 0, timeSpent: 0 },
      quiz: { total: 0, questions: 0, correct: 0, timeSpent: 0 },
      community: { posts: 0, comments: 0, likes: 0, followers: 0, following: 0 }
    };
    
    try {
      // Sync DSA progress
      const dsaQuery = query(collection(db, 'dsaProgress'), where('userId', '==', userId));
      const dsaSnapshot = await getDocs(dsaQuery);
      
      dsaSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.completed) {
          stats.dsa.completed++;
          switch (data.difficulty) {
            case 'Easy': stats.dsa.easy++; break;
            case 'Medium': stats.dsa.medium++; break;
            case 'Hard': stats.dsa.hard++; break;
          }
        }
        if (data.timeSpent) stats.dsa.timeSpent += data.timeSpent;
      });
    } catch (error) {
      console.log('DSA collection not found or empty, skipping...');
    }
    
    try {
      // Sync quiz progress
      const quizQuery = query(collection(db, 'quizHistory'), where('userId', '==', userId));
      const quizSnapshot = await getDocs(quizQuery);
      
      quizSnapshot.docs.forEach(doc => {
        const data = doc.data();
        stats.quiz.total++;
        if (data.questions) stats.quiz.questions += Array.isArray(data.questions) ? data.questions.length : data.questions;
        if (data.score || data.correct) stats.quiz.correct += data.score || data.correct;
        if (data.timeSpent) stats.quiz.timeSpent += data.timeSpent;
      });
    } catch (error) {
      console.log('Quiz collection not found or empty, skipping...');
    }
    
    try {
      // Sync community progress
      const postsQuery = query(collection(db, 'posts'), where('authorId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      stats.community.posts = postsSnapshot.docs.length;
      
      const commentsQuery = query(collection(db, 'comments'), where('authorId', '==', userId));
      const commentsSnapshot = await getDocs(commentsQuery);
      stats.community.comments = commentsSnapshot.docs.length;
    } catch (error) {
      console.log('Community collections not found or empty, skipping...');
    }
    
    // Calculate totals
    const totalActivities = stats.dsa.completed + stats.quiz.total + stats.community.posts + stats.community.comments;
    const totalXP = (stats.dsa.completed * 10) + (stats.quiz.correct * 5) + (stats.community.posts * 5) + (stats.community.comments * 2);
    const level = calculateLevel(totalXP);
    const nextLevelXP = (level + 1) * 100;
    
    // Batch update
    batch.update(userProgressRef, {
      'dsa.completedProblems': stats.dsa.completed,
      'dsa.easySolved': stats.dsa.easy,
      'dsa.mediumSolved': stats.dsa.medium,
      'dsa.hardSolved': stats.dsa.hard,
      'dsa.totalTimeSpent': stats.dsa.timeSpent,
      'quiz.totalQuizzes': stats.quiz.total,
      'quiz.totalQuestions': stats.quiz.questions,
      'quiz.correctAnswers': stats.quiz.correct,
      'quiz.accuracy': stats.quiz.questions > 0 ? (stats.quiz.correct / stats.quiz.questions) * 100 : 0,
      'quiz.totalTimeSpent': stats.quiz.timeSpent,
      'community.totalPosts': stats.community.posts,
      'community.totalComments': stats.community.comments,
      'community.followers': stats.community.followers,
      'community.following': stats.community.following,
      'overall.totalActivities': totalActivities,
      'overall.experience': totalXP,
      'overall.level': level,
      'overall.nextLevelXP': nextLevelXP,
      'overall.totalTimeSpent': stats.dsa.timeSpent + stats.quiz.timeSpent,
      'lastUpdated': serverTimestamp()
    });
    
    await batch.commit();
    
    console.log(`Progress synced successfully for user: ${userId}`);
    console.log('Synced stats:', stats);
    return true;
  } catch (error) {
    console.error('Error syncing progress from collections:', error);
    return false;
  }
};

// Additional utility functions
export const createProgressDocument = async (userId: string): Promise<boolean> => {
  return await initializeUserProgress(userId);
};

export const getProgressSnapshot = async (userId: string): Promise<UserProgress | null> => {
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(userProgressRef);
    
    if (progressDoc.exists()) {
      const data = progressDoc.data();
      return {
        ...data,
        userId,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        overall: {
          ...data.overall,
          lastLevelUp: data.overall?.lastLevelUp?.toDate() || new Date(),
          nextLevelXP: data.overall?.nextLevelXP || ((data.overall?.level || 1) + 1) * 100
        },
        dsa: {
          ...data.dsa,
          lastSolvedDate: data.dsa?.lastSolvedDate?.toDate() || new Date()
        },
        quiz: {
          ...data.quiz,
          lastQuizDate: data.quiz?.lastQuizDate?.toDate() || new Date()
        },
        community: {
          ...data.community,
          lastActivity: data.community?.lastActivity?.toDate() || new Date()
        },
        roadmaps: {
          ...data.roadmaps,
          currentRoadmaps: data.roadmaps?.currentRoadmaps?.map((roadmap: any) => ({
            ...roadmap,
            lastActivity: roadmap.lastActivity?.toDate() || new Date()
          })) || []
        }
      } as UserProgress;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting progress snapshot:', error);
    return null;
  }
};