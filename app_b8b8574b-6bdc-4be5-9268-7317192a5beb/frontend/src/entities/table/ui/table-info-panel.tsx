import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/ui';
import { Table as TableIcon, Database, Key, ExternalLink } from 'lucide-react';
import type { paths } from '@app/shared/generated-types';

type Table =
  paths['/tables/{id}']['get']['responses'][200]['content']['application/json'];

interface TableInfoPanelProps {
  table: Table;
}

const getColumnTypeColor = (type: string) => {
  const lowerType = type.toLowerCase();
  if (
    lowerType.includes('varchar') ||
    lowerType.includes('text') ||
    lowerType.includes('char')
  ) {
    return 'bg-blue-100 text-blue-800';
  }
  if (
    lowerType.includes('int') ||
    lowerType.includes('number') ||
    lowerType.includes('decimal')
  ) {
    return 'bg-green-100 text-green-800';
  }
  if (lowerType.includes('date') || lowerType.includes('time')) {
    return 'bg-purple-100 text-purple-800';
  }
  if (lowerType.includes('bool')) {
    return 'bg-orange-100 text-orange-800';
  }
  return 'bg-gray-100 text-gray-800';
};

export const TableInfoPanel = React.memo<TableInfoPanelProps>(({ table }) => {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">{table.name}</CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Columns */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4" />
            Columns ({table.columns.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {table.columns.map((column, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded border"
            >
              <div className="flex items-center gap-2">
                {column.constraints?.includes('PRIMARY KEY') && (
                  <Key className="h-3 w-3 text-yellow-500" />
                )}
                <span className="font-mono text-sm">{column.name}</span>
                {!column.nullable && (
                  <span className="text-xs text-red-500">*</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${getColumnTypeColor(column.type)}`}
                >
                  {column.type}
                </Badge>
                {column.default && (
                  <span className="text-xs text-muted-foreground">
                    default: {column.default}
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Relationships */}
      {table.relationships && table.relationships.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Relationships ({table.relationships.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {table.relationships.map((relationship, index) => (
              <div key={index} className="p-2 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">
                    {relationship.type.replace('-', ' ')}
                  </Badge>
                  <span className="text-sm font-mono">
                    {relationship.targetTable}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {relationship.sourceColumn} → {relationship.targetColumn}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Validation Rules */}
      {table.validationRules && table.validationRules.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Validation Rules ({table.validationRules.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {table.validationRules.map((rule, index) => (
              <div key={index} className="p-2 rounded border">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{rule.field}</span>
                  <Badge variant="secondary" className="text-xs">
                    {rule.rule}
                  </Badge>
                </div>
                {rule.params && Object.keys(rule.params).length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {JSON.stringify(rule.params)}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
});
