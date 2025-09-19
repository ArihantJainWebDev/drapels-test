'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Code, BrainCircuit, Bot, BookOpen, Briefcase, Mail, Users, BookMarked, FileText, Building2, ArrowRight, Sparkles, Zap, Target, Award, TrendingUp, Rocket, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  user: any;
  t: (key: string) => string;
}

const HeroSection = ({ user, t }: HeroSectionProps) => {
  const router = useRouter();

  const mainFeatures = [
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "AI-Powered Learning",
      description: "Smart algorithms adapt to your learning style, providing personalized challenges and instant feedback",
      color: "primary",
      stats: "50K+ Problems Solved",
      bgGradient: "from-primary-100 to-primary-50"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Live Coding Environment",
      description: "Practice in our advanced IDE with real-time collaboration and 40+ programming languages",
      color: "secondary",
      stats: "15+ Languages",
      bgGradient: "from-secondary-100 to-secondary-50"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Interview Simulation",
      description: "Experience real tech interviews with AI-powered mock sessions from top companies",
      color: "accent",
      stats: "500+ Companies",
      bgGradient: "from-accent-100 to-accent-50"
    }
  ];

  const aiTools = [
    { 
      name: 'Neuron DSA Solver', 
      icon: <BrainCircuit className="w-5 h-5" />, 
      tag: 'AI-Powered',
      description: 'Solve complex algorithms with AI guidance'
    },
    { 
      name: 'Mock Interview AI', 
      icon: <Bot className="w-5 h-5" />, 
      tag: 'Interactive',
      description: 'Practice with realistic interview scenarios'
    },
    { 
      name: 'Smart Quiz Engine', 
      icon: <Sparkles className="w-5 h-5" />, 
      tag: 'Adaptive',
      description: 'Personalized quizzes that adapt to your level'
    },
    { 
      name: 'Code Review AI', 
      icon: <Zap className="w-5 h-5" />, 
      tag: 'Instant',
      description: 'Get immediate feedback on your code quality'
    },
  ];

  const practiceTools = [
    { 
      name: 'Cloud Compiler', 
      icon: <Code className="w-5 h-5" />, 
      users: '25K+',
      description: 'Multi-language compiler with zero setup'
    },
    { 
      name: 'Problem Bank', 
      icon: <FileText className="w-5 h-5" />, 
      users: '10K+',
      description: 'Curated problems from top tech companies'
    },
    { 
      name: 'Learning Paths', 
      icon: <TrendingUp className="w-5 h-5" />, 
      users: '15K+',
      description: 'Structured courses for systematic learning'
    },
  ];

  const careerTools = [
    { 
      name: 'Company Insights', 
      icon: <Building2 className="w-5 h-5" />, 
      badge: 'Hot',
      premium: false
    },
    { 
      name: 'Resume Builder', 
      icon: <FileText className="w-5 h-5" />, 
      badge: 'New',
      premium: true
    },
    { 
      name: 'Email Templates', 
      icon: <Mail className="w-5 h-5" />, 
      badge: '',
      premium: false
    },
    { 
      name: 'Peer Network', 
      icon: <Users className="w-5 h-5" />, 
      badge: 'Trending',
      premium: false
    },
  ];

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
    <section id="home" className="relative overflow-hidden pt-32 pb-16 bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob dark:bg-primary/30 dark:opacity-40"></div>
        <div className="absolute top-40 right-80 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 dark:bg-accent/30 dark:opacity-40"></div>
        <div className="absolute -bottom-20 left-20 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000 dark:bg-secondary/30 dark:opacity-40"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-32 left-1/4 w-4 h-4 bg-primary/40 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-64 right-1/3 w-6 h-6 bg-accent/40 rounded-full opacity-30 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-secondary/40 rounded-full opacity-25 animate-float animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div 
            className="space-y-8 animate-fade-in"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-4">
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 px-4 py-2 rounded-full border border-primary/20">
                  <Sparkles className="w-4 h-4 text-accent-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI-Powered Developer Ecosystem
                  </span>
                </div>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Build. Collaborate. Grow
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">with Drapels</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed"
                variants={itemVariants}
              >
                Experience the future of development with our revolutionary AI ecosystem. 
                Master tools, solve challenges, and launch your career with personalized guidance.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Button
                onClick={() => goOrLogin("/get-started")}
                className="group bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/20 flex items-center justify-center space-x-2"
                size="lg"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              
              <Button
                onClick={() => goOrLogin("/tools")}
                variant="outline"
                className="group border-2 border-accent-600 text-accent-600 hover:bg-accent-600 hover:text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                size="lg"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Explore Ecosystem</span>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap gap-8 pt-8"
              variants={itemVariants}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - AI Learning Engine Illustration */}
          <motion.div 
            className="relative animate-slide-up"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-500 rounded-2xl opacity-20 animate-pulse-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-400 rounded-xl opacity-20 animate-bounce-slow"></div>
              
              {/* Main illustration area */}
              <div className="aspect-square bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                
                {/* Central content */}
                <div className="relative text-center space-y-6 z-10">
                  <motion.div 
                    className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
                    animate={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <BrainCircuit className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <div className="text-lg font-poppins font-semibold text-gray-800 dark:text-gray-200">
                      Drapels AI Engine
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Personalized • Adaptive • Intelligent
                    </div>
                  </div>
                  
                  {/* Feature indicators */}
                  <div className="flex justify-center space-x-4 pt-4">
                    <motion.div 
                      className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Code className="w-3 h-3 text-primary-600" />
                      <span className="text-xs text-primary-600 font-medium">Tools</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <Target className="w-3 h-3 text-accent-600" />
                      <span className="text-xs text-accent-600 font-medium">Challenges</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-2 bg-secondary/10 px-3 py-1 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      <Users className="w-3 h-3 text-secondary-600" />
                      <span className="text-xs text-secondary-600 font-medium">Community</span>
                    </motion.div>
                  </div>
                </div>
                
                {/* Floating particles */}
                <motion.div 
                  className="absolute top-8 right-8 w-3 h-3 bg-primary/40 rounded-full"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute bottom-12 left-8 w-2 h-2 bg-accent/40 rounded-full"
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.div 
                  className="absolute top-1/2 right-12 w-4 h-4 bg-secondary/30 rounded-full"
                  animate={{ 
                    x: [0, 8, 0],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;