import React from 'react';
import { BrainCircuit, Trophy, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AIQuizProgressProps {
  data: {
    totalQuizzes: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    lastQuizDate: Date;
    favoriteCompanies: string[];
    favoriteDomains: string[];
    totalTimeSpent: number;
  };
}

const AIQuizProgress: React.FC<AIQuizProgressProps> = ({ data }) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-indigo-500" />
              <h3 className="font-medium">Quiz Score</h3>
            </div>
            <Badge variant="secondary">{Math.round(data.accuracy)}%</Badge>
          </div>
          <Progress value={data.accuracy} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">Based on {data.totalQuestions} questions</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Total Quizzes</h3>
            </div>
            <span className="text-xl font-bold">{data.totalQuizzes}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Last quiz: {new Date(data.lastQuizDate).toLocaleDateString()}
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Time Spent</h3>
            </div>
            <Badge variant="secondary">{formatTime(data.totalTimeSpent)}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Average: {formatTime(Math.round(data.totalTimeSpent / data.totalQuizzes))} per quiz
          </div>
        </Card>
      </div>

      {/* Favorite Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-medium mb-3">Top Companies</h3>
          <div className="flex flex-wrap gap-2">
            {data.favoriteCompanies.map((company, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className={cn(
                  "px-3 py-1",
                  index < 3 ? "bg-gradient-to-r from-yellow-500/10 to-amber-500/10" : ""
                )}
              >
                {company}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-3">Top Domains</h3>
          <div className="flex flex-wrap gap-2">
            {data.favoriteDomains.map((domain, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className={cn(
                  "px-3 py-1",
                  index < 3 ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10" : ""
                )}
              >
                {domain}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIQuizProgress;
