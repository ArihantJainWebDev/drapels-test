'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star, Users, ExternalLink } from 'lucide-react';

type CuratedRoadmap = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  popularity: number;
  isNew?: boolean;
  isFeatured?: boolean;
};

const curatedRoadmaps: CuratedRoadmap[] = [
  {
    id: 'web-dev-2024',
    title: 'Full Stack Web Development',
    description: 'Master modern web development with this comprehensive roadmap covering frontend, backend, and DevOps.',
    category: 'Web Development',
    difficulty: 'Beginner',
    duration: '6-12 months',
    popularity: 4.8,
    isFeatured: true
  },
  {
    id: 'ds-ml',
    title: 'Data Science & Machine Learning',
    description: 'Learn data analysis, visualization, and machine learning algorithms from scratch.',
    category: 'Data Science',
    difficulty: 'Intermediate',
    duration: '8-12 months',
    popularity: 4.7,
    isNew: true
  },
  {
    id: 'blockchain-dev',
    title: 'Blockchain Development',
    description: 'Build decentralized applications and smart contracts with Solidity and Ethereum.',
    category: 'Blockchain',
    difficulty: 'Intermediate',
    duration: '4-6 months',
    popularity: 4.5
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    description: 'Create cross-platform mobile applications with React Native and Flutter.',
    category: 'Mobile',
    difficulty: 'Beginner',
    duration: '3-6 months',
    popularity: 4.3
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Engineering',
    description: 'Master CI/CD, Docker, Kubernetes, and cloud platforms like AWS and GCP.',
    category: 'DevOps',
    difficulty: 'Advanced',
    duration: '6-9 months',
    popularity: 4.6
  },
  {
    id: 'cyber-sec',
    title: 'Cybersecurity',
    description: 'Learn ethical hacking, penetration testing, and security best practices.',
    category: 'Security',
    difficulty: 'Advanced',
    duration: '6-12 months',
    popularity: 4.4
  }
];

interface CuratedRoadmapsProps {
  onSelect: (roadmap: CuratedRoadmap) => void;
}

export function CuratedRoadmaps({ onSelect }: CuratedRoadmapsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {curatedRoadmaps.map((roadmap, index) => (
        <motion.div
          key={roadmap.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-800 group">
            <CardHeader className="pb-3 relative">
              {roadmap.isNew && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  New
                </span>
              )}
              {roadmap.isFeatured && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Featured
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full">
                  {roadmap.category}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                  {roadmap.difficulty}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {roadmap.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {roadmap.description}
              </CardDescription>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>{roadmap.duration}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {roadmap.popularity.toFixed(1)}
                  </span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400 text-xs">
                    ({Math.floor(roadmap.popularity * 20)})
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors"
                onClick={() => onSelect(roadmap)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Use as Template
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
