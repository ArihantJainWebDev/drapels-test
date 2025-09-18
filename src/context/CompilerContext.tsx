import React, { createContext, useContext, ReactNode } from 'react';
import { useCompiler } from '../hooks/useCompiler';
import { CompilerOutput, DebugSuggestion, OptimizationSuggestion, ExecuteCodeParams, DebugCodeParams, OptimizeCodeParams } from '../services/compilerService';

interface CompilerContextType {
  isExecuting: boolean;
  isDebugging: boolean;
  isOptimizing: boolean;
  output: CompilerOutput | null;
  debugSuggestions: DebugSuggestion[];
  optimizationSuggestions: OptimizationSuggestion[];
  error: string | null;
  executeCode: (params: ExecuteCodeParams) => Promise<CompilerOutput>;
  debugCode: (params: DebugCodeParams) => Promise<DebugSuggestion[]>;
  optimizeCode: (params: OptimizeCodeParams) => Promise<OptimizationSuggestion[]>;
}

const CompilerContext = createContext<CompilerContextType | undefined>(undefined);

export const CompilerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const compilerState = useCompiler();
  
  return (
    <CompilerContext.Provider value={compilerState}>
      {children}
    </CompilerContext.Provider>
  );
};

export const useCompilerContext = (): CompilerContextType => {
  const context = useContext(CompilerContext);
  if (context === undefined) {
    throw new Error('useCompilerContext must be used within a CompilerProvider');
  }
  return context;
};