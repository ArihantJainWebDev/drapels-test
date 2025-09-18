import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { UserProfile } from '@/types/profile';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid,
        ...data,
        joinedDate: data.joinedDate?.toDate?.()?.toISOString() || data.joinedDate,
      } as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

export const updateUserProfile = async (
  uid: string, 
  profileData: Partial<UserProfile>
): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    const updateData = {
      ...profileData,
      updatedAt: serverTimestamp(),
    };

    if (userDoc.exists()) {
      await updateDoc(userDocRef, updateData);
    } else {
      await setDoc(userDocRef, {
        ...updateData,
        createdAt: serverTimestamp(),
        joinedDate: serverTimestamp(),
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

export const uploadUserPhoto = async (uid: string, file: File): Promise<string> => {
  try {
    // Create a reference to the file location
    const photoRef = ref(storage, `users/${uid}/profile-photo`);
    
    // Upload the file
    const snapshot = await uploadBytes(photoRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update the user's profile with the new photo URL
    await updateUserProfile(uid, { photoURL: downloadURL, profilePic: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading user photo:', error);
    throw new Error('Failed to upload photo');
  }
};

export const deleteUserPhoto = async (uid: string): Promise<boolean> => {
  try {
    const photoRef = ref(storage, `users/${uid}/profile-photo`);
    await deleteObject(photoRef);
    
    // Remove photo URL from user profile
    await updateUserProfile(uid, { photoURL: '', profilePic: '' });
    
    return true;
  } catch (error) {
    console.error('Error deleting user photo:', error);
    return false;
  }
};