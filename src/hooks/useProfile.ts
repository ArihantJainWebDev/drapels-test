'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';

// Mock service functions - replace with your actual service implementations
const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  // Replace with your actual implementation
  return null;
};

const updateUserProfile = async (uid: string, profile: UserProfile): Promise<boolean> => {
  // Replace with your actual implementation
  return true;
};

const uploadUserPhoto = async (uid: string, file: File): Promise<string> => {
  // Replace with your actual implementation
  return URL.createObjectURL(file);
};

export function useProfile(user: User | null) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserProfile>({
    displayName: '',
    title: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    skills: [],
    education: [],
    experience: [],
    joinedDate: new Date().toISOString(),
    communityInterests: [],
    preferredCommunities: [],
    contributionAreas: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user?.uid || profileLoaded) return;

    setIsLoading(true);
    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setFormData(prev => ({
          ...prev,
          ...profile,
          displayName: profile.displayName || user.displayName || '',
          education: profile.education || [],
          experience: profile.experience || [],
          skills: profile.skills || [],
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          displayName: user.displayName || '',
        }));
      }
      setProfileLoaded(true);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, user?.displayName, profileLoaded, toast]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  useEffect(() => {
    setProfileLoaded(false);
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const success = await updateUserProfile(user.uid, formData);
      if (success) {
        setIsEditing(false);
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileLoaded(false);
    loadProfile();
  };

  const handleImageUpload = async (file: File) => {
    if (!user?.uid) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      const photoURL = await uploadUserPhoto(user.uid, file);
      setFormData(prev => ({ ...prev, photoURL }));
      toast({
        title: 'Success',
        description: 'Profile photo updated successfully',
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload photo',
        variant: 'destructive',
      });
    }
  };

  return {
    formData,
    setFormData,
    isEditing,
    setIsEditing,
    isLoading,
    handleSave,
    handleCancel,
    handleImageUpload,
  };
}