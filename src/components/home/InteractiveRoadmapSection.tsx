'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Target,
  BrainCircuit,
  Code,
  Bot,
  Users,
  Trophy,
  Building2,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  FileText,
  Zap,
  Star,
  Clock,
  MapPin,
  Route
} from 'lucide-react';

interface InteractiveRoadmapSectionProps {
  user?: any;
  t?: (key: string) => string;
}

const InteractiveRoadmapSection = ({ user, t }: InteractiveRoadmapSectionProps) => {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const companies = [
    { name: 'Google', color: 'from-blue-500 to-green-500', logo: '🔍' },
    { name: 'Microsoft', color: 'from-blue-600 to-cyan-500', logo: '🪟' },
    { name: 'Amazon', color: 'from-orange-500 to-yellow-500', logo: '📦' },
    { name: 'Meta', color: 'from-blue-500 to-purple-500', logo: '👥' },
    { name: 'Netflix', color: 'from-red-500 to-pink-500', logo: '🎬' },
    { name: 'Apple', color: 'from-gray-600 to-gray-800', logo: '🍎' }
  ];

  const roles = [
    'Software Engineer',
    'Frontend Developer', 
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer'
  ];

  const roadmapSteps = [
    {
      id: 1,
      title: 'Set Your Goal',
      description: 'Define your target company and role',
      icon: <Target className="w-6 h-6" />,
      tool: 'Goal Setting',
      color: 'from-primary-500 to-primary-600',
      duration: '5 min',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Generate Roadmap',
      description: 'AI creates personalized learning path',
      icon: <BrainCircuit className="w-6 h-6" />,
      tool: 'AI Roadmap Generator',
      color: 'from-accent-500 to-accent-600',
      duration: '2 min',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Learn Fundamentals',
      description: 'Master core concepts and technologies',
      icon: <FileText className="w-6 h-6" />,
      tool: 'Interactive Docs',
      color: 'from-secondary-500 to-secondary-600',
      duration: '4-8 weeks',
      status: 'current'
    },
    {
      id: 4,
      title: 'Practice Coding',
      description: 'Solve problems and build projects',
      icon: <Code className="w-6 h-6" />,
      tool: 'Problem Bank + IDE',
      color: 'from-primary-600 to-accent-500',
      duration: '6-12 weeks',
      status: 'upcoming'
    },
    {
      id: 5,
      title: 'Mock Interviews',
      description: 'Practice with AI interviewer',
      icon: <Bot className="w-6 h-6" />,
      tool: 'AI Interview Simulator',
      color: 'from-accent-600 to-secondary-500',
      duration: '2-4 weeks',
      status: 'upcoming'
    },
    {
      id: 6,
      title: 'Get Community Help',
      description: 'Connect with mentors and peers',
      icon: <Users className="w-6 h-6" />,
      tool: 'Developer Community',
      color: 'from-secondary-600 to-primary-500',
      duration: 'Ongoing',
      status: 'upcoming'
    },
    {
      id: 7,
      title: 'Apply & Land Job',
      description: 'Use career tools to get hired',
      icon: <Trophy className="w-6 h-6" />,
      tool: 'Career Tools',
      color: 'from-primary-500 to-secondary-500',
      duration: '2-6 weeks',
      status: 'upcoming'
    }
  ];

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleStartRoadmap = () => {
    router.push('/roadmap');
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'current':
        return 'bg-primary-500 border-primary-500';
      default:
        return 'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'current':
        return <Play className="w-4 h-4 text-white" />;
      default:
        return <div className="w-2 h-2 bg-white rounded-full" />;
    }
  };

  // Auto-advance demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % roadmapSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-50 to-primary-50/20 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 dark:bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-60 dark:opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/5 dark:bg-accent/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-60 dark:opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary-600 text-sm font-medium mb-4 border border-primary/20">
            <Route className="w-3.5 h-3.5 mr-2" />
            How Drapels Works
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            Your Journey to
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> Dream Job</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            See how Drapels guides you from setting goals to landing your dream job with personalized roadmaps and AI-powered tools
          </p>
        </motion.div>

        {/* Company & Role Selector */}
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 mb-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Company Selection */}
            <div>
              <h3 className="text-lg font-poppins font-semibold text-gray-900 dark:text-white mb-3">
                Choose Your Target Company
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {companies.map((company) => (
                  <motion.button
                    key={company.name}
                    onClick={() => setSelectedCompany(company.name)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      selectedCompany === company.name
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{company.logo}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {company.name}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <h3 className="text-lg font-poppins font-semibold text-gray-900 dark:text-white mb-3">
                Select Your Role
              </h3>
              <div className="space-y-2">
                {roles.slice(0, 4).map((role) => (
                  <motion.button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full p-2 text-left rounded-lg border transition-all duration-300 ${
                      selectedRole === role
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 text-gray-700 dark:text-gray-300'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="text-sm font-medium">{role}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl border border-primary-200/50 dark:border-primary-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Your Goal:</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {selectedRole} at {selectedCompany}
                </div>
              </div>
              <Button
                onClick={handleStartRoadmap}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium px-4 py-2 text-sm rounded-lg transition-all duration-300 hover:scale-105"
              >
                Generate Roadmap
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Interactive Roadmap */}
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-poppins font-semibold text-gray-900 dark:text-white">
              Your Personalized Roadmap
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Estimated: 3-6 months</span>
            </div>
          </div>

          {/* Vertical Zigzag Roadmap */}
          <div className="relative">
            {/* SVG Path for Zigzag */}
            <svg 
              className="absolute left-1/2 transform -translate-x-1/2 w-4 pointer-events-none" 
              style={{ height: `${roadmapSteps.length * 120}px` }}
              viewBox={`0 0 100 ${roadmapSteps.length * 120}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="zigzagGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              {/* Background Path */}
              <path
                d={`M 50 20 ${roadmapSteps.map((_, i) => {
                  const y = 20 + i * 120;
                  const x = i % 2 === 0 ? 20 : 80;
                  const nextY = 20 + (i + 1) * 120;
                  const nextX = (i + 1) % 2 === 0 ? 20 : 80;
                  return i < roadmapSteps.length - 1 ? `Q 50 ${y + 60}, ${nextX} ${nextY}` : '';
                }).join(' ')}`}
                stroke="#e5e7eb"
                strokeWidth="3"
                fill="none"
                className="dark:stroke-gray-600"
              />
              {/* Animated Progress Path */}
              <path
                d={`M 50 20 ${roadmapSteps.map((_, i) => {
                  const y = 20 + i * 120;
                  const x = i % 2 === 0 ? 20 : 80;
                  const nextY = 20 + (i + 1) * 120;
                  const nextX = (i + 1) % 2 === 0 ? 20 : 80;
                  return i < roadmapSteps.length - 1 ? `Q 50 ${y + 60}, ${nextX} ${nextY}` : '';
                }).join(' ')}`}
                stroke="url(#zigzagGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="2000"
                strokeDashoffset={2000 - (currentStep / (roadmapSteps.length - 1)) * 2000}
                className="transition-all duration-2000 ease-out"
              />
            </svg>

            {/* Steps */}
            <div className="space-y-8">
              {roadmapSteps.map((step, index) => {
                const status = getStepStatus(index);
                const isActive = index === currentStep;
                const isRight = index % 2 === 1;
                
                return (
                  <motion.div
                    key={step.id}
                    className={`relative flex items-center ${isRight ? 'flex-row-reverse' : 'flex-row'} gap-8`}
                    initial={{ opacity: 0, x: isRight ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                  >
                    {/* Step Content Card */}
                    <motion.div
                      className={`flex-1 max-w-md p-6 rounded-xl shadow-lg border transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 scale-105 shadow-xl' 
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-102'
                      }`}
                      onClick={() => handleStepClick(index)}
                      whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                    >
                      <div className={`${isRight ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          {!isRight && (
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg`}>
                              {step.icon}
                            </div>
                          )}
                          <div className={`flex-1 ${isRight ? 'text-right' : 'text-left'}`}>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                              {step.title}
                            </h4>
                            <div className={`flex items-center gap-2 ${isRight ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {step.duration}
                              </span>
                              {isActive && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </div>
                          {isRight && (
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg`}>
                              {step.icon}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          {step.description}
                        </p>
                        
                        <div className={`flex items-center gap-3 ${isRight ? 'justify-end' : 'justify-start'}`}>
                          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${step.color} text-white`}>
                            {React.cloneElement(step.icon, { className: "w-4 h-4 mr-2" })}
                            {step.tool}
                          </div>
                          
                          {status === 'current' && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push('/tools');
                              }}
                              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              Start Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Center Step Circle */}
                    <motion.div
                      className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-300 ${getStatusColor(status)} ${
                        isActive ? 'scale-110 shadow-lg' : 'hover:scale-105'
                      } z-10 bg-white dark:bg-gray-800`}
                      onClick={() => handleStepClick(index)}
                      whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                    >
                      {getStatusIcon(status)}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-primary-400"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {/* Step Number */}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </div>
                    </motion.div>

                    {/* Spacer for opposite side */}
                    <div className="flex-1 max-w-md"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Success Metrics */}
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Success Rate</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">89% of users land their target role</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">89%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">within 6 months</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={handleStartRoadmap}
            className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Free to start • No credit card required • Join 100K+ developers
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveRoadmapSection;
