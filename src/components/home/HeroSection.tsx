'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, Code, Target, BrainCircuit, Sparkles, Zap, Bot, FileText, TrendingUp, Building2, Mail, Crown, ChevronRight, Award, Book } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  user: any;
  t: (key: string) => string;
}

const HeroSection = ({ user, t }: HeroSectionProps) => {
  const router = useRouter();

  const stats = [
    { number: '100K+', label: 'Active Learners', icon: <Users className="w-5 h-5" /> },
    { number: '50K+', label: 'Problems Solved', icon: <Target className="w-5 h-5" /> },
    { number: '500+', label: 'Companies', icon: <Building2 className="w-5 h-5" /> },
    { number: '95%', label: 'Success Rate', icon: <Award className="w-5 h-5" /> },
  ];

  const goOrLogin = (path: string) => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(path);
    }
  };

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
    <section className="relative min-h-[85vh] bg-gradient-to-br from-white via-primary-50/20 to-accent-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden w-full mx-auto">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob dark:bg-primary/20"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 dark:bg-accent/20"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Column - Main Content */}
          <motion.div 
            className="space-y-6 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary-600 text-sm font-medium border border-primary/20"
              variants={itemVariants}
            >
              <Star className="w-3.5 h-3.5 mr-2" />
              #1 Developer Learning Platform
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-[1.1]"
              variants={itemVariants}
            >
              <span className="text-gray-900 dark:text-white">Build.</span>{" "}
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Collaborate.
              </span>{" "}
              <br />
              <span className="text-gray-900 dark:text-white">Grow with</span>{" "}
              <span className="bg-gradient-to-r from-accent-600 to-secondary-600 bg-clip-text text-transparent">
                Drapels.
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              variants={itemVariants}
            >
              Master coding interviews, build real projects, and accelerate your tech career with AI-powered tools and a thriving developer community.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 pt-2"
              variants={itemVariants}
            >
              <Button
                onClick={() => goOrLogin('/dashboard')}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold px-6 py-3 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                {user ? 'Go to Dashboard' : 'Start Learning Free'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                onClick={() => router.push('/demo')}
                variant="outline"
                className="border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold px-6 py-3 text-base rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Simplified Stats */}
            <motion.div 
              className="flex justify-between items-center pt-8 max-w-md"
              variants={itemVariants}
            >
              {stats.slice(0, 3).map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Features Grid */}
          <motion.div 
            className="relative"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Features Grid */}
            <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-3xl p-8">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { 
                    name: 'Roadmaps', 
                    icon: <TrendingUp className="w-6 h-6" />, 
                    color: 'from-primary-500 to-primary-600',
                    href: '/roadmap',
                    description: 'AI Learning Paths'
                  },
                  { 
                    name: 'DSA Solver', 
                    icon: <BrainCircuit className="w-6 h-6" />, 
                    color: 'from-accent-500 to-accent-600',
                    href: '/tools/dsa-solver',
                    description: 'AI-Powered'
                  },
                  { 
                    name: 'Docs', 
                    icon: <FileText className="w-6 h-6" />, 
                    color: 'from-secondary-500 to-secondary-600',
                    href: '/docs',
                    description: 'Comprehensive'
                  },
                  { 
                    name: 'Problem Bank', 
                    icon: <Code className="w-6 h-6" />, 
                    color: 'from-primary-600 to-accent-500',
                    href: '/tools/problems',
                    description: '10K+ Problems'
                  },
                  { 
                    name: 'Mock Interview', 
                    icon: <Bot className="w-6 h-6" />, 
                    color: 'from-accent-600 to-secondary-500',
                    href: '/tools/mock-interview',
                    description: 'AI Interview'
                  },
                  { 
                    name: 'Community', 
                    icon: <Users className="w-6 h-6" />, 
                    color: 'from-secondary-600 to-primary-500',
                    href: '/community',
                    description: '100K+ Devs'
                  },
                  { 
                    name: 'Compiler', 
                    icon: <Zap className="w-6 h-6" />, 
                    color: 'from-primary-500 to-secondary-500',
                    href: '/tools/compiler',
                    description: 'Cloud IDE'
                  },
                  { 
                    name: 'Career Tools', 
                    icon: <Building2 className="w-6 h-6" />, 
                    color: 'from-accent-500 to-primary-600',
                    href: '/tools/career',
                    description: 'Job Ready'
                  },
                  { 
                    name: 'Courses', 
                    icon: <Book className="w-6 h-6" />, 
                    color: 'from-primary-600 to-accent-500',
                    href: '/courses',
                    description: 'Structured Courses'
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    className="group relative p-4 rounded-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(feature.href)}
                    whileHover={{ y: -4, scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <div className="text-center space-y-3">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mx-auto flex items-center justify-center text-white shadow-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <div>
                        <div className="font-poppins font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {feature.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
              
              {/* Bottom CTA */}
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={() => router.push('/tools')}
                  variant="outline"
                  className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-white/30 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Explore All Features
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-2xl opacity-60 backdrop-blur-sm"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent/10 rounded-xl opacity-60 backdrop-blur-sm"
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="absolute top-1/2 -right-6 w-8 h-8 bg-secondary/10 rounded-lg opacity-40 backdrop-blur-sm"
              animate={{ 
                x: [0, 8, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;