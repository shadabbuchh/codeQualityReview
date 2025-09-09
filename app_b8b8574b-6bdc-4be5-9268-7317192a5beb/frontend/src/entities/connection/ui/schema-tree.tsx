import React, { useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Database,
  Table as TableIcon,
} from 'lucide-react';
import { Alert, AlertDescription, Skeleton, Button } from '@/shared/ui';
import { useTablesForSchema, useTableStore } from '@/entities/table';
import type { paths } from '@app/shared/generated-types';

type Schema =
  paths['/connections/{id}/schemas']['get']['responses'][200]['content']['application/json'][0];
type Table =
  paths['/schemas/{id}/tables']['get']['responses'][200]['content']['application/json'][0];

interface SchemaTreeProps {
  schemas: Schema[];
  onSelectTable?: (tableId: string) => void;
}

interface SchemaNodeProps {
  schema: Schema;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectTable?: (tableId: string) => void;
}

const SchemaNode = React.memo<SchemaNodeProps>(
  ({ schema, isExpanded, onToggle, onSelectTable }) => {
    const {
      data: tables,
      isLoading,
      error,
    } = useTablesForSchema(isExpanded ? schema.id : '');
    const selectedTableId = useTableStore(state => state.selectedTableId);
    const setTables = useTableStore(state => state.setTables);

    useEffect(() => {
      if (tables && isExpanded) {
        setTables(tables);
      }
    }, [tables, isExpanded, setTables]);

    const handleTableSelect = React.useCallback(
      (table: Table) => {
        onSelectTable?.(table.id);
      },
      [onSelectTable]
    );

    return (
      <div>
        {/* Schema Header */}
        <Button
          variant="ghost"
          className="w-full justify-start h-8 px-2"
          onClick={onToggle}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 mr-1" />
          ) : (
            <ChevronRight className="h-3 w-3 mr-1" />
          )}
          <Database className="h-3 w-3 mr-2" />
          <span className="text-sm">{schema.name}</span>
        </Button>

        {/* Tables List */}
        {isExpanded && (
          <div className="ml-4 space-y-1">
            {isLoading && (
              <div className="space-y-1">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  Failed to load tables for {schema.name}
                </AlertDescription>
              </Alert>
            )}

            {tables && tables.length === 0 && !isLoading && (
              <div className="text-xs text-muted-foreground px-2 py-1">
                No tables found
              </div>
            )}

            {tables?.map(table => (
              <Button
                key={table.id}
                variant="ghost"
                className={`w-full justify-start h-6 px-2 text-xs ${
                  selectedTableId === table.id
                    ? 'bg-primary/10 text-primary'
                    : ''
                }`}
                onClick={() => handleTableSelect(table)}
              >
                <TableIcon className="h-3 w-3 mr-2" />
                {table.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export const SchemaTree = React.memo<SchemaTreeProps>(
  ({ schemas, onSelectTable }) => {
    const [expandedSchemas, setExpandedSchemas] = React.useState<Set<string>>(
      new Set()
    );

    const toggleSchema = React.useCallback((schemaId: string) => {
      setExpandedSchemas(prev => {
        const newSet = new Set(prev);
        if (newSet.has(schemaId)) {
          newSet.delete(schemaId);
        } else {
          newSet.add(schemaId);
        }
        return newSet;
      });
    }, []);

    if (!schemas || schemas.length === 0) {
      return (
        <div className="text-xs text-muted-foreground px-2 py-1">
          No schemas found
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {schemas.map(schema => (
          <SchemaNode
            key={schema.id}
            schema={schema}
            isExpanded={expandedSchemas.has(schema.id)}
            onToggle={() => toggleSchema(schema.id)}
            onSelectTable={onSelectTable}
          />
        ))}
      </div>
    );
  }
);
