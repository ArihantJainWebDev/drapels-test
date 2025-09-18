"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NavigationItem } from '@/config/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProgressiveDisclosureProps {
  items: NavigationItem[];
  title?: string;
  className?: string;
  defaultExpanded?: boolean;
  showBadges?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  items,
  title,
  className,
  defaultExpanded = false,
  showBadges = true,
  variant = 'default'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Auto-expand if there are featured items or user interaction patterns suggest interest
  useEffect(() => {
    const hasFeaturedItems = items.some(item => item.isNew || item.isPopular);
    const hasHighPriorityItems = items.some(item => (item.priority || 0) <= 2);
    
    if ((hasFeaturedItems || hasHighPriorityItems) && !defaultExpanded) {
      setIsExpanded(true);
    }
  }, [items, defaultExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderBadge = (item: NavigationItem) => {
    if (!showBadges) return null;
    
    if (item.isNew) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 animate-pulse">
          <Sparkles className="w-3 h-3 mr-1" />
          New
        </Badge>
      );
    }
    
    if (item.isPopular) {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          <Star className="w-3 h-3 mr-1" />
          Popular
        </Badge>
      );
    }
    
    // Smart badge for high-priority items
    if ((item.priority || 0) <= 2 && !item.isNew && !item.isPopular) {
      return (
        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400">
          Recommended
        </Badge>
      );
    }
    
    if (item.badge) {
      return (
        <Badge variant="outline" className="text-xs">
          {item.badge}
        </Badge>
      );
    }
    
    return null;
  };

  const renderCompactItem = (item: NavigationItem) => {
    const IconComponent = item.icon;
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setHoveredItem(item.id)}
        onHoverEnd={() => setHoveredItem(null)}
      >
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg transition-all duration-200',
            'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            hoveredItem === item.id && 'bg-gray-50 dark:bg-gray-800/50'
          )}
        >
          {IconComponent && (
            <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
              <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {item.label}
              </span>
              {renderBadge(item)}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  const renderDefaultItem = (item: NavigationItem) => {
    const IconComponent = item.icon;
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setHoveredItem(item.id)}
        onHoverEnd={() => setHoveredItem(null)}
      >
        <Card className={cn(
          'transition-all duration-200 cursor-pointer border-gray-200/50 dark:border-gray-800/50',
          hoveredItem === item.id && 'shadow-md border-gray-300 dark:border-gray-700'
        )}>
          <CardContent className="p-4">
            <Link href={item.href} className="block">
              <div className="flex items-start gap-3">
                {IconComponent && (
                  <div className="p-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {item.label}
                    </h4>
                    {renderBadge(item)}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderFeaturedItem = (item: NavigationItem) => {
    const IconComponent = item.icon;
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setHoveredItem(item.id)}
        onHoverEnd={() => setHoveredItem(null)}
      >
        <Card className={cn(
          'transition-all duration-300 cursor-pointer',
          'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
          'border-gray-200/50 dark:border-gray-800/50',
          hoveredItem === item.id && 'shadow-lg border-blue-200 dark:border-blue-800'
        )}>
          <CardContent className="p-6">
            <Link href={item.href} className="block">
              <div className="flex items-start gap-4">
                {IconComponent && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                    <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {item.label}
                    </h3>
                    {renderBadge(item)}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Explore <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderItem = (item: NavigationItem) => {
    switch (variant) {
      case 'compact':
        return renderCompactItem(item);
      case 'featured':
        return renderFeaturedItem(item);
      default:
        return renderDefaultItem(item);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {title && (
        <Button
          variant="ghost"
          onClick={toggleExpanded}
          className="w-full justify-between p-3 h-auto text-left hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </span>
            <Badge variant="secondary" className="text-xs">
              {items.length}
            </Badge>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Button>
      )}
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={cn(
              'space-y-2',
              variant === 'featured' && 'space-y-4',
              variant === 'compact' && 'space-y-1'
            )}>
              {items.map(renderItem)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressiveDisclosure;
