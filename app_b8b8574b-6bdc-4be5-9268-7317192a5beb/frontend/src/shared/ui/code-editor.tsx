import React, { useCallback } from 'react';
import { Textarea } from './textarea';
import { cn } from '@/shared/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'json' | 'sql' | 'text';
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const CodeEditor = React.memo<CodeEditorProps>(
  ({
    value,
    onChange,
    language = 'text',
    placeholder,
    className,
    rows = 10,
  }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    return (
      <div className={cn('relative', className)}>
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'font-mono text-sm resize-none',
            language === 'json' && 'text-blue-600',
            language === 'sql' && 'text-purple-600'
          )}
          rows={rows}
        />
        {language !== 'text' && (
          <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {language.toUpperCase()}
          </div>
        )}
      </div>
    );
  }
);
