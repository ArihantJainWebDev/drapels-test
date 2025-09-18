import React from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Bookmark, 
  Search,
  Plus,
  Heart,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { cn } from '../../../lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'posts' | 'communities' | 'events' | 'saved' | 'search' | 'comments';
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'posts',
  action,
  className,
  size = 'md'
}) => {
  const iconMap = {
    posts: MessageSquare,
    communities: Users,
    events: Calendar,
    saved: Bookmark,
    search: Search,
    comments: MessageSquare
  };

  const IconComponent = iconMap[icon];

  const sizeClasses = {
    sm: {
      icon: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-sm',
      padding: 'p-6'
    },
    md: {
      icon: 'w-12 h-12',
      title: 'text-xl',
      description: 'text-base',
      padding: 'p-8'
    },
    lg: {
      icon: 'w-16 h-16',
      title: 'text-2xl',
      description: 'text-lg',
      padding: 'p-12'
    }
  };

  const colorClasses = {
    posts: 'text-blue-500',
    communities: 'text-purple-500',
    events: 'text-green-500',
    saved: 'text-yellow-500',
    search: 'text-gray-500',
    comments: 'text-indigo-500'
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className={cn("text-center", sizeClasses[size].padding)}>
        {/* Animated Background */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full animate-pulse" />
          <div className={cn(
            "relative mx-auto rounded-full bg-muted/30 flex items-center justify-center",
            sizeClasses[size].icon === 'w-8 h-8' ? 'w-16 h-16' :
            sizeClasses[size].icon === 'w-12 h-12' ? 'w-24 h-24' : 'w-32 h-32'
          )}>
            <IconComponent className={cn(
              sizeClasses[size].icon,
              colorClasses[icon]
            )} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 mb-6">
          <h3 className={cn(
            "font-semibold text-foreground",
            sizeClasses[size].title
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-muted-foreground max-w-md mx-auto leading-relaxed",
            sizeClasses[size].description
          )}>
            {description}
          </p>
        </div>

        {/* Action Button */}
        {action && (
          <Button
            onClick={action.onClick}
            className="font-medium"
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
          >
            <Plus className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        )}

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-4 opacity-20">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;