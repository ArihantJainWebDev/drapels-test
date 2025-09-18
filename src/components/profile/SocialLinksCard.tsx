'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Github, Linkedin } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface SocialLinksCardProps {
  formData: UserProfile;
  setFormData: (data: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  isEditing: boolean;
}

const SocialLinksCard: React.FC<SocialLinksCardProps> = ({
  formData,
  setFormData,
  isEditing
}) => {
  const updateField = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Social Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">Personal Website</Label>
          {isEditing ? (
            <Input
              id="website"
              value={formData.website || ''}
              onChange={e => updateField('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          ) : (
            <div className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-lg text-sm border">
              <Globe className="w-4 h-4 text-gray-500" />
              {formData.website ? (
                <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                {formData.website.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className="text-gray-500">Not set</span>
            )}
          </div>
        )}
      </div>

      {/* GitHub */}
      <div className="space-y-2">
        <Label htmlFor="github">GitHub</Label>
        {isEditing ? (
          <Input
            id="github"
            value={formData.github || ''}
            onChange={e => updateField('github', e.target.value)}
            placeholder="https://github.com/username"
          />
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-lg text-sm border">
            <Github className="w-4 h-4 text-gray-700" />
            {formData.github ? (
              <a href={formData.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                {formData.github.replace('https://github.com/', '')}
              </a>
            ) : (
              <span className="text-gray-500">Not set</span>
            )}
          </div>
        )}
      </div>

      {/* LinkedIn */}
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        {isEditing ? (
          <Input
            id="linkedin"
            value={formData.linkedin || ''}
            onChange={e => updateField('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-lg text-sm border">
            <Linkedin className="w-4 h-4 text-blue-600" />
            {formData.linkedin ? (
              <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                {formData.linkedin.replace('https://linkedin.com/in/', '')}
              </a>
            ) : (
              <span className="text-gray-500">Not set</span>
            )}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
};

export default SocialLinksCard;