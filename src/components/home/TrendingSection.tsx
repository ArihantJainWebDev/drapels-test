'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Star, 
  Users, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Code,
  BookOpen,
  Trophy,
  Zap,
  Heart,
  Eye
} from 'lucide-react';

interface TrendingSectionProps {
  user?: any;
  t?: (key: string) => string;
}

const TrendingSection = ({ user, t }: TrendingSectionProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tools');

  const tabs = [
    { id: 'tools', name: 'Trending Tools', icon: Code },
    { id: 'challenges', name: 'Featured Challenges', icon: Trophy },
    { id: 'docs', name: 'Popular Docs', icon: BookOpen }
  ];

  const trendingData = {
    tools: [
      {
        id: 1,
        title: 'AI Code Generator',
        description: 'Generate code snippets using advanced AI models',
        category: 'AI Tools',
        users: '15.2K',
        rating: 4.9,
        trending: true,
        image: '/api/placeholder/300/200',
        tags: ['AI', 'Code Generation', 'Productivity']
      },
      {
        id: 2,
        title: 'API Testing Suite',
        description: 'Complete toolkit for API development and testing',
        category: 'Development',
        users: '8.7K',
        rating: 4.8,
        trending: true,
        image: '/api/placeholder/300/200',
        tags: ['API', 'Testing', 'Development']
      },
      {
        id: 3,
        title: 'Database Designer',
        description: 'Visual database schema design and management',
        category: 'Database',
        users: '12.1K',
        rating: 4.7,
        trending: false,
        image: '/api/placeholder/300/200',
        tags: ['Database', 'Design', 'Schema']
      },
      {
        id: 4,
        title: 'Code Formatter Pro',
        description: 'Advanced code formatting for multiple languages',
        category: 'Utilities',
        users: '6.3K',
        rating: 4.6,
        trending: true,
        image: '/api/placeholder/300/200',
        tags: ['Formatting', 'Code Quality', 'Utilities']
      }
    ],
    challenges: [
      {
        id: 1,
        title: 'Full-Stack E-commerce Challenge',
        description: 'Build a complete e-commerce platform with modern tech stack',
        category: 'Full-Stack',
        participants: '2.1K',
        difficulty: 'Advanced',
        duration: '2 weeks',
        prize: '$5,000',
        image: '/api/placeholder/300/200',
        tags: ['React', 'Node.js', 'MongoDB']
      },
      {
        id: 2,
        title: 'AI Chatbot Competition',
        description: 'Create an intelligent chatbot using machine learning',
        category: 'AI/ML',
        participants: '1.8K',
        difficulty: 'Intermediate',
        duration: '10 days',
        prize: '$3,000',
        image: '/api/placeholder/300/200',
        tags: ['Python', 'TensorFlow', 'NLP']
      },
      {
        id: 3,
        title: 'Mobile App Design Sprint',
        description: 'Design and prototype a mobile app in record time',
        category: 'Mobile',
        participants: '950',
        difficulty: 'Beginner',
        duration: '5 days',
        prize: '$1,500',
        image: '/api/placeholder/300/200',
        tags: ['Flutter', 'UI/UX', 'Mobile']
      },
      {
        id: 4,
        title: 'Blockchain DApp Challenge',
        description: 'Build a decentralized application on Ethereum',
        category: 'Blockchain',
        participants: '1.2K',
        difficulty: 'Advanced',
        duration: '3 weeks',
        prize: '$7,500',
        image: '/api/placeholder/300/200',
        tags: ['Solidity', 'Web3', 'Ethereum']
      }
    ],
    docs: [
      {
        id: 1,
        title: 'React Hooks Mastery Guide',
        description: 'Complete guide to mastering React Hooks with examples',
        category: 'Frontend',
        views: '45.2K',
        rating: 4.9,
        readTime: '15 min',
        updated: '2 days ago',
        image: '/api/placeholder/300/200',
        tags: ['React', 'Hooks', 'JavaScript']
      },
      {
        id: 2,
        title: 'Node.js Performance Optimization',
        description: 'Advanced techniques for optimizing Node.js applications',
        category: 'Backend',
        views: '32.1K',
        rating: 4.8,
        readTime: '20 min',
        updated: '1 week ago',
        image: '/api/placeholder/300/200',
        tags: ['Node.js', 'Performance', 'Backend']
      },
      {
        id: 3,
        title: 'Docker Container Best Practices',
        description: 'Essential practices for containerizing applications',
        category: 'DevOps',
        views: '28.7K',
        rating: 4.7,
        readTime: '12 min',
        updated: '3 days ago',
        image: '/api/placeholder/300/200',
        tags: ['Docker', 'DevOps', 'Containers']
      },
      {
        id: 4,
        title: 'GraphQL API Design Patterns',
        description: 'Modern patterns for designing scalable GraphQL APIs',
        category: 'API',
        views: '19.8K',
        rating: 4.6,
        readTime: '18 min',
        updated: '5 days ago',
        image: '/api/placeholder/300/200',
        tags: ['GraphQL', 'API', 'Design Patterns']
      }
    ]
  };

  const handleItemClick = (item: any) => {
    const basePath = activeTab === 'tools' ? '/tools' : 
                    activeTab === 'challenges' ? '/challenges' : '/docs';
    router.push(`${basePath}/${item.id}`);
  };

  const renderCard = (item: any) => {
    return (
      <motion.div
        key={item.id}
        className="group relative bg-white dark:bg-accent-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-accent-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 cursor-pointer"
        onClick={() => handleItemClick(item)}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Image/Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-accent-700 dark:to-accent-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20"></div>
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="px-2 py-1 bg-white/90 dark:bg-accent-800/90 text-xs font-semibold text-accent-700 dark:text-gray-300 rounded-full">
              {item.category}
            </span>
            {(item.trending || activeTab === 'tools') && (
              <span className="px-2 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </span>
            )}
          </div>
          {activeTab === 'challenges' && item.prize && (
            <div className="absolute top-4 right-4 bg-secondary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {item.prize}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-accent-800 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <p className="text-accent-600 dark:text-gray-300 mb-4 line-clamp-2">
            {item.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-accent-500 dark:text-gray-400">
              {activeTab === 'tools' && (
                <>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {item.users}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {item.rating}
                  </div>
                </>
              )}
              {activeTab === 'challenges' && (
                <>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {item.participants}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.duration}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    item.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.difficulty}
                  </span>
                </>
              )}
              {activeTab === 'docs' && (
                <>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {item.views}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.readTime}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {item.rating}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-600 hover:text-primary-700 p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform"
            >
              {activeTab === 'tools' ? 'Try Tool' : 
               activeTab === 'challenges' ? 'Join Challenge' : 'Read More'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-400 hover:text-red-500">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-20 bg-white dark:bg-accent-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-accent-800 dark:text-white mb-6">
            What's{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">
              Trending
            </span>
          </h2>
          <p className="text-xl text-accent-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the most popular tools, featured challenges, and trending documentation in our community
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex bg-gray-100 dark:bg-accent-800 rounded-2xl p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-accent-600 dark:text-gray-300 hover:text-primary-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {trendingData[activeTab as keyof typeof trendingData].map(renderCard)}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={() => router.push(`/${activeTab}`)}
            variant="outline"
            size="lg"
            className="border-2 border-primary-300 text-primary-600 hover:bg-primary-50 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/20 px-8 py-3 rounded-xl font-semibold"
          >
            View All {tabs.find(t => t.id === activeTab)?.name}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;
