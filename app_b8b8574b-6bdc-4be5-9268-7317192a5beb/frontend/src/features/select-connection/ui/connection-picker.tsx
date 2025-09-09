import React, { useEffect } from 'react';
import {
  ConnectionCard,
  SchemaTree,
  useConnections,
  useConnectionStore,
  useConnectionSchemas,
} from '@/entities/connection';
import { useTableStore } from '@/entities/table';
import { Alert, AlertDescription, Skeleton, Separator } from '@/shared/ui';
import { AlertCircle } from 'lucide-react';
import type { paths } from '@app/shared/generated-types';

type Connection = paths['/connections']['get']['responses'][200]['content']['application/json'][0];

export const ConnectionPicker = React.memo(() => {
  const { data: connections, isLoading, error } = useConnections();
  const selectedConnectionId = useConnectionStore(
    state => state.selectedConnectionId
  );
  const selectConnection = useConnectionStore(state => state.selectConnection);
  const setConnections = useConnectionStore(state => state.setConnections);
  const setStatus = useConnectionStore(state => state.setStatus);
  const setError = useConnectionStore(state => state.setError);

  const { data: schemas, isLoading: schemasLoading } =
    useConnectionSchemas(selectedConnectionId);
  const selectTable = useTableStore(state => state.selectTable);
  const setSchemas = useTableStore(state => state.setSchemas);

  useEffect(() => {
    if (isLoading) {
      setStatus('loading');
    } else if (error) {
      setStatus('error');
      setError('Failed to load connections');
    } else {
      setStatus('idle');
      setError(null);
      if (connections) {
        setConnections(connections);
      }
    }
  }, [connections, isLoading, error, setConnections, setStatus, setError]);

  useEffect(() => {
    if (schemas) {
      setSchemas(schemas);
    }
  }, [schemas, setSchemas]);

  const handleConnectionSelect = React.useCallback(
    (connection: Connection) => {
      selectConnection(connection.id);
    },
    [selectConnection]
  );

  const handleTableSelect = React.useCallback(
    (tableId: string) => {
      selectTable(tableId);
    },
    [selectTable]
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Select Connection</h2>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Select Connection</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load connections. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Select Connection</h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No connections configured. Add a connection to get started.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Select Connection</h2>
        <div className="space-y-2">
          {connections.map(connection => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              isSelected={connection.id === selectedConnectionId}
              onSelect={handleConnectionSelect}
            />
          ))}
        </div>
      </div>

      {selectedConnectionId && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Database Structure</h3>
            {schemasLoading ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : schemas ? (
              <SchemaTree schemas={schemas} onSelectTable={handleTableSelect} />
            ) : (
              <div className="text-xs text-muted-foreground px-2 py-1">
                No database structure available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
});
