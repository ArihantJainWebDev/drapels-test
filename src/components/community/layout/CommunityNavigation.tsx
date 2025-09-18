'use client';
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';

export const CommunityNavigation = () => {
  const pathname = usePathname();
  const activeTab = pathname?.split('/')[2] || 'feed';
  
  return (
    <div className="sticky top-16 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Tabs defaultValue="feed" value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="my_posts">My Posts</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
