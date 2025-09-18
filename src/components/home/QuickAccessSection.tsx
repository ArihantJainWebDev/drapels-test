'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { 
  Wrench, 
  BookOpen, 
  Trophy, 
  Users, 
  ShoppingCart, 
  User,
  ArrowRight
} from 'lucide-react';

interface QuickAccessSectionProps {
  user?: any;
  t?: (key: string) => string;
}

const QuickAccessSection = ({ user, t }: QuickAccessSectionProps) => {
  const router = useRouter();

  const categories = [
    {
      id: 'tools',
      title: 'Tools',
      description: 'Developer tools and utilities to boost your productivity',
      icon: Wrench,
      href: '/tools',
      color: 'primary',
      stats: '50+ Tools',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      id: 'docs',
      title: 'Docs',
      description: 'Comprehensive documentation and learning resources',
      icon: BookOpen,
      href: '/docs',
      color: 'secondary',
      stats: '1000+ Articles',
      gradient: 'from-secondary-600 to-secondary-700'
    },
    {
      id: 'challenges',
      title: 'Challenges',
      description: 'Coding challenges and competitions to test your skills',
      icon: Trophy,
      href: '/challenges',
      color: 'accent',
      stats: '200+ Challenges',
      gradient: 'from-accent-600 to-accent-700'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with developers and share knowledge',
      icon: Users,
      href: '/community',
      color: 'primary',
      stats: '50K+ Members',
      gradient: 'from-primary-600 to-primary-700'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Discover and share developer resources and templates',
      icon: ShoppingCart,
      href: '/marketplace',
      color: 'secondary',
      stats: '300+ Resources',
      gradient: 'from-secondary-700 to-secondary-800'
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your account and track your progress',
      icon: User,
      href: user ? '/profile' : '/login',
      color: 'accent',
      stats: user ? 'Your Dashboard' : 'Get Started',
      gradient: 'from-accent-700 to-accent-800'
    }
  ];

  const handleCategoryClick = (category: typeof categories[0]) => {
    if (category.id === 'profile' && !user) {
      router.push('/login');
    } else {
      router.push(category.href);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
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
    <section className="py-20 bg-white dark:bg-accent-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-accent-800 dark:text-white mb-6">
            Everything You Need in{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">
              One Place
            </span>
          </h2>
          <p className="text-xl text-accent-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive ecosystem designed for developers at every stage of their journey
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="group relative"
              >
                <div 
                  onClick={() => handleCategoryClick(category)}
                  className="relative bg-white dark:bg-accent-800 rounded-2xl p-8 border border-gray-200 dark:border-accent-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 cursor-pointer overflow-hidden"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon and Stats */}
                  <div className="relative flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                        {category.stats}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-accent-800 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-accent-600 dark:text-gray-300 leading-relaxed mb-6">
                      {category.description}
                    </p>
                    
                    {/* Action Button */}
                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span className="mr-2">
                        {category.id === 'profile' && !user ? 'Sign In' : 'Explore'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Border Glow on Hover */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default QuickAccessSection;
