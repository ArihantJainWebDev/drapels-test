'use client';

import React from 'react';
import { motion, Variant } from 'framer-motion';
import { 
  Search, 
  Users, 
  Rocket, 
  ArrowRight,
  Sparkles,
  Target,
  Trophy
} from 'lucide-react';

interface HowItWorksSectionProps {
  user?: any;
  t?: (key: string) => string;
}

const HowItWorksSection = ({ user, t }: HowItWorksSectionProps) => {
  const steps = [
    {
      id: 1,
      title: 'Explore',
      subtitle: 'Find tools, docs & challenges',
      description: 'Browse through our comprehensive collection of developer tools, documentation, and coding challenges. Use our smart search and filtering to find exactly what you need.',
      icon: Search,
      color: 'primary',
      features: [
        'Smart search & filtering',
        'Curated collections',
        'Personalized recommendations',
        'Category-based browsing'
      ],
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      id: 2,
      title: 'Collaborate',
      subtitle: 'Join community & discussions',
      description: 'Connect with fellow developers, share knowledge, participate in discussions, and learn from the community. Build your network and grow together.',
      icon: Users,
      color: 'secondary',
      features: [
        'Community discussions',
        'Knowledge sharing',
        'Peer code reviews',
        'Mentorship programs'
      ],
      gradient: 'from-secondary-600 to-secondary-700'
    },
    {
      id: 3,
      title: 'Build',
      subtitle: 'Showcase projects & grow profile',
      description: 'Apply your skills in real projects, showcase your work, participate in challenges, and build a portfolio that stands out to employers.',
      icon: Rocket,
      color: 'accent',
      features: [
        'Project showcases',
        'Skill assessments',
        'Achievement badges',
        'Portfolio building'
      ],
      gradient: 'from-accent-600 to-accent-700'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50/30 dark:from-accent-900 dark:to-accent-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-accent-800 dark:text-white mb-6">
            How{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">
              Drapels Works
            </span>
          </h2>
          <p className="text-xl text-accent-600 dark:text-gray-300 max-w-3xl mx-auto">
            Three simple steps to accelerate your development journey and connect with a thriving community
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Connection Lines (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 dark:from-primary-800 dark:via-secondary-800 dark:to-accent-800 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Step Card */}
                  <div className="bg-white dark:bg-accent-800 rounded-3xl p-8 border border-gray-200 dark:border-accent-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 group-hover:-translate-y-2">
                    
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-10 h-10" />
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-gray-200 dark:text-accent-600">
                          0{step.id}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-accent-800 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className={`text-lg font-semibold mb-4 ${
                        step.color === 'primary' ? 'text-primary-600' :
                        step.color === 'secondary' ? 'text-secondary-600' :
                        'text-accent-600'
                      } dark:text-${step.color}-400`}>
                        {step.subtitle}
                      </p>
                      <p className="text-accent-600 dark:text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full bg-${step.color}-500`}></div>
                          <span className="text-sm font-medium text-accent-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {/* Arrow (Desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                      <div className="w-12 h-12 bg-white dark:bg-accent-800 rounded-full border-2 border-primary-200 dark:border-primary-700 flex items-center justify-center shadow-lg">
                        <ArrowRight className="w-5 h-5 text-primary-500" />
                      </div>
                    </div>
                  )}

                  {/* Mobile Arrow */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-8">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-primary-500 rotate-90" />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
