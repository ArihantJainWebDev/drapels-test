'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Code, 
  Trophy,
  Star,
  Zap
} from 'lucide-react';

interface CTAStripSectionProps {
  user?: any;
  t?: (key: string) => string;
}

const CTAStripSection = ({ user, t }: CTAStripSectionProps) => {
  const router = useRouter();

  const stats = [
    { icon: Users, number: '50K+', label: 'Developers' },
    { icon: Code, number: '1000+', label: 'Tools' },
    { icon: Trophy, number: '500+', label: 'Challenges' },
    { icon: Star, number: '10K+', label: 'Projects Built' }
  ];

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleExplore = () => {
    router.push('/explore');
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-8 left-8 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-20 h-20 bg-secondary-300/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-16 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-secondary-400/15 rounded-full blur-xl animate-bounce"></div>
        
        {/* Floating Icons */}
        <motion.div 
          className="absolute top-16 left-1/3 text-white/20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Code className="w-6 h-6" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-24 right-1/3 text-white/20"
          animate={{ 
            y: [0, 12, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Trophy className="w-8 h-8" />
        </motion.div>
        
        <motion.div 
          className="absolute top-1/2 left-16 text-white/15"
          animate={{ 
            y: [0, -8, 0],
            x: [0, 8, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight px-4">
              Ready to start building with{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Drapels?
                </span>
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                ></motion.div>
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              Join thousands of developers today and accelerate your coding journey with our comprehensive ecosystem
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl text-white mb-2 sm:mb-3 group-hover:bg-white/30 transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-white/80 font-medium text-xs sm:text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSignUp}
                className="bg-white text-primary-600 hover:bg-gray-50 font-bold px-6 sm:px-8 py-3 text-sm sm:text-base rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 group w-full sm:w-auto"
              >
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Sign Up Free
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleExplore}
                variant="outline"
                className="border-2 border-white/30 text-white bg-white/5 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm font-bold px-6 sm:px-8 py-3 text-sm sm:text-base rounded-xl transition-all duration-300 group w-full sm:w-auto"
              >
                Explore Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-white/80 text-xs sm:text-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i}
                    className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full border border-white flex items-center justify-center"
                  >
                    <Star className="w-2 h-2 sm:w-3 sm:h-3 text-white fill-current" />
                  </div>
                ))}
              </div>
              <span className="font-medium">4.9/5 from 10K+ reviews</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
              <span className="font-medium text-center sm:text-left">Free to start • No credit card required</span>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="text-white/60 text-xs font-medium mb-3">
              Trusted by developers worldwide
            </div>
            <motion.div 
              className="w-0.5 h-6 bg-white/30 rounded-full mx-auto"
              animate={{ 
                scaleY: [1, 0.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="white"
            className="dark:fill-accent-900"
          />
        </svg>
      </div>
    </section>
  );
};

export default CTAStripSection;
