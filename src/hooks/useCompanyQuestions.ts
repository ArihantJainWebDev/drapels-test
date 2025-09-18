import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  CompanyQuestion, 
  QuestionFilter, 
  QuestionSearchResult,
  CompanyQuestionAnalytics,
  RoleBasedQuestionSet,
  QuestionGenerationRequest,
  QuestionGenerationResponse,
  CompanyQuestionDatabase
} from '@/types/companyQuestions';
import { CompanyQuestionService } from '@/services/companyQuestionService';

export interface UseCompanyQuestionsOptions {
  autoInitialize?: boolean;
  defaultFilters?: Partial<QuestionFilter>;
}

export interface CompanyQuestionsState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  searchResults: QuestionSearchResult | null;
  analytics: CompanyQuestionAnalytics | null;
  roleBasedSet: RoleBasedQuestionSet | null;
  companyDatabase: CompanyQuestionDatabase | null;
}

export const useCompanyQuestions = (options: UseCompanyQuestionsOptions = {}) => {
  const { autoInitialize = true, defaultFilters = {} } = options;
  const { toast } = useToast();

  // State
  const [state, setState] = useState<CompanyQuestionsState>({
    initialized: false,
    loading: false,
    error: null,
    searchResults: null,
    analytics: null,
    roleBasedSet: null,
    companyDatabase: null
  });

  // Filters
  const [filters, setFilters] = useState<QuestionFilter>({
    companies: [],
    roles: [],
    categories: [],
    difficulties: [],
    tags: [],
    interviewRounds: [],
    questionTypes: [],
    verified: true,
    ...defaultFilters
  });

  // Initialize service
  const initialize = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await CompanyQuestionService.initialize();
      setState(prev => ({ 
        ...prev, 
        initialized: true, 
        loading: false 
      }));
    } catch (error) {
      const errorMessage = 'Failed to initialize company question service';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      toast({
        title: 'Initialization Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Search questions
  const searchQuestions = useCallback(async (customFilters?: Partial<QuestionFilter>) => {
    const searchFilters = { ...filters, ...customFilters };
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const results = await CompanyQuestionService.searchQuestions(searchFilters);
      setState(prev => ({ 
        ...prev, 
        searchResults: results,
        loading: false 
      }));
      return results;
    } catch (error) {
      const errorMessage = 'Failed to search questions';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      toast({
        title: 'Search Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [filters, toast]);

  // Get company questions
  const getCompanyQuestions = useCallback(async (
    companyId: string, 
    customFilters?: Partial<QuestionFilter>
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const questions = await CompanyQuestionService.getCompanyQuestions(companyId, customFilters);
      setState(prev => ({ ...prev, loading: false }));
      return questions;
    } catch (error) {
      const errorMessage = 'Failed to get company questions';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Get role-based question set
  const getRoleBasedQuestionSet = useCallback(async (companyId: string, roleId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const roleSet = await CompanyQuestionService.getRoleBasedQuestionSet(companyId, roleId);
      setState(prev => ({ 
        ...prev, 
        roleBasedSet: roleSet,
        loading: false 
      }));
      return roleSet;
    } catch (error) {
      const errorMessage = 'Failed to get role-based question set';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Analyze company patterns
  const analyzeCompanyPatterns = useCallback(async (companyId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const analytics = await CompanyQuestionService.analyzeCompanyPatterns(companyId);
      setState(prev => ({ 
        ...prev, 
        analytics,
        loading: false 
      }));
      return analytics;
    } catch (error) {
      const errorMessage = 'Failed to analyze company patterns';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      toast({
        title: 'Analytics Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Generate questions
  const generateQuestions = useCallback(async (request: QuestionGenerationRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await CompanyQuestionService.generateQuestions(request);
      
      // Update search results if they exist
      setState(prev => {
        const updatedSearchResults = prev.searchResults ? {
          ...prev.searchResults,
          questions: [...response.questions, ...prev.searchResults.questions],
          totalCount: prev.searchResults.totalCount + response.questions.length
        } : null;

        return {
          ...prev,
          searchResults: updatedSearchResults,
          loading: false
        };
      });

      toast({
        title: 'Questions Generated',
        description: `Successfully generated ${response.questions.length} questions.`
      });

      return response;
    } catch (error) {
      const errorMessage = 'Failed to generate questions';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      toast({
        title: 'Generation Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Get company database
  const getCompanyDatabase = useCallback(async (companyId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const database = await CompanyQuestionService.getCompanyDatabase(companyId);
      setState(prev => ({ 
        ...prev, 
        companyDatabase: database,
        loading: false 
      }));
      return database;
    } catch (error) {
      const errorMessage = 'Failed to get company database';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      toast({
        title: 'Database Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Filter management
  const updateFilter = useCallback((key: keyof QuestionFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleFilterValue = useCallback((key: keyof QuestionFilter, value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] as string[] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      companies: [],
      roles: [],
      categories: [],
      difficulties: [],
      tags: [],
      interviewRounds: [],
      questionTypes: [],
      verified: true,
      ...defaultFilters
    });
  }, [defaultFilters]);

  // Clear state
  const clearState = useCallback(() => {
    setState({
      initialized: false,
      loading: false,
      error: null,
      searchResults: null,
      analytics: null,
      roleBasedSet: null,
      companyDatabase: null
    });
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInitialize && !state.initialized && !state.loading) {
      initialize().catch(console.error);
    }
  }, [autoInitialize, state.initialized, state.loading, initialize]);

  // Auto-search when filters change (debounced)
  useEffect(() => {
    if (!state.initialized) return;

    const debounceTimer = setTimeout(() => {
      searchQuestions().catch(console.error);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, state.initialized, searchQuestions]);

  // Utility functions
  const getFilteredQuestions = useCallback((customFilters?: Partial<QuestionFilter>) => {
    if (!state.searchResults) return [];
    
    const searchFilters = { ...filters, ...customFilters };
    return state.searchResults.questions.filter(question => {
      // Apply custom filtering logic here if needed
      return true;
    });
  }, [state.searchResults, filters]);

  const getQuestionsByCompany = useCallback((companyId: string) => {
    if (!state.searchResults) return [];
    return state.searchResults.questions.filter(q => q.companyId === companyId);
  }, [state.searchResults]);

  const getQuestionsByRole = useCallback((roleId: string) => {
    if (!state.searchResults) return [];
    return state.searchResults.questions.filter(q => q.roleIds.includes(roleId));
  }, [state.searchResults]);

  const getQuestionsByCategory = useCallback((category: string) => {
    if (!state.searchResults) return [];
    return state.searchResults.questions.filter(q => q.category === category);
  }, [state.searchResults]);

  const getQuestionsByDifficulty = useCallback((difficulty: string) => {
    if (!state.searchResults) return [];
    return state.searchResults.questions.filter(q => q.difficulty === difficulty);
  }, [state.searchResults]);

  const getQuestionStats = useCallback(() => {
    if (!state.searchResults) return null;

    const questions = state.searchResults.questions;
    const totalQuestions = questions.length;
    
    if (totalQuestions === 0) return null;

    const categoryStats = questions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const difficultyStats = questions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const companyStats = questions.reduce((acc, q) => {
      acc[q.companyId] = (acc[q.companyId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageFrequency = questions.reduce((sum, q) => sum + q.companySpecific.frequency, 0) / totalQuestions;
    const averageSuccessRate = questions.reduce((sum, q) => sum + q.companySpecific.successRate, 0) / totalQuestions;
    const averageTime = questions.reduce((sum, q) => sum + (q.timeLimit || 5), 0) / totalQuestions;

    return {
      totalQuestions,
      categoryStats,
      difficultyStats,
      companyStats,
      averageFrequency,
      averageSuccessRate,
      averageTime
    };
  }, [state.searchResults]);

  const getTags = useCallback(() => {
    return CompanyQuestionService.getTags();
  }, []);

  return {
    // State
    ...state,
    filters,

    // Actions
    initialize,
    searchQuestions,
    getCompanyQuestions,
    getRoleBasedQuestionSet,
    analyzeCompanyPatterns,
    generateQuestions,
    getCompanyDatabase,

    // Filter management
    updateFilter,
    toggleFilterValue,
    resetFilters,

    // Utilities
    clearState,
    getFilteredQuestions,
    getQuestionsByCompany,
    getQuestionsByRole,
    getQuestionsByCategory,
    getQuestionsByDifficulty,
    getQuestionStats,
    getTags,

    // Computed properties
    hasResults: !!state.searchResults && state.searchResults.questions.length > 0,
    hasAnalytics: !!state.analytics,
    hasRoleSet: !!state.roleBasedSet,
    isReady: state.initialized && !state.loading,
    questionCount: state.searchResults?.totalCount || 0
  };
};

export default useCompanyQuestions;