'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { LearningStats } from '@/types/profile';

interface StatsOverviewProps {
  stats: LearningStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const totalHours = stats.dsa.hoursSpent + stats.interview.hoursSpent;
  const totalActivities = stats.dsa.problemsSolved + stats.interview.sessionsCompleted + stats.community.posts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Trophy className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.dsa.problemsSolved}</p>
              <p className="text-sm text-muted-foreground">Problems Solved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.interview.sessionsCompleted}</p>
              <p className="text-sm text-muted-foreground">Interview Sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalHours}h</p>
              <p className="text-sm text-muted-foreground">Total Study Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.community.interactions}</p>
              <p className="text-sm text-muted-foreground">Community Points</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;