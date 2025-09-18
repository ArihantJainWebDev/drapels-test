import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { cn } from '../../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  variant?: 'card' | 'inline' | 'fullscreen';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  className,
  variant = 'card'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const SpinnerContent = () => (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary mb-2", sizeClasses[size])} />
      {message && (
        <p className={cn("text-muted-foreground", textSizeClasses[size])}>
          {message}
        </p>
      )}
    </div>
  );

  switch (variant) {
    case 'inline':
      return <SpinnerContent />;
      
    case 'fullscreen':
      return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="p-8">
            <CardContent className="p-0">
              <SpinnerContent />
            </CardContent>
          </Card>
        </div>
      );
      
    case 'card':
    default:
      return (
        <Card className={cn("shadow-sm", className)}>
          <CardContent className="p-8">
            <SpinnerContent />
          </CardContent>
        </Card>
      );
  }
};

export default LoadingSpinner;