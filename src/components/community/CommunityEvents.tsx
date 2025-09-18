import React from 'react';
import EmptyState from './common/EmptyState';

export const CommunityEvents = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Community Events</h1>
      <EmptyState 
        title="No events yet" 
        description="Check back later for upcoming events" 
      />
    </div>
  );
};
