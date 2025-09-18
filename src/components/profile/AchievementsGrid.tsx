import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Medal } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: 'dsa' | 'interview' | 'community' | 'learning';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsGridProps {
  achievements: Achievement[];
}

const rarityColors = {
  common: 'bg-gray-100 text-gray-900',
  rare: 'bg-blue-100 text-blue-900',
  epic: 'bg-purple-100 text-purple-900',
  legendary: 'bg-yellow-100 text-yellow-900'
};

const rarityIcons = {
  common: Trophy,
  rare: Star,
  epic: Medal,
  legendary: Trophy
};

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = rarityIcons[achievement.rarity];
          return (
            <Card 
              key={achievement.id}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${rarityColors[achievement.rarity]} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {achievement.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(achievement.date).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
