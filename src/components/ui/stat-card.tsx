import React from 'react';
import { Card, CardContent } from './card';
import { Progress } from './progress';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  stats: Array<{
    label: string;
    value: number | string;
  }>;
  progress?: number;
  className?: string;
  animateOnHover?: boolean;
}

import '../profile/progress-animations.css';

export function StatCard({
  icon: Icon,
  title,
  stats,
  progress,
  className,
  animateOnHover = true,
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden stat-card fade-slide-in",
        animateOnHover && "group hover:shadow-lg transition-all duration-300 hover:border-primary/20",
        className
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className={cn(
              "absolute inset-0 bg-primary/10 rounded-full",
              animateOnHover && "group-hover:scale-110 transition-transform duration-300"
            )}></div>
            <Icon className="h-6 w-6 text-primary relative z-10" />
          </div>
          <h3 className={cn(
            "font-semibold text-lg",
            animateOnHover && "group-hover:text-primary transition-colors duration-300"
          )}>
            {title}
          </h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
              >
                <div className="text-muted-foreground text-sm mb-1">{stat.label}</div>
                <div className="font-semibold text-lg stat-value">{stat.value}</div>
              </div>
            ))}
          </div>
          {progress !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 rounded-full transition-all duration-500"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
