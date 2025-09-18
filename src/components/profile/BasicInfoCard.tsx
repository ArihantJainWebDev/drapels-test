'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail } from 'lucide-react';
import { UserProfile } from '@/types/profile';
import { User } from 'firebase/auth';

interface BasicInfoCardProps {
  formData: UserProfile;
  setFormData: (data: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  isEditing: boolean;
  user: User;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  formData,
  setFormData,
  isEditing,
  user
}) => {
  const updateField = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Profile Information
        </CardTitle>
        <CardDescription>Update your personal information and contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            {isEditing ? (
              <Input
                id="displayName"
                value={formData.displayName || ''}
                onChange={e => updateField('displayName', e.target.value)}
                placeholder="Enter your display name"
              />
            ) : (
              <p className="py-3 px-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-lg text-sm border">
                {formData.displayName || 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            {isEditing ? (
              <Input
                id="title"
                value={formData.title || ''}
                onChange={e => updateField('title', e.target.value)}
                placeholder="e.g., Software Engineer"
              />
            ) : (
              <p className="py-3 px-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-lg text-sm border">
                {formData.title || 'Not set'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location || ''}
                onChange={e => updateField('location', e.target.value)}
                placeholder="City, Country"
              />
            ) : (
              <div className="flex items-center gap-2 py-3 px-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-lg text-sm border">
                <MapPin className="w-4 h-4 text-gray-500" />
                {formData.location || 'Not set'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="flex items-center gap-2 py-3 px-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-lg text-sm border">
              <Mail className="w-4 h-4 text-gray-500" />
              {user.email}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={e => updateField('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="resize-none"
            />
          ) : (
            <div className="py-4 px-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-lg text-sm min-h-[120px] border">
              {formData.bio || 'No bio added yet'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;