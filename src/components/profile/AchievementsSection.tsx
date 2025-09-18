import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AchievementsSectionProps {
  achievements: string[];
  level: number;
  experience: number;
  nextLevelXP: number;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  level,
  experience,
  nextLevelXP
}) => {
  const progressToNextLevel = ((experience % 100) / 100) * 100;
  
  return (
    <Card className="overflow-hidden">
      {/* Level Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {level}
              </div>
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Trophy className="h-3 w-3 text-yellow-900" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Level {level}</h2>
              <p className="text-blue-100">{experience} XP</p>
              <div className="w-32 mt-2">
                <Progress
                  value={progressToNextLevel}
                  className="h-2 bg-white/20"
                />
              </div>
              <p className="text-xs text-blue-100 mt-1">
                {Math.ceil(nextLevelXP - experience)} XP to next level
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <span className="text-sm font-medium">{achievement}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  +50 XP
                </Badge>
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Complete activities to earn achievements!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;
