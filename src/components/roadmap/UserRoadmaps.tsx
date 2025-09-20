'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, BookOpen, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Roadmap } from '@/types/roadmap';

interface UserRoadmapsProps {
  roadmaps: Roadmap[];
  onDelete: (id: string) => void;
  onView: (roadmap: Roadmap) => void;
}

export function UserRoadmaps({ roadmaps, onDelete, onView }: UserRoadmapsProps) {
  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1.5">No roadmaps yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Create your first roadmap to get started on your learning journey.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {roadmaps.map((roadmap, index) => (
        <motion.div
          key={roadmap.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col hover:shadow-md dark:hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/50">
            <CardHeader className="pb-2 px-4 sm:px-5 pt-4 sm:pt-5">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-[15px] font-medium leading-snug text-gray-900 dark:text-gray-100 line-clamp-2">
                    {roadmap.title || 'Untitled Roadmap'}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {format(new Date(roadmap.createdAt), 'MMM d, yyyy')}
                  </CardDescription>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium whitespace-nowrap">
                  {roadmap.params.experience || 'Beginner'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 px-4 sm:px-5 py-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                {roadmap.description || 'No description available'}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{roadmap.params.timeframe || 'N/A'} hours</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{roadmap.params.experience || 'Medium'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-gray-700/50 px-4 sm:px-5 py-3">
              <div className="flex justify-between w-full gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onView(roadmap)}
                  className="h-8 text-xs px-3 flex items-center gap-1.5 border-gray-200 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:bg-gray-700/50 dark:hover:bg-gray-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs px-3 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => onDelete(roadmap.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  <span>Delete</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
