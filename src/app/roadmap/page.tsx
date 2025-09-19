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
import { ArrowLeft, Plus, Trash, History, User, Target, Brain, CheckCircle, Star, Route } from 'lucide-react';
import { motion } from "framer-motion";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

export default function RoadmapPage() {
  const { requireAuth, SignInRequiredDialog } = useSignInRequired();
  const { canAfford, spend, refresh } = useCredits();
  const { toast } = useToast();
  const ROADMAP_COST = 20;
  const { openLowCredits } = useCreditsDialog();
  
  const [currentView, setCurrentView] = useState<'form' | 'display' | 'library'>('form');
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roadmapToDelete, setRoadmapToDelete] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-x-hidden">
      {/* Hero Section with animated background */}
      <section className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-primary-50/20 to-accent-50/20 dark:from-gray-800 dark:to-gray-900">
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

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center pt-32 pb-16 min-h-[60vh]">
          <motion.div 
            className="max-w-4xl text-center w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Route className="w-4 h-4 mr-2" />
              AI-Powered Learning Paths
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-poppins font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Roadmap
              </span>{" "}
              <br className="hidden md:block" />
              <span className="text-gray-900 dark:text-white">Generator</span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Build personalized learning paths tailored to your target company and role with AI-powered recommendations
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
                <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl p-2">
                  <TabsTrigger value="form" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline">Create</span>
                  </TabsTrigger>
                  <TabsTrigger value="display" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                    <Target className="h-4 w-4" />
                    <span className="hidden sm:inline">Generated</span>
                  </TabsTrigger>
                  <TabsTrigger value="library" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">Library</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="relative flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Sections */}
        <div className="space-y-8">
          {currentView === 'form' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/40 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl p-8"
            >
              <RoadmapForm onSubmit={handleGenerateRoadmap} loading={loading} />
            </motion.div>
          )}
          
          {currentView === 'display' && currentRoadmap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden"
            >
              <RoadmapDisplay
                roadmap={currentRoadmap}
                onRoadmapUpdate={handleRoadmapUpdate}
                onDeleteRoadmap={() => handleDeleteRoadmap(currentRoadmap.id)}
              />
            </motion.div>
          )}
          
          {currentView === 'library' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {savedRoadmaps.length === 0 ? (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Route className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-poppins font-semibold mb-3 text-gray-900 dark:text-white">No roadmaps yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">Create your first personalized learning roadmap to get started on your journey!</p>
                  <Button
                    onClick={() => setCurrentView('form')}
                    className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="mr-2 h-5 w-5" /> Create Your First Roadmap
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-poppins font-semibold text-gray-900 dark:text-white">
                      Your Learning Library
                    </h2>
                    <Button
                      onClick={() => setCurrentView('form')}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="mr-2 h-4 w-4" /> New Roadmap
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedRoadmaps.map((roadmap, index) => (
                      <motion.div 
                        key={roadmap.id} 
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-poppins font-semibold text-gray-900 dark:text-white line-clamp-2">{roadmap.title}</h3>
                            <button
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-error-100 dark:bg-error-900/20 text-error-600 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-900/40 transition-colors"
                              onClick={() => handleDeleteRoadmap(roadmap.id)}
                              title="Delete roadmap"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 leading-relaxed">{roadmap.description}</p>

                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{Math.round(roadmap.overallProgress)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                                style={{ width: `${roadmap.overallProgress}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                            {[
                              ['Company', roadmap.params.company],
                              ['Role', roadmap.params.role],
                              ['Experience', roadmap.params.experience],
                              ['Timeframe', roadmap.params.timeframe],
                              ['Topics', roadmap.topics.length],
                              ['Updated', formatDate(roadmap.updatedAt)]
                            ].map(([label, value]) => (
                              <div key={label} className="space-y-1">
                                <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</span>
                                <p className="font-medium truncate text-gray-900 dark:text-white">{value}</p>
                              </div>
                            ))}
                          </div>

                          <Button
                            onClick={() => handleSelectRoadmap(roadmap)}
                            className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
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
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

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
