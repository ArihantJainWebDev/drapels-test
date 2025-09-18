import { 
  ConversationSession, 
  LearningStep, 
  ProgressMetrics, 
  AIResponse,
  ConversationMessage,
  DSAProblem 
} from '@/types/conversational';

export interface FlowControlConfig {
  enableAdaptiveDifficulty: boolean;
  maxHintsPerStep: number;
  progressThresholds: {
    understanding: number;
    implementation: number;
    optimization: number;
  };
  stepTransitionRules: {
    requiresUnderstanding: boolean;
    allowSkipSteps: boolean;
    autoAdvanceOnSuccess: boolean;
  };
}

export interface FlowDecision {
  shouldAdvanceStep: boolean;
  shouldProvideHint: boolean;
  shouldRequestClarification: boolean;
  shouldOfferAlternativeApproach: boolean;
  nextStepSuggestion?: LearningStep;
  adaptedDifficulty?: 'easier' | 'harder' | 'same';
}

export class ConversationFlowController {
  private config: FlowControlConfig;

  constructor(config: Partial<FlowControlConfig> = {}) {
    this.config = {
      enableAdaptiveDifficulty: true,
      maxHintsPerStep: 3,
      progressThresholds: {
        understanding: 70,
        implementation: 60,
        optimization: 50
      },
      stepTransitionRules: {
        requiresUnderstanding: true,
        allowSkipSteps: false,
        autoAdvanceOnSuccess: true
      },
      ...config
    };
  }

  /**
   * Analyze conversation flow and determine next actions
   */
  analyzeFlow(
    session: ConversationSession,
    lastUserMessage: string,
    aiResponse: AIResponse
  ): FlowDecision {
    const currentStep = session.currentStep;
    const progress = session.userProgress;
    const recentMessages = session.conversationHistory.slice(-6);

    // Analyze user engagement and understanding
    const userEngagement = this.assessUserEngagement(recentMessages);
    const conceptualUnderstanding = this.assessConceptualUnderstanding(
      recentMessages, 
      lastUserMessage
    );
    const strugglingIndicators = this.detectStruggling(recentMessages, progress);

    // Make flow decisions
    const decision: FlowDecision = {
      shouldAdvanceStep: false,
      shouldProvideHint: false,
      shouldRequestClarification: false,
      shouldOfferAlternativeApproach: false
    };

    // Step advancement logic
    if (this.shouldAdvanceToNextStep(currentStep, progress, conceptualUnderstanding)) {
      decision.shouldAdvanceStep = true;
      decision.nextStepSuggestion = this.generateNextStep(currentStep, session.problem);
    }

    // Hint provision logic
    if (strugglingIndicators.isStruggling && progress.hintsUsed < this.config.maxHintsPerStep) {
      decision.shouldProvideHint = true;
    }

    // Clarification request logic
    if (userEngagement.isConfused || conceptualUnderstanding < 0.3) {
      decision.shouldRequestClarification = true;
    }

    // Alternative approach logic
    if (strugglingIndicators.needsAlternativeApproach) {
      decision.shouldOfferAlternativeApproach = true;
    }

    // Adaptive difficulty
    if (this.config.enableAdaptiveDifficulty) {
      decision.adaptedDifficulty = this.determineAdaptiveDifficulty(
        progress,
        strugglingIndicators,
        userEngagement
      );
    }

    return decision;
  }

  /**
   * Generate the next learning step based on current progress
   */
  generateNextStep(currentStep: LearningStep, problem: DSAProblem): LearningStep {
    const stepSequence: LearningStep['stepType'][] = [
      'understanding',
      'approach',
      'implementation',
      'optimization'
    ];

    const currentIndex = stepSequence.indexOf(currentStep.stepType);
    const nextIndex = Math.min(currentIndex + 1, stepSequence.length - 1);
    const nextStepType = stepSequence[nextIndex];

    const stepDescriptions = {
      understanding: 'Understanding the problem requirements and constraints',
      approach: 'Developing the algorithmic approach and strategy',
      implementation: 'Implementing the solution with proper code structure',
      optimization: 'Optimizing for time and space complexity'
    };

    return {
      stepNumber: currentStep.stepNumber + 1,
      stepType: nextStepType,
      description: stepDescriptions[nextStepType],
      completed: false
    };
  }

  /**
   * Assess user engagement from recent messages
   */
  private assessUserEngagement(messages: ConversationMessage[]): {
    isEngaged: boolean;
    isConfused: boolean;
    responseQuality: number; // 0-1
  } {
    const userMessages = messages.filter(m => m.role === 'user');
    
    if (userMessages.length === 0) {
      return { isEngaged: false, isConfused: false, responseQuality: 0 };
    }

    const avgMessageLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length;
    const hasQuestions = userMessages.some(msg => msg.content.includes('?'));
    const hasCodeAttempts = userMessages.some(msg => msg.content.includes('```') || msg.content.includes('function'));
    
    // Confusion indicators
    const confusionKeywords = ['confused', 'don\'t understand', 'unclear', 'what do you mean', 'help'];
    const isConfused = userMessages.some(msg => 
      confusionKeywords.some(keyword => msg.content.toLowerCase().includes(keyword))
    );

    // Engagement indicators
    const isEngaged = avgMessageLength > 20 || hasQuestions || hasCodeAttempts;
    
    // Response quality (0-1)
    let responseQuality = 0.5;
    if (avgMessageLength > 50) responseQuality += 0.2;
    if (hasQuestions) responseQuality += 0.2;
    if (hasCodeAttempts) responseQuality += 0.3;
    responseQuality = Math.min(responseQuality, 1);

    return { isEngaged, isConfused, responseQuality };
  }

  /**
   * Assess conceptual understanding from conversation
   */
  private assessConceptualUnderstanding(
    messages: ConversationMessage[], 
    lastMessage: string
  ): number {
    // Keywords indicating good understanding
    const understandingKeywords = [
      'algorithm', 'complexity', 'time', 'space', 'approach', 'strategy',
      'data structure', 'array', 'tree', 'graph', 'hash', 'sort', 'search'
    ];

    // Keywords indicating confusion
    const confusionKeywords = [
      'confused', 'unclear', 'don\'t get', 'what', 'how', 'why'
    ];

    const lastMessageLower = lastMessage.toLowerCase();
    
    let understandingScore = 0.5; // Base score

    // Positive indicators
    const understandingMatches = understandingKeywords.filter(keyword => 
      lastMessageLower.includes(keyword)
    ).length;
    understandingScore += understandingMatches * 0.1;

    // Negative indicators
    const confusionMatches = confusionKeywords.filter(keyword => 
      lastMessageLower.includes(keyword)
    ).length;
    understandingScore -= confusionMatches * 0.15;

    // Code presence indicates higher understanding
    if (lastMessage.includes('```') || lastMessage.includes('function')) {
      understandingScore += 0.2;
    }

    // Question asking indicates engagement but potential confusion
    if (lastMessage.includes('?')) {
      understandingScore += 0.05; // Slight positive for engagement
    }

    return Math.max(0, Math.min(1, understandingScore));
  }

  /**
   * Detect if user is struggling
   */
  private detectStruggling(
    messages: ConversationMessage[], 
    progress: ProgressMetrics
  ): {
    isStruggling: boolean;
    needsAlternativeApproach: boolean;
    strugglingAreas: string[];
  } {
    const recentUserMessages = messages
      .filter(m => m.role === 'user')
      .slice(-3);

    // Struggling indicators
    const strugglingKeywords = [
      'stuck', 'confused', 'don\'t know', 'help', 'difficult', 'hard',
      'can\'t figure', 'not sure', 'lost'
    ];

    const isStruggling = recentUserMessages.some(msg =>
      strugglingKeywords.some(keyword => 
        msg.content.toLowerCase().includes(keyword)
      )
    ) || progress.hintsUsed > 2;

    // Need alternative approach indicators
    const needsAlternativeApproach = 
      progress.hintsUsed >= this.config.maxHintsPerStep ||
      (progress.understanding < 30 && messages.length > 8);

    // Identify struggling areas
    const strugglingAreas: string[] = [];
    if (progress.understanding < this.config.progressThresholds.understanding) {
      strugglingAreas.push('problem understanding');
    }
    if (progress.implementation < this.config.progressThresholds.implementation) {
      strugglingAreas.push('implementation');
    }
    if (progress.optimization < this.config.progressThresholds.optimization) {
      strugglingAreas.push('optimization');
    }

    return { isStruggling, needsAlternativeApproach, strugglingAreas };
  }

  /**
   * Determine if should advance to next step
   */
  private shouldAdvanceToNextStep(
    currentStep: LearningStep,
    progress: ProgressMetrics,
    understanding: number
  ): boolean {
    if (!this.config.stepTransitionRules.autoAdvanceOnSuccess) {
      return false;
    }

    // Check minimum understanding requirement
    if (this.config.stepTransitionRules.requiresUnderstanding && understanding < 0.6) {
      return false;
    }

    // Step-specific advancement criteria
    switch (currentStep.stepType) {
      case 'understanding':
        return progress.understanding >= this.config.progressThresholds.understanding;
      
      case 'approach':
        return progress.understanding >= 70 && understanding > 0.7;
      
      case 'implementation':
        return progress.implementation >= this.config.progressThresholds.implementation;
      
      case 'optimization':
        return false; // Final step, no advancement
      
      default:
        return false;
    }
  }

  /**
   * Determine adaptive difficulty adjustment
   */
  private determineAdaptiveDifficulty(
    progress: ProgressMetrics,
    struggling: { isStruggling: boolean },
    engagement: { responseQuality: number }
  ): 'easier' | 'harder' | 'same' {
    // If struggling significantly, make it easier
    if (struggling.isStruggling && progress.understanding < 40) {
      return 'easier';
    }

    // If progressing well with high engagement, make it harder
    if (progress.understanding > 80 && 
        progress.implementation > 70 && 
        engagement.responseQuality > 0.8) {
      return 'harder';
    }

    return 'same';
  }

  /**
   * Generate contextual prompts based on flow analysis
   */
  generateContextualPrompts(decision: FlowDecision, session: ConversationSession): {
    systemPrompt: string;
    userGuidance: string;
  } {
    let systemPrompt = "You are Neuron, an AI tutor using the Socratic method. ";
    let userGuidance = "";

    if (decision.shouldProvideHint) {
      systemPrompt += "The user seems to be struggling. Provide a gentle hint without giving away the solution. ";
      userGuidance = "I notice you might need some guidance. Let me provide a hint to help you move forward.";
    }

    if (decision.shouldRequestClarification) {
      systemPrompt += "The user seems confused. Ask clarifying questions to understand their confusion. ";
      userGuidance = "I want to make sure I understand where you're at. Could you clarify your current thinking?";
    }

    if (decision.shouldOfferAlternativeApproach) {
      systemPrompt += "The current approach isn't working. Suggest an alternative way to think about the problem. ";
      userGuidance = "Let's try a different approach to this problem. Sometimes a fresh perspective helps!";
    }

    if (decision.shouldAdvanceStep) {
      systemPrompt += "The user is ready to advance to the next step. Guide them smoothly to the next phase. ";
      userGuidance = "Great progress! You're ready to move to the next step in solving this problem.";
    }

    if (decision.adaptedDifficulty === 'easier') {
      systemPrompt += "Simplify your explanations and break down concepts into smaller steps. ";
    } else if (decision.adaptedDifficulty === 'harder') {
      systemPrompt += "You can challenge the user with more advanced concepts and edge cases. ";
    }

    return { systemPrompt, userGuidance };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<FlowControlConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): FlowControlConfig {
    return { ...this.config };
  }
}

export default ConversationFlowController;