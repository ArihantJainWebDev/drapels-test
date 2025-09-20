'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket, Sparkles, Target, BookOpen, Code } from 'lucide-react';

interface RoadmapHeroProps {
  onGenerateClick: () => void;
}

export function RoadmapHero({ onGenerateClick }: RoadmapHeroProps) {
  const features = [
    {
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      text: 'Personalized learning paths',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      text: 'Structured curriculum',
    },
    {
      icon: <Code className="w-5 h-5 text-indigo-600" />,
      text: 'Hands-on projects',
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Roadmap Generator
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Build Your Perfect <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Learning Path</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get a customized learning roadmap tailored to your goals, skill level, and timeline. 
            Our AI generates the perfect path to help you master any technology or subject.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="group relative overflow-hidden px-8 py-6 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={onGenerateClick}
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Generate Your Roadmap
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-base font-medium border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              Explore Templates
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                {feature.icon}
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-72 -mt-24 -mr-24 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-72 -mb-24 -ml-24 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-30 animate-blob animation-delay-2000"></div>
    </section>
  );
}
