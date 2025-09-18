import { 
  ConversationSession, 
  AIResponse, 
  CodeReview, 
  HintLevel, 
  DSAProblem,
  Message,
  LearningStep,
  ProgressMetrics
} from '../types/conversational';

const API_BASE = '/api/conversational';

export interface StartSessionResponse {
  sessionId: string;
  initialMessage: Message;
  currentStep: LearningStep;
  progress: ProgressMetrics;
}

export interface RespondResponse {
  response: AIResponse;
  currentStep: LearningStep;
  progress: ProgressMetrics;
  conversationHistory: Message[];
}

export interface HintResponse {
  hint: string;
  hintsUsed: number;
}

export interface CodeReviewResponse {
  codeReview: CodeReview;
}

export interface ConversationHistoryResponse {
  history: Message[];
  totalMessages: number;
}

export interface SessionStateResponse extends Omit<ConversationSession, 'conversationHistory'> {
  messageCount: number;
  lastMessage: Message;
}

export class ConversationalAIService {
  /**
   * Start a new guided learning session
   */
  static async startSession(problem: DSAProblem, userId: string): Promise<StartSessionResponse> {
    const response = await fetch(`${API_BASE}/sessions/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ problem, userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start conversation session');
    }

    return response.json();
  }

  /**
   * Send a user response to the AI
   */
  static async sendMessage(
    sessionId: string, 
    message: string, 
    context?: any
  ): Promise<RespondResponse> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process message');
    }

    return response.json();
  }

  /**
   * Request a hint for the current problem
   */
  static async getHint(sessionId: string, hintLevel: HintLevel = 'moderate'): Promise<HintResponse> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hintLevel }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get hint');
    }

    return response.json();
  }

  /**
   * Submit code for AI review
   */
  static async reviewCode(
    sessionId: string, 
    code: string, 
    language: string
  ): Promise<CodeReviewResponse> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/review-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to review code');
    }

    return response.json();
  }

  /**
   * Get conversation history
   */
  static async getConversationHistory(
    sessionId: string, 
    limit: number = 50
  ): Promise<ConversationHistoryResponse> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/history?limit=${limit}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get conversation history');
    }

    return response.json();
  }

  /**
   * Get current session state
   */
  static async getSessionState(sessionId: string): Promise<SessionStateResponse> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get session state');
    }

    return response.json();
  }

  /**
   * Check service health
   */
  static async checkHealth(): Promise<{ status: string; service: string; timestamp: string }> {
    const response = await fetch(`${API_BASE}/health`);

    if (!response.ok) {
      throw new Error('Conversational AI service is not available');
    }

    return response.json();
  }
}

export default ConversationalAIService;