import React from 'react';
import { Card, CardContent } from './card';
import { Progress } from './progress';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import { Award, Clock } from 'lucide-react';

interface CompactProgressCardProps {
  level: number;
  experience: number;
  totalTimeSpent: number;
  progress: number;
  achievements?: string[];
  className?: string;
}

import '../profile/progress-animations.css';

export function CompactProgressCard({
  level,
  experience,
  totalTimeSpent,
  progress,
  achievements = [],
  className,
}: CompactProgressCardProps) {
  return (
    <Card className={cn(
      "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-none overflow-hidden transition-all duration-300 hover:shadow-lg fade-slide-in",
      className
    )}>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full animate-pulse"></div>
              <Award className="h-10 w-10 sm:h-12 sm:w-12 text-primary relative z-10 glow-pulse" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl sm:text-3xl font-bold">Level {level}</h3>
                <span className="text-sm text-muted-foreground">({experience} XP)</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{Math.round(totalTimeSpent / 60)}h spent learning</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {achievements.slice(0, 3).map((achievement, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-3 py-1 bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {achievement}
              </Badge>
            ))}
          </div>
        </div>
        <div className="relative">
          <Progress 
            value={progress} 
            className="h-3 rounded-full transition-all duration-500 ease-in-out progress-bar progress-animate"
          />
          <span className="absolute right-0 top-4 text-xs text-muted-foreground">
            {progress}%
          </span>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap md:hidden">
          {achievements.slice(0, 3).map((achievement, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs px-3 py-1 bg-primary/10"
            >
              {achievement}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
