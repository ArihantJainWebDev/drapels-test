'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getUserProfile } from '@/services/userService';

interface UserAvatarProps {
  userId: string;
  size?: number;
  urlOverride?: string | null;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  size = 40,
  urlOverride,
  className
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const profile = await getUserProfile(userId);
        if (profile) {
          setAvatarUrl(profile.photoURL || profile.profilePic || null);
          setDisplayName(profile.displayName || '');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    if (userId && !urlOverride) {
      loadUserData();
    }
  }, [userId, urlOverride]);

  const finalAvatarUrl = urlOverride || avatarUrl;
  const initials = displayName.charAt(0).toUpperCase() || '?';

  return (
    <Avatar 
      className={cn(className)} 
      style={{ width: size, height: size }}
    >
      {finalAvatarUrl && (
        <AvatarImage 
          src={finalAvatarUrl} 
          alt={displayName || 'User avatar'} 
        />
      )}
      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;