'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Plus, X } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface SkillsCardProps {
  formData: UserProfile;
  setFormData: (data: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  isEditing: boolean;
}

const SkillsCard: React.FC<SkillsCardProps> = ({
  formData,
  setFormData,
  isEditing
}) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !(formData.skills || []).includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => s !== skill)
    }));
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing && (
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addSkill()}
              className="flex-1"
            />
            <Button onClick={addSkill} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {(formData.skills || []).map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
        {(!formData.skills || formData.skills.length === 0) && (
          <p className="text-center text-gray-500 py-4">No skills added yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsCard;