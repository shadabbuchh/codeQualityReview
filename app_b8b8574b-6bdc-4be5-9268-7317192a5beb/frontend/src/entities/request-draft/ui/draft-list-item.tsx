import React from 'react';
import { Badge } from '@/shared/ui';
import type { RequestDraft } from '../model/types';

interface DraftListItemProps {
  draft: RequestDraft;
  isSelected?: boolean;
  onClick?: () => void;
}

export const RequestDraftListItem = React.memo<DraftListItemProps>(
  ({ draft, isSelected = false, onClick }) => {
    const hasWarnings =
      draft.validationWarnings && draft.validationWarnings.length > 0;
    const errorCount =
      draft.validationWarnings?.filter(w => w.severity === 'error').length || 0;
    const warningCount =
      draft.validationWarnings?.filter(w => w.severity === 'warning').length ||
      0;

    return (
      <div
        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={draft.type === 'rest' ? 'default' : 'secondary'}>
              {draft.type.toUpperCase()}
            </Badge>
            {hasWarnings && (
              <div className="flex gap-1">
                {errorCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {errorCount} error{errorCount !== 1 ? 's' : ''}
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {warningCount} warning{warningCount !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        <h4 className="text-sm font-medium truncate">
          {draft.title || `Untitled ${draft.type.toUpperCase()} request`}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          Last modified {new Date(draft.updatedAt).toLocaleString()}
        </p>
      </div>
    );
  }
);
