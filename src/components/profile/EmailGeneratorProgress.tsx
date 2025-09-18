import React from 'react';
import { Mail, Clock, Send, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EmailGeneratorProgressProps {
  data: {
    totalEmailsGenerated: number;
    totalWordsWritten: number;
    lastGeneratedDate: Date;
    favoriteTemplates: string[];
    totalTimeSpent: number;
  };
}

const EmailGeneratorProgress: React.FC<EmailGeneratorProgressProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-sky-500/10">
          <Mail className="h-8 w-8 text-blue-500 mb-2" />
          <div className="text-2xl font-bold">{data.totalEmailsGenerated}</div>
          <p className="text-sm text-muted-foreground">Emails Generated</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <FileText className="h-8 w-8 text-green-500 mb-2" />
          <div className="text-2xl font-bold">
            {Math.round(data.totalWordsWritten / 1000)}K
          </div>
          <p className="text-sm text-muted-foreground">Words Written</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
          <Clock className="h-8 w-8 text-purple-500 mb-2" />
          <div className="text-2xl font-bold">
            {Math.round(data.totalTimeSpent / 60)}h
          </div>
          <p className="text-sm text-muted-foreground">Time Spent</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
          <Send className="h-8 w-8 text-orange-500 mb-2" />
          <div className="text-2xl font-bold">
            {Math.round(data.totalWordsWritten / data.totalEmailsGenerated)}
          </div>
          <p className="text-sm text-muted-foreground">Avg. Words/Email</p>
        </Card>
      </div>

      {/* Favorite Templates */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Most Used Templates</h3>
        <div className="flex flex-wrap gap-3">
          {data.favoriteTemplates.map((template, index) => (
            <Badge 
              key={index} 
              className={cn(
                "px-3 py-1 text-sm",
                index === 0 && "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
                index === 1 && "bg-gradient-to-r from-gray-500/20 to-slate-500/20",
                index === 2 && "bg-gradient-to-r from-orange-500/20 to-amber-500/20"
              )}
            >
              {template}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Recent Activity</h3>
          <Badge variant="outline">
            Last generated: {new Date(data.lastGeneratedDate).toLocaleDateString()}
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Daily Generation</p>
            <Progress value={70} className="h-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Success Rate</p>
            <Progress value={85} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailGeneratorProgress;
