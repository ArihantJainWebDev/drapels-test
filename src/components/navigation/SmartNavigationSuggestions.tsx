'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useNavigation } from './NavigationManager';
import { cn } from '@/lib/utils';

interface SmartNavigationSuggestionsProps {
  className?: string;
  maxSuggestions?: number;
  variant?: 'compact' | 'detailed' | 'minimal';
}

export const SmartNavigationSuggestions: React.FC<SmartNavigationSuggestionsProps> = ({
  className,
  maxSuggestions = 4,
  variant = 'detailed'
}) => {
  const { getRecommendedItems, relatedItems, currentItem } = useNavigation();
  const recommendations = getRecommendedItems().slice(0, maxSuggestions);

  if (recommendations.length === 0) return null;

  const renderMinimalSuggestion = (item: any, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={item.href}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {item.label}
        </span>
        {(item.isNew || item.isPopular) && (
          <Badge variant="secondary" className="text-xs">
            {item.isNew ? 'New' : 'Popular'}
          </Badge>
        )}
      </Link>
    </motion.div>
  );

  const renderCompactSuggestion = (item: any, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-3">
          <Link href={item.href} className="block">
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {item.label}
                  </h4>
                  {item.isNew && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {item.isPopular && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderDetailedSuggestion = (item: any, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200/50 dark:border-gray-800/50">
        <CardContent className="p-4">
          <Link href={item.href} className="block">
            <div className="flex items-start gap-4">
              {item.icon && (
                <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {item.label}
                  </h3>
                  {item.isNew && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 animate-pulse">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {item.isPopular && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderSuggestion = (item: any, index: number) => {
    switch (variant) {
      case 'minimal':
        return renderMinimalSuggestion(item, index);
      case 'compact':
        return renderCompactSuggestion(item, index);
      default:
        return renderDetailedSuggestion(item, index);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recommended for You
        </h3>
      </div>
      
      <div className={cn(
        'space-y-3',
        variant === 'minimal' && 'space-y-1',
        variant === 'compact' && 'space-y-2'
      )}>
        {recommendations.map(renderSuggestion)}
      </div>

      {relatedItems.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Related to {currentItem?.label}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedItems.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button variant="outline" size="sm" asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    {item.icon && <item.icon className="w-3 h-3" />}
                    {item.label}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartNavigationSuggestions;