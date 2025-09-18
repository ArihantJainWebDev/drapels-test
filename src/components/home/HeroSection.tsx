'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Code, BrainCircuit, Bot, BookOpen, Briefcase, Mail, Users, BookMarked, FileText, Building2, ArrowRight, Sparkles, Zap, Target, Award, TrendingUp, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

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
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 min-h-screen">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Header */}
        <motion.div 
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 100K+ developers worldwide
            </span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">
              Build. Collaborate. Grow
            </span>{" "}
            <br className="hidden md:block" />
            <span className="relative text-accent-800 dark:text-white">
              with Drapels.
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-primary-300/30 to-secondary-300/30 rounded-full opacity-60 -z-10"></div>
            </span>
          </motion.h1>
          
          <motion.p 
            className="max-w-3xl mx-auto text-xl text-accent-600 dark:text-gray-300 mb-10 leading-relaxed"
            variants={itemVariants}
          >
            Your ecosystem for developer tools, docs, challenges, and community – all in one place.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            variants={itemVariants}
          >
            <Button 
              onClick={() => goOrLogin("/get-started")}
              className="group bg-primary-500 hover:bg-primary-600 text-white font-semibold px-10 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/20"
              size="lg"
            >
              Get Started
              <Rocket className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => goOrLogin("/challenges")}
              className="group bg-secondary-700 hover:bg-secondary-800 text-white font-semibold px-10 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-secondary/20"
              size="lg"
            >
              Explore Challenges
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;