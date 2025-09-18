import React from 'react';
import { CommunityHeader } from './layout/CommunityHeader';
import { CommunityNavigation } from './layout/CommunityNavigation';
// import { CreatePostForm } from './posts/CreatePostForm';
// import { PostCard } from './posts/PostCard';
// import EmptyState from './common/EmptyState';
// import LoadingSpinner from './common/LoadingSpinner';

export const Community = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <CommunityHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-4xl py-4 sm:pb-20 pb-[env(safe-area-inset-bottom)]">
        {/* Navigation */}
        <CommunityNavigation />

        {/* Content will go here */}
      </div>
    </div>
  );
};
