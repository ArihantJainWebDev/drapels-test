import { useState, useCallback } from 'react';
import { compilerService, CompilerOutput, DebugSuggestion, OptimizationSuggestion, ExecuteCodeParams, DebugCodeParams, OptimizeCodeParams } from '../services/compilerService';

export const useCompiler = () => {
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isDebugging, setIsDebugging] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [output, setOutput] = useState<CompilerOutput | null>(null);
  const [debugSuggestions, setDebugSuggestions] = useState<DebugSuggestion[]>([]);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const executeCode = useCallback(async (params: ExecuteCodeParams) => {
    setIsExecuting(true);
    setOutput(null);
    setError(null);
    
    try {
      const result = await compilerService.executeCode(params);
      setOutput(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred while executing your code');
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const debugCode = useCallback(async (params: DebugCodeParams) => {
    setIsDebugging(true);
    setDebugSuggestions([]);
    setError(null);
    
    try {
      const result = await compilerService.debugCode(params);
      setDebugSuggestions(result.suggestions);
      return result.suggestions;
    } catch (err: any) {
      setError(err.message || 'An error occurred while debugging your code');
      throw err;
    } finally {
      setIsDebugging(false);
    }
  }, []);

  const optimizeCode = useCallback(async (params: OptimizeCodeParams) => {
    setIsOptimizing(true);
    setOptimizationSuggestions([]);
    setError(null);
    
    try {
      const result = await compilerService.optimizeCode(params);
      setOptimizationSuggestions(result.suggestions);
      return result.suggestions;
    } catch (err: any) {
      setError(err.message || 'An error occurred while optimizing your code');
      throw err;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  return {
    isExecuting,
    isDebugging,
    isOptimizing,
    output,
    debugSuggestions,
    optimizationSuggestions,
    error,
    executeCode,
    debugCode,
    optimizeCode,
  };
};