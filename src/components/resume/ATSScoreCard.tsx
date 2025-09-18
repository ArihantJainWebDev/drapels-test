import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Target, FileText, Eye, BarChart3 } from 'lucide-react';
import { ATSScore, ATSSuggestion } from '@/types/ats';

interface ATSScoreCardProps {
  score: ATSScore;
  isLoading?: boolean;
}

const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ score, isLoading = false }) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-50 border-green-200';
    if (value >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSuggestionIcon = (type: ATSSuggestion['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'improvement':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getSuggestionBadgeVariant = (type: ATSSuggestion['type']) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'improvement':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            ATS Compatibility Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Score Card */}
      <Card className={`w-full ${getScoreBgColor(score.overall)}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              ATS Compatibility Score
            </div>
            <Badge variant={score.passesATS ? 'default' : 'destructive'}>
              {score.passesATS ? 'ATS Friendly' : 'Needs Improvement'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
                {score.overall}
              </div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
          </div>
          
          {!score.passesATS && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your resume may not pass ATS screening. Focus on the suggestions below to improve your score.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(score.breakdown).map(([category, value]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {category === 'formatting' && <FileText className="w-4 h-4" />}
                  {category === 'keywords' && <Target className="w-4 h-4" />}
                  {category === 'structure' && <BarChart3 className="w-4 h-4" />}
                  {category === 'readability' && <Eye className="w-4 h-4" />}
                  {category === 'length' && <FileText className="w-4 h-4" />}
                  <span className="capitalize font-medium">{category}</span>
                </div>
                <span className={`font-semibold ${getScoreColor(value)}`}>
                  {value}%
                </span>
              </div>
              <div className="relative">
                <Progress value={value} className="h-2" />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getProgressColor(value)}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggestions */}
      {score.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {score.suggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex gap-3 p-3 rounded-lg border bg-card">
                <div className="flex-shrink-0 mt-0.5">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSuggestionBadgeVariant(suggestion.type)} className="text-xs">
                        {suggestion.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        +{suggestion.impact} pts
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ATSScoreCard;