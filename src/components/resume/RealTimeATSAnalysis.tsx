import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  FileText,
  BarChart3,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { ATSAnalysis, ATSScore, ATSSuggestion } from '@/types/ats';
import { atsService } from '@/services/atsService';
import ATSScoreCard from './ATSScoreCard';

interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    start: string;
    end: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    start: string;
    end: string;
  }>;
}

interface RealTimeATSAnalysisProps {
  resumeData: ResumeData;
  targetRole?: string;
  onScoreChange?: (score: number) => void;
}

const RealTimeATSAnalysis: React.FC<RealTimeATSAnalysisProps> = ({
  resumeData,
  targetRole,
  onScoreChange
}) => {
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedData, setLastAnalyzedData] = useState<string>('');

  // Debounced analysis - only analyze when data changes and after a delay
  const resumeDataString = useMemo(() => JSON.stringify(resumeData), [resumeData]);

  useEffect(() => {
    if (resumeDataString !== lastAnalyzedData) {
      const timeoutId = setTimeout(() => {
        analyzeResume();
      }, 1000); // 1 second delay

      return () => clearTimeout(timeoutId);
    }
  }, [resumeDataString, targetRole]);

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      const newAnalysis = atsService.analyzeResume(resumeData, targetRole);
      setAnalysis(newAnalysis);
      setLastAnalyzedData(resumeDataString);
      onScoreChange?.(newAnalysis.score.overall);
    } catch (error) {
      console.error('ATS analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const forceRefresh = () => {
    analyzeResume();
  };

  const getImprovementPriority = (suggestions: ATSSuggestion[]) => {
    const critical = suggestions.filter(s => s.type === 'critical');
    const warnings = suggestions.filter(s => s.type === 'warning');
    const improvements = suggestions.filter(s => s.type === 'improvement');
    
    return { critical, warnings, improvements };
  };

  const getScoreChangeIndicator = (current: number, previous?: number) => {
    if (!previous) return null;
    
    const change = current - previous;
    if (Math.abs(change) < 1) return null;
    
    return (
      <Badge variant={change > 0 ? 'default' : 'destructive'} className="text-xs">
        {change > 0 ? '+' : ''}{change.toFixed(0)}
      </Badge>
    );
  };

  const getSectionCompleteness = () => {
    const sections = [
      { name: 'Name', complete: !!resumeData.fullName.trim() },
      { name: 'Email', complete: !!resumeData.email.trim() },
      { name: 'Phone', complete: !!resumeData.phone.trim() },
      { name: 'Summary', complete: !!resumeData.summary.trim() },
      { name: 'Skills', complete: !!resumeData.skills.trim() },
      { name: 'Experience', complete: resumeData.experience.length > 0 },
      { name: 'Education', complete: resumeData.education.length > 0 }
    ];
    
    const completed = sections.filter(s => s.complete).length;
    const total = sections.length;
    
    return { sections, completed, total, percentage: (completed / total) * 100 };
  };

  const completeness = getSectionCompleteness();

  return (
    <div className="space-y-4">
      {/* Quick Status Card */}
      <Card className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5" />
              Real-time ATS Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              {isAnalyzing && (
                <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
              <Button variant="outline" size="sm" onClick={forceRefresh} disabled={isAnalyzing}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {analysis ? (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-3xl font-bold ${
                    analysis.score.overall >= 80 ? 'text-green-600' :
                    analysis.score.overall >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {analysis.score.overall}
                  </div>
                  <div>
                    <div className="text-sm font-medium">ATS Score</div>
                    <div className="text-xs text-muted-foreground">out of 100</div>
                  </div>
                </div>
                <Badge variant={analysis.score.passesATS ? 'default' : 'destructive'}>
                  {analysis.score.passesATS ? 'ATS Friendly' : 'Needs Work'}
                </Badge>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {analysis.score.breakdown.keywords}%
                  </div>
                  <div className="text-xs text-muted-foreground">Keywords</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {analysis.score.breakdown.formatting}%
                  </div>
                  <div className="text-xs text-muted-foreground">Formatting</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">
                    {analysis.score.breakdown.structure}%
                  </div>
                  <div className="text-xs text-muted-foreground">Structure</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-600">
                    {completeness.percentage.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-muted-foreground">
                {isAnalyzing ? 'Analyzing your resume...' : 'Start typing to see ATS analysis'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      {analysis && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="completeness">Completeness</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <ATSScoreCard score={analysis.score} />
          </TabsContent>
          
          <TabsContent value="suggestions" className="space-y-4">
            {(() => {
              const { critical, warnings, improvements } = getImprovementPriority(analysis.score.suggestions);
              
              return (
                <div className="space-y-4">
                  {critical.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-red-800">
                          <XCircle className="w-5 h-5" />
                          Critical Issues ({critical.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {critical.map((suggestion) => (
                          <div key={suggestion.id} className="flex gap-3 p-3 rounded-lg bg-white border border-red-200">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-red-800">{suggestion.title}</h4>
                              <p className="text-sm text-red-700 mt-1">{suggestion.description}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                +{suggestion.impact} points
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {warnings.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-yellow-800">
                          <AlertTriangle className="w-5 h-5" />
                          Warnings ({warnings.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {warnings.map((suggestion) => (
                          <div key={suggestion.id} className="flex gap-3 p-3 rounded-lg bg-white border border-yellow-200">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-yellow-800">{suggestion.title}</h4>
                              <p className="text-sm text-yellow-700 mt-1">{suggestion.description}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                +{suggestion.impact} points
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {improvements.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          <Lightbulb className="w-5 h-5" />
                          Improvements ({improvements.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {improvements.map((suggestion) => (
                          <div key={suggestion.id} className="flex gap-3 p-3 rounded-lg bg-white border border-blue-200">
                            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-blue-800">{suggestion.title}</h4>
                              <p className="text-sm text-blue-700 mt-1">{suggestion.description}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                +{suggestion.impact} points
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {analysis.score.suggestions.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-green-800 mb-2">Excellent Work!</h3>
                        <p className="text-green-700">Your resume looks great with no major issues detected.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })()}
          </TabsContent>
          
          <TabsContent value="keywords" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Keyword Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-green-800">Found Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.keywords.filter(k => k.found).slice(0, 10).map((keyword) => (
                          <Badge key={keyword.keyword} variant="default" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {keyword.keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-red-800">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.keywords.filter(k => !k.found && k.importance >= 3).slice(0, 10).map((keyword) => (
                          <Badge key={keyword.keyword} variant="outline" className="text-xs">
                            <XCircle className="w-3 h-3 mr-1" />
                            {keyword.keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completeness" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Resume Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completeness.completed}/{completeness.total} sections
                    </span>
                  </div>
                  <Progress value={completeness.percentage} className="h-2" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {completeness.sections.map((section) => (
                      <div key={section.name} className="flex items-center justify-between p-2 rounded border">
                        <span className="text-sm">{section.name}</span>
                        {section.complete ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default RealTimeATSAnalysis;