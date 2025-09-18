'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X, Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { useNavigation } from './NavigationManager';
import DynamicMenuGenerator from './DynamicMenuGenerator';
import SmartNavigationSuggestions from './SmartNavigationSuggestions';
import { cn } from '@/lib/utils';

interface NavigationSidebarProps {
  className?: string;
  defaultCollapsed?: boolean;
  showOnRoutes?: string[];
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  className,
  defaultCollapsed = false,
  showOnRoutes = ['/tools', '/docs', '/settings', '/admin']
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname() as string;
  const { currentItem, breadcrumbs } = useNavigation();

  // Determine if sidebar should be shown on current route
  const shouldShow = showOnRoutes.some(route => pathname.startsWith(route));

  React.useEffect(() => {
    setIsVisible(shouldShow);
  }, [shouldShow]);

  if (!isVisible) return null;

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-80';
  const contentWidth = isCollapsed ? 'ml-16' : 'ml-80';

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={cn(
          'fixed left-0 top-20 bottom-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-800/50 transition-all duration-300',
          sidebarWidth,
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-800/50">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Compass className="w-5 h-5 text-blue-500" />
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  Navigation
                </h2>
              </motion.div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Current Context */}
                {currentItem && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {currentItem.icon && (
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                            <currentItem.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {currentItem.label}
                          </h3>
                          {currentItem.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {currentItem.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Separator />

                {/* Main Navigation */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    Main Menu
                  </h3>
                  <DynamicMenuGenerator 
                    variant="sidebar"
                    showCategories={true}
                    maxItemsPerCategory={8}
                  />
                </div>

                <Separator />

                {/* Smart Suggestions */}
                <div>
                  <SmartNavigationSuggestions 
                    variant="minimal"
                    maxSuggestions={4}
                  />
                </div>
              </motion.div>
            ) : (
              // Collapsed view - show only icons
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full p-3 justify-center"
                  title="Home"
                >
                  <Home className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full p-3 justify-center"
                  title="Navigation Menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content Spacer */}
      <div className={cn('transition-all duration-300', contentWidth)} />
    </>
  );
};

export default NavigationSidebar;