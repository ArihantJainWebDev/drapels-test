'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight,
  BrainCircuit,
  Code,
  Bot,
  Users,
  TrendingUp,
  Building2,
  FileText,
  Zap,
  Play,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';

interface FeaturesShowcaseSectionProps {
  user?: any;
  t?: (key: string) => string;
}

const FeaturesShowcaseSection = ({ user, t }: FeaturesShowcaseSectionProps) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features = [
    {
      id: 1,
      title: 'AI-Powered DSA Solver',
      subtitle: 'Master Data Structures & Algorithms with AI Guidance',
      description: 'Our advanced AI analyzes your coding patterns and provides personalized hints, step-by-step solutions, and optimal approaches to solve complex DSA problems. Get real-time feedback and improve your problem-solving skills.',
      icon: <BrainCircuit className="w-12 h-12" />,
      color: 'from-primary-500 to-accent-500',
      bgGradient: 'from-primary-50 to-accent-50',
      darkBgGradient: 'dark:from-primary-900/20 dark:to-accent-900/20',
      href: '/tools/dsa-solver',
      features: [
        'AI-powered hints and solutions',
        'Step-by-step problem breakdown',
        'Complexity analysis and optimization',
        'Personalized learning path',
        'Real-time code evaluation'
      ],
      stats: { users: '25K+', problems: '5K+', accuracy: '94%' },
      demoSteps: [
        'Select a problem from our curated collection',
        'Write your solution in the interactive editor',
        'Get AI-powered hints if you\'re stuck',
        'Review optimal solutions and complexity analysis'
      ]
    },
    {
      id: 2,
      title: 'Smart Roadmap Generator',
      subtitle: 'Personalized Learning Paths for Your Career Goals',
      description: 'Create customized learning roadmaps tailored to your target company, role, and experience level. Our AI analyzes job requirements and creates structured paths with milestones, resources, and progress tracking.',
      icon: <TrendingUp className="w-12 h-12" />,
      color: 'from-secondary-500 to-primary-500',
      bgGradient: 'from-secondary-50 to-primary-50',
      darkBgGradient: 'dark:from-secondary-900/20 dark:to-primary-900/20',
      href: '/roadmap',
      features: [
        'Company-specific roadmaps',
        'Role-based skill mapping',
        'Progress tracking and milestones',
        'Resource recommendations',
        'Community-driven insights'
      ],
      stats: { roadmaps: '10K+', companies: '500+', success: '89%' },
      demoSteps: [
        'Enter your target company and role',
        'Specify your current experience level',
        'Get a personalized learning roadmap',
        'Track progress and update milestones'
      ]
    },
    {
      id: 3,
      title: 'Mock Interview AI',
      subtitle: 'Practice Real Tech Interviews with AI',
      description: 'Experience realistic technical interviews with our AI interviewer. Get evaluated on coding skills, system design, and behavioral questions. Receive detailed feedback and improvement suggestions.',
      icon: <Bot className="w-12 h-12" />,
      color: 'from-accent-500 to-secondary-500',
      bgGradient: 'from-accent-50 to-secondary-50',
      darkBgGradient: 'dark:from-accent-900/20 dark:to-secondary-900/20',
      href: '/tools/mock-interview',
      features: [
        'AI-powered interview simulation',
        'Company-specific question patterns',
        'Real-time performance evaluation',
        'Detailed feedback and scoring',
        'Behavioral and technical rounds'
      ],
      stats: { interviews: '50K+', companies: '200+', improvement: '76%' },
      demoSteps: [
        'Choose your target company and role',
        'Start the AI-powered interview session',
        'Answer coding and behavioral questions',
        'Get detailed feedback and improvement tips'
      ]
    },
    {
      id: 4,
      title: 'Cloud Compiler & IDE',
      subtitle: 'Code Anywhere with Zero Setup',
      description: 'Write, compile, and run code in 40+ programming languages directly in your browser. Features include intelligent autocomplete, debugging tools, and collaborative coding capabilities.',
      icon: <Code className="w-12 h-12" />,
      color: 'from-primary-500 to-secondary-500',
      bgGradient: 'from-primary-50 to-secondary-50',
      darkBgGradient: 'dark:from-primary-900/20 dark:to-secondary-900/20',
      href: '/tools/compiler',
      features: [
        '40+ programming languages',
        'Intelligent code completion',
        'Real-time collaboration',
        'Built-in debugging tools',
        'Cloud storage and sharing'
      ],
      stats: { languages: '40+', users: '100K+', uptime: '99.9%' },
      demoSteps: [
        'Select your preferred programming language',
        'Write code in the feature-rich editor',
        'Compile and run with a single click',
        'Share and collaborate with others'
      ]
    },
    {
      id: 5,
      title: 'Developer Community',
      subtitle: 'Connect, Learn, and Grow Together',
      description: 'Join a thriving community of 100K+ developers. Share knowledge, participate in discussions, collaborate on projects, and get help from experienced mentors.',
      icon: <Users className="w-12 h-12" />,
      color: 'from-accent-500 to-primary-500',
      bgGradient: 'from-accent-50 to-primary-50',
      darkBgGradient: 'dark:from-accent-900/20 dark:to-primary-900/20',
      href: '/community',
      features: [
        'Expert mentorship program',
        'Project collaboration',
        'Technical discussions',
        'Career guidance',
        'Networking opportunities'
      ],
      stats: { members: '100K+', mentors: '5K+', projects: '15K+' },
      demoSteps: [
        'Create your developer profile',
        'Join relevant discussion groups',
        'Connect with mentors and peers',
        'Collaborate on exciting projects'
      ]
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, features.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const currentFeature = features[currentSlide];

  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 dark:bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-60 dark:opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/5 dark:bg-accent/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-60 dark:opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary-600 text-sm font-medium mb-4 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Platform Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            Powerful Tools for
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> Developers</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover our comprehensive suite of AI-powered tools designed to accelerate your coding journey and career growth
          </p>
        </motion.div>

        {/* Main Slideshow */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="min-h-[60vh]"
            >
              <div className={`bg-gradient-to-br ${currentFeature.bgGradient} ${currentFeature.darkBgGradient} rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/50 dark:border-gray-700/50`}>
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  {/* Left Column - Content */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${currentFeature.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        {React.cloneElement(currentFeature.icon, { className: "w-6 h-6" })}
                      </div>
                      <div>
                        <h3 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white">
                          {currentFeature.title}
                        </h3>
                        <p className="text-base text-gray-600 dark:text-gray-300 mt-1">
                          {currentFeature.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {currentFeature.description}
                    </p>

                    {/* Key Features */}
                    <div className="space-y-3">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">Key Features:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                        {currentFeature.features.slice(0, 4).map((feature, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-6">
                      {Object.entries(currentFeature.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{value}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => router.push(currentFeature.href)}
                        className={`bg-gradient-to-r ${currentFeature.color} hover:opacity-90 text-white font-semibold px-6 py-2.5 text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
                      >
                        Try It Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold px-6 py-2.5 text-sm rounded-xl transition-all duration-300 hover:scale-105 group"
                      >
                        <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Watch Demo
                      </Button>
                    </div>
                  </div>

                  {/* Right Column - How to Use */}
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50">
                    <h4 className="text-lg font-poppins font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-primary-500" />
                      How to Get Started
                    </h4>
                    <div className="space-y-3">
                      {currentFeature.demoSteps.map((step, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Hidden on mobile */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Mobile Navigation Buttons */}
          <div className="md:hidden flex justify-between items-center mt-6 px-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary-500 w-4' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Slide Indicators - Hidden on mobile */}
        <div className="hidden md:flex justify-center mt-8 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary-500 w-6' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-300'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Control */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
          >
            {isAutoPlaying ? (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Auto-playing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume auto-play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcaseSection;
