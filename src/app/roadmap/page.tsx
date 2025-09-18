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
    <div className="min-h-screen bg-[#FFF8EE] dark:bg-black overflow-x-hidden">
      {/* Hero Section with animated background */}
      <section className="relative min-h-[60vh] overflow-hidden bg-[#FFF8EE] dark:bg-black">
        {/* Animated SVG Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 flex items-center justify-center pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-16 min-h-[60vh]">
          <div className="max-w-4xl text-center w-full">
            <h1 className="text-5xl md:text-7xl font-light leading-tight md:leading-[0.9] tracking-[-0.03em] text-gray-900 dark:text-white">
              <span className="block mb-4">Roadmap</span>
              <span className="block font-extralight">Generator</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mt-4">
              Build a tailored learning path for your target company and role
            </p>

            <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl rounded-full p-2">
                <TabsTrigger value="form" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white/80 data-[state=active]:text-[#1EB36B] data-[state=active]:shadow-lg">
                  <Brain className="h-4 w-4" />
                  Create
                </TabsTrigger>
                <TabsTrigger value="display" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white/80 data-[state=active]:text-[#1EB36B] data-[state=active]:shadow-lg">
                  <Target className="h-4 w-4" />
                  Generated
                </TabsTrigger>
                <TabsTrigger value="library" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white/80 data-[state=active]:text-[#1EB36B] data-[state=active]:shadow-lg">
                  <History className="h-4 w-4" />
                  Library
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto max-w-screen-xl p-4 md:px-6 md:py-8">
        <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="form">Create</TabsTrigger>
            <TabsTrigger value="display">Generated</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
          </TabsList>
          
          {currentView === 'form' && (
            <RoadmapForm onSubmit={handleGenerateRoadmap} loading={loading} />
          )}
          
          {currentView === 'display' && currentRoadmap && (
            <RoadmapDisplay
              roadmap={currentRoadmap}
              onRoadmapUpdate={handleRoadmapUpdate}
              onDeleteRoadmap={() => handleDeleteRoadmap(currentRoadmap.id)}
            />
          )}
          
          {currentView === 'library' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savedRoadmaps.length === 0 ? (
                <div className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1EB36B]/10 flex items-center justify-center">
                    <Route className="w-8 w-8 text-[#1EB36B]" />
                  </div>
                  <h3 className="text-2xl font-light mb-3 text-gray-900 dark:text-white">No roadmaps yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 font-light">Create your first learning roadmap to get started!</p>
                  <button
                    className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-[#1EB36B]/10 text-[#1EB36B] hover:bg-[#1EB36B]/20 border border-[#1EB36B]/20 h-12 px-8"
                    onClick={() => setCurrentView('form')}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Roadmap
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {savedRoadmaps.map(roadmap => (
                    <motion.div 
                      key={roadmap.id} 
                      className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-light text-gray-900 dark:text-white">{roadmap.title}</h3>
                          <div className="flex gap-2">
                            <button
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20"
                              onClick={() => handleDeleteRoadmap(roadmap.id)}
                              title="Delete"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 font-light">{roadmap.description}</p>

                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="font-medium text-gray-900 dark:text-white">{Math.round(roadmap.overallProgress)}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all rounded-full"
                              style={{
                                width: `${roadmap.overallProgress}%`,
                                backgroundColor: '#1EB36B'
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                          {[
                            ['Company', roadmap.params.company],
                            ['Role', roadmap.params.role],
                            ['Experience', roadmap.params.experience],
                            ['Timeframe', roadmap.params.timeframe],
                            ['Topics', roadmap.topics.length],
                            ['Updated', formatDate(roadmap.updatedAt)]
                          ].map(([label, value]) => (
                            <div key={label} className="space-y-1">
                              <span className="text-gray-500 dark:text-gray-400 text-xs">{label}</span>
                              <p className="font-medium truncate text-gray-900 dark:text-white">{value}</p>
                            </div>
                          ))}
                        </div>

                        <button
                          className="w-full inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-[#1EB36B]/10 text-[#1EB36B] hover:bg-[#1EB36B]/20 border border-[#1EB36B]/20 h-10 px-4"
                          onClick={() => handleSelectRoadmap(roadmap)}
                        >
                          {roadmap.overallProgress > 0 ? 'Continue Learning' : 'Start Journey'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Tabs>
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
