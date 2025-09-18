"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';

export interface UseHeaderAuthReturn {
  user: any;
  profilePic: string | null;
  firstName: string;
  isAuthenticated: boolean;
  logout: () => void;
  navigateToLogin: () => void;
  navigateToProfile: () => void;
}

export const useHeaderAuth = (): UseHeaderAuthReturn => {
  const router = useRouter();
  const { user, signOut: authLogout } = useAuth();
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Fetch user profile picture
  useEffect(() => {
    const fetchProfilePic = async () => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            if (data.profilePic) {
              setProfilePic(data.profilePic);
            }
          }
        } catch (err) {
          console.error("Failed to load profile picture:", err);
        }
      }
    };
    fetchProfilePic();
  }, [user]);

  const firstName = user?.displayName?.split(" ")[0] || "User";
  const isAuthenticated = !!user;

  const logout = () => {
    authLogout();
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return {
    user,
    profilePic,
    firstName,
    isAuthenticated,
    logout,
    navigateToLogin,
    navigateToProfile
  };
};