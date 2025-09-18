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
  limit
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
    level: number;
    experience: number;
    achievements: string[];
    badges: string[];
  };
}

export interface ProgressUpdate {
  section: 'roadmap' | 'dsa' | 'quiz' | 'email' | 'interview' | 'community';
  action: string;
  data: any;
  timestamp: Date;
}

// Initialize user progress - this will create the collection if it doesn't exist
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
          level: 1,
          experience: 0,
          achievements: [],
          badges: []
        }
      };
      
      // Use setDoc to create the document and collection
      await setDoc(userProgressRef, {
        ...initialProgress,
        lastUpdated: serverTimestamp(),
        'dsa.lastSolvedDate': serverTimestamp(),
        'quiz.lastQuizDate': serverTimestamp(),
        'email.lastGeneratedDate': serverTimestamp(),
        'interview.lastSessionDate': serverTimestamp(),
        'community.lastActivity': serverTimestamp()
      });
      
      console.log(`Progress document created successfully for user: ${userId}`);
    } else {
      console.log(`Progress document already exists for user: ${userId}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing user progress:', error);
    return false;
  }
};

// Enhanced getUserProgress with automatic initialization
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
      console.log(`No progress document found for user: ${userId}, attempting to create...`);
      // Attempt to initialize if document doesn't exist
      const initialized = await initializeUserProgress(userId);
      if (!initialized) {
        console.error(`Failed to initialize progress for user: ${userId}`);
        callback(null);
      }
      // The onSnapshot will trigger again after initialization
    }
  }, (error) => {
    console.error('Error listening to progress updates:', error);
    callback(null);
  });
};

// Utility function to ensure progress document exists before updating
const ensureProgressDocument = async (userId: string): Promise<boolean> => {
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(userProgressRef);
    
    if (!progressDoc.exists()) {
      return await initializeUserProgress(userId);
    }
    return true;
  } catch (error) {
    console.error('Error ensuring progress document:', error);
    return false;
  }
};

// Update roadmap progress with document existence check
export const updateRoadmapProgress = async (userId: string, roadmapId: string, progress: number, title: string) => {
  try {
    console.log(`Updating roadmap progress for user: ${userId}, roadmap: ${roadmapId}`);
    
    // Ensure progress document exists
    const documentExists = await ensureProgressDocument(userId);
    if (!documentExists) {
      throw new Error('Failed to ensure progress document exists');
    }

    const userProgressRef = doc(db, 'userProgress', userId);
    
    await updateDoc(userProgressRef, {
      'roadmaps.lastActivity': serverTimestamp(),
      'lastUpdated': serverTimestamp()
    });
    
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
        'roadmaps.inProgress': inProgress
      });
    }
    
    console.log(`Roadmap progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating roadmap progress:', error);
    return false;
  }
};

// Update DSA progress with document existence check
export const updateDSAProgress = async (userId: string, problemData: {
  difficulty: string;
  topic: string;
  timeSpent: number;
  completed: boolean;
}) => {
  try {
    console.log(`Updating DSA progress for user: ${userId}`);
    
    // Ensure progress document exists
    const documentExists = await ensureProgressDocument(userId);
    if (!documentExists) {
      throw new Error('Failed to ensure progress document exists');
    }

    const userProgressRef = doc(db, 'userProgress', userId);
    
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
    
    console.log(`DSA progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating DSA progress:', error);
    return false;
  }
};

// Update quiz progress with document existence check
export const updateQuizProgress = async (userId: string, quizData: {
  questions: number;
  correct: number;
  company: string;
  domain: string;
  timeSpent: number;
}) => {
  try {
    console.log(`Updating quiz progress for user: ${userId}`);
    
    // Ensure progress document exists
    const documentExists = await ensureProgressDocument(userId);
    if (!documentExists) {
      throw new Error('Failed to ensure progress document exists');
    }

    const userProgressRef = doc(db, 'userProgress', userId);
    
    // Calculate accuracy
    const accuracy = quizData.questions > 0 ? (quizData.correct / quizData.questions) * 100 : 0;
    
    await updateDoc(userProgressRef, {
      'quiz.totalQuizzes': increment(1),
      'quiz.totalQuestions': increment(quizData.questions),
      'quiz.correctAnswers': increment(quizData.correct),
      'quiz.accuracy': accuracy,
      'quiz.lastQuizDate': serverTimestamp(),
      'quiz.totalTimeSpent': increment(quizData.timeSpent),
      'quiz.favoriteCompanies': arrayUnion(quizData.company),
      'quiz.favoriteDomains': arrayUnion(quizData.domain),
      'lastUpdated': serverTimestamp(),
      'overall.totalTimeSpent': increment(quizData.timeSpent),
      'overall.totalActivities': increment(1),
      'overall.experience': increment(5 * quizData.correct) // XP for correct answers
    });
    
    console.log(`Quiz progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating quiz progress:', error);
    return false;
  }
};

// Update email generator progress with document existence check
export const updateEmailProgress = async (userId: string, emailData: {
  words: number;
  template: string;
  timeSpent: number;
}) => {
  try {
    console.log(`Updating email progress for user: ${userId}`);
    
    // Ensure progress document exists
    const documentExists = await ensureProgressDocument(userId);
    if (!documentExists) {
      throw new Error('Failed to ensure progress document exists');
    }

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
      'overall.experience': increment(3) // XP for generating email
    });
    
    console.log(`Email progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating email progress:', error);
    return false;
  }
};

// Update interview prep progress with document existence check
export const updateInterviewProgress = async (userId: string, interviewData: {
  sessionTime: number;
  topic: string;
  score?: number;
  completed: boolean;
}) => {
  try {
    console.log(`Updating interview progress for user: ${userId}`);
    
    // Ensure progress document exists
    const documentExists = await ensureProgressDocument(userId);
    if (!documentExists) {
      throw new Error('Failed to ensure progress document exists');
    }

    const userProgressRef = doc(db, 'userProgress', userId);
    
    const updates: any = {
      'interview.totalTimeSpent': increment(interviewData.sessionTime),
      'interview.lastSessionDate': serverTimestamp(),
      'interview.favoriteTopics': arrayUnion(interviewData.topic),
      'lastUpdated': serverTimestamp(),
      'overall.totalTimeSpent': increment(interviewData.sessionTime)
    };
    
    if (interviewData.completed) {
      updates['interview.totalSessions'] = increment(1);
      updates['overall.totalActivities'] = increment(1);
      updates['overall.experience'] = increment(8); // XP for completing session
      
      if (interviewData.score !== undefined) {
        updates['interview.mockInterviewsCompleted'] = increment(1);
        // Update average score logic would go here
      }
    }
    
    await updateDoc(userProgressRef, updates);
    
    console.log(`Interview progress updated successfully for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating interview progress:', error);
    return false;
  }
};

// Update community progress with document existence check
export const updateCommunityProgress = async (userId: string, action: 'post' | 'comment' | 'like' | 'share' | 'follow') => {
  try {
    console.log(`Updating community progress for user: ${userId}, action: ${action}`);
    
    // Ensure progress document exists
    const documentExists = await ensureProgressDocument(userId);
    if (!documentExists) {
      throw new Error('Failed to ensure progress document exists');
    }

    const userProgressRef = doc(db, 'userProgress', userId);
    
    const updates: any = {
      'community.lastActivity': serverTimestamp(),
      'lastUpdated': serverTimestamp(),
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
        updates['overall.experience'] = increment(1);
        break;
    }
    
    await updateDoc(userProgressRef, updates);
    
    console.log(`Community progress updated successfully for user: ${userId}, action: ${action}`);
    return true;
  } catch (error) {
    console.error('Error updating community progress:', error);
    return false;
  }
};

// Get leaderboard data
export const getLeaderboard = async (section: keyof UserProgress, limitCount: number = 10) => {
  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(progressRef, orderBy(`${section}.totalTimeSpent`, 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

// Manual trigger to create progress document (useful for testing)
export const createProgressDocument = async (userId: string): Promise<boolean> => {
  console.log(`Manually creating progress document for user: ${userId}`);
  return await initializeUserProgress(userId);
};