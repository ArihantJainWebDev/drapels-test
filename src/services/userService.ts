import { connectDB } from '@/lib/mongoose';
import User from '../../models/User';

export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  image?: string;
  displayName?: string;
  credits: number;
  plan: 'free' | 'premium' | 'enterprise';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      browser: boolean;
      marketing: boolean;
    };
  };
  profile: {
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    company?: string;
    jobTitle?: string;
    skills: string[];
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  progress: {
    completedCourses: string[];
    currentCourse?: string;
    totalXP: number;
    streak: number;
    lastActiveDate?: Date;
  };
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    await connectDB();
    const user = await User.findById(userId).lean();
    return user ? { ...user, id: user._id.toString() } : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    await connectDB();
    const user = await User.findOne({ email }).lean();
    return user ? { ...user, id: user._id.toString() } : null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>
): Promise<boolean> => {
  try {
    await connectDB();
    const result = await User.findByIdAndUpdate(
      userId,
      { ...profileData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    return !!result;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

export const createUserProfile = async (userData: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    await connectDB();
    const user = new User(userData);
    const savedUser = await user.save();
    return { ...savedUser.toObject(), id: savedUser._id.toString() };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
};

export const updateUserCredits = async (userId: string, credits: number): Promise<boolean> => {
  try {
    await connectDB();
    const result = await User.findByIdAndUpdate(
      userId,
      { credits, updatedAt: new Date() },
      { new: true }
    );
    return !!result;
  } catch (error) {
    console.error('Error updating user credits:', error);
    return false;
  }
};

export const updateUserProgress = async (userId: string, progressData: Partial<UserProfile['progress']>): Promise<boolean> => {
  try {
    await connectDB();
    const result = await User.findByIdAndUpdate(
      userId,
      { 
        progress: progressData,
        updatedAt: new Date() 
      },
      { new: true }
    );
    return !!result;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
};

// Note: Photo upload functionality will need to be implemented with a different service
// like AWS S3, Cloudinary, or similar since we're removing Firebase Storage
export const uploadUserPhoto = async (userId: string, file: File): Promise<string> => {
  // TODO: Implement with your preferred file storage solution
  throw new Error('Photo upload needs to be implemented with a file storage service');
};

export const deleteUserPhoto = async (userId: string): Promise<boolean> => {
  // TODO: Implement with your preferred file storage solution
  try {
    await updateUserProfile(userId, { image: '' });
    return true;
  } catch (error) {
    console.error('Error removing user photo URL:', error);
    return false;
  }
};
