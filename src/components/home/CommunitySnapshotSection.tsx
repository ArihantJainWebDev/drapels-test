'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Award, 
  Star, 
  Clock, 
  ArrowRight,
  Heart,
  Share2,
  Eye,
  Trophy,
  Zap,
  Code
} from 'lucide-react';

interface CommunitySnapshotSectionProps {
  user?: any;
  t?: (key: string) => string;
}

const CommunitySnapshotSection = ({ user, t }: CommunitySnapshotSectionProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('discussions');

  const tabs = [
    { id: 'discussions', name: 'Latest Discussions', icon: MessageCircle },
    { id: 'leaderboard', name: 'Top Developers', icon: Trophy },
    { id: 'achievements', name: 'Recent Achievements', icon: Award }
  ];

  const discussions = [
    {
      id: 1,
      title: 'Best practices for React performance optimization',
      author: 'Sarah Chen',
      avatar: '/api/placeholder/40/40',
      category: 'React',
      replies: 23,
      likes: 45,
      views: 1200,
      timeAgo: '2 hours ago',
      isHot: true,
      tags: ['React', 'Performance', 'Optimization']
    },
    {
      id: 2,
      title: 'How to handle authentication in Next.js 14?',
      author: 'Mike Rodriguez',
      avatar: '/api/placeholder/40/40',
      category: 'Next.js',
      replies: 18,
      likes: 32,
      views: 890,
      timeAgo: '4 hours ago',
      isHot: false,
      tags: ['Next.js', 'Authentication', 'Security']
    },
    {
      id: 3,
      title: 'Docker vs Kubernetes: When to use what?',
      author: 'Alex Kumar',
      avatar: '/api/placeholder/40/40',
      category: 'DevOps',
      replies: 31,
      likes: 67,
      views: 1500,
      timeAgo: '6 hours ago',
      isHot: true,
      tags: ['Docker', 'Kubernetes', 'DevOps']
    },
    {
      id: 4,
      title: 'GraphQL vs REST: A comprehensive comparison',
      author: 'Emma Wilson',
      avatar: '/api/placeholder/40/40',
      category: 'API',
      replies: 15,
      likes: 28,
      views: 650,
      timeAgo: '8 hours ago',
      isHot: false,
      tags: ['GraphQL', 'REST', 'API Design']
    }
  ];

  const leaderboard = [
    {
      id: 1,
      rank: 1,
      name: 'David Park',
      avatar: '/api/placeholder/50/50',
      points: 15420,
      badge: 'Expert',
      badgeColor: 'bg-yellow-500',
      contributions: 156,
      streak: 45,
      specialties: ['React', 'Node.js', 'TypeScript']
    },
    {
      id: 2,
      rank: 2,
      name: 'Lisa Zhang',
      avatar: '/api/placeholder/50/50',
      points: 14280,
      badge: 'Expert',
      badgeColor: 'bg-yellow-500',
      contributions: 142,
      streak: 38,
      specialties: ['Python', 'Machine Learning', 'Data Science']
    },
    {
      id: 3,
      rank: 3,
      name: 'James Miller',
      avatar: '/api/placeholder/50/50',
      points: 13150,
      badge: 'Advanced',
      badgeColor: 'bg-purple-500',
      contributions: 128,
      streak: 29,
      specialties: ['Go', 'Microservices', 'Cloud']
    },
    {
      id: 4,
      rank: 4,
      name: 'Maria Garcia',
      avatar: '/api/placeholder/50/50',
      points: 12890,
      badge: 'Advanced',
      badgeColor: 'bg-purple-500',
      contributions: 134,
      streak: 33,
      specialties: ['Vue.js', 'Frontend', 'UI/UX']
    },
    {
      id: 5,
      rank: 5,
      name: 'Tom Anderson',
      avatar: '/api/placeholder/50/50',
      points: 11760,
      badge: 'Advanced',
      badgeColor: 'bg-purple-500',
      contributions: 119,
      streak: 25,
      specialties: ['Rust', 'Systems', 'Performance']
    }
  ];

  const achievements = [
    {
      id: 1,
      user: 'Alex Thompson',
      avatar: '/api/placeholder/40/40',
      achievement: 'Code Master',
      description: 'Completed 100 coding challenges',
      icon: Code,
      timeAgo: '1 hour ago',
      rarity: 'Rare',
      color: 'text-purple-600'
    },
    {
      id: 2,
      user: 'Sophie Lee',
      avatar: '/api/placeholder/40/40',
      achievement: 'Community Helper',
      description: 'Helped 50+ developers with solutions',
      icon: Users,
      timeAgo: '3 hours ago',
      rarity: 'Epic',
      color: 'text-orange-600'
    },
    {
      id: 3,
      user: 'Ryan Foster',
      avatar: '/api/placeholder/40/40',
      achievement: 'Speed Demon',
      description: 'Solved 10 challenges in under 1 hour',
      icon: Zap,
      timeAgo: '5 hours ago',
      rarity: 'Legendary',
      color: 'text-yellow-600'
    },
    {
      id: 4,
      user: 'Nina Patel',
      avatar: '/api/placeholder/40/40',
      achievement: 'Documentation Pro',
      description: 'Contributed to 25+ documentation articles',
      icon: Star,
      timeAgo: '7 hours ago',
      rarity: 'Rare',
      color: 'text-blue-600'
    }
  ];

  const handleDiscussionClick = (discussion: any) => {
    router.push(`/community/discussions/${discussion.id}`);
  };

  const handleUserClick = (userId: number) => {
    router.push(`/community/users/${userId}`);
  };

  const renderDiscussions = () => (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <motion.div
          key={discussion.id}
          className="bg-white dark:bg-accent-800 rounded-xl p-6 border border-gray-200 dark:border-accent-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 cursor-pointer group"
          onClick={() => handleDiscussionClick(discussion)}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start space-x-4">
            <img
              src={discussion.avatar}
              alt={discussion.author}
              className="w-10 h-10 rounded-full bg-gray-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-accent-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                  {discussion.title}
                </h3>
                {discussion.isHot && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full flex items-center">
                    🔥 Hot
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-accent-500 dark:text-gray-400 mb-3">
                <span>by {discussion.author}</span>
                <span>in {discussion.category}</span>
                <span>{discussion.timeAgo}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {discussion.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-sm text-accent-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {discussion.replies}
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {discussion.likes}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {discussion.views}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-4">
      {leaderboard.map((user) => (
        <motion.div
          key={user.id}
          className="bg-white dark:bg-accent-800 rounded-xl p-6 border border-gray-200 dark:border-accent-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 cursor-pointer group"
          onClick={() => handleUserClick(user.id)}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                user.rank === 1 ? 'bg-yellow-500' :
                user.rank === 2 ? 'bg-gray-400' :
                user.rank === 3 ? 'bg-orange-600' :
                'bg-primary-500'
              }`}>
                {user.rank}
              </div>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full bg-gray-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-accent-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {user.name}
                </h3>
                <span className={`px-2 py-1 ${user.badgeColor} text-white text-xs font-semibold rounded-full`}>
                  {user.badge}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {user.specialties.slice(0, 3).map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 text-xs font-medium rounded-md"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {user.points.toLocaleString()}
              </div>
              <div className="text-sm text-accent-500 dark:text-gray-400">points</div>
              <div className="flex items-center justify-end space-x-3 mt-2 text-xs text-accent-500 dark:text-gray-400">
                <span>{user.contributions} contributions</span>
                <span>{user.streak} day streak</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      {achievements.map((achievement) => {
        const Icon = achievement.icon;
        return (
          <motion.div
            key={achievement.id}
            className="bg-white dark:bg-accent-800 rounded-xl p-6 border border-gray-200 dark:border-accent-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 cursor-pointer group"
            onClick={() => handleUserClick(achievement.id)}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center space-x-4">
              <img
                src={achievement.avatar}
                alt={achievement.user}
                className="w-10 h-10 rounded-full bg-gray-200"
              />
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${achievement.color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${achievement.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-accent-800 dark:text-white">
                    {achievement.user}
                  </h3>
                  <span className="text-sm text-accent-500 dark:text-gray-400">
                    earned
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {achievement.achievement}
                  </span>
                </div>
                <p className="text-accent-600 dark:text-gray-300 mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center space-x-3 text-sm text-accent-500 dark:text-gray-400">
                  <span>{achievement.timeAgo}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    achievement.rarity === 'Legendary' ? 'bg-yellow-100 text-yellow-700' :
                    achievement.rarity === 'Epic' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {achievement.rarity}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-secondary-50/30 to-primary-50/30 dark:from-accent-800/50 dark:to-accent-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-accent-800 dark:text-white mb-6">
            Community{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">
              Pulse
            </span>
          </h2>
          <p className="text-xl text-accent-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay connected with the latest discussions, top contributors, and recent achievements in our vibrant developer community
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex bg-white dark:bg-accent-800 rounded-2xl p-2 border border-gray-200 dark:border-accent-700">
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
                  <span className="hidden sm:inline">{tab.name}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {activeTab === 'discussions' && renderDiscussions()}
          {activeTab === 'leaderboard' && renderLeaderboard()}
          {activeTab === 'achievements' && renderAchievements()}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={() => router.push('/community')}
            variant="outline"
            size="lg"
            className="border-2 border-primary-300 text-primary-600 hover:bg-primary-50 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/20 px-8 py-3 rounded-xl font-semibold"
          >
            Join the Community
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySnapshotSection;
