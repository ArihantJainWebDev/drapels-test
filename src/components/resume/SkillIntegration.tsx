import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Plus, 
  X,
  Loader2,
  Star,
  Code,
  BookOpen,
  Briefcase,
  Info
} from 'lucide-react';
import { SkillAssessment } from '@/types/ats';
import { skillIntegrationService } from '@/services/skillIntegrationService';
import { useAuth } from '@/context/AuthContext';

interface SkillIntegrationProps {
  currentSkills: string;
  onSkillsChange: (skills: string) => void;
  targetRole?: string;
}

const SkillIntegration: React.FC<SkillIntegrationProps> = ({
  currentSkills,
  onSkillsChange,
  targetRole
}) => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<SkillAssessment[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    if (user?.uid) {
      loadSkillAssessments();
    }
  }, [user?.uid, targetRole]);

  const loadSkillAssessments = async () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    try {
      const userAssessments = await skillIntegrationService.getUserSkillAssessments(user.uid);
      setAssessments(userAssessments);
      
      const suggested = skillIntegrationService.suggestSkillsForResume(userAssessments, targetRole);
      setSuggestedSkills(suggested);
    } catch (error) {
      console.error('Failed to load skill assessments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillLevelColor = (level: SkillAssessment['level']) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'advanced':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'beginner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceIcon = (source: SkillAssessment['source']) => {
    switch (source) {
      case 'quiz':
        return <BookOpen className="w-3 h-3" />;
      case 'dsa':
        return <Code className="w-3 h-3" />;
      case 'project':
        return <Briefcase className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const getCurrentSkillsArray = () => {
    return currentSkills.split(',').map(s => s.trim()).filter(Boolean);
  };

  const addSkillToResume = (skill: string) => {
    const currentSkillsArray = getCurrentSkillsArray();
    if (!currentSkillsArray.includes(skill)) {
      const newSkills = [...currentSkillsArray, skill].join(', ');
      onSkillsChange(newSkills);
    }
  };

  const removeSkillFromResume = (skill: string) => {
    const currentSkillsArray = getCurrentSkillsArray();
    const newSkills = currentSkillsArray.filter(s => s !== skill).join(', ');
    onSkillsChange(newSkills);
  };

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      addSkillToResume(customSkill.trim());
      setCustomSkill('');
    }
  };

  const applyAllSuggestions = () => {
    const currentSkillsArray = getCurrentSkillsArray();
    const newSkills = [...new Set([...currentSkillsArray, ...suggestedSkills])];
    onSkillsChange(newSkills.join(', '));
  };

  const isSkillInResume = (skill: string) => {
    return getCurrentSkillsArray().includes(skill);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Skill Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading your skill assessments...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Skill Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="current">Current Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggestions" className="space-y-4">
            {suggestedSkills.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Based on your platform assessments, we suggest adding these skills:
                  </p>
                  <Button size="sm" onClick={applyAllSuggestions}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedSkills.map((skill) => {
                    const assessment = assessments.find(a => a.skill === skill);
                    const inResume = isSkillInResume(skill);
                    
                    return (
                      <div
                        key={skill}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          inResume 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {assessment && getSourceIcon(assessment.source)}
                            <span className="font-medium text-sm">{skill}</span>
                          </div>
                          {assessment && (
                            <Badge className={`text-xs ${getSkillLevelColor(assessment.level)}`}>
                              {assessment.level}
                            </Badge>
                          )}
                        </div>
                        
                        {assessment && assessment.score && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${assessment.score}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {assessment.score}%
                            </span>
                          </div>
                        )}
                        
                        <Button
                          size="sm"
                          variant={inResume ? "outline" : "default"}
                          className="w-full"
                          onClick={() => inResume ? removeSkillFromResume(skill) : addSkillToResume(skill)}
                        >
                          {inResume ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 mr-1" />
                              Add to Resume
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Complete quizzes and DSA problems to get personalized skill suggestions for your resume.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="assessments" className="space-y-4">
            {assessments.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your verified skills from platform assessments:
                </p>
                
                {assessments.map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getSourceIcon(assessment.source)}
                        <span className="font-medium text-sm">{assessment.skill}</span>
                      </div>
                      
                      <Badge className={`text-xs ${getSkillLevelColor(assessment.level)}`}>
                        {assessment.level}
                      </Badge>
                      
                      {assessment.verified && (
                        <Badge variant="outline" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {assessment.score && (
                        <span className="text-sm text-muted-foreground">
                          {assessment.score}%
                        </span>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addSkillToResume(assessment.skill)}
                        disabled={isSkillInResume(assessment.skill)}
                      >
                        {isSkillInResume(assessment.skill) ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  Take quizzes and solve DSA problems to build your verified skill portfolio.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="current" className="space-y-4">
            <div className="space-y-3">
              <Label>Current Skills on Resume</Label>
              
              {getCurrentSkillsArray().length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {getCurrentSkillsArray().map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => removeSkillFromResume(skill)}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet.</p>
              )}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom skill..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                />
                <Button onClick={addCustomSkill} disabled={!customSkill.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SkillIntegration;