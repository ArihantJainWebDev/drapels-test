import axios from 'axios';

export interface CompilerOutput {
  stdout: string;
  stderr: string;
  executionTime: string;
  memory: string;
}

export interface DebugSuggestion {
  issue: string;
  suggestion: string;
  code?: string;
}

export interface OptimizationSuggestion {
  title: string;
  description: string;
  impact?: string;
  code?: string;
}

export interface ExecuteCodeParams {
  language: string;
  code: string;
  input: string;
}

export interface DebugCodeParams {
  language: string;
  code: string;
  output: string;
  errorContext?: any;
}

export interface OptimizeCodeParams {
  language: string;
  code: string;
}

const API_BASE_URL = '';

export const compilerService = {
  async executeCode(params: ExecuteCodeParams): Promise<CompilerOutput> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/execute-code`, params);
      return response.data as CompilerOutput;
    } catch (error: any) {
      console.error('Error executing code:', error);
      throw new Error(error.response?.data?.error || 'Failed to execute code');
    }
  },

  async debugCode(params: DebugCodeParams): Promise<{ suggestions: DebugSuggestion[] }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/debug-code`, params);
      return response.data as { suggestions: DebugSuggestion[] };
    } catch (error: any) {
      console.error('Error debugging code:', error);
      throw new Error(error.response?.data?.error || 'Failed to debug code');
    }
  },

  async optimizeCode(params: OptimizeCodeParams): Promise<{ suggestions: OptimizationSuggestion[] }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/optimize-code`, params);
      return response.data as { suggestions: OptimizationSuggestion[] };
    } catch (error: any) {
      console.error('Error optimizing code:', error);
      throw new Error(error.response?.data?.error || 'Failed to optimize code');
    }
  }
};