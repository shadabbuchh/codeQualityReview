import React, { useMemo } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  ScrollArea,
} from '@/shared/ui';
import { useExecutionResultStore } from '@/entities/execution-result';
import {
  Clock,
  CheckCircle,
  XCircle,
  Database,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

function formatBytesHelper(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

interface ShowResultsPaneProps {
  className?: string;
}

export const ShowResultsPane = React.memo<ShowResultsPaneProps>(
  ({ className }) => {
    const currentResult = useExecutionResultStore(state => state.currentResult);
    const isLoading = useExecutionResultStore(state => state.isLoading);
    const error = useExecutionResultStore(state => state.error);

    const statusIcon = useMemo(() => {
      if (isLoading) return <Clock className="w-4 h-4 animate-spin" />;
      if (error || currentResult?.status === 'error')
        return <XCircle className="w-4 h-4 text-destructive" />;
      if (currentResult?.status === 'success')
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      return null;
    }, [isLoading, error, currentResult?.status]);

    const statusBadge = useMemo(() => {
      if (isLoading) return <Badge variant="outline">Executing...</Badge>;
      if (error) return <Badge variant="destructive">Error</Badge>;
      if (currentResult?.status === 'error')
        return <Badge variant="destructive">Failed</Badge>;
      if (currentResult?.status === 'success')
        return (
          <Badge variant="outline" className="border-green-600 text-green-600">
            Success
          </Badge>
        );
      return null;
    }, [isLoading, error, currentResult?.status]);

    const metadataItems = useMemo(() => {
      if (!currentResult?.metadata) return [];

      const items = [];

      // Common metadata
      if (currentResult.duration !== undefined) {
        items.push({
          label: 'Duration',
          value: `${currentResult.duration}ms`,
          icon: <Clock className="w-3 h-3" />,
        });
      }

      if (currentResult.type === 'rest') {
        // REST-specific metadata
        const {
          statusCode,
          statusText,
          headers,
          responseSize,
          requestUrl,
          requestMethod,
        } = currentResult.metadata;

        if (statusCode) {
          items.push({
            label: 'Status',
            value: `${statusCode} ${statusText || ''}`.trim(),
            icon: <Globe className="w-3 h-3" />,
          });
        }

        if (requestMethod && requestUrl) {
          items.push({
            label: 'Request',
            value: `${requestMethod} ${requestUrl}`,
            icon: <Globe className="w-3 h-3" />,
          });
        }

        if (responseSize) {
          items.push({
            label: 'Size',
            value: formatBytesHelper(responseSize),
            icon: <Globe className="w-3 h-3" />,
          });
        }

        if (headers && Object.keys(headers).length > 0) {
          items.push({
            label: 'Headers',
            value: `${Object.keys(headers).length} headers`,
            icon: <Globe className="w-3 h-3" />,
          });
        }
      }

      if (currentResult.type === 'sql') {
        // SQL-specific metadata
        const { rowsAffected, executionTime } = currentResult.metadata;

        if (rowsAffected !== undefined) {
          items.push({
            label: 'Rows',
            value: `${rowsAffected} affected`,
            icon: <Database className="w-3 h-3" />,
          });
        }

        if (executionTime !== undefined) {
          items.push({
            label: 'Query Time',
            value: `${executionTime}ms`,
            icon: <Database className="w-3 h-3" />,
          });
        }
      }

      // Error metadata
      if (currentResult.metadata.error) {
        const { code, message } = currentResult.metadata.error;
        items.push({
          label: 'Error',
          value: code ? `${code}: ${message}` : message,
          icon: <AlertCircle className="w-3 h-3" />,
          isError: true,
        });
      }

      return items;
    }, [currentResult]);

    if (isLoading) {
      return (
        <div className={cn('flex flex-col h-full', className)}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              {statusIcon}
              <h3 className="font-medium">Executing...</h3>
              {statusBadge}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Clock className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Running your request...</p>
            </div>
          </div>
        </div>
      );
    }

    if (error && !currentResult) {
      return (
        <div className={cn('flex flex-col h-full', className)}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              {statusIcon}
              <h3 className="font-medium">Execution Error</h3>
              {statusBadge}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-destructive" />
              <p className="text-destructive font-medium">Execution Failed</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (!currentResult) {
      return (
        <div className={cn('flex flex-col h-full', className)}>
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Results</h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Database className="w-8 h-8 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Execute a request or query to see results
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={cn('flex flex-col h-full', className)}>
        {/* Header with status and metadata */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {statusIcon}
              <h3 className="font-medium">Results</h3>
              {statusBadge}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(currentResult.executedAt).toLocaleTimeString()}
            </div>
          </div>

          {/* Metadata summary */}
          {metadataItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadataItems.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-1 text-xs px-2 py-1 rounded border',
                    item.isError
                      ? 'border-destructive/20 bg-destructive/5 text-destructive'
                      : 'bg-muted/30'
                  )}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}:</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results content */}
        <div className="flex-1 min-h-0">
          <Tabs defaultValue="formatted" className="h-full flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="formatted">Formatted</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="formatted" className="flex-1 m-4 mt-2">
              <ScrollArea className="h-full border rounded-md">
                <div className="p-4">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {typeof currentResult.formattedResult === 'string'
                      ? currentResult.formattedResult
                      : JSON.stringify(currentResult.formattedResult, null, 2)}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="raw" className="flex-1 m-4 mt-2">
              <ScrollArea className="h-full border rounded-md">
                <div className="p-4">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {typeof currentResult.rawResult === 'string'
                      ? currentResult.rawResult
                      : JSON.stringify(currentResult.rawResult, null, 2)}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="metadata" className="flex-1 m-4 mt-2">
              <ScrollArea className="h-full border rounded-md">
                <div className="p-4 space-y-4">
                  {/* Execution details */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Execution Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="capitalize">{currentResult.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="capitalize">
                          {currentResult.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Executed:</span>
                        <span>
                          {new Date(currentResult.executedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{currentResult.duration}ms</span>
                      </div>
                    </div>
                  </div>

                  {/* Full metadata */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Full Metadata</h4>
                    <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                      {JSON.stringify(currentResult.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
);
