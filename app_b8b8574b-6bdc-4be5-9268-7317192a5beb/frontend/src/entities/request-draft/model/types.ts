export interface RequestDraft {
  id: string;
  connectionId: string;
  type: 'rest' | 'sql';
  title?: string;
  content: string;
  validationWarnings?: ValidationWarning[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidationWarning {
  id: string;
  draftId: string;
  message: string;
  field?: string;
  severity: 'info' | 'warning' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface RestRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export interface SqlQuery {
  query: string;
}

export interface DraftContent {
  rest?: RestRequest;
  sql?: SqlQuery;
}
