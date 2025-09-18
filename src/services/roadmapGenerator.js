import { collection, getDocs, deleteDoc, getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.ts';
import { getAuth } from 'firebase/auth';
import { updateRoadmapProgress } from './unifiedProgressService';
import { toast } from "@/components/ui/use-toast";

// Read from Vite env. Note: frontend envs are not secret at runtime; prefer a backend proxy for real secrecy.
const QROQ_API_KEY_ROADMAP = import.meta.env?.VITE_QROQ_API_KEY_ROADMAP?.trim();
if (!QROQ_API_KEY_ROADMAP) {
  // eslint-disable-next-line no-console
  console.error('Missing VITE_QROQ_API_KEY_ROADMAP. Define it in frontend/.env.local');
}

const waitForAuth = async () => {
  const auth = getAuth();
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Safely extract and parse JSON from LLM responses
function parseRoadmapJSON(raw) {
  if (!raw || typeof raw !== 'string') throw new Error('Empty AI response');
  let s = raw.trim();
  // Strip markdown code fences
  s = s.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  // Heuristic: extract first '{' to last '}'
  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first >= 0 && last > first) {
    s = s.slice(first, last + 1);
  }
  // Remove trailing commas before } or ]
  s = s.replace(/,\s*(\}|\])/g, '$1');
  // Normalize quotes around object keys if any accidental backticks occurred
  // (keep minimal to avoid corrupting URLs)
  try {
    return JSON.parse(s);
  } catch (e) {
    // Last resort: remove control characters
    const cleaned = s.replace(/[\u0000-\u001F]+/g, '');
    return JSON.parse(cleaned);
  }
}

export async function generateRoadmap(params) {
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
    console.log('Starting roadmap generation with params:', params);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QROQ_API_KEY_ROADMAP}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content ?? '';

    const roadmapData = parseRoadmapJSON(content);

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
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error,
      });
      throw new Error(error);
    }

    const roadmap = {
      id: `roadmap-${Date.now()}`,
      title: roadmapData.title,
      description: roadmapData.description,
      totalEstimatedHours: roadmapData.totalEstimatedHours,
      params: params,
      topics: roadmapData.topics.map(topic => ({
        ...topic,
        completed: false,
        progress: 0,
        subtopics: (topic.subtopics || []).map(subtopic => ({
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
    
    // Track roadmap progress
    try {
      await updateRoadmapProgress(user.uid, roadmap.id, 0, roadmap.title);
    } catch (progressError) {
      console.error('Error tracking roadmap progress:', progressError);
    }
    
    return roadmap;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    let errorMessage = error instanceof SyntaxError
      ? 'Failed to parse AI response. The AI response was not valid JSON.'
      : `Failed to generate roadmap: ${error.message}`;

    toast({
      variant: "destructive",
      title: "Roadmap Generation Failed",
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
}

export async function getUserRoadmaps() {
  const auth = getAuth();
  
  // Wait for auth state to be initialized
  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });

  const user = auth.currentUser;
  if (!user) {
    const error = 'User not authenticated. Please log in to view your roadmaps.';
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: error,
    });
    throw new Error(error);
  }

  try {
    const roadmapsRef = collection(db, 'users', user.uid, 'roadmaps');
    const snapshot = await getDocs(roadmapsRef);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Failed to Load Roadmaps",
      description: error.message,
    });
    throw error;
  }
}

export async function deleteRoadmap(roadmapId) {
  try {
    await waitForAuth();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      const error = 'User not authenticated. Please log in to delete roadmaps.';
      toast({
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
  } catch (error) {
    console.error('Error in deleteRoadmap:', error);
    const errorMessage = `Failed to delete roadmap: ${error.message}`;
    toast({
      variant: "destructive",
      title: "Delete Failed",
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }
}

export async function updateTopicProgress(roadmapId, topicId, subtopicId, completed) {
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
    toast({
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
    toast({
      variant: "destructive",
      title: "Update Failed",
      description: error,
    });
    throw new Error(error);
  }
  const roadmap = roadmapDoc.data();
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
  
  // Also update the unified userProgress collection
  try {
    await updateRoadmapProgress(user.uid, roadmapId, roadmap.overallProgress, roadmap.title);
  } catch (progressError) {
    console.error('Error updating unified roadmap progress:', progressError);
    // Don't throw error here to maintain backward compatibility
  }
  
  return roadmap;
}
