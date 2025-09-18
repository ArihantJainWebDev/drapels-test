import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  Clock, 
  BarChart,
  BookOpen,
  Code,
  Brain,
  Users,
  ArrowRight
} from 'lucide-react';

interface LearningStats {
  dsa: {
    problemsSolved: number;
    hoursSpent: number;
    lastActive: Date;
  };
  interview: {
    sessionsCompleted: number;
    hoursSpent: number;
    lastSession: Date;
  };
  community: {
    posts: number;
    interactions: number;
    lastActivity: Date;
  };
}

interface ActivityTimelineProps {
  stats: LearningStats;
}

const ActivityCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subValue, 
  date 
}: { 
  icon: React.ElementType;
  title: string;
  value: string | number;
  subValue?: string;
  date: Date;
}) => (
  <Card className="group hover:shadow-md transition-all duration-300">
    <CardContent className="p-4">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium group-hover:text-primary transition-colors">
            {title}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {subValue && (
              <span className="text-sm text-muted-foreground">{subValue}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last active: {new Date(date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function ActivityTimeline({ stats }: ActivityTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActivityCard
          icon={Code}
          title="DSA Practice"
          value={stats.dsa.problemsSolved}
          subValue="problems solved"
          date={stats.dsa.lastActive}
        />
        <ActivityCard
          icon={Brain}
          title="Interview Practice"
          value={stats.interview.sessionsCompleted}
          subValue="sessions"
          date={stats.interview.lastSession}
        />
        <ActivityCard
          icon={Users}
          title="Community Engagement"
          value={stats.community.posts + stats.community.interactions}
          subValue="interactions"
          date={stats.community.lastActivity}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Time Investment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>DSA & Learning</span>
              </div>
              <span className="font-medium">{stats.dsa.hoursSpent}h</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span>Interview Prep</span>
              </div>
              <span className="font-medium">{stats.interview.hoursSpent}h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full">
        View Detailed Statistics
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
