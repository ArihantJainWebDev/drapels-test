import { createRoadmap, getUserRoadmaps as fetchUserRoadmaps, RoadmapData } from './roadmapService';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

function parseRoadmapJSON(raw: string) {
  if (!raw || typeof raw !== 'string') throw new Error('Empty AI response');
  let s = raw.trim();
  s = s.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first >= 0 && last > first) {
    s = s.slice(first, last + 1);
  }
  s = s.replace(/,\s*(\}|\])/g, '$1');
  try {
    return JSON.parse(s);
  } catch (e) {
    const cleaned = s.replace(/[\u0000-\u001F]+/g, '');
    return JSON.parse(cleaned);
  }
}

export const generateRoadmap = async (params: any, userId: string): Promise<RoadmapData | null> => {
  const prompt = `Generate a comprehensive learning roadmap for a ${params.role} role at ${params.company} in the domain of ${params.domain}. 
  
Experience level: ${params.experience}
Timeframe: ${params.timeframe}
Focus areas: ${params.focusAreas.join(', ')}
Current skills: ${params.currentSkills.join(', ')}

Create a detailed roadmap with:
1. 12-15 main topics that are essential for this role
2. Each topic should have all the subtopics (7-12) that break down the learning into specific areas
3. Include estimated learning hours for each topic and subtopic
4. Provide priority levels (high/medium/low) for topics
5. Include difficulty levels (beginner/intermediate/advanced) for subtopics
6. Add relevant resources (articles, courses, projects) for each subtopic
7. Ensure the roadmap is tailored to the ${params.experience} level and ${params.timeframe} timeframe
8. if there is DSA then add all the DSA topics (e.g. arrays and then leetcode on array, then other topics dividing in subtopics)
9. must have all dsa topics if dsa is choosen (Array, strings, sliding window, two pointers, linkedlist, stach and queue, trie, graph)
10. if user ask for full stack you have to reutrn three main topics (frontend, backend, database).

Format the output as JSON with this exact structure:
{
  "title": "Learning Roadmap for [Role] at [Company]",
  "description": "A comprehensive learning path...",
  "totalEstimatedHours": 240,
  "topics": [
    {
      "id": "topic-1",
      "title": "Topic Name",
      "description": "Detailed description of what this topic covers",
      "estimatedHours": 30,
      "priority": "high",
      "subtopics": [
        {
          "id": "subtopic-1-1",
          "title": "Subtopic Name",
          "description": "What you'll learn in this subtopic",
          "estimatedHours": 8,
          "difficulty": "beginner",
          "resources": [
            {
              "type": "article",
              "title": "Resource Title",
              "url": "https://example.com",
              "description": "Resource description"
            }
          ]
        }
      ]
    }
  ]
}

Important:
- Respond with JSON ONLY (no prose, no markdown fences).
- Ensure valid JSON (no comments, no trailing commas, all strings quoted).
- Use only these strings for fields: priority = ["high","medium","low"], difficulty = ["beginner","intermediate","advanced"], resource.type = ["video","article","book","course","practice","project"].`;

  try {
    const response = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        params
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const roadmapData = parseRoadmapJSON(data.content);

    if (!roadmapData.topics || !Array.isArray(roadmapData.topics)) {
      throw new Error('Invalid roadmap structure: topics array missing');
    }

    if (roadmapData.topics.length === 0) {
      throw new Error('No topics generated in roadmap');
    }

    if (!userId) {
      const error = 'User not authenticated. Please log in to save your roadmap.';
      toast.show({
        variant: "destructive",
        title: "Authentication Error",
        description: error,
      });
      throw new Error(error);
    }

    // Convert topics to steps format for MongoDB
    const steps = roadmapData.topics?.flatMap((topic: any, topicIndex: number) => 
      (topic.subtopics || []).map((subtopic: any, subtopicIndex: number) => ({
        id: `step-${topicIndex}-${subtopicIndex}`,
        title: subtopic.title,
        description: subtopic.description,
        resources: subtopic.resources || [],
        completed: false,
        estimatedTime: subtopic.estimatedHours ? `${subtopic.estimatedHours} hours` : '2 hours'
      }))
    ) || [];

    const roadmapPayload: Omit<RoadmapData, 'id'> = {
      userId,
      title: roadmapData.title,
      description: roadmapData.description,
      category: params.domain || 'General',
      difficulty: params.experience === 'beginner' ? 'beginner' : 
                  params.experience === 'advanced' ? 'advanced' : 'intermediate',
      estimatedDuration: params.timeframe || '3 months',
      technologies: params.focusAreas || [],
      steps,
      progress: {
        completedSteps: 0,
        totalSteps: steps.length,
        percentage: 0
      },
      isPublic: false,
      tags: params.currentSkills || [],
      status: 'active'
    };

    const roadmap = await createRoadmap(roadmapPayload);
    
    return roadmap;
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    let errorMessage = error instanceof SyntaxError
      ? 'Failed to parse AI response. The AI response was not valid JSON.'
      : `Failed to generate roadmap: ${error.message}`;

    toast.show({
      variant: "destructive",
      title: "Roadmap Generation Failed",
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const getUserRoadmaps = async (userId: string): Promise<RoadmapData[]> => {
  if (!userId) {
    const error = 'User not authenticated. Please log in to view your roadmaps.';
    toast.show({
      variant: "destructive",
      title: "Authentication Error",
      description: error,
    });
    throw new Error(error);
  }

  try {
    return await fetchUserRoadmaps(userId);
  } catch (error: any) {
    toast.show({
      title: "Failed to Load Roadmaps",
      description: error.message,
    });
    throw error;
  }
};

// This function is now handled by the roadmapService
export { deleteRoadmap } from './roadmapService';

// This function is now handled by the roadmapService
export { updateStepCompletion as updateTopicProgress } from './roadmapService';

// Helper function to update step completion with proper mapping
export const updateStepProgress = async (
  roadmapId: string,
  stepId: string,
  completed: boolean
): Promise<boolean> => {
  const { updateStepCompletion } = await import('./roadmapService');
  return await updateStepCompletion(roadmapId, stepId, completed);
};
