'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageCircle, 
  Trophy, 
  TrendingUp, 
  Star, 
  Clock, 
  ArrowRight,
  Heart,
  Share2,
  Eye,
  Award,
  Zap,
  Code
} from 'lucide-react';

interface CommunitySectionProps {
  user?: any;
  t?: (key: string) => string;
}

const CommunitySection = ({ user, t }: CommunitySectionProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('discussions');

  const tabs = [
    { id: 'discussions', name: 'Latest Discussions', icon: MessageCircle },
    { id: 'leaderboard', name: 'Top Developers', icon: Trophy },
    { id: 'achievements', name: 'Recent Achievements', icon: Award }
  ];

  const communityStats = [
    { icon: Users, value: '10K+', label: 'Active Members', color: 'bg-primary-500' },
    { icon: MessageCircle, value: '50K+', label: 'Discussions', color: 'bg-accent-500' },
    { icon: Trophy, value: '1K+', label: 'Competitions', color: 'bg-warning-500' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate', color: 'bg-success-500' },
  ];

  const discussions = [
    {
      id: 1,
      title: 'Best practices for React performance optimization',
      author: 'Sarah Chen',
      avatar: 'SC',
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
      avatar: 'MR',
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
      avatar: 'AK',
      category: 'DevOps',
      replies: 31,
      likes: 67,
      views: 1500,
      timeAgo: '6 hours ago',
      isHot: true,
      tags: ['Docker', 'Kubernetes', 'DevOps']
    }
  ];

  const leaderboard = [
    {
      id: 1,
      rank: 1,
      name: 'David Park',
      avatar: 'DP',
      points: 15420,
      badge: 'Expert',
      badgeColor: 'bg-warning-500',
      contributions: 156,
      streak: 45,
      specialties: ['React', 'Node.js', 'TypeScript']
    },
    {
      id: 2,
      rank: 2,
      name: 'Lisa Zhang',
      avatar: 'LZ',
      points: 14280,
      badge: 'Expert',
      badgeColor: 'bg-warning-500',
      contributions: 142,
      streak: 38,
      specialties: ['Python', 'ML', 'Data Science']
    },
    {
      id: 3,
      rank: 3,
      name: 'James Miller',
      avatar: 'JM',
      points: 13150,
      badge: 'Advanced',
      badgeColor: 'bg-primary-500',
      contributions: 128,
      streak: 29,
      specialties: ['Go', 'Microservices', 'Cloud']
    }
  ];

  const achievements = [
    {
      id: 1,
      user: 'Alex Thompson',
      avatar: 'AT',
      achievement: 'Code Master',
      description: 'Completed 100 coding challenges',
      icon: Code,
      timeAgo: '1 hour ago',
      rarity: 'Rare',
      color: 'text-primary-600'
    },
    {
      id: 2,
      user: 'Sophie Lee',
      avatar: 'SL',
      achievement: 'Community Helper',
      description: 'Helped 50+ developers with solutions',
      icon: Users,
      timeAgo: '3 hours ago',
      rarity: 'Epic',
      color: 'text-warning-600'
    },
    {
      id: 3,
      user: 'Ryan Foster',
      avatar: 'RF',
      achievement: 'Speed Demon',
      description: 'Solved 10 challenges in under 1 hour',
      icon: Zap,
      timeAgo: '5 hours ago',
      rarity: 'Legendary',
      color: 'text-accent-600'
    }
  ];

  const recentActivity = [
    {
      user: 'Alex Chen',
      action: 'solved "Binary Tree Traversal"',
      time: '2 min ago',
      avatar: 'AC',
      type: 'achievement'
    },
    {
      user: 'Sarah Kim',
      action: 'started discussion on "React Hooks"',
      time: '5 min ago',
      avatar: 'SK',
      type: 'discussion'
    },
    {
      user: 'Mike Johnson',
      action: 'completed AI Fundamentals roadmap',
      time: '10 min ago',
      avatar: 'MJ',
      type: 'completion'
    },
    {
      user: 'Emma Davis',
      action: 'won Weekly Coding Challenge',
      time: '15 min ago',
      avatar: 'ED',
      type: 'achievement'
    },
  ];

  const handleDiscussionClick = (discussion: any) => {
    router.push(`/community/discussions/${discussion.id}`);
  };

  const handleUserClick = (userId: number) => {
    router.push(`/community/users/${userId}`);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return Trophy;
      case 'discussion':
        return MessageCircle;
      case 'completion':
        return Star;
      default:
        return Users;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'text-warning-500';
      case 'discussion':
        return 'text-accent-500';
      case 'completion':
        return 'text-success-500';
      default:
        return 'text-primary-500';
    }
  };

  const renderDiscussions = () => (
    <div className="space-y-3">
      {discussions.slice(0, 3).map((discussion) => (
        <motion.div
          key={discussion.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-lg"
          onClick={() => handleDiscussionClick(discussion)}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {discussion.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start space-x-2 mb-1">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
                  {discussion.title}
                </h3>
                {discussion.isHot && (
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full flex items-center flex-shrink-0">
                    🔥 <span className="hidden sm:inline ml-1">Hot</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-gray-500 dark:text-gray-400 mb-2 flex-wrap">
                <span className="truncate">by {discussion.author}</span>
                <span className="hidden sm:inline">in {discussion.category}</span>
                <span>{discussion.timeAgo}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{discussion.replies}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{discussion.likes}</span>
                  </div>
                  <div className="hidden sm:flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{discussion.views}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {discussion.tags.slice(0, window.innerWidth < 640 ? 1 : 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
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
          className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-lg"
          onClick={() => handleUserClick(user.id)}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                user.rank === 1 ? 'bg-warning-500' :
                user.rank === 2 ? 'bg-gray-400' :
                user.rank === 3 ? 'bg-warning-600' :
                'bg-primary-500'
              }`}>
                {user.rank}
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.avatar}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1 flex-wrap">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {user.name}
                </h3>
                <span className={`px-2 py-1 ${user.badgeColor} text-white text-xs font-semibold rounded-full`}>
                  {user.badge}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                {user.specialties.slice(0, window.innerWidth < 640 ? 2 : 3).map((specialty) => (
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
              <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                {user.points.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">points</div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end space-y-1 sm:space-y-0 sm:space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">{user.contributions} contributions</span>
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
            className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-lg"
            onClick={() => handleUserClick(achievement.id)}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {achievement.avatar}
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${achievement.color} bg-opacity-10`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${achievement.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {achievement.user}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    earned
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {achievement.achievement}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center space-x-2 sm:space-x-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                  <span>{achievement.timeAgo}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    achievement.rarity === 'Legendary' ? 'bg-warning-100 text-warning-700' :
                    achievement.rarity === 'Epic' ? 'bg-primary-100 text-primary-700' :
                    'bg-accent-100 text-accent-700'
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section id="community" className="py-16 bg-gradient-to-br from-gray-50 to-primary-50/20 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-2xl md:text-3xl lg:text-4xl font-poppins font-bold mb-3"
            variants={itemVariants}
          >
            Join Our{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Thriving Community
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Connect with like-minded developers, share knowledge, and grow together in our vibrant ecosystem
          </motion.p>
        </motion.div>

        {/* Community Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {communityStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className={`inline-flex p-1.5 sm:p-2 ${stat.color} rounded-lg mb-2 sm:mb-3 shadow-lg`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 sm:p-1.5 border border-gray-200 dark:border-gray-700 shadow-lg overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">{tab.name}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {activeTab === 'discussions' && renderDiscussions()}
          {activeTab === 'leaderboard' && renderLeaderboard()}
          {activeTab === 'achievements' && renderAchievements()}
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-12"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-poppins font-semibold text-gray-900 dark:text-white">
              Live Activity Feed
            </h3>
            <div className="flex items-center space-x-2 text-success-500">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type);
              const iconColor = getActivityColor(activity.type);
              
              return (
                <motion.div
                  key={index}
                  className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg flex-shrink-0">
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {activity.user}
                      </span>
                      <ActivityIcon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {activity.action}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-center text-accent-600 hover:text-accent-700 font-medium transition-colors duration-200 py-2 rounded-lg hover:bg-accent-50 dark:hover:bg-accent-900/20">
              View All Activity
            </button>
          </div>
        </motion.div>

        {/* Join Community CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={() => router.push('/community')}
            className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold px-6 py-3 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Join the Community
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
