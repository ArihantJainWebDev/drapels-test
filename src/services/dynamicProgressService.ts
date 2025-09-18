import { 
  collection, 
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export interface UserProgress {
  userId: string;
  lastUpdated: Date;
  
  // Roadmap Progress (you might not have this collection yet)
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
  
  // DSA Progress (from dsaProgress collection)
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
  
  // Quiz Progress (from quizHistory collection)
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
  
  // Email Generator Progress (might need to add tracking to your email feature)
  email: {
    totalEmailsGenerated: number;
    totalWordsWritten: number;
    lastGeneratedDate: Date;
    favoriteTemplates: string[];
    totalTimeSpent: number;
  };
  
  // Interview Prep Progress (might need to add this collection)
  interview: {
    totalSessions: number;
    totalTimeSpent: number;
    lastSessionDate: Date;
    favoriteTopics: string[];
    mockInterviewsCompleted: number;
    averageScore: number;
  };
  
  // Community Progress (from posts, comments, follows collections)
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
    level: number;
    experience: number;
    achievements: string[];
    badges: string[];
  };
}

// Calculate DSA progress from dsaProgress collection
const calculateDSAProgress = async (userId: string) => {
  try {
    const dsaQuery = query(
      collection(db, 'dsaProgress'), 
      where('userId', '==', userId)
    );
    const dsaSnapshot = await getDocs(dsaQuery);
    
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalTimeSpent = 0;
    let lastSolvedDate = new Date(0);
    const favoriteTopics: string[] = [];
    
    dsaSnapshot.docs.forEach(doc => {
      const data = doc.data();
      
      if (data.completed) {
        switch (data.difficulty) {
          case 'Easy':
            easySolved++;
            break;
          case 'Medium':
            mediumSolved++;
            break;
          case 'Hard':
            hardSolved++;
            break;
        }
      }
      
      if (data.timeSpent) {
        totalTimeSpent += data.timeSpent;
      }
      
      if (data.topic && !favoriteTopics.includes(data.topic)) {
        favoriteTopics.push(data.topic);
      }
      
      if (data.submittedAt?.toDate() > lastSolvedDate) {
        lastSolvedDate = data.submittedAt.toDate();
      }
    });
    
    // Calculate streak (you'd need to implement streak logic based on submission dates)
    const streakDays = calculateStreak(dsaSnapshot.docs);
    
    return {
      totalProblems: dsaSnapshot.docs.length,
      completedProblems: easySolved + mediumSolved + hardSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      streakDays,
      lastSolvedDate,
      favoriteTopics,
      totalTimeSpent
    };
  } catch (error) {
    console.error('Error calculating DSA progress:', error);
    return {
      totalProblems: 0,
      completedProblems: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      streakDays: 0,
      lastSolvedDate: new Date(),
      favoriteTopics: [],
      totalTimeSpent: 0
    };
  }
};

// Calculate quiz progress from quizHistory collection
const calculateQuizProgress = async (userId: string) => {
  try {
    const quizQuery = query(
      collection(db, 'quizHistory'), 
      where('userId', '==', userId)
    );
    const quizSnapshot = await getDocs(quizQuery);
    
    let totalQuestions = 0;
    let correctAnswers = 0;
    let totalTimeSpent = 0;
    let lastQuizDate = new Date(0);
    const favoriteCompanies: string[] = [];
    const favoriteDomains: string[] = [];
    
    quizSnapshot.docs.forEach(doc => {
      const data = doc.data();
      
      if (data.questions) {
        totalQuestions += Array.isArray(data.questions) ? data.questions.length : data.questions;
      }
      
      if (data.score || data.correct) {
        correctAnswers += data.score || data.correct;
      }
      
      if (data.timeSpent) {
        totalTimeSpent += data.timeSpent;
      }
      
      if (data.company && !favoriteCompanies.includes(data.company)) {
        favoriteCompanies.push(data.company);
      }
      
      if (data.domain && !favoriteDomains.includes(data.domain)) {
        favoriteDomains.push(data.domain);
      }
      
      if (data.submittedAt?.toDate() > lastQuizDate) {
        lastQuizDate = data.submittedAt.toDate();
      }
    });
    
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    return {
      totalQuizzes: quizSnapshot.docs.length,
      totalQuestions,
      correctAnswers,
      accuracy,
      lastQuizDate,
      favoriteCompanies,
      favoriteDomains,
      totalTimeSpent
    };
  } catch (error) {
    console.error('Error calculating quiz progress:', error);
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      lastQuizDate: new Date(),
      favoriteCompanies: [],
      favoriteDomains: [],
      totalTimeSpent: 0
    };
  }
};

// Calculate community progress from posts, comments, follows collections
const calculateCommunityProgress = async (userId: string) => {
  try {
    // Get posts by user
    const postsQuery = query(
      collection(db, 'posts'), 
      where('authorId', '==', userId)
    );
    const postsSnapshot = await getDocs(postsQuery);
    
    // Get comments by user
    const commentsQuery = query(
      collection(db, 'comments'), 
      where('authorId', '==', userId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    
    // Get followers
    const followersQuery = query(
      collection(db, 'follows'), 
      where('followingId', '==', userId)
    );
    const followersSnapshot = await getDocs(followersQuery);
    
    // Get following
    const followingQuery = query(
      collection(db, 'follows'), 
      where('followerId', '==', userId)
    );
    const followingSnapshot = await getDocs(followingQuery);
    
    // Calculate likes from posts
    let totalLikes = 0;
    let totalShares = 0;
    let lastActivity = new Date(0);
    
    postsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalLikes += data.likes || data.likedBy?.length || 0;
      totalShares += data.shares || 0;
      
      if (data.createdAt?.toDate() > lastActivity) {
        lastActivity = data.createdAt.toDate();
      }
    });
    
    // Check comment dates for last activity
    commentsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.createdAt?.toDate() > lastActivity) {
        lastActivity = data.createdAt.toDate();
      }
    });
    
    return {
      totalPosts: postsSnapshot.docs.length,
      totalComments: commentsSnapshot.docs.length,
      totalLikes,
      totalShares,
      communitiesJoined: 0, // You'd need to track this separately
      followers: followersSnapshot.docs.length,
      following: followingSnapshot.docs.length,
      lastActivity
    };
  } catch (error) {
    console.error('Error calculating community progress:', error);
    return {
      totalPosts: 0,
      totalComments: 0,
      totalLikes: 0,
      totalShares: 0,
      communitiesJoined: 0,
      followers: 0,
      following: 0,
      lastActivity: new Date()
    };
  }
};

// Helper function to calculate streak
const calculateStreak = (docs: any[]) => {
  if (docs.length === 0) return 0;
  
  // Sort by date
  const sortedDocs = docs.sort((a, b) => {
    const dateA = a.data().submittedAt?.toDate() || new Date(0);
    const dateB = b.data().submittedAt?.toDate() || new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const doc of sortedDocs) {
    const submissionDate = doc.data().submittedAt?.toDate();
    if (!submissionDate) continue;
    
    submissionDate.setHours(0, 0, 0, 0);
    const diffTime = currentDate.getTime() - submissionDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= streak + 1) {
      if (diffDays === streak) {
        // Same day, continue
        continue;
      } else if (diffDays === streak + 1) {
        // Next day, increment streak
        streak++;
        currentDate = new Date(submissionDate);
      }
    } else {
      // Gap in streak, break
      break;
    }
  }
  
  return streak;
};

// Main function to get user progress
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    console.log('Calculating dynamic progress for user:', userId);
    
    // Calculate progress from each collection
    const [dsaProgress, quizProgress, communityProgress] = await Promise.all([
      calculateDSAProgress(userId),
      calculateQuizProgress(userId),
      calculateCommunityProgress(userId)
    ]);
    
    // Calculate overall stats
    const totalTimeSpent = dsaProgress.totalTimeSpent + quizProgress.totalTimeSpent;
    const totalActivities = dsaProgress.totalProblems + quizProgress.totalQuizzes + 
                          communityProgress.totalPosts + communityProgress.totalComments;
    
    // Simple level calculation based on experience
    const experience = (dsaProgress.completedProblems * 10) + 
                      (quizProgress.correctAnswers * 5) + 
                      (communityProgress.totalPosts * 5) + 
                      (communityProgress.totalComments * 2);
    
    const level = Math.floor(experience / 100) + 1;
    
    // Generate achievements based on progress
    const achievements: string[] = [];
    if (dsaProgress.completedProblems >= 1) achievements.push('First Problem Solved');
    if (dsaProgress.completedProblems >= 10) achievements.push('Problem Solver');
    if (dsaProgress.completedProblems >= 50) achievements.push('Coding Master');
    if (quizProgress.totalQuizzes >= 1) achievements.push('Quiz Taker');
    if (quizProgress.accuracy >= 80) achievements.push('Quiz Master');
    if (communityProgress.totalPosts >= 1) achievements.push('Community Member');
    if (communityProgress.totalPosts >= 10) achievements.push('Active Contributor');
    
    const progress: UserProgress = {
      userId,
      lastUpdated: new Date(),
      roadmaps: {
        totalCreated: 0,
        totalCompleted: 0,
        inProgress: 0,
        totalHoursSpent: 0,
        currentRoadmaps: []
      },
      dsa: dsaProgress,
      quiz: quizProgress,
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
      community: communityProgress,
      overall: {
        totalTimeSpent,
        totalActivities,
        level,
        experience,
        achievements,
        badges: []
      }
    };
    
    console.log('Calculated progress:', progress);
    return progress;
    
  } catch (error) {
    console.error('Error calculating user progress:', error);
    return null;
  }
};

// Real-time progress listener (listens to multiple collections)
export const getUserProgressRealtime = (userId: string, callback: (progress: UserProgress | null) => void) => {
  console.log('Setting up real-time progress listener for user:', userId);
  
  // Set up listeners for each collection
  const unsubscribes: (() => void)[] = [];
  
  // DSA Progress listener
  const dsaQuery = query(collection(db, 'dsaProgress'), where('userId', '==', userId));
  const dsaUnsubscribe = onSnapshot(dsaQuery, () => {
    // Recalculate progress when DSA data changes
    getUserProgress(userId).then(callback);
  });
  unsubscribes.push(dsaUnsubscribe);
  
  // Quiz History listener
  const quizQuery = query(collection(db, 'quizHistory'), where('userId', '==', userId));
  const quizUnsubscribe = onSnapshot(quizQuery, () => {
    // Recalculate progress when quiz data changes
    getUserProgress(userId).then(callback);
  });
  unsubscribes.push(quizUnsubscribe);
  
  // Posts listener
  const postsQuery = query(collection(db, 'posts'), where('authorId', '==', userId));
  const postsUnsubscribe = onSnapshot(postsQuery, () => {
    // Recalculate progress when posts change
    getUserProgress(userId).then(callback);
  });
  unsubscribes.push(postsUnsubscribe);
  
  // Comments listener
  const commentsQuery = query(collection(db, 'comments'), where('authorId', '==', userId));
  const commentsUnsubscribe = onSnapshot(commentsQuery, () => {
    // Recalculate progress when comments change
    getUserProgress(userId).then(callback);
  });
  unsubscribes.push(commentsUnsubscribe);
  
  // Initial load
  getUserProgress(userId).then(callback);
  
  // Return cleanup function
  return () => {
    unsubscribes.forEach(unsubscribe => unsubscribe());
  };
};