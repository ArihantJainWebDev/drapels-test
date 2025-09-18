import React from 'react';
import { Brain, Users, Timer, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface InterviewPrepProgressProps {
  data: {
    totalSessions: number;
    totalTimeSpent: number;
    lastSessionDate: Date;
    favoriteTopics: string[];
    mockInterviewsCompleted: number;
    averageScore: number;
  };
}

const InterviewPrepProgress: React.FC<InterviewPrepProgressProps> = ({ data }) => {
  // Format hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-2 bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Sessions</span>
          </div>
          <div className="text-2xl font-bold">
            {data.totalSessions}
          </div>
          <p className="text-xs text-muted-foreground">Total practice sessions</p>
        </Card>

        <Card className="p-4 space-y-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Mock Interviews</span>
          </div>
          <div className="text-2xl font-bold">
            {data.mockInterviewsCompleted}
          </div>
          <p className="text-xs text-muted-foreground">Completed interviews</p>
        </Card>

        <Card className="p-4 space-y-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium">Time Spent</span>
          </div>
          <div className="text-2xl font-bold">
            {formatTime(data.totalTimeSpent)}
          </div>
          <p className="text-xs text-muted-foreground">Total practice time</p>
        </Card>

        <Card className="p-4 space-y-2 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium">Avg. Score</span>
          </div>
          <div className="text-2xl font-bold">
            {Math.round(data.averageScore)}%
          </div>
          <p className="text-xs text-muted-foreground">Performance rating</p>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Metrics
          </h3>
          <Badge variant="outline">
            Last session: {new Date(data.lastSessionDate).toLocaleDateString()}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Technical Skills</span>
              <span>{Math.round(data.averageScore * 0.8)}%</span>
            </div>
            <Progress value={data.averageScore * 0.8} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Communication</span>
              <span>{Math.round(data.averageScore * 0.9)}%</span>
            </div>
            <Progress value={data.averageScore * 0.9} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Problem Solving</span>
              <span>{Math.round(data.averageScore * 0.85)}%</span>
            </div>
            <Progress value={data.averageScore * 0.85} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Favorite Topics */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Most Practiced Topics</h3>
        <div className="flex flex-wrap gap-2">
          {data.favoriteTopics.map((topic, index) => (
            <Badge 
              key={index}
              variant={index < 3 ? "default" : "secondary"}
              className="px-2 py-1"
            >
              {topic}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InterviewPrepProgress;
