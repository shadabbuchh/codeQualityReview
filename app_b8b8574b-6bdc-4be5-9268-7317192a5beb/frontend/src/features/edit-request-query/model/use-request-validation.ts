import { useMemo } from 'react';
import type {
  RestRequest,
  SqlQuery,
  ValidationWarning,
} from '@/entities/request-draft/model/types';

interface UseRequestValidationProps {
  type: 'rest' | 'sql';
  content: RestRequest | SqlQuery;
}

export const useRequestValidation = ({
  type,
  content,
}: UseRequestValidationProps) => {
  const warnings = useMemo<ValidationWarning[]>(() => {
    const validationWarnings: ValidationWarning[] = [];
    const now = new Date().toISOString();

    if (type === 'rest') {
      const restContent = content as RestRequest;

      // Validate URL
      if (!restContent.url.trim()) {
        validationWarnings.push({
          id: crypto.randomUUID(),
          draftId: '',
          message: 'URL is required',
          field: 'url',
          severity: 'error',
          createdAt: now,
          updatedAt: now,
        });
      } else if (
        !restContent.url.startsWith('http://') &&
        !restContent.url.startsWith('https://')
      ) {
        validationWarnings.push({
          id: crypto.randomUUID(),
          draftId: '',
          message: 'URL should start with http:// or https://',
          field: 'url',
          severity: 'warning',
          createdAt: now,
          updatedAt: now,
        });
      }

      // Validate JSON body for POST/PUT/PATCH requests
      if (
        ['POST', 'PUT', 'PATCH'].includes(restContent.method) &&
        restContent.body
      ) {
        try {
          JSON.parse(restContent.body);
        } catch {
          validationWarnings.push({
            id: crypto.randomUUID(),
            draftId: '',
            message: 'Invalid JSON in request body',
            field: 'body',
            severity: 'error',
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      // Validate headers
      Object.entries(restContent.headers).forEach(([key, value]) => {
        if (!key.trim()) {
          validationWarnings.push({
            id: crypto.randomUUID(),
            draftId: '',
            message: 'Header name cannot be empty',
            field: 'headers',
            severity: 'error',
            createdAt: now,
            updatedAt: now,
          });
        }
        if (!value.trim()) {
          validationWarnings.push({
            id: crypto.randomUUID(),
            draftId: '',
            message: `Header "${key}" has empty value`,
            field: 'headers',
            severity: 'warning',
            createdAt: now,
            updatedAt: now,
          });
        }
      });
    }

    if (type === 'sql') {
      const sqlContent = content as SqlQuery;

      // Basic SQL validation
      if (!sqlContent.query.trim()) {
        validationWarnings.push({
          id: crypto.randomUUID(),
          draftId: '',
          message: 'SQL query is required',
          field: 'query',
          severity: 'error',
          createdAt: now,
          updatedAt: now,
        });
      } else {
        const query = sqlContent.query.trim().toLowerCase();

        // Check for potentially dangerous operations
        if (query.includes('drop table') || query.includes('truncate')) {
          validationWarnings.push({
            id: crypto.randomUUID(),
            draftId: '',
            message: 'Destructive operation detected - use with caution',
            field: 'query',
            severity: 'warning',
            createdAt: now,
            updatedAt: now,
          });
        }

        // Check for missing WHERE clause in DELETE/UPDATE
        if (
          (query.includes('delete from') || query.includes('update ')) &&
          !query.includes('where')
        ) {
          validationWarnings.push({
            id: crypto.randomUUID(),
            draftId: '',
            message: 'DELETE/UPDATE without WHERE clause will affect all rows',
            field: 'query',
            severity: 'warning',
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }

    return validationWarnings;
  }, [type, content]);

  const hasErrors = warnings.some(w => w.severity === 'error');
  const hasWarnings = warnings.some(w => w.severity === 'warning');
  const isValid = !hasErrors;

  return {
    warnings,
    hasErrors,
    hasWarnings,
    isValid,
  };
};
