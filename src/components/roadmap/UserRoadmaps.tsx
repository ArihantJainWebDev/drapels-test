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
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No roadmaps yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Create your first roadmap to get started on your learning journey.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roadmaps.map((roadmap, index) => (
        <motion.div
          key={roadmap.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {roadmap.title || 'Untitled Roadmap'}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {format(new Date(roadmap.createdAt), 'MMM d, yyyy')}
                  </CardDescription>
                </div>
                <div className="px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                  {roadmap.skillLevel || 'Beginner'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {roadmap.description || 'No description available'}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>{roadmap.estimatedTime || 'N/A'} hours</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1.5" />
                  <span>{roadmap.complexity || 'Medium'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex justify-between w-full">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onView(roadmap)}
                  className="flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => onDelete(roadmap.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
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
