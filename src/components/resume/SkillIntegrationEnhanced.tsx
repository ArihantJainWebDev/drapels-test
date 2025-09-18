import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  X, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Target,
  Info,
  Zap,
  Award,
  BookOpen,
  Brain,
  Code,
  Briefcase,
  Lightbulb,
  RefreshCw,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { SkillAssessment } from '@/types/ats';
import { skillIntegrationService } from '@/services/skillIntegrationService';
import { useAuth } from '@/context/AuthContext';

interface SkillIntegrationProps {
  currentSkills: string;
  onSkillsChange: (skills: string) => void;
  targetRole?: string;
}

const SkillIntegrationEnhanced: React.FC<SkillIntegrationProps> = ({
  currentSkills,
  onSkillsChange,
  targetRole
}) => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<SkillAssessment[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<{
    missing: string[];
    emerging: string[];
    complementary: string[];
  }>({ missing: [], emerging: [], complementary: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    if (user?.uid) {
      loadSkillAssessments();
    }
  }, [user?.uid, targetRole]);

  useEffect(() => {
    if (assessments.length > 0) {
      const suggested = skillIntegrationService.suggestSkillsForResume(assessments, targetRole);
      setSuggestedSkills(suggested);
      
      const currentSkillsArray = getCurrentSkillsArray();
      const recs = skillIntegrationService.generateSkillRecommendations(currentSkillsArray, targetRole);
      setRecommendations(recs);
    }
  }, [assessments, targetRole, currentSkills]);

  const loadSkillAssessments = async () => {
    setIsLoading(true);
    try {
      const userAssessments = await skillIntegrationService.getUserSkillAssessments(user!.uid);
      setAssessments(userAssessments);
    } catch (error) {
      console.error('Failed to load skill assessments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentSkillsArray = (): string[] => {
    return currentSkills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
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

  const isSkillInResume = (skill: string) => {
    return getCurrentSkillsArray().includes(skill);
  };

  const getSkillLevelColor = (level: SkillAssessment['level']) => {
    switch (level) {
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'advanced': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'beginner': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceIcon = (source: SkillAssessment['source']) => {
    switch (source) {
      case 'quiz': return <Brain className="w-3 h-3" />;
      case 'dsa': return <Code className="w-3 h-3" />;
      case 'project': return <Briefcase className="w-3 h-3" />;
      case 'manual': return <BookOpen className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  const getSkillCompleteness = () => {
    const currentSkillsArray = getCurrentSkillsArray();
    const totalRecommended = recommendations.missing.length + currentSkillsArray.length;
    if (totalRecommended === 0) return 100;
    return Math.round((currentSkillsArray.length / totalRecommended) * 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Enhanced Skill Integration
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadSkillAssessments}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="suggested" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggested" className="space-y-4">
            {/* Skill Completeness */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-800">Skill Profile Completeness</h3>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    {getSkillCompleteness()}%
                  </Badge>
                </div>
                <Progress value={getSkillCompleteness()} className="h-2 mb-2" />
                <p className="text-sm text-blue-700">
                  {recommendations.missing.length > 0 
                    ? `Add ${recommendations.missing.length} more skills to complete your profile`
                    : 'Your skill profile looks complete!'
                  }
                </p>
              </CardContent>
            </Card>

            {/* AI-Suggested Skills */}
            {suggestedSkills.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-semibold">AI-Suggested Skills</h3>
                  <Badge variant="outline" className="text-xs">
                    Based on your assessments
                  </Badge>
                </div>
                
                <div className="grid gap-3">
                  {suggestedSkills.map((skill) => {
                    const assessment = assessments.find(a => a.skill === skill);
                    const inResume = isSkillInResume(skill);
                    
                    return (
                      <Card 
                        key={skill}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          inResume 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {assessment && getSourceIcon(assessment.source)}
                              <span className="font-medium text-sm">{skill}</span>
                            </div>
                            {assessment && (
                              <Badge className={`text-xs border ${getSkillLevelColor(assessment.level)}`}>
                                {assessment.level}
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant={inResume ? "outline" : "default"}
                            className="h-7 px-3 text-xs"
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
                        {assessment?.score && (
                          <div className="mt-2 flex items-center gap-2">
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
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Complete quizzes and DSA problems to get personalized skill suggestions for your resume.
                </AlertDescription>
              </Alert>
            )}

            {/* Add Custom Skill */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4" />
                  <h3 className="font-semibold">Add Custom Skill</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter skill name..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                    className="flex-1"
                  />
                  <Button onClick={addCustomSkill} disabled={!customSkill.trim()}>
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assessments" className="space-y-4">
            {assessments.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold">Your Skill Assessments</h3>
                  <Badge variant="outline" className="text-xs">
                    {assessments.length} verified skills
                  </Badge>
                </div>
                
                <div className="grid gap-3">
                  {assessments.map((assessment, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(assessment.source)}
                          <span className="font-medium text-sm">{assessment.skill}</span>
                          <Badge className={`text-xs border ${getSkillLevelColor(assessment.level)}`}>
                            {assessment.level}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addSkillToResume(assessment.skill)}
                          disabled={isSkillInResume(assessment.skill)}
                          className="h-7 px-3 text-xs"
                        >
                          {isSkillInResume(assessment.skill) ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <>
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="capitalize">From {assessment.source}</span>
                        {assessment.score && (
                          <span>{assessment.score}% proficiency</span>
                        )}
                      </div>
                      
                      {assessment.score && (
                        <div className="mt-2 flex items-center gap-2">
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
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No skill assessments found. Complete quizzes and DSA problems to build your skill profile.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            {/* Missing Skills for Target Role */}
            {recommendations.missing.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-800 text-base">
                    <AlertTriangle className="w-4 h-4" />
                    Missing Skills for {targetRole || 'Target Role'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {recommendations.missing.map((skill) => (
                      <Badge 
                        key={skill}
                        variant="outline" 
                        className="cursor-pointer hover:bg-red-100 border-red-300 text-red-700"
                        onClick={() => addSkillToResume(skill)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-red-700 mt-2">
                    These skills are commonly required for {targetRole || 'your target role'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Emerging Technologies */}
            {recommendations.emerging.length > 0 && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-800 text-base">
                    <TrendingUp className="w-4 h-4" />
                    Emerging Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {recommendations.emerging.map((skill) => (
                      <Badge 
                        key={skill}
                        variant="outline" 
                        className="cursor-pointer hover:bg-purple-100 border-purple-300 text-purple-700"
                        onClick={() => addSkillToResume(skill)}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-purple-700 mt-2">
                    Stay ahead with these trending technologies
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Complementary Skills */}
            {recommendations.complementary.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-800 text-base">
                    <Lightbulb className="w-4 h-4" />
                    Complementary Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {recommendations.complementary.map((skill) => (
                      <Badge 
                        key={skill}
                        variant="outline" 
                        className="cursor-pointer hover:bg-blue-100 border-blue-300 text-blue-700"
                        onClick={() => addSkillToResume(skill)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    Skills that complement your current expertise
                  </p>
                </CardContent>
              </Card>
            )}

            {recommendations.missing.length === 0 && 
             recommendations.emerging.length === 0 && 
             recommendations.complementary.length === 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {targetRole 
                    ? `Your skills look well-aligned with ${targetRole} requirements!`
                    : 'Set a target role to get personalized skill recommendations.'
                  }
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="current" className="space-y-4">
            <div className="space-y-3">
              <Label>Current Skills on Resume</Label>
              
              {getCurrentSkillsArray().length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {getCurrentSkillsArray().map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
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
                <p className="text-sm text-muted-foreground">
                  No skills added yet. Use the suggestions above to add skills.
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Skill Statistics</Label>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Total Skills:</span>
                  <span className="font-medium">{getCurrentSkillsArray().length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified Skills:</span>
                  <span className="font-medium">{assessments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profile Completeness:</span>
                  <span className="font-medium">{getSkillCompleteness()}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Missing for Role:</span>
                  <span className="font-medium">{recommendations.missing.length}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SkillIntegrationEnhanced;