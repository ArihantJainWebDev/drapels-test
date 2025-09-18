import { Roadmap } from "@/types/roadmap";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Update Firebase import path
import { getAuth } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast';

const waitForAuth = async () => {
  const auth = getAuth();
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

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

export const generateRoadmap = async (params: any): Promise<Roadmap> => {
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

    await waitForAuth();
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      const error = 'User not authenticated. Please log in to save your roadmap.';
      toast.show({
        variant: "destructive",
        title: "Authentication Error",
        description: error,
      });
      throw new Error(error);
    }

    const roadmap: Roadmap = {
      id: `roadmap-${Date.now()}`,
      title: roadmapData.title,
      description: roadmapData.description,
      params: params,
      topics: roadmapData.topics.map((topic: any) => ({
        ...topic,
        completed: false,
        progress: 0,
        subtopics: (topic.subtopics || []).map((subtopic: any) => ({
          ...subtopic,
          completed: false
        }))
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      overallProgress: 0,
      userId: user.uid
    };

    const roadmapRef = doc(db, 'users', user.uid, 'roadmaps', roadmap.id);
    await setDoc(roadmapRef, roadmap);
    
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

export const getUserRoadmaps = async (): Promise<Roadmap[]> => {
  const auth = getAuth();
  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });

  const user = auth.currentUser;
  if (!user) {
    const error = 'User not authenticated. Please log in to view your roadmaps.';
    toast.show({
      variant: "destructive",
      title: "Authentication Error",
      description: error,
    });
    throw new Error(error);
  }

  try {
    const roadmapsRef = collection(db, 'users', user.uid, 'roadmaps');
    const snapshot = await getDocs(roadmapsRef);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Roadmap));
  } catch (error: any) {
    toast.show({
      variant: "destructive",
      title: "Failed to Load Roadmaps",
      description: error.message,
    });
    throw error;
  }
};

export const deleteRoadmap = async (roadmapId: string): Promise<boolean> => {
  try {
    await waitForAuth();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      const error = 'User not authenticated. Please log in to delete roadmaps.';
      toast.show({
        variant: "destructive",
        title: "Authentication Error",
        description: error,
      });
      throw new Error(error);
    }

    if (!roadmapId) {
      throw new Error('Invalid roadmap ID');
    }

    const roadmapRef = doc(db, 'users', user.uid, 'roadmaps', roadmapId);
    await deleteDoc(roadmapRef);
    return true;
  } catch (error: any) {
    console.error('Error in deleteRoadmap:', error);
    const errorMessage = `Failed to delete roadmap: ${error.message}`;
    toast.show({
      variant: "destructive",
      title: "Delete Failed",
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

export const updateTopicProgress = async (
  roadmapId: string,
  topicId: string,
  subtopicId: string | null,
  completed: boolean
): Promise<Roadmap | null> => {
  const auth = getAuth();
  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
  
  const user = auth.currentUser;
  if (!user) {
    const error = 'User not authenticated. Please log in to update your progress.';
    toast.show({
      variant: "destructive",
      title: "Authentication Error",
      description: error,
    });
    throw new Error(error);
  }

  const roadmapRef = doc(db, 'users', user.uid, 'roadmaps', roadmapId);
  const roadmapDoc = await getDoc(roadmapRef);
  
  if (!roadmapDoc.exists()) {
    const error = 'Roadmap not found';
    toast.show({
      variant: "destructive",
      title: "Update Failed",
      description: error,
    });
    throw new Error(error);
  }

  const roadmap = roadmapDoc.data() as Roadmap;
  const topic = roadmap.topics.find(t => t.id === topicId);
  
  if (!topic) {
    throw new Error('Topic not found');
  }

  if (subtopicId) {
    const subtopic = topic.subtopics.find(s => s.id === subtopicId);
    if (subtopic) {
      subtopic.completed = completed;
    }
  } else {
    topic.completed = completed;
    if (Array.isArray(topic.subtopics)) {
      topic.subtopics = topic.subtopics.map(subtopic => ({
        ...subtopic,
        completed: completed
      }));
    }
  }

  roadmap.topics.forEach(topic => {
    const completedSubtopics = topic.subtopics.filter(s => s.completed).length;
    topic.progress = topic.subtopics.length > 0 ?
      Math.round((completedSubtopics / topic.subtopics.length) * 100) : 0;
    topic.completed = topic.progress === 100;
  });

  const completedTopics = roadmap.topics.filter(t => t.completed).length;
  roadmap.overallProgress = roadmap.topics.length > 0 ?
    Math.round((completedTopics / roadmap.topics.length) * 100) : 0;
  roadmap.updatedAt = new Date().toISOString();
  
  await setDoc(roadmapRef, roadmap);
  return roadmap;
};