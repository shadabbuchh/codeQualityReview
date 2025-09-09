import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Badge,
} from '@/shared/ui';
import { RestRequestEditor } from './rest-request-editor';
import { SqlQueryEditor } from './sql-query-editor';
import { useRequestValidation } from '../model/use-request-validation';
import { useAutoSave } from '../model/use-auto-save';
import { useRequestDraftStore } from '@/entities/request-draft';
import { useExecutionResultStore } from '@/entities/execution-result';
import {
  simulateRestExecution,
  simulateSqlExecution,
} from '../model/simulation-helpers';
import type {
  RestRequest,
  SqlQuery,
  DraftContent,
} from '@/entities/request-draft/model/types';
import { Play, Save, AlertTriangle, AlertCircle } from 'lucide-react';

interface RequestQueryTabsProps {
  className?: string;
}

const DEFAULT_REST_REQUEST: RestRequest = {
  method: 'GET',
  url: '',
  headers: {},
  body: '',
};

const DEFAULT_SQL_QUERY: SqlQuery = {
  query: '',
};

export const RequestQueryTabs = React.memo<RequestQueryTabsProps>(
  ({ className }) => {
    const currentDraftId = useRequestDraftStore(state => state.currentDraftId);
    const drafts = useRequestDraftStore(state => state.drafts);
    const createDraft = useRequestDraftStore(state => state.createDraft);
    const updateDraft = useRequestDraftStore(state => state.updateDraft);

    const getCurrentDraft = useRequestDraftStore(
      state => state.getCurrentDraft
    );

    const currentDraft = getCurrentDraft();

    // Parse draft content
    const draftContent = useMemo<DraftContent>(() => {
      if (!currentDraft?.content) {
        return { rest: DEFAULT_REST_REQUEST, sql: DEFAULT_SQL_QUERY };
      }

      try {
        return JSON.parse(currentDraft.content) as DraftContent;
      } catch {
        return { rest: DEFAULT_REST_REQUEST, sql: DEFAULT_SQL_QUERY };
      }
    }, [currentDraft?.content]);

    const restContent = draftContent.rest || DEFAULT_REST_REQUEST;
    const sqlContent = draftContent.sql || DEFAULT_SQL_QUERY;

    // Validation for current tab
    const restValidation = useRequestValidation({
      type: 'rest',
      content: restContent,
    });
    const sqlValidation = useRequestValidation({
      type: 'sql',
      content: sqlContent,
    });

    const activeTab = currentDraft?.type || 'rest';

    // Auto-save functionality
    useAutoSave({
      draftId: currentDraftId,
      content: JSON.stringify(draftContent),
      enabled: !!currentDraft,
      delay: 1000,
    });

    // Create initial drafts if none exist
    useEffect(() => {
      if (drafts.length === 0) {
        createDraft({
          connectionId: '', // Will be set based on selected connection
          type: 'rest',
          title: 'New REST Request',
          content: JSON.stringify({
            rest: DEFAULT_REST_REQUEST,
            sql: DEFAULT_SQL_QUERY,
          }),
        });
      }
    }, [drafts.length, createDraft]);

    const handleTabChange = useCallback(
      (tab: string) => {
        if (tab === 'rest' || tab === 'sql') {
          if (currentDraft) {
            updateDraft(currentDraft.id, { type: tab });
          } else {
            createDraft({
              connectionId: '',
              type: tab,
              title: `New ${tab.toUpperCase()} ${tab === 'rest' ? 'Request' : 'Query'}`,
              content: JSON.stringify({
                rest: DEFAULT_REST_REQUEST,
                sql: DEFAULT_SQL_QUERY,
              }),
            });
          }
        }
      },
      [currentDraft, updateDraft, createDraft]
    );

    const handleRestChange = useCallback(
      (newRestContent: RestRequest) => {
        if (!currentDraft) return;

        const newDraftContent: DraftContent = {
          ...draftContent,
          rest: newRestContent,
        };

        updateDraft(currentDraft.id, {
          content: JSON.stringify(newDraftContent),
          validationWarnings: restValidation.warnings,
        });
      },
      [currentDraft, draftContent, updateDraft, restValidation.warnings]
    );

    const handleSqlChange = useCallback(
      (newSqlContent: SqlQuery) => {
        if (!currentDraft) return;

        const newDraftContent: DraftContent = {
          ...draftContent,
          sql: newSqlContent,
        };

        updateDraft(currentDraft.id, {
          content: JSON.stringify(newDraftContent),
          validationWarnings: sqlValidation.warnings,
        });
      },
      [currentDraft, draftContent, updateDraft, sqlValidation.warnings]
    );

    const handleSave = useCallback(() => {
      // In a real implementation, this would save to backend
      console.log('Saving draft:', currentDraft);
    }, [currentDraft]);

    const handleExecute = useCallback(async () => {
      if (!currentDraft) return;

      const { setLoading, setResult, setError, createResult } =
        useExecutionResultStore.getState();

      try {
        setLoading(true);
        setError(null);

        const startTime = Date.now();

        // Simulate execution based on type
        let result;
        let metadata;

        if (activeTab === 'rest') {
          // Simulate REST request execution
          result = await simulateRestExecution(restContent);
          metadata = {
            statusCode: result.status || 200,
            statusText: result.statusText || 'OK',
            headers: result.headers || {},
            responseSize: JSON.stringify(result.data || {}).length,
            requestUrl: restContent.url,
            requestMethod: restContent.method,
          };
        } else {
          // Simulate SQL query execution
          result = await simulateSqlExecution(sqlContent);
          metadata = {
            rowsAffected: result.rowCount || 0,
            executionTime: result.executionTime || 0,
          };
        }

        const duration = Date.now() - startTime;

        const executionResult = createResult({
          type: activeTab,
          rawResult: result.data || result,
          metadata,
          duration,
          status: result.error ? 'error' : 'success',
        });

        if (result.error) {
          executionResult.metadata.error = {
            message: result.error.message,
            code: result.error.code,
            details: result.error.details,
          };
        }

        setResult(executionResult);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown execution error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [activeTab, restContent, sqlContent, currentDraft]);

    const currentValidation =
      activeTab === 'rest' ? restValidation : sqlValidation;

    if (!currentDraft) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No draft selected</h3>
            <p>Create a new request or query to get started</p>
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="rest" className="flex items-center gap-2">
                REST
                {restValidation.hasErrors && (
                  <Badge variant="destructive" className="w-2 h-2 p-0" />
                )}
                {!restValidation.hasErrors && restValidation.hasWarnings && (
                  <Badge variant="outline" className="w-2 h-2 p-0" />
                )}
              </TabsTrigger>
              <TabsTrigger value="sql" className="flex items-center gap-2">
                SQL
                {sqlValidation.hasErrors && (
                  <Badge variant="destructive" className="w-2 h-2 p-0" />
                )}
                {!sqlValidation.hasErrors && sqlValidation.hasWarnings && (
                  <Badge variant="outline" className="w-2 h-2 p-0" />
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {/* Validation indicators */}
              {currentValidation.hasErrors && (
                <div className="flex items-center gap-1 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    {
                      currentValidation.warnings.filter(
                        w => w.severity === 'error'
                      ).length
                    }{' '}
                    error(s)
                  </span>
                </div>
              )}
              {!currentValidation.hasErrors &&
                currentValidation.hasWarnings && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">
                      {
                        currentValidation.warnings.filter(
                          w => w.severity === 'warning'
                        ).length
                      }{' '}
                      warning(s)
                    </span>
                  </div>
                )}

              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                onClick={handleExecute}
                disabled={currentValidation.hasErrors}
              >
                <Play className="w-4 h-4 mr-1" />
                Execute
              </Button>
            </div>
          </div>

          <TabsContent value="rest" className="mt-0">
            <RestRequestEditor
              value={restContent}
              onChange={handleRestChange}
              className="space-y-6"
            />
          </TabsContent>

          <TabsContent value="sql" className="mt-0">
            <SqlQueryEditor
              value={sqlContent}
              onChange={handleSqlChange}
              className="space-y-6"
            />
          </TabsContent>
        </Tabs>

        {/* Validation warnings display */}
        {currentValidation.warnings.length > 0 && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/30">
            <h4 className="text-sm font-medium mb-2">Validation Issues:</h4>
            <ul className="space-y-1">
              {currentValidation.warnings.map(warning => (
                <li
                  key={warning.id}
                  className={`text-sm flex items-center gap-2 ${
                    warning.severity === 'error'
                      ? 'text-destructive'
                      : 'text-orange-600'
                  }`}
                >
                  {warning.severity === 'error' ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {warning.message}
                  {warning.field && (
                    <Badge variant="outline" className="text-xs">
                      {warning.field}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
