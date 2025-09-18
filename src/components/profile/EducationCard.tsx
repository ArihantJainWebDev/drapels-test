'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { UserProfile, Education } from '@/types/profile';

interface EducationCardProps {
  formData: UserProfile;
  setFormData: (data: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  isEditing: boolean;
}

const EducationCard: React.FC<EducationCardProps> = ({
  formData,
  setFormData,
  isEditing
}) => {
  const addEducation = () => {
    const currentYear = new Date().getFullYear().toString();
    
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), {
        institution: '',
        degree: '',
        field: '',
        startYear: currentYear,
        endYear: currentYear
      }]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData(prev => {
      const updatedEducation = [...(prev.education || [])];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value
      };
      return {
        ...prev,
        education: updatedEducation
      };
    });
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            Education
          </CardTitle>
          {isEditing && (
            <Button onClick={addEducation} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(!formData.education || formData.education.length === 0) ? (
          <div className="text-center py-6 text-gray-500">
            <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No education added yet</p>
          </div>
        ) : (
          (formData.education || []).map((edu, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-white to-slate-50 dark:from-gray-800 dark:to-gray-800">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <Input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={e => updateEducation(index, 'institution', e.target.value)}
                      />
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={e => updateEducation(index, 'degree', e.target.value)}
                      />
                      <Input
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={e => updateEducation(index, 'field', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Start Year"
                          value={edu.startYear}
                          onChange={e => updateEducation(index, 'startYear', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="End Year"
                          value={edu.endYear}
                          onChange={e => updateEducation(index, 'endYear', e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{edu.degree}</h4>
                  <p className="text-purple-600 font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.field}</p>
                  <p className="text-sm text-gray-500">
                    {edu.startYear} {edu.endYear && edu.startYear !== edu.endYear ? `- ${edu.endYear}` : ''}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default EducationCard;