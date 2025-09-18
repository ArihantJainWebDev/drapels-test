'use client';
import React from 'react';
import UserAvatar from '../user/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export const CommunityHeader = () => {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/community" className="flex items-center space-x-2">
          <span className="inline-block font-bold">Community</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <UserAvatar userId={user.uid} size={32} />
          ) : (
            <Link href="/login">
              <button className="text-sm font-medium">Sign In</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
