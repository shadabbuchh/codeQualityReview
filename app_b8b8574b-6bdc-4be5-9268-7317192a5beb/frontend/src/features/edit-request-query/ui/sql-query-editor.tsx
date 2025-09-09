import React, { useCallback } from 'react';
import { Label } from '@/shared/ui';
import { CodeEditor } from '@/shared/ui/code-editor';
import type { SqlQuery } from '@/entities/request-draft/model/types';

interface SqlQueryEditorProps {
  value: SqlQuery;
  onChange: (value: SqlQuery) => void;
  className?: string;
}

export const SqlQueryEditor = React.memo<SqlQueryEditorProps>(
  ({ value, onChange, className }) => {
    const handleQueryChange = useCallback(
      (query: string) => {
        onChange({ ...value, query });
      },
      [value, onChange]
    );

    return (
      <div className={className}>
        <div className="space-y-4">
          <div>
            <Label className="mb-3 block">SQL Query</Label>
            <CodeEditor
              value={value.query}
              onChange={handleQueryChange}
              language="sql"
              placeholder="SELECT * FROM users WHERE id = 1;"
              rows={12}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Tips:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Use semicolons to separate multiple statements</li>
              <li>Press Ctrl+Enter to execute the query</li>
              <li>Use table and column names from the schema browser</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
);
