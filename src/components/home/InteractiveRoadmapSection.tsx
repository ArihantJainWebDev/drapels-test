'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target,
  BrainCircuit,
  Code,
  Bot,
  Users,
  Trophy,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Route,
  FileText,
  MapPin,
  ChevronRight
} from 'lucide-react';

const InteractiveRoadmapSection = () => {
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [currentStep, setCurrentStep] = useState(0);

  const companies = [
    { name: 'Google', logo: '🔍' },
    { name: 'Microsoft', logo: '💼' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Meta', logo: '👥' },
    { name: 'Apple', logo: '🍎' },
    { name: 'Netflix', logo: '🎬' }
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
      title: 'Define Goals',
      description: 'Set clear career objectives',
      icon: <Target className="w-5 h-5" />,
      duration: '1 week',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Learn Fundamentals',
      description: 'Master core technologies',
      icon: <FileText className="w-5 h-5" />,
      duration: '8-12 weeks',
      color: 'bg-indigo-500'
    },
    {
      id: 3,
      title: 'Build Projects',
      description: 'Create portfolio pieces',
      icon: <Code className="w-5 h-5" />,
      duration: '4-6 weeks',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Practice Problems',
      description: 'Solve coding challenges',
      icon: <BrainCircuit className="w-5 h-5" />,
      duration: '6-8 weeks',
      color: 'bg-pink-500'
    },
    {
      id: 5,
      title: 'Mock Interviews',
      description: 'Prepare with AI coaching',
      icon: <Bot className="w-5 h-5" />,
      duration: '2-4 weeks',
      color: 'bg-orange-500'
    },
    {
      id: 6,
      title: 'Network',
      description: 'Connect with professionals',
      icon: <Users className="w-5 h-5" />,
      duration: 'Ongoing',
      color: 'bg-green-500'
    },
    {
      id: 7,
      title: 'Land the Job',
      description: 'Apply and succeed',
      icon: <Trophy className="w-5 h-5" />,
      duration: '2-4 weeks',
      color: 'bg-yellow-500'
    }
  ];

  // Auto-advance demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % roadmapSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Route className="w-3 h-3 mr-1.5" />
            Career Roadmap
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Your Path to Success
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow our proven roadmap to land your dream job at top tech companies
          </p>
        </motion.div>

        {/* Goal Selection */}
        {/* <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Company Selection
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Select Company
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {companies.map((company) => (
                    <button
                      key={company.name}
                      onClick={() => setSelectedCompany(company.name)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedCompany === company.name
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">{company.logo}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{company.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selection */}
              {/* <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-purple-500" />
                  Select Role
                </h3>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Goal:</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedRole} at {selectedCompany}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                Generate Personalized Roadmap
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div> */}

        {/* Roadmap Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Desktop Timeline */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-7 gap-2 xl:gap-4">
              {roadmapSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Connection dot */}
                  <div className="flex justify-center mb-4 relative">
                    {/* Connecting line to next step */}
                    {index < roadmapSteps.length - 1 && (
                      <div className="absolute top-1/2 left-1/2 w-full h-1 -translate-y-1/2">
                        <div className="ml-6 h-full bg-gray-200 dark:bg-gray-700">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            initial={{ width: '0%' }}
                            animate={{ 
                              width: index < currentStep ? '100%' : index === currentStep ? '50%' : '0%'
                            }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <motion.div
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all relative z-10 ${
                        index <= currentStep
                          ? 'bg-white border-blue-500 shadow-lg'
                          : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      ) : index === currentStep ? (
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                      ) : (
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{index + 1}</span>
                      )}
                    </motion.div>
                  </div>

                  {/* Step content */}
                  <motion.div
                    className={`p-3 xl:p-4 rounded-lg border transition-all hover:shadow-lg cursor-pointer ${
                      index === currentStep
                        ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 shadow-blue-100/50'
                        : index < currentStep
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                        : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className={`w-8 h-8 xl:w-10 xl:h-10 rounded-lg ${step.color} text-white flex items-center justify-center mb-2 xl:mb-3 shadow-lg`}>
                      {React.cloneElement(step.icon, { className: "w-4 h-4 xl:w-5 xl:h-5" })}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-xs xl:text-sm mb-1 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-tight line-clamp-2">
                      {step.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{step.duration}</span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-6">
            {roadmapSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Timeline line and dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all ${
                      index <= currentStep
                        ? 'bg-white border-blue-500 shadow-blue-200/50'
                        : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    ) : index === currentStep ? (
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    ) : (
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{index + 1}</span>
                    )}
                  </div>
                  {index < roadmapSteps.length - 1 && (
                    <div className={`w-1 h-16 mt-2 rounded-full transition-all ${
                      index < currentStep ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 p-5 rounded-xl border-2 shadow-sm transition-all ${
                  index === currentStep
                    ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 shadow-blue-100/50'
                    : index < currentStep
                    ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                    : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${step.color} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{step.duration}</span>
                        {index === currentStep && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                            Current
                          </span>
                        )}
                        {index < currentStep && (
                          <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          {/* <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-blue-600 mb-2">89%</div>
              <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-purple-600 mb-2">100K+</div>
              <div className="text-gray-600 dark:text-gray-400">Developers Trained</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-green-600 mb-2">3-6</div>
              <div className="text-gray-600 dark:text-gray-400">Months Average</div>
            </div>
          </motion.div>

          {/* CTA Section */}
          {/* <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 mx-auto">
              Start Your Journey Today
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Free to start • No credit card required
            </p>
          </motion.div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default InteractiveRoadmapSection;