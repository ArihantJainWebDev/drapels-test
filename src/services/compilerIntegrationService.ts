import { DSAProblem } from '@/lib/DSAProblemsData';
import { LearningTopic, CodeExample } from '@/types/documentation';
import { documentationProgressService } from './documentationProgressService';

export interface CompilerSession {
  id: string;
  type: 'dsa-problem' | 'documentation-exercise' | 'neuron-guided' | 'free-coding';
  sourceId: string; // DSA problem ID, topic ID, etc.
  language: string;
  code: string;
  startTime: Date;
  lastModified: Date;
  executionCount: number;
  isCompleted: boolean;
  timeSpent: number;
  metadata?: {
    problemTitle?: string;
    difficulty?: string;
    topic?: string;
    hints?: string[];
    testCases?: any[];
  };
}

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  author: string;
  createdAt: Date;
  isPublic: boolean;
  likes: number;
  forks: number;
  sourceType?: 'dsa-solution' | 'documentation-example' | 'user-creation';
  sourceId?: string;
}

export interface CompilerProgress {
  totalSessions: number;
  completedProblems: number;
  totalExecutions: number;
  totalTimeSpent: number;
  languageStats: Record<string, {
    sessionsCount: number;
    executionCount: number;
    timeSpent: number;
  }>;
  recentSessions: CompilerSession[];
  achievements: CompilerAchievement[];
}

export interface CompilerAchievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: Date;
  type: 'execution' | 'completion' | 'streak' | 'language' | 'sharing';
}

class CompilerIntegrationService {
  private readonly SESSIONS_KEY = 'compiler_sessions';
  private readonly SNIPPETS_KEY = 'code_snippets';
  private readonly PROGRESS_KEY = 'compiler_progress';

  // Session Management
  createSession(type: CompilerSession['type'], sourceId: string, language: string, initialCode?: string): CompilerSession {
    const session: CompilerSession = {
      id: this.generateId(),
      type,
      sourceId,
      language,
      code: initialCode || this.getDefaultCode(language),
      startTime: new Date(),
      lastModified: new Date(),
      executionCount: 0,
      isCompleted: false,
      timeSpent: 0,
      metadata: this.getSessionMetadata(type, sourceId)
    };

    this.saveSession(session);
    return session;
  }

  getSession(sessionId: string): CompilerSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  updateSession(sessionId: string, updates: Partial<CompilerSession>): void {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    
    if (index >= 0) {
      sessions[index] = { 
        ...sessions[index], 
        ...updates, 
        lastModified: new Date() 
      };
      this.saveSessions(sessions);
    }
  }

  completeSession(sessionId: string, finalCode: string): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    const timeSpent = Date.now() - session.startTime.getTime();
    
    this.updateSession(sessionId, {
      code: finalCode,
      isCompleted: true,
      timeSpent: Math.floor(timeSpent / 1000 / 60) // minutes
    });

    // Update progress tracking based on session type
    this.updateProgressFromSession(session);
    
    // Check for achievements
    this.checkCompilerAchievements();
  }

  // DSA Integration
  createDSASession(problem: DSAProblem, language: string): CompilerSession {
    const initialCode = this.getDSAStarterCode(problem, language);
    return this.createSession('dsa-problem', problem.id, language, initialCode);
  }

  getDSAStarterCode(problem: DSAProblem, language: string): string {
    // Generate starter code based on problem and language
    const templates: Record<string, string> = {
      javascript: `// ${problem.title}\n// Difficulty: ${problem.difficulty}\n// Pattern: ${problem.pattern}\n\nfunction solution() {\n    // Your code here\n    \n}\n\n// Test cases\nconsole.log(solution());`,
      python: `# ${problem.title}\n# Difficulty: ${problem.difficulty}\n# Pattern: ${problem.pattern}\n\ndef solution():\n    # Your code here\n    pass\n\n# Test cases\nprint(solution())`,
      java: `// ${problem.title}\n// Difficulty: ${problem.difficulty}\n// Pattern: ${problem.pattern}\n\npublic class Solution {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        // Test cases\n        System.out.println(sol.solution());\n    }\n    \n    public Object solution() {\n        // Your code here\n        return null;\n    }\n}`,
      cpp: `// ${problem.title}\n// Difficulty: ${problem.difficulty}\n// Pattern: ${problem.pattern}\n\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    auto solution() {\n        // Your code here\n        \n    }\n};\n\nint main() {\n    Solution sol;\n    // Test cases\n    cout << "Result: " << endl;\n    return 0;\n}`
    };

    return templates[language] || templates.javascript;
  }

  // Documentation Integration
  createDocumentationSession(topic: LearningTopic, example: CodeExample): CompilerSession {
    return this.createSession('documentation-exercise', topic.id, example.language, example.code);
  }

  // Neuron Integration
  createNeuronSession(problemId: string, language: string, guidedCode?: string): CompilerSession {
    return this.createSession('neuron-guided', problemId, language, guidedCode);
  }

  // Code Snippet Sharing
  createSnippet(session: CompilerSession, title: string, description: string, isPublic: boolean = false): CodeSnippet {
    const snippet: CodeSnippet = {
      id: this.generateId(),
      title,
      description,
      code: session.code,
      language: session.language,
      tags: this.generateTags(session),
      author: 'current-user', // Would be actual user ID in real app
      createdAt: new Date(),
      isPublic,
      likes: 0,
      forks: 0,
      sourceType: this.getSnippetSourceType(session.type),
      sourceId: session.sourceId
    };

    this.saveSnippet(snippet);
    return snippet;
  }

  getSnippets(filters?: { language?: string; tags?: string[]; isPublic?: boolean }): CodeSnippet[] {
    const snippets = this.getAllSnippets();
    
    if (!filters) return snippets;

    return snippets.filter(snippet => {
      if (filters.language && snippet.language !== filters.language) return false;
      if (filters.isPublic !== undefined && snippet.isPublic !== filters.isPublic) return false;
      if (filters.tags && !filters.tags.some(tag => snippet.tags.includes(tag))) return false;
      return true;
    });
  }

  forkSnippet(snippetId: string): CodeSnippet | null {
    const snippet = this.getSnippets().find(s => s.id === snippetId);
    if (!snippet) return null;

    const forkedSnippet: CodeSnippet = {
      ...snippet,
      id: this.generateId(),
      title: `${snippet.title} (Fork)`,
      author: 'current-user',
      createdAt: new Date(),
      likes: 0,
      forks: 0
    };

    // Update original snippet fork count
    const snippets = this.getAllSnippets();
    const originalIndex = snippets.findIndex(s => s.id === snippetId);
    if (originalIndex >= 0) {
      snippets[originalIndex].forks++;
      this.saveSnippets(snippets);
    }

    this.saveSnippet(forkedSnippet);
    return forkedSnippet;
  }

  // Progress Tracking
  getProgress(): CompilerProgress {
    try {
      const stored = localStorage.getItem(this.PROGRESS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultProgress();
    } catch (error) {
      console.error('Error loading compiler progress:', error);
      return this.getDefaultProgress();
    }
  }

  private updateProgressFromSession(session: CompilerSession): void {
    const progress = this.getProgress();
    
    progress.totalSessions++;
    progress.totalExecutions += session.executionCount;
    progress.totalTimeSpent += session.timeSpent;
    
    if (session.isCompleted) {
      progress.completedProblems++;
    }

    // Update language stats
    if (!progress.languageStats[session.language]) {
      progress.languageStats[session.language] = {
        sessionsCount: 0,
        executionCount: 0,
        timeSpent: 0
      };
    }
    
    const langStats = progress.languageStats[session.language];
    langStats.sessionsCount++;
    langStats.executionCount += session.executionCount;
    langStats.timeSpent += session.timeSpent;

    // Update recent sessions
    progress.recentSessions = [session, ...progress.recentSessions.slice(0, 9)];

    this.saveProgress(progress);

    // Sync with documentation progress if applicable
    if (session.type === 'documentation-exercise' && session.isCompleted) {
      documentationProgressService.completeTopicInPath(
        'compiler-practice', 
        session.sourceId, 
        session.timeSpent
      );
    }
  }

  // Achievement System
  private checkCompilerAchievements(): void {
    const progress = this.getProgress();
    const achievements = progress.achievements;

    // First execution
    if (progress.totalExecutions === 1 && !achievements.find(a => a.id === 'first-execution')) {
      achievements.push({
        id: 'first-execution',
        title: 'Hello World',
        description: 'Executed your first program!',
        iconName: 'Play',
        unlockedAt: new Date(),
        type: 'execution'
      });
    }

    // 10 completed problems
    if (progress.completedProblems === 10 && !achievements.find(a => a.id === 'problem-solver')) {
      achievements.push({
        id: 'problem-solver',
        title: 'Problem Solver',
        description: 'Completed 10 coding problems!',
        iconName: 'Target',
        unlockedAt: new Date(),
        type: 'completion'
      });
    }

    // Multi-language user
    const languageCount = Object.keys(progress.languageStats).length;
    if (languageCount >= 3 && !achievements.find(a => a.id === 'polyglot')) {
      achievements.push({
        id: 'polyglot',
        title: 'Polyglot',
        description: 'Coded in 3 different languages!',
        iconName: 'Globe',
        unlockedAt: new Date(),
        type: 'language'
      });
    }

    this.saveProgress(progress);
  }

  // Utility Methods
  private getAllSessions(): CompilerSession[] {
    try {
      const stored = localStorage.getItem(this.SESSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  private saveSession(session: CompilerSession): void {
    const sessions = this.getAllSessions();
    sessions.push(session);
    this.saveSessions(sessions);
  }

  private saveSessions(sessions: CompilerSession[]): void {
    try {
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  private getAllSnippets(): CodeSnippet[] {
    try {
      const stored = localStorage.getItem(this.SNIPPETS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading snippets:', error);
      return [];
    }
  }

  private saveSnippet(snippet: CodeSnippet): void {
    const snippets = this.getAllSnippets();
    snippets.push(snippet);
    this.saveSnippets(snippets);
  }

  private saveSnippets(snippets: CodeSnippet[]): void {
    try {
      localStorage.setItem(this.SNIPPETS_KEY, JSON.stringify(snippets));
    } catch (error) {
      console.error('Error saving snippets:', error);
    }
  }

  private saveProgress(progress: CompilerProgress): void {
    try {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  private getDefaultProgress(): CompilerProgress {
    return {
      totalSessions: 0,
      completedProblems: 0,
      totalExecutions: 0,
      totalTimeSpent: 0,
      languageStats: {},
      recentSessions: [],
      achievements: []
    };
  }

  private getDefaultCode(language: string): string {
    const templates: Record<string, string> = {
      javascript: 'console.log("Hello, World!");',
      python: 'print("Hello, World!")',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}'
    };
    return templates[language] || templates.javascript;
  }

  private getSessionMetadata(type: CompilerSession['type'], sourceId: string): CompilerSession['metadata'] {
    // This would fetch metadata based on type and sourceId
    // For now, return basic metadata
    return {
      problemTitle: `Problem ${sourceId}`,
      difficulty: 'medium',
      topic: 'general'
    };
  }

  private generateTags(session: CompilerSession): string[] {
    const tags = [session.language, session.type];
    if (session.metadata?.difficulty) tags.push(session.metadata.difficulty);
    if (session.metadata?.topic) tags.push(session.metadata.topic);
    return tags;
  }

  private getSnippetSourceType(sessionType: CompilerSession['type']): CodeSnippet['sourceType'] {
    switch (sessionType) {
      case 'dsa-problem': return 'dsa-solution';
      case 'documentation-exercise': return 'documentation-example';
      default: return 'user-creation';
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const compilerIntegrationService = new CompilerIntegrationService();