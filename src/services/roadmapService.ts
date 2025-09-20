import { connectDB } from '@/lib/mongoose';
import Roadmap from '../../models/Roadmap';
import { toast } from '@/components/ui/use-toast';

export interface RoadmapData {
  id?: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  technologies: string[];
  steps: Array<{
    id: string;
    title: string;
    description: string;
    resources: Array<{
      title: string;
      url: string;
      type: 'article' | 'video' | 'course' | 'documentation' | 'practice';
    }>;
    completed: boolean;
    completedAt?: Date;
    estimatedTime: string;
  }>;
  progress: {
    completedSteps: number;
    totalSteps: number;
    percentage: number;
  };
  isPublic: boolean;
  tags: string[];
  status: 'draft' | 'active' | 'completed' | 'paused';
}

export const createRoadmap = async (roadmapData: Omit<RoadmapData, 'id'>): Promise<RoadmapData | null> => {
  try {
    await connectDB();
    
    // Calculate progress
    const totalSteps = roadmapData.steps.length;
    const completedSteps = roadmapData.steps.filter(step => step.completed).length;
    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    const roadmap = new Roadmap({
      ...roadmapData,
      progress: {
        completedSteps,
        totalSteps,
        percentage,
      },
    });

    const savedRoadmap = await roadmap.save();
    return { ...savedRoadmap.toObject(), id: savedRoadmap._id.toString() };
  } catch (error) {
    console.error('Error creating roadmap:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to create roadmap. Please try again.",
    });
    return null;
  }
};

export const getUserRoadmaps = async (userId: string): Promise<RoadmapData[]> => {
  try {
    await connectDB();
    const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 }).lean();
    return roadmaps.map(roadmap => ({ ...roadmap, id: roadmap._id.toString() }));
  } catch (error) {
    console.error('Error fetching user roadmaps:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch your roadmaps. Please try again.",
    });
    return [];
  }
};

export const getRoadmapById = async (roadmapId: string): Promise<RoadmapData | null> => {
  try {
    await connectDB();
    const roadmap = await Roadmap.findById(roadmapId).lean();
    return roadmap ? { ...roadmap, id: roadmap._id.toString() } : null;
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return null;
  }
};

export const updateRoadmap = async (roadmapId: string, updates: Partial<RoadmapData>): Promise<boolean> => {
  try {
    await connectDB();
    
    // Recalculate progress if steps are updated
    if (updates.steps) {
      const totalSteps = updates.steps.length;
      const completedSteps = updates.steps.filter(step => step.completed).length;
      const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      
      updates.progress = {
        completedSteps,
        totalSteps,
        percentage,
      };
    }

    const result = await Roadmap.findByIdAndUpdate(
      roadmapId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    return !!result;
  } catch (error) {
    console.error('Error updating roadmap:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update roadmap. Please try again.",
    });
    return false;
  }
};

export const deleteRoadmap = async (roadmapId: string): Promise<boolean> => {
  try {
    await connectDB();
    const result = await Roadmap.findByIdAndDelete(roadmapId);
    return !!result;
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to delete roadmap. Please try again.",
    });
    return false;
  }
};

export const updateStepCompletion = async (
  roadmapId: string, 
  stepId: string, 
  completed: boolean
): Promise<boolean> => {
  try {
    await connectDB();
    
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return false;

    const stepIndex = roadmap.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return false;

    roadmap.steps[stepIndex].completed = completed;
    if (completed) {
      roadmap.steps[stepIndex].completedAt = new Date();
    } else {
      roadmap.steps[stepIndex].completedAt = undefined;
    }

    // Recalculate progress
    const totalSteps = roadmap.steps.length;
    const completedSteps = roadmap.steps.filter(step => step.completed).length;
    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    roadmap.progress = {
      completedSteps,
      totalSteps,
      percentage,
    };

    // Update status based on progress
    if (percentage === 100) {
      roadmap.status = 'completed';
    } else if (percentage > 0 && roadmap.status === 'draft') {
      roadmap.status = 'active';
    }

    await roadmap.save();
    return true;
  } catch (error) {
    console.error('Error updating step completion:', error);
    return false;
  }
};

export const getPublicRoadmaps = async (limit = 20): Promise<RoadmapData[]> => {
  try {
    await connectDB();
    const roadmaps = await Roadmap.find({ isPublic: true })
      .populate('userId', 'name email')
      .sort({ likes: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    
    return roadmaps.map(roadmap => ({ ...roadmap, id: roadmap._id.toString() }));
  } catch (error) {
    console.error('Error fetching public roadmaps:', error);
    return [];
  }
};

export const likeRoadmap = async (roadmapId: string, userId: string): Promise<boolean> => {
  try {
    await connectDB();
    
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return false;

    const hasLiked = roadmap.likedBy.includes(userId);
    
    if (hasLiked) {
      // Unlike
      roadmap.likedBy = roadmap.likedBy.filter(id => id.toString() !== userId);
      roadmap.likes = Math.max(0, roadmap.likes - 1);
    } else {
      // Like
      roadmap.likedBy.push(userId);
      roadmap.likes += 1;
    }

    await roadmap.save();
    return true;
  } catch (error) {
    console.error('Error toggling roadmap like:', error);
    return false;
  }
};