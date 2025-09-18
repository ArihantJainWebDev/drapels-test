import { db } from '@/firebase';
import { getAuth } from 'firebase/auth'
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc,
  increment,
  arrayUnion,
  serverTimestamp,
  getDoc
} from "firebase/firestore";

const QUIZ_HISTORY_COLLECTION = 'quizHistory';
const auth = getAuth();

export const saveQuizToFirestore = async (userId, quizData) => {
  try {
    // Save to quizHistory collection for backward compatibility
    const docRef = await addDoc(collection(db, QUIZ_HISTORY_COLLECTION), {
      userId,
      ...quizData,
      createdAt: new Date().toISOString()
    });
    
    // Also update the unified userProgress collection
    try {
      const userProgressRef = doc(db, 'userProgress', userId);
      
      // Get current progress to calculate overall accuracy
      const currentProgressDoc = await getDoc(userProgressRef);
      const currentData = currentProgressDoc.exists() ? currentProgressDoc.data() : {};
      
      // Calculate new totals
      const currentTotalQuestions = currentData.quiz?.totalQuestions || 0;
      const currentCorrectAnswers = currentData.quiz?.correctAnswers || 0;
      const newTotalQuestions = currentTotalQuestions + (quizData.questions || quizData.quizParams?.questions || 0);
      const newCorrectAnswers = currentCorrectAnswers + (quizData.score || quizData.correct || 0);
      
      // Calculate overall accuracy
      const overallAccuracy = newTotalQuestions > 0 ? (newCorrectAnswers / newTotalQuestions) * 100 : 0;
      
      await updateDoc(userProgressRef, {
        'quiz.totalQuizzes': increment(1),
        'quiz.totalQuestions': increment(quizData.questions || quizData.quizParams?.questions || 0),
        'quiz.correctAnswers': increment(quizData.score || quizData.correct || 0),
        'quiz.accuracy': overallAccuracy, // Use overall accuracy, not just this quiz's accuracy
        'quiz.lastQuizDate': serverTimestamp(),
        'quiz.totalTimeSpent': increment(quizData.timeSpent || 5),
        'quiz.favoriteCompanies': arrayUnion(quizData.quizParams?.company || 'Unknown'),
        'quiz.favoriteDomains': arrayUnion(quizData.quizParams?.domain || 'Unknown'),
        'lastUpdated': serverTimestamp(),
        'overall.totalTimeSpent': increment(quizData.timeSpent || 5),
        'overall.totalActivities': increment(1),
        'overall.experience': increment(5 * (quizData.score || quizData.correct || 0)) // XP for correct answers
      }, { merge: true });
    } catch (progressError) {
      console.error('Error updating unified progress:', progressError);
      // Don't throw error here to maintain backward compatibility
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz to Firestore:', error);
    throw error;
  }
};

export const loadQuizHistory = async (userId, limitCount = 20) => {
  try {
    const q = query(
      collection(db, QUIZ_HISTORY_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const history = [];
    
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return history;
  } catch (error) {
    console.error('Error loading quiz history:', error);
    throw error;
  }
};

export const deleteQuizFromFirestore = async (quizId) => {
  try {
    await deleteDoc(doc(db, QUIZ_HISTORY_COLLECTION, quizId));
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

export const setupAuthListener = (callback) => {
  return auth.onAuthStateChanged(callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};