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
  arrayRemove,
  orderBy,
  limit,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase';

export interface UserProgress {
  userId: string;
  lastUpdated: Date;
  
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
  
  // Email Generator Progress
  email: {
    totalEmailsGenerated: number;
    totalWordsWritten: number;
    lastGeneratedDate: Date;
    favoriteTemplates: string[];
    totalTimeSpent: number;
  };
  
  // Interview Prep Progress
  interview: {
    totalSessions: number;
    totalTimeSpent: number;
    lastSessionDate: Date;
    favoriteTopics: string[];
    mockInterviewsCompleted: number;
    averageScore: number;
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
  
  // Overall Stats
  overall: {
    totalTimeSpent: number;
    totalActivities: number;
    experience: number;
    level: number;
    achievements: string[];
    lastLevelUp: Date;
  };
}

// Initialize user progress document
export const initializeUserProgress = async (userId: string): Promise<boolean> => {
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(userProgressRef);
    
    if (!progressDoc.exists()) {
      console.log(`Creating new progress document for user: ${userId}`);
      
      const initialProgress: UserProgress = {
        userId,
        lastUpdated: new Date(),
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
          lastSolvedDate: new Date(),
          favoriteTopics: [],
          totalTimeSpent: 0
        },
        quiz: {
          totalQuizzes: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          lastQuizDate: new Date(),
          favoriteCompanies: [],
          favoriteDomains: [],
          totalTimeSpent: 0
        },
        email: {
          totalEmailsGenerated: 0,
          totalWordsWritten: 0,
          lastGeneratedDate: new Date(),
          favoriteTemplates: [],
          totalTimeSpent: 0
        },
        interview: {
          totalSessions: 0,
          totalTimeSpent: 0,
          lastSessionDate: new Date(),
          favoriteTopics: [],
          mockInterviewsCompleted: 0,
          averageScore: 0
        },
        community: {
          totalPosts: 0,
          totalComments: 0,
          totalLikes: 0,
          totalShares: 0,
          communitiesJoined: 0,
          followers: 0,
          following: 0,
          lastActivity: new Date()
        },
        overall: {
          totalTimeSpent: 0,
          totalActivities: 0,
          experience: 0,
          level: 1,
          achievements: [],
          lastLevelUp: new Date()
        }
      };
      
      await setDoc(userProgressRef, initialProgress);
      console.log(`Progress document created for user: ${userId}`);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing user progress:', error);
    return false;
  }
};

// Get user progress with real-time updates
export const getUserProgress = (userId: string, callback: (progress: UserProgress | null) => void) => {
  console.log(`Setting up progress listener for user: ${userId}`);
  
  const userProgressRef = doc(db, 'userProgress', userId);
  
  return onSnapshot(userProgressRef, async (doc) => {
    if (doc.exists()) {
      console.log(`Progress data found for user: ${userId}`);
      const data = doc.data();
      
      // Convert Firestore timestamps to Date objects
      const progressData: UserProgress = {
        ...data,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        dsa: {
          ...data.dsa,
          lastSolvedDate: data.dsa?.lastSolvedDate?.toDate() || new Date()
        },
        quiz: {
          ...data.quiz,
          lastQuizDate: data.quiz?.lastQuizDate?.toDate() || new Date()
        },
        email: {
          ...data.email,
          lastGeneratedDate: data.email?.lastGeneratedDate?.toDate() || new Date()
        },
        interview: {
          ...data.interview,
          lastSessionDate: data.interview?.lastSessionDate?.toDate() || new Date()
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
      
      callback(progressData);
    } else {
      console.log(`No progress document found for user: ${userId}, initializing...`);
      const initialized = await initializeUserProgress(userId);
      if (initialized) {
        // Re-fetch the document after initialization
        const newDoc = await getDoc(userProgressRef);
        if (newDoc.exists()) {
          const data = newDoc.data();
          const progressData: UserProgress = {
            ...data,
            lastUpdated: data.lastUpdated?.toDate() || new Date(),
            dsa: {
              ...data.dsa,
              lastSolvedDate: data.dsa?.lastSolvedDate?.toDate() || new Date()
            },
            quiz: {
              ...data.quiz,
              lastQuizDate: data.quiz?.lastQuizDate?.toDate() || new Date()
            },
            email: {
              ...data.email,
              lastGeneratedDate: data.email?.lastGeneratedDate?.toDate() || new Date()
            },
            interview: {
              ...data.interview,
              lastSessionDate: data.interview?.lastSessionDate?.toDate() || new Date()
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
          callback(progressData);
        }
      } else {
        callback(null);
      }
    }
  });
};

// Update roadmap progress
export const updateRoadmapProgress = async (userId: string, roadmapId: string, progress: number, title: string) => {
  try {
    console.log(`Updating roadmap progress for user: ${userId}, roadmap: ${roadmapId}`);
    
    await initializeUserProgress(userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    // Update current roadmaps
    const progressDoc = await getDoc(userProgressRef);
    if (progressDoc.exists()) {
      const currentData = progressDoc.data();
      const currentRoadmaps = currentData.roadmaps?.currentRoadmaps || [];
      
      const existingIndex = currentRoadmaps.findIndex((r: any) => r.id === roadmapId);
      if (existingIndex >= 0) {
        currentRoadmaps[existingIndex].progress = progress;
        currentRoadmaps[existingIndex].lastActivity = new Date();
      } else {
        currentRoadmaps.push({
          id: roadmapId,
          title,
          progress,
          lastActivity: new Date()
        });
        
        // Increment totalCreated when adding new roadmap
        await updateDoc(userProgressRef, {
          'roadmaps.totalCreated': increment(1)
        });
      }
      
      // Update completion status
      const completed = currentRoadmaps.filter((r: any) => r.progress >= 100).length;
      const inProgress = currentRoadmaps.filter((r: any) => r.progress < 100).length;
      
      await updateDoc(userProgressRef, {
        'roadmaps.currentRoadmaps': currentRoadmaps,
        'roadmaps.totalCompleted': completed,
        'roadmaps.inProgress': inProgress,
        'roadmaps.lastActivity': serverTimestamp(),
        'lastUpdated': serverTimestamp(),
        'overall.totalActivities': increment(1),
        'overall.experience': increment(5) // XP for roadmap activity
      });
    }
    
    // Update level and achievements
    await updateLevel(userId);
    await updateAchievements(userId);
    
    console.log(`Roadmap progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating roadmap progress:', error);
    return false;
  }
};

// Update DSA progress
export const updateDSAProgress = async (userId: string, problemData: {
  difficulty: string;
  topic: string;
  timeSpent: number;
  completed: boolean;
  totalProblems?: number;
}) => {
  try {
    console.log(`Updating DSA progress for user: ${userId}`);
    
    await initializeUserProgress(userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    // Set total problems count if provided
    if (problemData.totalProblems !== undefined) {
      await updateDoc(userProgressRef, {
        'dsa.totalProblems': problemData.totalProblems
      });
    }
    
    const updates: any = {
      'dsa.lastSolvedDate': serverTimestamp(),
      'dsa.totalTimeSpent': increment(problemData.timeSpent),
      'lastUpdated': serverTimestamp(),
      'overall.totalTimeSpent': increment(problemData.timeSpent),
      'overall.totalActivities': increment(1)
    };
    
    if (problemData.completed) {
      updates['dsa.completedProblems'] = increment(1);
      updates['overall.experience'] = increment(10); // Add XP for completing problem
      
      if (problemData.difficulty === 'Easy') {
        updates['dsa.easySolved'] = increment(1);
      } else if (problemData.difficulty === 'Medium') {
        updates['dsa.mediumSolved'] = increment(1);
        updates['overall.experience'] = increment(5); // Bonus XP for medium
      } else if (problemData.difficulty === 'Hard') {
        updates['dsa.hardSolved'] = increment(1);
        updates['overall.experience'] = increment(10); // Bonus XP for hard
      }
      
      // Update favorite topics
      updates['dsa.favoriteTopics'] = arrayUnion(problemData.topic);
    }
    
    await updateDoc(userProgressRef, updates);
    
    // Update level and achievements
    await updateLevel(userId);
    await updateAchievements(userId);
    
    console.log(`DSA progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating DSA progress:', error);
    return false;
  }
};

// Update quiz progress
export const updateQuizProgress = async (userId: string, quizData: {
  questions: number;
  correct: number;
  company: string;
  domain: string;
  timeSpent: number;
}) => {
  try {
    console.log(`Updating quiz progress for user: ${userId}`);
    
    await initializeUserProgress(userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    // Get current progress to calculate overall accuracy
    const currentProgressDoc = await getDoc(userProgressRef);
    const currentData = currentProgressDoc.exists() ? currentProgressDoc.data() : {};
    
    // Calculate new totals
    const currentTotalQuestions = currentData.quiz?.totalQuestions || 0;
    const currentCorrectAnswers = currentData.quiz?.correctAnswers || 0;
    const newTotalQuestions = currentTotalQuestions + quizData.questions;
    const newCorrectAnswers = currentCorrectAnswers + quizData.correct;
    
    // Calculate overall accuracy
    const overallAccuracy = newTotalQuestions > 0 ? (newCorrectAnswers / newTotalQuestions) * 100 : 0;
    
    await updateDoc(userProgressRef, {
      'quiz.totalQuizzes': increment(1),
      'quiz.totalQuestions': increment(quizData.questions),
      'quiz.correctAnswers': increment(quizData.correct),
      'quiz.accuracy': overallAccuracy, // Use overall accuracy, not just this quiz's accuracy
      'quiz.lastQuizDate': serverTimestamp(),
      'quiz.totalTimeSpent': increment(quizData.timeSpent),
      'quiz.favoriteCompanies': arrayUnion(quizData.company),
      'quiz.favoriteDomains': arrayUnion(quizData.domain),
      'lastUpdated': serverTimestamp(),
      'overall.totalTimeSpent': increment(quizData.timeSpent),
      'overall.totalActivities': increment(1),
      'overall.experience': increment(5 * quizData.correct) // XP for correct answers
    });
    
    // Update level and achievements
    await updateLevel(userId);
    await updateAchievements(userId);
    
    console.log(`Quiz progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating quiz progress:', error);
    return false;
  }
};

// Update email generator progress
export const updateEmailProgress = async (userId: string, emailData: {
  words: number;
  template: string;
  timeSpent: number;
}) => {
  try {
    console.log(`Updating email progress for user: ${userId}`);
    
    await initializeUserProgress(userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    await updateDoc(userProgressRef, {
      'email.totalEmailsGenerated': increment(1),
      'email.totalWordsWritten': increment(emailData.words),
      'email.lastGeneratedDate': serverTimestamp(),
      'email.favoriteTemplates': arrayUnion(emailData.template),
      'email.totalTimeSpent': increment(emailData.timeSpent),
      'lastUpdated': serverTimestamp(),
      'overall.totalTimeSpent': increment(emailData.timeSpent),
      'overall.totalActivities': increment(1),
      'overall.experience': increment(3) // XP for email generation
    });
    
    // Update level and achievements
    await updateLevel(userId);
    await updateAchievements(userId);
    
    console.log(`Email progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating email progress:', error);
    return false;
  }
};

// Update interview prep progress
export const updateInterviewProgress = async (userId: string, interviewData: {
  sessionTime: number;
  topic: string;
  score?: number;
  completed: boolean;
}) => {
  try {
    console.log(`Updating interview progress for user: ${userId}`);
    
    await initializeUserProgress(userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    const updates: any = {
      'interview.lastSessionDate': serverTimestamp(),
      'interview.favoriteTopics': arrayUnion(interviewData.topic),
      'lastUpdated': serverTimestamp()
    };
    
    // Only increment totalSessions and add XP when session is completed
    if (interviewData.completed) {
      updates['interview.totalSessions'] = increment(1);
      updates['overall.totalActivities'] = increment(1);
      updates['overall.experience'] = increment(8); // XP for completing session
      
      if (interviewData.score !== undefined) {
        updates['interview.mockInterviewsCompleted'] = increment(1);
        // Update average score logic would go here
      }
    }
    
    // Always track time spent (even for incomplete sessions)
    if (interviewData.sessionTime > 0) {
      updates['interview.totalTimeSpent'] = increment(interviewData.sessionTime);
      updates['overall.totalTimeSpent'] = increment(interviewData.sessionTime);
    }
    
    await updateDoc(userProgressRef, updates);
    
    // Update level and achievements
    await updateLevel(userId);
    await updateAchievements(userId);
    
    console.log(`Interview progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating interview progress:', error);
    return false;
  }
};

// Update community progress
export const updateCommunityProgress = async (userId: string, action: 'post' | 'comment' | 'like' | 'share' | 'follow') => {
  try {
    console.log(`Updating community progress for user: ${userId}, action: ${action}`);
    
    await initializeUserProgress(userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    const updates: any = {
      'community.lastActivity': serverTimestamp(),
      'lastUpdated': serverTimestamp(),
      'overall.totalActivities': increment(1)
    };
    
    switch (action) {
      case 'post':
        updates['community.totalPosts'] = increment(1);
        updates['overall.experience'] = increment(5); // XP for posting
        break;
      case 'comment':
        updates['community.totalComments'] = increment(1);
        updates['overall.experience'] = increment(2); // XP for commenting
        break;
      case 'like':
        updates['community.totalLikes'] = increment(1);
        updates['overall.experience'] = increment(1); // XP for liking
        break;
      case 'share':
        updates['community.totalShares'] = increment(1);
        updates['overall.experience'] = increment(3); // XP for sharing
        break;
      case 'follow':
        updates['community.following'] = increment(1);
        updates['overall.experience'] = increment(2); // XP for following
        break;
    }
    
    await updateDoc(userProgressRef, updates);
    
    // Update level and achievements
    await updateLevel(userId);
    await updateAchievements(userId);
    
    console.log(`Community progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating community progress:', error);
    return false;
  }
};

// Sync progress from existing collections (one-time migration)
export const syncProgressFromCollections = async (userId: string) => {
  try {
    console.log(`Syncing progress from collections for user: ${userId}`);
    
    await initializeUserProgress(userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    // Sync DSA progress
    const dsaQuery = query(collection(db, 'dsaProgress'), where('userId', '==', userId));
    const dsaSnapshot = await getDocs(dsaQuery);
    
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalTimeSpent = 0;
    
    dsaSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.completed) {
        switch (data.difficulty) {
          case 'Easy': easySolved++; break;
          case 'Medium': mediumSolved++; break;
          case 'Hard': hardSolved++; break;
        }
      }
      if (data.timeSpent) totalTimeSpent += data.timeSpent;
    });
    
    // Sync quiz progress
    const quizQuery = query(collection(db, 'quizHistory'), where('userId', '==', userId));
    const quizSnapshot = await getDocs(quizQuery);
    
    let totalQuizzes = 0;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let quizTimeSpent = 0;
    
    quizSnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalQuizzes++;
      if (data.questions) totalQuestions += Array.isArray(data.questions) ? data.questions.length : data.questions;
      if (data.score || data.correct) correctAnswers += data.score || data.correct;
      if (data.timeSpent) quizTimeSpent += data.timeSpent;
    });
    
    // Sync community progress
    const postsQuery = query(collection(db, 'posts'), where('authorId', '==', userId));
    const postsSnapshot = await getDocs(postsQuery);
    
    const commentsQuery = query(collection(db, 'comments'), where('authorId', '==', userId));
    const commentsSnapshot = await getDocs(commentsQuery);
    
    const followersQuery = query(collection(db, 'follows'), where('followingId', '==', userId));
    const followersSnapshot = await getDocs(followersQuery);
    
    const followingQuery = query(collection(db, 'follows'), where('followerId', '==', userId));
    const followingSnapshot = await getDocs(followingQuery);
    
    // Calculate overall stats
    const totalActivities = easySolved + mediumSolved + hardSolved + totalQuizzes + postsSnapshot.docs.length + commentsSnapshot.docs.length;
    const experience = (easySolved + mediumSolved + hardSolved) * 10 + correctAnswers * 5 + postsSnapshot.docs.length * 5 + commentsSnapshot.docs.length * 2;
    const level = Math.floor(experience / 100) + 1;
    
    // Update progress document
    await updateDoc(userProgressRef, {
      'dsa.completedProblems': easySolved + mediumSolved + hardSolved,
      'dsa.easySolved': easySolved,
      'dsa.mediumSolved': mediumSolved,
      'dsa.hardSolved': hardSolved,
      'dsa.totalTimeSpent': totalTimeSpent,
      'quiz.totalQuizzes': totalQuizzes,
      'quiz.totalQuestions': totalQuestions,
      'quiz.correctAnswers': correctAnswers,
      'quiz.totalTimeSpent': quizTimeSpent,
      'community.totalPosts': postsSnapshot.docs.length,
      'community.totalComments': commentsSnapshot.docs.length,
      'community.followers': followersSnapshot.docs.length,
      'community.following': followingSnapshot.docs.length,
      'overall.totalActivities': totalActivities,
      'overall.experience': experience,
      'overall.level': level,
      'overall.totalTimeSpent': totalTimeSpent + quizTimeSpent,
      'lastUpdated': serverTimestamp()
    });
    
    console.log(`Progress synced successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error syncing progress from collections:', error);
    return false;
  }
};

// Calculate and update level based on experience
export const updateLevel = async (userId: string) => {
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(userProgressRef);
    
    if (!progressDoc.exists()) return;
    
    const data = progressDoc.data();
    const currentLevel = data.overall?.level || 1;
    const currentXP = data.overall?.experience || 0;
    
    // Calculate new level (every 100 XP = 1 level)
    const newLevel = Math.floor(currentXP / 100) + 1;
    
    if (newLevel > currentLevel) {
      // Level up!
      await updateDoc(userProgressRef, {
        'overall.level': newLevel,
        'overall.lastLevelUp': serverTimestamp()
      });
      
      console.log(`User ${userId} leveled up to level ${newLevel}!`);
    }
    
    return newLevel;
  } catch (error) {
    console.error('Error updating level:', error);
    return null;
  }
};

// Calculate achievements based on user progress
export const calculateAchievements = (progress: UserProgress): string[] => {
  const achievements: string[] = [];
  
  // DSA Achievements
  if (progress.dsa.completedProblems >= 10) achievements.push('DSA Beginner');
  if (progress.dsa.completedProblems >= 50) achievements.push('DSA Enthusiast');
  if (progress.dsa.completedProblems >= 100) achievements.push('DSA Master');
  if (progress.dsa.easySolved >= 20) achievements.push('Easy Problem Solver');
  if (progress.dsa.mediumSolved >= 20) achievements.push('Medium Problem Solver');
  if (progress.dsa.hardSolved >= 10) achievements.push('Hard Problem Solver');
  if (progress.dsa.streakDays >= 7) achievements.push('Week Warrior');
  if (progress.dsa.streakDays >= 30) achievements.push('Monthly Master');
  
  // Quiz Achievements
  if (progress.quiz.totalQuizzes >= 5) achievements.push('Quiz Taker');
  if (progress.quiz.totalQuizzes >= 20) achievements.push('Quiz Enthusiast');
  if (progress.quiz.totalQuizzes >= 50) achievements.push('Quiz Master');
  if (progress.quiz.accuracy >= 80) achievements.push('High Accuracy');
  if (progress.quiz.accuracy >= 95) achievements.push('Perfect Score');
  
  // Email Achievements
  if (progress.email.totalEmailsGenerated >= 5) achievements.push('Email Composer');
  if (progress.email.totalEmailsGenerated >= 20) achievements.push('Email Expert');
  if (progress.email.totalWordsWritten >= 1000) achievements.push('Word Smith');
  
  // Interview Achievements
  if (progress.interview.totalSessions >= 3) achievements.push('Interview Prep');
  if (progress.interview.totalSessions >= 10) achievements.push('Interview Ready');
  if (progress.interview.mockInterviewsCompleted >= 5) achievements.push('Mock Master');
  
  // Community Achievements
  if (progress.community.totalPosts >= 5) achievements.push('Community Contributor');
  if (progress.community.totalPosts >= 20) achievements.push('Community Leader');
  if (progress.community.totalComments >= 10) achievements.push('Active Commenter');
  if (progress.community.totalLikes >= 50) achievements.push('Like Collector');
  if (progress.community.followers >= 10) achievements.push('Influencer');
  
  // Roadmap Achievements
  if (progress.roadmaps.totalCreated >= 3) achievements.push('Roadmap Creator');
  if (progress.roadmaps.totalCompleted >= 1) achievements.push('Roadmap Completer');
  if (progress.roadmaps.totalCompleted >= 5) achievements.push('Roadmap Master');
  
  // Overall Achievements
  if (progress.overall.totalActivities >= 50) achievements.push('Active Learner');
  if (progress.overall.totalActivities >= 100) achievements.push('Dedicated Learner');
  if (progress.overall.totalActivities >= 200) achievements.push('Learning Champion');
  if (progress.overall.level >= 5) achievements.push('Level 5 Achiever');
  if (progress.overall.level >= 10) achievements.push('Level 10 Master');
  if (progress.overall.level >= 20) achievements.push('Level 20 Legend');
  if (progress.overall.totalTimeSpent >= 1000) achievements.push('Time Invested');
  if (progress.overall.totalTimeSpent >= 5000) achievements.push('Time Master');
  
  return achievements;
};

// Update achievements for a user
export const updateAchievements = async (userId: string) => {
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(userProgressRef);
    
    if (!progressDoc.exists()) return;
    
    const progress = progressDoc.data() as UserProgress;
    const newAchievements = calculateAchievements(progress);
    const currentAchievements = progress.overall?.achievements || [];
    
    // Find new achievements
    const newlyUnlocked = newAchievements.filter(achievement => 
      !currentAchievements.includes(achievement)
    );
    
    if (newlyUnlocked.length > 0) {
      await updateDoc(userProgressRef, {
        'overall.achievements': newAchievements
      });
      
      console.log(`User ${userId} unlocked achievements:`, newlyUnlocked);
      return newlyUnlocked;
    }
    
    return [];
  } catch (error) {
    console.error('Error updating achievements:', error);
    return [];
  }
};
