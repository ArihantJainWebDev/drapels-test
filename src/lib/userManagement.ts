import { db, auth } from '@/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { isCurrentUserAdmin, ADMIN_PERMISSIONS } from './adminConfig';
import { Blog } from '@/types/blog';

const USERS_COLLECTION = 'users';
const BLOGS_COLLECTION = 'blogs';
const USER_FEEDBACK_COLLECTION = 'userFeedback';
const VERIFIED_USERS_COLLECTION = 'verifiedUsers';

// User interface for admin operations
export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  isVerified?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  blogCount?: number;
}

// Require admin authentication
const requireAdminAuth = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required');
  }
  if (!isCurrentUserAdmin(user)) {
    throw new Error('Admin access required');
  }
  return user;
};

// Get all users (admin only)
export const getAllUsersAsync = async (): Promise<AdminUser[]> => {
  requireAdminAuth();
  
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await getDocs(usersRef);
    
    const users: AdminUser[] = [];
    for (const docSnapshot of querySnapshot.docs) {
      const userData = docSnapshot.data();
      
      // Get blog count for this user
      const blogsRef = collection(db, BLOGS_COLLECTION);
      const blogQuery = query(blogsRef, where('authorId', '==', docSnapshot.id));
      const blogSnapshot = await getDocs(blogQuery);
      
      // Check if user is verified
      const verifiedRef = doc(db, VERIFIED_USERS_COLLECTION, docSnapshot.id);
      const verifiedDoc = await getDoc(verifiedRef);
      
      users.push({
        uid: docSnapshot.id,
        email: userData.email || '',
        displayName: userData.displayName || 'Anonymous',
        isVerified: verifiedDoc.exists(),
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLoginAt: userData.lastLoginAt?.toDate?.()?.toISOString(),
        blogCount: blogSnapshot.size
      });
    }
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Delete user profile and all associated data (admin only)
export const deleteUserProfileAsync = async (userId: string): Promise<void> => {
  requireAdminAuth();
  
  try {
    // Delete user's blogs
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const blogQuery = query(blogsRef, where('authorId', '==', userId));
    const blogSnapshot = await getDocs(blogQuery);
    
    const deletePromises = [];
    
    // Delete all user's blogs
    for (const blogDoc of blogSnapshot.docs) {
      deletePromises.push(deleteDoc(blogDoc.ref));
    }
    
    // Delete user feedback
    const feedbackRef = doc(db, USER_FEEDBACK_COLLECTION, userId);
    deletePromises.push(deleteDoc(feedbackRef));
    
    // Delete verification status
    const verifiedRef = doc(db, VERIFIED_USERS_COLLECTION, userId);
    deletePromises.push(deleteDoc(verifiedRef));
    
    // Delete user profile
    const userRef = doc(db, USERS_COLLECTION, userId);
    deletePromises.push(deleteDoc(userRef));
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
};

// Delete all posts by a user (admin only)
export const deleteUserPostsAsync = async (userId: string): Promise<void> => {
  requireAdminAuth();
  
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const blogQuery = query(blogsRef, where('authorId', '==', userId));
    const blogSnapshot = await getDocs(blogQuery);
    
    const deletePromises = blogSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting user posts:', error);
    throw error;
  }
};

// Promote user to verified status (admin only)
export const promoteToVerifiedAsync = async (userId: string): Promise<void> => {
  requireAdminAuth();
  
  try {
    const verifiedRef = doc(db, VERIFIED_USERS_COLLECTION, userId);
    await setDoc(verifiedRef, {
      verifiedAt: serverTimestamp(),
      verifiedBy: auth.currentUser?.email || 'admin'
    });
  } catch (error) {
    console.error('Error promoting user to verified:', error);
    throw error;
  }
};

// Remove verified status from user (admin only)
export const removeVerifiedStatusAsync = async (userId: string): Promise<void> => {
  requireAdminAuth();
  
  try {
    const verifiedRef = doc(db, VERIFIED_USERS_COLLECTION, userId);
    await deleteDoc(verifiedRef);
  } catch (error) {
    console.error('Error removing verified status:', error);
    throw error;
  }
};

// Check if a user is verified
export const isUserVerifiedAsync = async (userId: string): Promise<boolean> => {
  try {
    const verifiedRef = doc(db, VERIFIED_USERS_COLLECTION, userId);
    const verifiedDoc = await getDoc(verifiedRef);
    return verifiedDoc.exists();
  } catch (error) {
    console.error('Error checking verification status:', error);
    return false;
  }
};

// Check if a user is verified by email (for display purposes)
export const isUserVerifiedByEmailAsync = async (email: string): Promise<boolean> => {
  try {
    // First check if it's an admin account (always verified)
    if (email === 'taizun8@gmail.com' || email === 'drapelsai@gmail.com' || email === 'arihantjainwebdev@gmail.com') {
      return true;
    }
    
    // Find user by email
    const usersRef = collection(db, USERS_COLLECTION);
    const userQuery = query(usersRef, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) return false;
    
    const userId = userSnapshot.docs[0].id;
    return await isUserVerifiedAsync(userId);
  } catch (error) {
    console.error('Error checking verification by email:', error);
    return false;
  }
};

// Get user blogs for admin review
export const getUserBlogsAsync = async (userId: string): Promise<Blog[]> => {
  requireAdminAuth();
  
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const blogQuery = query(blogsRef, where('authorId', '==', userId));
    const blogSnapshot = await getDocs(blogQuery);
    
    return blogSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Blog[];
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    throw error;
  }
};

// Admin can delete any blog
export const adminDeleteBlogAsync = async (blogId: string): Promise<void> => {
  requireAdminAuth();
  
  try {
    const blogRef = doc(db, BLOGS_COLLECTION, blogId);
    await deleteDoc(blogRef);
  } catch (error) {
    console.error('Error deleting blog as admin:', error);
    throw error;
  }
};
