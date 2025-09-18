'use client';

import React from 'react';

export const dynamic = 'force-dynamic';
import { useAuth } from '@/context/AuthContext';
import { useSignInRequired } from '@/components/auth/SignInRequiredDialog';
import ProfileHeader from '@/components/profile/ProfileHeader';
import BasicInfoCard from '@/components/profile/BasicInfoCard';
import SkillsCard from '@/components/profile/SkillsCard';
import ExperienceCard from '@/components/profile/ExperienceCard';
import EducationCard from '@/components/profile/EducationCard';
import SocialLinksCard from '@/components/profile/SocialLinksCard';
import StatsOverview from '@/components/profile/StatsOverview';
import { useProfile } from '@/hooks/useProfile';
import { UserCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Mock data - replace with actual data fetching
const mockStats = {
  dsa: {
    problemsSolved: 142,
    hoursSpent: 89,
    lastActive: new Date(),
  },
  interview: {
    sessionsCompleted: 23,
    hoursSpent: 45,
    lastSession: new Date(),
  },
  community: {
    posts: 12,
    interactions: 156,
    lastActivity: new Date(),
  },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { requireAuth, SignInRequiredDialog } = useSignInRequired();
  const {
    formData,
    setFormData,
    isEditing,
    setIsEditing,
    isLoading,
    handleSave,
    handleCancel,
    handleImageUpload,
  } = useProfile(user);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="animate-pulse">
          <CardContent className="p-6 text-center">
            <UserCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Please sign in to view your profile</p>
          </CardContent>
        </Card>
        <SignInRequiredDialog />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <div className="space-y-8">
          {/* Profile Header */}
          <ProfileHeader
            user={user}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            onImageUpload={handleImageUpload}
          />

          {/* Stats Overview */}
          <StatsOverview stats={mockStats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <BasicInfoCard
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                user={user}
              />
              <ExperienceCard
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
              />
            </div>

            {/* Right Column - Secondary Info */}
            <div className="space-y-6">
              <SkillsCard
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
              />
              <EducationCard
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
              />
              <SocialLinksCard
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}