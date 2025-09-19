'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Clock, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Code, 
  Trophy, 
  Target,
  ArrowRight,
  Play,
  Bookmark,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react';

interface PersonalizedFeedSectionProps {
  user?: any;
  t?: (key: string) => string;
}

const PersonalizedFeedSection = ({ user, t }: PersonalizedFeedSectionProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('recommended');

  if (!user) {
    return null; // Don't show this section if user is not logged in
  }

  const tabs = [
    { id: 'recommended', name: 'Recommended for You', icon: Star },
    { id: 'recent', name: 'Your Recent Activity', icon: Clock },
    { id: 'progress', name: 'Your Progress', icon: BarChart3 }
  ];

  const recommendedItems = [
    {
      id: 1,
      type: 'tool',
      title: 'Advanced React Debugger',
      description: 'Based on your React projects, this tool can help debug complex state issues',
      category: 'Development Tools',
      matchReason: 'Matches your React expertise',
      rating: 4.8,
      users: '12K+',
      tags: ['React', 'Debugging', 'Development'],
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      type: 'challenge',
      title: 'Full-Stack Authentication System',
      description: 'Build a complete auth system with JWT, refresh tokens, and role-based access',
      category: 'Full-Stack Challenge',
      matchReason: 'Perfect for your skill level',
      participants: '1.2K',
      duration: '1 week',
      prize: '$2,500',
      tags: ['Authentication', 'JWT', 'Security'],
      difficulty: 'Advanced'
    },
    {
      id: 3,
      type: 'doc',
      title: 'TypeScript Best Practices 2024',
      description: 'Latest TypeScript patterns and practices for enterprise applications',
      category: 'Documentation',
      matchReason: 'Trending in your interests',
      views: '25K',
      readTime: '15 min',
      updated: '2 days ago',
      tags: ['TypeScript', 'Best Practices', 'Enterprise'],
      difficulty: 'Intermediate'
    },
    {
      id: 4,
      type: 'tool',
      title: 'API Performance Monitor',
      description: 'Monitor and optimize your API performance with real-time analytics',
      category: 'Monitoring',
      matchReason: 'Based on your backend projects',
      rating: 4.7,
      users: '8K+',
      tags: ['API', 'Performance', 'Monitoring'],
      difficulty: 'Advanced'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'challenge_completed',
      title: 'React Component Library Challenge',
      action: 'Completed',
      timeAgo: '2 hours ago',
      score: 95,
      rank: 12,
      icon: Trophy,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'tool_used',
      title: 'Code Formatter Pro',
      action: 'Used',
      timeAgo: '1 day ago',
      duration: '45 min',
      icon: Code,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'doc_read',
      title: 'Node.js Performance Guide',
      action: 'Read',
      timeAgo: '2 days ago',
      progress: 80,
      icon: BookOpen,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'challenge_joined',
      title: 'AI Chatbot Competition',
      action: 'Joined',
      timeAgo: '3 days ago',
      status: 'In Progress',
      icon: Target,
      color: 'text-orange-600'
    },
    {
      id: 5,
      type: 'achievement_earned',
      title: 'Code Master Badge',
      action: 'Earned',
      timeAgo: '1 week ago',
      rarity: 'Rare',
      icon: Award,
      color: 'text-yellow-600'
    }
  ];

  const progressData = {
    currentStreak: 15,
    totalPoints: 8420,
    completedChallenges: 23,
    toolsUsed: 45,
    docsRead: 67,
    rank: 'Advanced Developer',
    nextRank: 'Expert Developer',
    progressToNext: 75,
    recentBadges: [
      { name: 'React Master', icon: '⚛️', earned: '2 days ago' },
      { name: 'API Expert', icon: '🔌', earned: '1 week ago' },
      { name: 'Code Reviewer', icon: '👀', earned: '2 weeks ago' }
    ],
    skillProgress: [
      { skill: 'React', level: 85, color: 'bg-blue-500' },
      { skill: 'Node.js', level: 78, color: 'bg-green-500' },
      { skill: 'TypeScript', level: 72, color: 'bg-purple-500' },
      { skill: 'Python', level: 65, color: 'bg-yellow-500' }
    ]
  };

  const handleItemClick = (item: any) => {
    const basePath = item.type === 'tool' ? '/tools' : 
                    item.type === 'challenge' ? '/challenges' : '/docs';
    router.push(`${basePath}/${item.id}`);
  };

  const renderRecommended = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {recommendedItems.map((item) => (
        <motion.div
          key={item.id}
          className="bg-white dark:bg-accent-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-accent-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 cursor-pointer group"
          onClick={() => handleItemClick(item)}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                item.type === 'tool' ? 'bg-blue-100 text-blue-700' :
                item.type === 'challenge' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {item.type === 'tool' ? 'Tool' : item.type === 'challenge' ? 'Challenge' : 'Doc'}
              </span>
              <span className="text-xs text-primary-600 dark:text-primary-400 font-medium hidden sm:inline">
                {item.matchReason}
              </span>
            </div>
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-primary-500 cursor-pointer flex-shrink-0" />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-accent-800 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-sm sm:text-base text-accent-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {item.tags.slice(0, window.innerWidth < 640 ? 2 : 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-accent-500 dark:text-gray-400 flex-wrap">
              {item.type === 'tool' && (
                <>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-500" />
                    {item.rating}
                  </div>
                  <span className="hidden sm:inline">{item.users} users</span>
                </>
              )}
              {item.type === 'challenge' && (
                <>
                  <span>{item.participants} joined</span>
                  <span className="hidden sm:inline">{item.duration}</span>
                  <span className="font-semibold text-secondary-600">{item.prize}</span>
                </>
              )}
              {item.type === 'doc' && (
                <>
                  <span>{item.views} views</span>
                  <span className="hidden sm:inline">{item.readTime} read</span>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 p-1 sm:p-0 h-auto text-xs sm:text-sm">
              <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {item.type === 'tool' ? 'Try' : item.type === 'challenge' ? 'Join' : 'Read'}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderRecentActivity = () => (
    <div className="space-y-3 sm:space-y-4">
      {recentActivity.map((activity) => {
        const Icon = activity.icon;
        return (
          <motion.div
            key={activity.id}
            className="bg-white dark:bg-accent-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-accent-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${activity.color} bg-opacity-10 flex-shrink-0`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1 flex-wrap">
                  <span className="text-sm sm:text-base text-accent-600 dark:text-gray-300">{activity.action}</span>
                  <span className="font-semibold text-sm sm:text-base text-accent-800 dark:text-white line-clamp-1">{activity.title}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-accent-500 dark:text-gray-400 flex-wrap gap-1">
                  <span>{activity.timeAgo}</span>
                  {activity.score && <span className="hidden sm:inline">Score: {activity.score}/100</span>}
                  {activity.rank && <span>Rank: #{activity.rank}</span>}
                  {activity.duration && <span className="hidden sm:inline">Duration: {activity.duration}</span>}
                  {activity.progress && <span className="hidden sm:inline">Progress: {activity.progress}%</span>}
                  {activity.status && <span>Status: {activity.status}</span>}
                  {activity.rarity && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      {activity.rarity}
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderProgress = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Stats Overview */}
      <div className="bg-white dark:bg-accent-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-accent-700">
        <h3 className="text-lg sm:text-xl font-semibold text-accent-800 dark:text-white mb-4 sm:mb-6">Your Stats</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
              {progressData.currentStreak}
            </div>
            <div className="text-xs sm:text-sm text-accent-500 dark:text-gray-400">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-secondary-600 dark:text-secondary-400">
              {progressData.totalPoints.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-accent-500 dark:text-gray-400">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {progressData.completedChallenges}
            </div>
            <div className="text-xs sm:text-sm text-accent-500 dark:text-gray-400">Challenges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {progressData.toolsUsed}
            </div>
            <div className="text-xs sm:text-sm text-accent-500 dark:text-gray-400">Tools Used</div>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-accent-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-accent-700 dark:text-gray-300">
              {progressData.rank}
            </span>
            <span className="text-xs sm:text-sm text-accent-500 dark:text-gray-400">
              {progressData.progressToNext}% to {progressData.nextRank}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-accent-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressData.progressToNext}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="bg-white dark:bg-accent-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-accent-700">
        <h3 className="text-lg sm:text-xl font-semibold text-accent-800 dark:text-white mb-4 sm:mb-6">Recent Badges</h3>
        <div className="space-y-3 sm:space-y-4">
          {progressData.recentBadges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="text-xl sm:text-2xl">{badge.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base text-accent-800 dark:text-white">{badge.name}</div>
                <div className="text-xs sm:text-sm text-accent-500 dark:text-gray-400">{badge.earned}</div>
              </div>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Skill Progress */}
      <div className="lg:col-span-2 bg-white dark:bg-accent-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-accent-700">
        <h3 className="text-lg sm:text-xl font-semibold text-accent-800 dark:text-white mb-4 sm:mb-6">Skill Progress</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {progressData.skillProgress.map((skill) => (
            <div key={skill.skill}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm sm:text-base font-medium text-accent-700 dark:text-gray-300">{skill.skill}</span>
                <span className="text-xs sm:text-sm text-accent-500 dark:text-gray-400">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-accent-700 rounded-full h-2">
                <div 
                  className={`${skill.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50/30 to-accent-50/30 dark:from-accent-900/30 dark:to-accent-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent-800 dark:text-white mb-4 sm:mb-6">
            Your{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-accent-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Personalized content based on your interests, recent activity, and learning progress
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex justify-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex bg-white dark:bg-accent-800 rounded-2xl p-1 sm:p-2 border border-gray-200 dark:border-accent-700 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-accent-600 dark:text-gray-300 hover:text-primary-600'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">{tab.name}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {activeTab === 'recommended' && renderRecommended()}
          {activeTab === 'recent' && renderRecentActivity()}
          {activeTab === 'progress' && renderProgress()}
        </motion.div>
      </div>
    </section>
  );
};

export default PersonalizedFeedSection;
