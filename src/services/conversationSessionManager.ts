import { ConversationSession, ConversationMessage } from '@/types/conversational';

const SESSION_STORAGE_KEY = 'conversational_ai_sessions';
const ACTIVE_SESSION_KEY = 'active_conversation_session';
const MAX_STORED_SESSIONS = 10;

export interface StoredSession {
  id: string;
  userId: string;
  problemTitle: string;
  lastActivity: string;
  messageCount: number;
  progress: {
    understanding: number;
    implementation: number;
    optimization: number;
  };
}

export class ConversationSessionManager {
  /**
   * Save a conversation session to local storage
   */
  static saveSession(session: ConversationSession): void {
    try {
      // Save full session data
      localStorage.setItem(`session_${session.id}`, JSON.stringify({
        ...session,
        conversationHistory: session.conversationHistory.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        createdAt: session.createdAt.toISOString(),
        lastActivity: session.lastActivity.toISOString()
      }));

      // Update session list
      const sessions = this.getStoredSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      const storedSession: StoredSession = {
        id: session.id,
        userId: session.userId,
        problemTitle: session.problem.title,
        lastActivity: session.lastActivity.toISOString(),
        messageCount: session.conversationHistory.length,
        progress: {
          understanding: session.userProgress.understanding,
          implementation: session.userProgress.implementation,
          optimization: session.userProgress.optimization
        }
      };

      if (existingIndex >= 0) {
        sessions[existingIndex] = storedSession;
      } else {
        sessions.unshift(storedSession);
      }

      // Keep only the most recent sessions
      const trimmedSessions = sessions.slice(0, MAX_STORED_SESSIONS);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(trimmedSessions));

      // Set as active session
      localStorage.setItem(ACTIVE_SESSION_KEY, session.id);
    } catch (error) {
      console.error('Failed to save conversation session:', error);
    }
  }

  /**
   * Load a conversation session from local storage
   */
  static loadSession(sessionId: string): ConversationSession | null {
    try {
      const sessionData = localStorage.getItem(`session_${sessionId}`);
      if (!sessionData) return null;

      const parsed = JSON.parse(sessionData);
      
      return {
        ...parsed,
        conversationHistory: parsed.conversationHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(parsed.createdAt),
        lastActivity: new Date(parsed.lastActivity)
      };
    } catch (error) {
      console.error('Failed to load conversation session:', error);
      return null;
    }
  }

  /**
   * Get list of stored sessions
   */
  static getStoredSessions(): StoredSession[] {
    try {
      const sessions = localStorage.getItem(SESSION_STORAGE_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Failed to get stored sessions:', error);
      return [];
    }
  }

  /**
   * Get the active session ID
   */
  static getActiveSessionId(): string | null {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
  }

  /**
   * Delete a conversation session
   */
  static deleteSession(sessionId: string): void {
    try {
      // Remove full session data
      localStorage.removeItem(`session_${sessionId}`);

      // Remove from session list
      const sessions = this.getStoredSessions();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(filteredSessions));

      // Clear active session if it was the deleted one
      if (this.getActiveSessionId() === sessionId) {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch (error) {
      console.error('Failed to delete conversation session:', error);
    }
  }

  /**
   * Clear all stored sessions
   */
  static clearAllSessions(): void {
    try {
      const sessions = this.getStoredSessions();
      sessions.forEach(session => {
        localStorage.removeItem(`session_${session.id}`);
      });
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear all sessions:', error);
    }
  }

  /**
   * Export session data for backup
   */
  static exportSession(sessionId: string): string | null {
    const session = this.loadSession(sessionId);
    if (!session) return null;

    return JSON.stringify(session, null, 2);
  }

  /**
   * Import session data from backup
   */
  static importSession(sessionData: string): boolean {
    try {
      const session = JSON.parse(sessionData);
      
      // Validate session structure
      if (!session.id || !session.userId || !session.problem || !session.conversationHistory) {
        throw new Error('Invalid session data structure');
      }

      // Convert date strings back to Date objects
      const restoredSession: ConversationSession = {
        ...session,
        conversationHistory: session.conversationHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(session.createdAt),
        lastActivity: new Date(session.lastActivity)
      };

      this.saveSession(restoredSession);
      return true;
    } catch (error) {
      console.error('Failed to import session:', error);
      return false;
    }
  }

  /**
   * Get session statistics
   */
  static getSessionStats(sessionId: string): {
    totalMessages: number;
    userMessages: number;
    aiMessages: number;
    hintsUsed: number;
    codeReviews: number;
    duration: number; // in minutes
    conceptsLearned: number;
  } | null {
    const session = this.loadSession(sessionId);
    if (!session) return null;

    const userMessages = session.conversationHistory.filter(m => m.role === 'user').length;
    const aiMessages = session.conversationHistory.filter(m => m.role === 'assistant').length;
    const codeReviews = session.conversationHistory.filter(m => m.codeReview).length;
    
    const duration = Math.round(
      (session.lastActivity.getTime() - session.createdAt.getTime()) / (1000 * 60)
    );

    return {
      totalMessages: session.conversationHistory.length,
      userMessages,
      aiMessages,
      hintsUsed: session.userProgress.hintsUsed,
      codeReviews,
      duration,
      conceptsLearned: session.userProgress.conceptsLearned.length
    };
  }

  /**
   * Search sessions by problem title or content
   */
  static searchSessions(query: string): StoredSession[] {
    const sessions = this.getStoredSessions();
    const lowercaseQuery = query.toLowerCase();

    return sessions.filter(session => {
      // Search in problem title
      if (session.problemTitle.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }

      // Search in conversation content
      const fullSession = this.loadSession(session.id);
      if (fullSession) {
        return fullSession.conversationHistory.some(msg =>
          msg.content.toLowerCase().includes(lowercaseQuery)
        );
      }

      return false;
    });
  }

  /**
   * Get sessions by user ID
   */
  static getSessionsByUser(userId: string): StoredSession[] {
    return this.getStoredSessions().filter(session => session.userId === userId);
  }

  /**
   * Auto-cleanup old sessions (older than 30 days)
   */
  static cleanupOldSessions(): void {
    try {
      const sessions = this.getStoredSessions();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const validSessions = sessions.filter(session => {
        const lastActivity = new Date(session.lastActivity);
        const isRecent = lastActivity > thirtyDaysAgo;
        
        if (!isRecent) {
          // Remove the full session data
          localStorage.removeItem(`session_${session.id}`);
        }
        
        return isRecent;
      });

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(validSessions));
    } catch (error) {
      console.error('Failed to cleanup old sessions:', error);
    }
  }

  /**
   * Initialize session manager (call on app startup)
   */
  static initialize(): void {
    // Cleanup old sessions on initialization
    this.cleanupOldSessions();
  }
}

export default ConversationSessionManager;