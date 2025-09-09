import { create } from 'zustand';
import type { ExecutionResult, ExecutionMetadata } from './types';

// Helper function to format results based on type
function formatResultHelper(rawResult: unknown, type: 'rest' | 'sql'): unknown {
  if (!rawResult) return null;

  try {
    if (type === 'rest') {
      // For REST responses, try to pretty-print JSON
      if (typeof rawResult === 'string') {
        return JSON.stringify(JSON.parse(rawResult), null, 2);
      }
      if (typeof rawResult === 'object') {
        return JSON.stringify(rawResult, null, 2);
      }
    }

    if (type === 'sql') {
      // For SQL results, format as table data if it's an array
      if (Array.isArray(rawResult)) {
        return rawResult;
      }
    }
  } catch {
    // If formatting fails, return the raw result
  }

  return rawResult;
}

interface ExecutionResultState {
  // Current result
  currentResult: ExecutionResult | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setResult: (result: ExecutionResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResult: () => void;

  // Helper to create new result
  createResult: (params: {
    type: 'rest' | 'sql';
    rawResult: unknown;
    metadata: ExecutionMetadata;
    duration: number;
    status?: 'success' | 'error';
  }) => ExecutionResult;
}

export const useExecutionResultStore = create<ExecutionResultState>(set => ({
  currentResult: null,
  isLoading: false,
  error: null,

  setResult: result => set({ currentResult: result, error: null }),

  setLoading: isLoading => set({ isLoading }),

  setError: error => set({ error, isLoading: false }),

  clearResult: () => set({ currentResult: null, error: null }),

  createResult: ({
    type,
    rawResult,
    metadata,
    duration,
    status = 'success',
  }) => {
    const result: ExecutionResult = {
      id: crypto.randomUUID(),
      type,
      status,
      rawResult,
      formattedResult: formatResultHelper(rawResult, type),
      metadata,
      executedAt: new Date().toISOString(),
      duration,
    };

    return result;
  },
}));
