import { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { 
  ConversationSession, 
  ConversationMessage, 
  LearningStep, 
  ProgressMetrics, 
  DSAProblem, 
  HintLevel, 
  CodeReview,
  UseConversationalAI 
} from '../types/conversational';
import ConversationalAIService from '../services/conversationalAIService';
import ConversationSessionManager from '../services/conversationSessionManager';
import ConversationFlowController from '../services/conversationFlowController';
import { toast } from 'sonner';

// State interface
interface ConversationalAIState {
  session: ConversationSession | null;
  messages: ConversationMessage[];
  currentStep: LearningStep | null;
  progress: ProgressMetrics | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
}

// Action types
type ConversationalAIAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SESSION'; payload: ConversationSession }
  | { type: 'SET_MESSAGES'; payload: ConversationMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ConversationMessage }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<ConversationMessage> } }
  | { type: 'SET_CURRENT_STEP'; payload: LearningStep }
  | { type: 'SET_PROGRESS'; payload: ProgressMetrics }
  | { type: 'RESET_SESSION' };

// Initial state
const initialState: ConversationalAIState = {
  session: null,
  messages: [],
  currentStep: null,
  progress: null,
  isLoading: false,
  isTyping: false,
  error: null,
};

// Reducer
function conversationalAIReducer(
  state: ConversationalAIState, 
  action: ConversationalAIAction
): ConversationalAIState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isTyping: false };
    
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload] 
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id 
            ? { ...msg, ...action.payload.updates }
            : msg
        )
      };
    
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    
    case 'RESET_SESSION':
      return initialState;
    
    default:
      return state;
  }
}

// Context
const ConversationalAIContext = createContext<UseConversationalAI | null>(null);

// Provider component
interface ConversationalAIProviderProps {
  children: ReactNode;
  userId: string;
}

export function ConversationalAIProvider({ children, userId }: ConversationalAIProviderProps) {
  const [state, dispatch] = useReducer(conversationalAIReducer, initialState);
  const flowController = new ConversationFlowController();

  // Initialize session manager and try to restore active session
  useEffect(() => {
    ConversationSessionManager.initialize();
    
    const activeSessionId = ConversationSessionManager.getActiveSessionId();
    if (activeSessionId) {
      const savedSession = ConversationSessionManager.loadSession(activeSessionId);
      if (savedSession && savedSession.userId === userId) {
        dispatch({ type: 'SET_SESSION', payload: savedSession });
        dispatch({ type: 'SET_MESSAGES', payload: savedSession.conversationHistory.map(formatMessage) });
        dispatch({ type: 'SET_CURRENT_STEP', payload: savedSession.currentStep });
        dispatch({ type: 'SET_PROGRESS', payload: savedSession.userProgress });
        toast.info('Previous conversation restored!');
      }
    }
  }, [userId]);

  // Auto-save session when it changes
  useEffect(() => {
    if (state.session) {
      ConversationSessionManager.saveSession(state.session);
    }
  }, [state.session, state.messages, state.currentStep, state.progress]);

  // Helper function to format messages for display
  const formatMessage = (message: any): ConversationMessage => ({
    ...message,
    timestamp: new Date(message.timestamp),
    displayTimestamp: new Date(message.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  });

  // Start a new conversation session
  const startSession = useCallback(async (problem: DSAProblem) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await ConversationalAIService.startSession(problem, userId);
      
      // Create session object
      const session: ConversationSession = {
        id: response.sessionId,
        userId,
        problem,
        conversationHistory: [response.initialMessage],
        currentStep: response.currentStep,
        userProgress: response.progress,
        createdAt: new Date(),
        lastActivity: new Date()
      };

      dispatch({ type: 'SET_SESSION', payload: session });
      dispatch({ type: 'SET_MESSAGES', payload: [formatMessage(response.initialMessage)] });
      dispatch({ type: 'SET_CURRENT_STEP', payload: response.currentStep });
      dispatch({ type: 'SET_PROGRESS', payload: response.progress });

      toast.success('Conversation started! Neuron is ready to guide you.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start session';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [userId]);

  // Send a message to the AI
  const sendMessage = useCallback(async (message: string, context?: any) => {
    if (!state.session) {
      toast.error('No active session. Please start a conversation first.');
      return;
    }

    try {
      dispatch({ type: 'SET_TYPING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Add user message immediately
      const userMessage: ConversationMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: message,
        type: 'response',
        timestamp: new Date(),
        stepNumber: state.currentStep?.stepNumber || 1,
        displayTimestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Send to AI and get response
      const response = await ConversationalAIService.sendMessage(
        state.session.id, 
        message, 
        context
      );

      // Add AI response
      const aiMessage = formatMessage({
        ...response.response,
        id: `ai_${Date.now()}`,
        role: 'assistant',
        stepNumber: response.currentStep.stepNumber,
        timestamp: new Date()
      });

      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      dispatch({ type: 'SET_CURRENT_STEP', payload: response.currentStep });
      dispatch({ type: 'SET_PROGRESS', payload: response.progress });

      // Update session with new messages and progress
      if (state.session) {
        const updatedSession: ConversationSession = {
          ...state.session,
          conversationHistory: [...state.session.conversationHistory, userMessage, aiMessage],
          currentStep: response.currentStep,
          userProgress: response.progress,
          lastActivity: new Date()
        };
        dispatch({ type: 'SET_SESSION', payload: updatedSession });

        // Analyze conversation flow for adaptive guidance
        const flowDecision = flowController.analyzeFlow(
          updatedSession,
          message,
          response.response
        );

        // Apply flow decisions (could trigger additional AI interactions)
        if (flowDecision.shouldAdvanceStep && flowDecision.nextStepSuggestion) {
          toast.success(`Moving to next step: ${flowDecision.nextStepSuggestion.description}`);
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [state.session, state.currentStep]);

  // Get a hint
  const getHint = useCallback(async (level: HintLevel = 'moderate'): Promise<string> => {
    if (!state.session) {
      toast.error('No active session. Please start a conversation first.');
      return '';
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await ConversationalAIService.getHint(state.session.id, level);
      
      // Add hint as a message
      const hintMessage: ConversationMessage = {
        id: `hint_${Date.now()}`,
        role: 'assistant',
        content: response.hint,
        type: 'hint',
        timestamp: new Date(),
        stepNumber: state.currentStep?.stepNumber || 1,
        displayTimestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      dispatch({ type: 'ADD_MESSAGE', payload: hintMessage });
      
      // Update progress with new hint count
      if (state.progress) {
        dispatch({ 
          type: 'SET_PROGRESS', 
          payload: { ...state.progress, hintsUsed: response.hintsUsed }
        });
      }

      toast.success(`Hint provided! (${response.hintsUsed} hints used)`);
      return response.hint;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get hint';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return '';
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.session, state.currentStep, state.progress]);

  // Review code
  const reviewCode = useCallback(async (code: string, language: string): Promise<CodeReview> => {
    if (!state.session) {
      toast.error('No active session. Please start a conversation first.');
      return {
        correctness: '',
        suggestions: [],
        edgeCases: [],
        optimizations: [],
        conceptsUsed: []
      };
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await ConversationalAIService.reviewCode(
        state.session.id, 
        code, 
        language
      );

      // Add code review as a message
      const reviewMessage: ConversationMessage = {
        id: `review_${Date.now()}`,
        role: 'assistant',
        content: 'Here\'s my review of your code:',
        type: 'correction',
        timestamp: new Date(),
        stepNumber: state.currentStep?.stepNumber || 1,
        codeReview: response.codeReview,
        displayTimestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      dispatch({ type: 'ADD_MESSAGE', payload: reviewMessage });
      toast.success('Code review completed!');
      
      return response.codeReview;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to review code';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return {
        correctness: '',
        suggestions: [],
        edgeCases: [],
        optimizations: [],
        conceptsUsed: []
      };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.session, state.currentStep]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Reset session
  const resetSession = useCallback(() => {
    if (state.session) {
      ConversationSessionManager.deleteSession(state.session.id);
    }
    dispatch({ type: 'RESET_SESSION' });
    toast.info('Session reset. Ready to start a new conversation.');
  }, [state.session]);

  // Load a previous session
  const loadSession = useCallback((sessionId: string) => {
    const savedSession = ConversationSessionManager.loadSession(sessionId);
    if (savedSession && savedSession.userId === userId) {
      dispatch({ type: 'SET_SESSION', payload: savedSession });
      dispatch({ type: 'SET_MESSAGES', payload: savedSession.conversationHistory.map(formatMessage) });
      dispatch({ type: 'SET_CURRENT_STEP', payload: savedSession.currentStep });
      dispatch({ type: 'SET_PROGRESS', payload: savedSession.userProgress });
      toast.success('Session loaded successfully!');
    } else {
      toast.error('Failed to load session');
    }
  }, [userId]);

  // Get stored sessions
  const getStoredSessions = useCallback(() => {
    return ConversationSessionManager.getSessionsByUser(userId);
  }, [userId]);

  // Delete a stored session
  const deleteStoredSession = useCallback((sessionId: string) => {
    ConversationSessionManager.deleteSession(sessionId);
    toast.success('Session deleted');
  }, []);

  // Export session
  const exportSession = useCallback((sessionId: string) => {
    const exportData = ConversationSessionManager.exportSession(sessionId);
    if (exportData) {
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-session-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Session exported successfully!');
    } else {
      toast.error('Failed to export session');
    }
  }, []);

  // Import session
  const importSession = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (ConversationSessionManager.importSession(content)) {
        toast.success('Session imported successfully!');
      } else {
        toast.error('Failed to import session');
      }
    };
    reader.readAsText(file);
  }, []);

  const value: UseConversationalAI = {
    // State
    session: state.session,
    messages: state.messages,
    currentStep: state.currentStep,
    progress: state.progress,
    isLoading: state.isLoading,
    isTyping: state.isTyping,
    error: state.error,

    // Actions
    startSession,
    sendMessage,
    getHint,
    reviewCode,
    clearError,
    resetSession,
    loadSession,
    getStoredSessions,
    deleteStoredSession,
    exportSession,
    importSession,
  };

  return (
    <ConversationalAIContext.Provider value={value}>
      {children}
    </ConversationalAIContext.Provider>
  );
}

// Hook to use the context
export function useConversationalAI(): UseConversationalAI {
  const context = useContext(ConversationalAIContext);
  if (!context) {
    throw new Error('useConversationalAI must be used within a ConversationalAIProvider');
  }
  return context;
}

export default ConversationalAIContext;