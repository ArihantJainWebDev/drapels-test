'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Roadmap } from '@/types/roadmap';

const skillLevels = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

const timeCommitments = [
  { id: '5', label: '5-10 hours/week' },
  { id: '15', label: '10-20 hours/week' },
  { id: '25', label: '20-30 hours/week' },
  { id: '40', label: 'Full-time (40+ hours/week)' },
];

const roadmapSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  timeCommitment: z.string(),
  focusAreas: z.string().optional(),
  learningStyle: z.enum(['visual', 'hands-on', 'theoretical', 'mixed']),
  preferredTechnologies: z.string().optional(),
});

type RoadmapFormValues = z.infer<typeof roadmapSchema>;

interface RoadmapGeneratorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoadmapFormValues) => Promise<void>;
  isLoading: boolean;
}

export function RoadmapGeneratorForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: RoadmapGeneratorFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<RoadmapFormValues>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: {
      skillLevel: 'beginner',
      learningStyle: 'mixed',
      timeCommitment: '15',
    },
  });

  const onNext = async () => {
    if (step === 1) {
      const isValid = await trigger(['title', 'description']);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(['skillLevel', 'timeCommitment']);
      if (isValid) setStep(3);
    }
  };

  const onBack = () => {
    setStep(step - 1);
  };

  const handleFormSubmit = async (data: RoadmapFormValues) => {
    try {
      await onSubmit(data);
      onClose();
      toast({
        title: 'Roadmap Generated!',
        description: 'Your personalized learning path is ready.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate roadmap. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-6 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {step === 1 && 'Create New Roadmap'}
                  {step === 2 && 'Learning Preferences'}
                  {step === 3 && 'Additional Details'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Progress steps */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((stepNum) => (
                    <div key={stepNum} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step === stepNum 
                            ? 'bg-indigo-600 text-white' 
                            : step > stepNum 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}
                      >
                        {stepNum}
                      </div>
                      <span className="text-xs mt-1.5 text-gray-500 dark:text-gray-400">
                        {stepNum === 1 ? 'Basics' : stepNum === 2 ? 'Preferences' : 'Details'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form content */}
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="title">Roadmap Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Full Stack Web Development"
                        className="mt-1.5"
                        {...register('title')}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">What do you want to learn?</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your learning goals, interests, and any specific technologies you're interested in..."
                        rows={5}
                        className="mt-1.5"
                        {...register('description')}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Learning Preferences */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label>Your Current Skill Level</Label>
                      <div className="mt-2 space-y-2">
                        {skillLevels.map((level) => (
                          <div key={level.id} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={level.id}
                              value={level.id}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              {...register('skillLevel')}
                            />
                            <Label htmlFor={level.id} className="font-normal">
                              {level.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Time Commitment</Label>
                      <div className="mt-2 space-y-2">
                        {timeCommitments.map((commitment) => (
                          <div key={commitment.id} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`time-${commitment.id}`}
                              value={commitment.id}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              {...register('timeCommitment')}
                            />
                            <Label htmlFor={`time-${commitment.id}`} className="font-normal">
                              {commitment.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="learningStyle">Learning Style</Label>
                      <select
                        id="learningStyle"
                        className="mt-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white p-2"
                        {...register('learningStyle')}
                      >
                        <option value="visual">Visual (Videos, Diagrams)</option>
                        <option value="hands-on">Hands-on (Projects, Coding)</option>
                        <option value="theoretical">Theoretical (Reading, Documentation)</option>
                        <option value="mixed">Mixed (A bit of everything)</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Additional Details */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="focusAreas">Specific Focus Areas (Optional)</Label>
                      <Input
                        id="focusAreas"
                        placeholder="e.g., React, Node.js, MongoDB"
                        className="mt-1.5"
                        {...register('focusAreas')}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Any specific technologies or topics you want to focus on?
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="preferredTechnologies">Preferred Technologies (Optional)</Label>
                      <Input
                        id="preferredTechnologies"
                        placeholder="e.g., JavaScript, Python, React"
                        className="mt-1.5"
                        {...register('preferredTechnologies')}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Any specific programming languages or frameworks you prefer?
                      </p>
                    </div>

                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                            AI-Powered Roadmap Generation
                          </h3>
                          <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                            Our AI will analyze your preferences and generate a personalized learning path just for you.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
                <div>
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  )}
                </div>
                <div className="flex space-x-3">
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={onNext}
                      disabled={isLoading}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Roadmap
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
