'use client';

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { RoadmapForm } from '@/components/RoadmapForm';
import RoadmapDisplay from "@/components/RoadmapDisplay";
import { generateRoadmap, getUserRoadmaps, deleteRoadmap } from '@/services/roadmapGenerator';
import { useCredits } from '@/context/CreditsContext';
import { useToast } from '@/hooks/use-toast';
import { useCreditsDialog } from '@/components/credits/CreditsDialogProvider';
import { useSignInRequired } from '@/components/auth/SignInRequiredDialog';
import { getAuth } from 'firebase/auth';
import { Roadmap } from '@/types/roadmap';
import { ArrowLeft, Plus, Trash, History, User, Target, Brain, CheckCircle, Star, Route, Search, Zap, Rocket, BookOpen, Briefcase, Code, Database, Server, Cpu, Palette, BarChart, Lock, Globe, Award, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';

// Mock data for curated roadmaps
const CURATED_ROADMAPS = [
  {
    id: 'frontend-2024',
    title: 'Frontend Development 2024',
    description: 'Master modern frontend development with React, Next.js, and TypeScript',
    icon: <Code className="w-6 h-6 text-blue-500" />,
    category: 'Development',
    duration: '3 months',
    level: 'Beginner to Advanced',
    topics: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'State Management']
  },
  {
    id: 'fullstack-js',
    title: 'Full Stack JavaScript',
    description: 'Become a full-stack JavaScript developer with MERN stack',
    icon: <Database className="w-6 h-6 text-green-500" />,
    category: 'Development',
    duration: '4 months',
    level: 'Intermediate',
    topics: ['Node.js', 'Express', 'MongoDB', 'React', 'Authentication']
  },
  {
    id: 'devops-fundamentals',
    title: 'DevOps Fundamentals',
    description: 'Learn the essentials of DevOps and CI/CD pipelines',
    icon: <Server className="w-6 h-6 text-purple-500" />,
    category: 'DevOps',
    duration: '2 months',
    level: 'Intermediate',
    topics: ['Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'Terraform']
  },
  {
    id: 'ai-ml-basics',
    title: 'AI/ML Basics',
    description: 'Introduction to Artificial Intelligence and Machine Learning',
    icon: <Cpu className="w-6 h-6 text-red-500" />,
    category: 'Data Science',
    duration: '3 months',
    level: 'Beginner',
    topics: ['Python', 'TensorFlow', 'Neural Networks', 'Data Preprocessing']
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Master the principles of user interface and experience design',
    icon: <Palette className="w-6 h-6 text-pink-500" />,
    category: 'Design',
    duration: '2 months',
    level: 'Beginner to Intermediate',
    topics: ['Figma', 'User Research', 'Wireframing', 'Prototyping']
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    description: 'Become proficient in data analysis and visualization',
    icon: <BarChart className="w-6 h-6 text-yellow-500" />,
    category: 'Data Science',
    duration: '3 months',
    level: 'Beginner',
    topics: ['SQL', 'Python', 'Pandas', 'Data Visualization']
  },
  {
    id: 'cybersecurity-basics',
    title: 'Cybersecurity Basics',
    description: 'Learn the fundamentals of cybersecurity',
    icon: <Lock className="w-6 h-6 text-amber-500" />,
    category: 'Security',
    duration: '2 months',
    level: 'Beginner',
    topics: ['Network Security', 'Encryption', 'Ethical Hacking', 'Risk Management']
  },
  {
    id: 'web3-blockchain',
    title: 'Web3 & Blockchain',
    description: 'Introduction to decentralized applications and blockchain technology',
    icon: <Globe className="w-6 h-6 text-emerald-500" />,
    category: 'Blockchain',
    duration: '3 months',
    level: 'Intermediate',
    topics: ['Solidity', 'Ethereum', 'Smart Contracts', 'DeFi']
  }
];

export default function RoadmapPage() {
  const { requireAuth, SignInRequiredDialog } = useSignInRequired();
  const { canAfford, spend, refresh } = useCredits();
  const { user } = useAuth();
  const { toast } = useToast();
  const ROADMAP_COST = 20;
  const { openLowCredits } = useCreditsDialog();
  
  const [currentView, setCurrentView] = useState<'form' | 'display' | 'library' | 'featured'>('featured');
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<Roadmap[]>([]);
  const [featuredRoadmaps, setFeaturedRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roadmapToDelete, setRoadmapToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  
  // Filter roadmaps based on search query and selected category
  const filteredRoadmaps = CURATED_ROADMAPS.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || roadmap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['All', ...new Set(CURATED_ROADMAPS.map(r => r.category))];

  const handleOpenForm = () => {
    if (!authChecked) {
      requireAuth(user);
      return;
    }
    setIsFormOpen(true);
  };
  
  // Load featured roadmaps
  useEffect(() => {
    const loadFeaturedRoadmaps = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFeaturedRoadmaps(CURATED_ROADMAPS);
      } catch (error) {
        console.error('Error loading featured roadmaps:', error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    loadFeaturedRoadmaps();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setAuthChecked(true);
        setError(null);
        loadSavedRoadmaps();
      } else {
        setAuthChecked(false);
        setError(null);
        setSavedRoadmaps([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadSavedRoadmaps = async () => {
    try {
      const roadmaps = await getUserRoadmaps();
      setSavedRoadmaps(roadmaps);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGenerateRoadmap = async (params: any) => {
    const auth = getAuth();
    
    setLoading(true);
    setError(null);
    try {
      const ok = await spend(ROADMAP_COST);
      if (!ok) {
        toast({ title: "Payment error", description: "Could not deduct credits. Please try again.", variant: "destructive" });
        openLowCredits();
        setLoading(false);
        return;
      }
      
      refresh().catch(() => {});
      const roadmap = await generateRoadmap(params);
      setCurrentRoadmap(roadmap);
      await loadSavedRoadmaps();
      setCurrentView('display');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoadmapUpdate = async (updatedRoadmap: Roadmap) => {
    setCurrentRoadmap(updatedRoadmap);
    await loadSavedRoadmaps();
  };

  const handleSelectRoadmap = (roadmap: Roadmap) => {
    setCurrentRoadmap(roadmap);
    setCurrentView('display');
  };

  const handleDeleteConfirm = async () => {
    if (!roadmapToDelete) return;
    try {
      await deleteRoadmap(roadmapToDelete);
      await loadSavedRoadmaps();
      if (currentRoadmap?.id === roadmapToDelete) {
        setCurrentRoadmap(null);
        setCurrentView('form');
      }
      setDeleteDialogOpen(false);
      setRoadmapToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteRoadmap = (roadmapId: string) => {
    setRoadmapToDelete(roadmapId);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800/95 overflow-x-hidden text-base">
      {/* Hero Section with animated background */}
      <section className="relative min-h-[65vh] overflow-hidden bg-gradient-to-br from-primary-50/20 to-accent-50/20 dark:from-gray-800/95 dark:to-gray-900/95">
        {/* Enhanced Background Elements - Reduced size and opacity */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-60 h-60 bg-primary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob dark:bg-primary/20 dark:opacity-30"></div>
          <div className="absolute top-40 right-80 w-60 h-60 bg-accent/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 dark:bg-accent/20 dark:opacity-30"></div>
          <div className="absolute -bottom-20 left-20 w-60 h-60 bg-secondary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 dark:bg-secondary/20 dark:opacity-30"></div>
          
          {/* Smaller, more subtle floating elements */}
          <div className="absolute top-32 left-1/4 w-3 h-3 bg-primary/30 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-64 right-1/3 w-4 h-4 bg-accent/30 rounded-full opacity-25 animate-float animation-delay-1000"></div>
          <div className="absolute bottom-40 left-1/3 w-2.5 h-2.5 bg-secondary/30 rounded-full opacity-20 animate-float animation-delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center pt-20 pb-6 min-h-[65vh]">
          <motion.div 
            className="w-full max-w-4xl text-center px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-5 border border-primary/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              <span>AI-Powered Roadmap Generator</span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 leading-tight"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your Personalized
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400 block sm:inline">
                {' '}Learning Journey
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-7 px-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Get a customized learning path based on your goals, experience level, and time commitment.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="group px-6 sm:px-7 py-4 sm:py-5 text-sm sm:text-base font-medium bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5"
                onClick={handleOpenForm}
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform" />
                Generate Your Roadmap
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-6 sm:px-7 py-4 sm:py-5 text-sm sm:text-base font-medium border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                onClick={() => setCurrentView('featured')}
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                Browse Roadmaps
              </Button>
            </motion.div>

            <motion.div 
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { icon: <Briefcase className="w-6 h-6 text-primary-600" />, text: 'Company-Specific' },
                { icon: <Code className="w-6 h-6 text-blue-500" />, text: 'Role-Based' },
                { icon: <TrendingUp className="w-6 h-6 text-green-500" />, text: 'Career Growth' },
                { icon: <Award className="w-6 h-6 text-yellow-500" />, text: 'Skill Validation' },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center justify-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-lg mb-2">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="mb-8 -translate-x-1/2 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center p-1 mb-2">
            <motion.div
              className="w-1 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Scroll to explore</span>
        </motion.div>
      </section>

      {/* Featured Roadmaps Section */}
      <section id="featured-roadmaps" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-poppins font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Explore <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Featured Roadmaps</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Get started with our hand-picked collection of learning paths designed by industry experts
            </motion.p>
          </div>

          {/* Search and Filter */}
          <motion.div 
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search roadmaps..."
                className="pl-10 pr-4 py-6 text-base border-2 border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category 
                      ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Roadmaps Grid */}
          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Skeleton className="h-40 w-full rounded-t-lg" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                      <Skeleton className="h-3 w-4/6" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRoadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="p-5 sm:p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300">
                          {roadmap.icon}
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-xs py-1 px-2.5 rounded-full border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 bg-primary-50/50 dark:bg-primary-900/20"
                        >
                          {roadmap.duration}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {roadmap.title}
                      </CardTitle>
                      
                      <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {roadmap.description}
                      </CardDescription>
                      
                      <div className="mt-4 mb-5 sm:mb-6">
                        <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                          <span className="text-gray-500 dark:text-gray-400">Level</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{roadmap.level}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-accent-500 h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: roadmap.level === 'Beginner' ? '33%' : 
                                     roadmap.level === 'Intermediate' ? '66%' : '100%' 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-2">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {roadmap.topics.slice(0, 3).map((topic, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className="text-xs py-1 px-2.5 rounded-full bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                            >
                              {topic}
                            </Badge>
                          ))}
                          {roadmap.topics.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs py-1 px-2.5 rounded-full border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                            >
                              +{roadmap.topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <Button 
                          className="w-full group-hover:bg-primary-600 group-hover:text-white transition-colors border-gray-200 dark:border-gray-600 dark:text-white dark:hover:bg-primary-700 dark:hover:border-primary-600"
                          variant="outline"
                          onClick={() => {
                            if (!authChecked) {
                              requireAuth(user);
                              return;
                            }
                            setIsFormOpen(true);
                          }}
                        >
                          Start Learning
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-all duration-200" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {filteredRoadmaps.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No roadmaps found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    We couldn't find any roadmaps matching your search. Try adjusting your filters or search term.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Your Roadmaps Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900 dark:text-white mb-2">
                Your Learning Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Continue where you left off or start a new learning path
              </p>
            </div>
            <Button 
              onClick={handleOpenForm}
              className="mt-4 md:mt-0 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" /> New Roadmap
            </Button>
          </div>

          {savedRoadmaps.length === 0 ? (
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <Route className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-poppins font-semibold mb-3 text-gray-900 dark:text-white">No roadmaps yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Create your first personalized learning roadmap to get started on your journey to success!
              </p>
              <Button
                onClick={handleOpenForm}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" /> Create Your First Roadmap
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savedRoadmaps.slice(0, 2).map((roadmap) => (
                <Card key={roadmap.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                          {roadmap.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {roadmap.params.role} at {roadmap.params.company}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteRoadmap(roadmap.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">{Math.round(roadmap.overallProgress)}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                            style={{ width: `${roadmap.overallProgress}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Experience</div>
                          <div className="font-medium text-gray-900 dark:text-white">{roadmap.params.experience}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Timeframe</div>
                          <div className="font-medium text-gray-900 dark:text-white">{roadmap.params.timeframe}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Topics</div>
                          <div className="font-medium text-gray-900 dark:text-white">{roadmap.topics.length} topics</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Updated</div>
                          <div className="font-medium text-gray-900 dark:text-white">{formatDate(roadmap.updatedAt)}</div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleSelectRoadmap(roadmap)}
                      >
                        {roadmap.overallProgress > 0 ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Continue Learning
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4" />
                            Start Journey
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {savedRoadmaps.length > 2 && (
                <div className="lg:col-span-2 text-center mt-4">
                  <Button 
                    variant="outline" 
                    className="text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    onClick={() => setCurrentView('library')}
                  >
                    View All Your Roadmaps ({savedRoadmaps.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Ready to get started?
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-poppins font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Create Your Personalized <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Learning Path</span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get a customized learning roadmap tailored to your career goals, experience level, and target companies.
              Start your journey to success today!
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button 
                onClick={handleOpenForm}
                size="lg"
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Generate Your Roadmap
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200 font-semibold px-8 py-6 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 text-base sm:text-lg"
                onClick={() => {
                  const element = document.getElementById('featured-roadmaps');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Roadmaps
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Generate New Roadmap
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Fill in the details to create a personalized learning path
            </p>
          </DialogHeader>
          <div className="py-4">
            <RoadmapForm 
              onSubmit={async (data) => {
                await handleGenerateRoadmap(data);
                setIsFormOpen(false);
              }} 
              loading={loading} 
            />
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
      <SignInRequiredDialog />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your roadmap.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
