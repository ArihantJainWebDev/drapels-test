'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { UserProfile, Experience } from '@/types/profile';

interface ExperienceCardProps {
  formData: UserProfile;
  setFormData: (data: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  isEditing: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  formData,
  setFormData,
  isEditing
}) => {
  const addExperience = () => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    setFormData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), {
        company: '',
        position: '',
        startDate: currentMonth,
        endDate: currentMonth,
        description: ''
      }]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setFormData(prev => {
      const updatedExperience = [...(prev.experience || [])];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value
      };
      return {
        ...prev,
        experience: updatedExperience
      };
    });
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-purple-600" />
              Experience
            </CardTitle>
            <CardDescription>Your professional work experience</CardDescription>
          </div>
          {isEditing && (
            <Button onClick={addExperience} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(!formData.experience || formData.experience.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No experience added yet</p>
          </div>
        ) : (
          (formData.experience || []).map((exp, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-white to-slate-50 dark:from-gray-800 dark:to-gray-800">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={e => updateExperience(index, 'company', e.target.value)}
                    />
                    <Input
                      placeholder="Position"
                      value={exp.position}
                      onChange={e => updateExperience(index, 'position', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      type="month"
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={e => updateExperience(index, 'startDate', e.target.value)}
                    />
                    <Input
                      type="month"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={e => updateExperience(index, 'endDate', e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Describe your role and achievements..."
                    value={exp.description}
                    onChange={e => updateExperience(index, 'description', e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{exp.position}</h4>
                  <p className="text-purple-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - 
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 mt-2 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;