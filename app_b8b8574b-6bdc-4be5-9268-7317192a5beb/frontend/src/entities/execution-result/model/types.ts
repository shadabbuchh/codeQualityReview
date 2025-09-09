export interface ExecutionResult {
  id: string;
  type: 'rest' | 'sql';
  status: 'success' | 'error';
  rawResult: unknown;
  formattedResult?: unknown;
  metadata: ExecutionMetadata;
  executedAt: string;
  duration: number;
}

export interface ExecutionMetadata {
  statusCode?: number;
  statusText?: string;
  headers?: Record<string, string>;
  responseSize?: number;
  requestUrl?: string;
  requestMethod?: string;
  rowsAffected?: number;
  queryPlan?: unknown;
  executionTime?: number;
  error?: {
    code?: string | number;
    message: string;
    details?: unknown;
  };
}
