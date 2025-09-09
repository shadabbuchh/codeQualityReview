import React, { useMemo } from 'react';
import { Button } from '@/shared/ui';
import { RequestQueryTabs } from '@/features/edit-request-query';
import {
  RequestDraftListItem,
  useRequestDraftStore,
} from '@/entities/request-draft';
import { Plus, FileText } from 'lucide-react';

interface EditorTabsWidgetProps {
  className?: string;
}

export const EditorTabsWidget = React.memo<EditorTabsWidgetProps>(
  ({ className }) => {
    const drafts = useRequestDraftStore(state => state.drafts);
    const currentDraftId = useRequestDraftStore(state => state.currentDraftId);
    const createDraft = useRequestDraftStore(state => state.createDraft);
    const selectDraft = useRequestDraftStore(state => state.selectDraft);

    const handleCreateRestDraft = () => {
      createDraft({
        connectionId: '', // Will be set based on selected connection
        type: 'rest',
        title: 'New REST Request',
        content: JSON.stringify({
          rest: { method: 'GET', url: '', headers: {}, body: '' },
          sql: { query: '' },
        }),
      });
    };

    const handleCreateSqlDraft = () => {
      createDraft({
        connectionId: '', // Will be set based on selected connection
        type: 'sql',
        title: 'New SQL Query',
        content: JSON.stringify({
          rest: { method: 'GET', url: '', headers: {}, body: '' },
          sql: { query: '' },
        }),
      });
    };

    const handleSelectDraft = (draftId: string) => {
      selectDraft(draftId);
    };

    const sortedDrafts = useMemo(() => {
      return [...drafts].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }, [drafts]);

    return (
      <div className={`flex flex-col h-full ${className || ''}`}>
        {/* Draft management header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Request & Query Editor
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateRestDraft}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              REST
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateSqlDraft}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              SQL
            </Button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Drafts sidebar */}
          {drafts.length > 1 && (
            <div className="w-64 border-r p-4 overflow-y-auto">
              <h3 className="text-sm font-medium mb-3">Recent Drafts</h3>
              <div className="space-y-2">
                {sortedDrafts.map(draft => (
                  <RequestDraftListItem
                    key={draft.id}
                    draft={draft}
                    isSelected={draft.id === currentDraftId}
                    onClick={() => handleSelectDraft(draft.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Main editor area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {drafts.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center space-y-4">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground/50" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      No requests or queries yet
                    </h3>
                    <p>
                      Create your first REST request or SQL query to get started
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={handleCreateRestDraft}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New REST Request
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCreateSqlDraft}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New SQL Query
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <RequestQueryTabs />
            )}
          </div>
        </div>
      </div>
    );
  }
);
