'use client';

import React, { useRef, useState } from 'react';
import { Edit, MapPin, Calendar, Mail, Camera, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile } from '@/types/profile';
import { User } from 'firebase/auth';

interface ProfileHeaderProps {
  user: User;
  formData: UserProfile;
  setFormData: (data: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (file: File) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  formData,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 dark:from-violet-800 dark:via-purple-800 dark:to-blue-800"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent dark:from-black/50"></div>
      
      <CardContent className="relative p-8 text-white">
        <div className="flex flex-col lg:flex-row items-center lg:items-end space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Avatar Section */}
          <div className="relative group">
            <Avatar className="w-32 h-32 shadow-2xl transition-all duration-300 group-hover:shadow-3xl group-hover:scale-105">
              <AvatarImage 
                src={formData.photoURL || formData.profilePic || user.photoURL || undefined}
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600">
                {(formData.displayName || user.email)?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            <h1 className="text-4xl font-bold">
              {formData.displayName || user.email}
            </h1>
            {formData.title && (
              <p className="text-2xl text-blue-100 font-light">
                {formData.title}
              </p>
            )}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-blue-100">
              {formData.location && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <MapPin className="w-4 h-4" />
                  {formData.location}
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Calendar className="w-4 h-4" />
                Joined {formData.joinedDate ? new Date(formData.joinedDate).toLocaleDateString() : 'Recently'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={onSave}
                  className="bg-white text-purple-600 hover:bg-blue-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={onEdit}
                className="bg-white/90 text-purple-700 hover:bg-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;