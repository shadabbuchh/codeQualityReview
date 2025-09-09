import React from 'react';
import { Card, CardContent, CardHeader, Badge } from '@/shared/ui';
import {
  Database,
  Plug,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { paths } from '@app/shared/generated-types';

type Connection = paths['/connections']['get']['responses'][200]['content']['application/json'][0];

interface ConnectionCardProps {
  connection: Connection;
  isSelected?: boolean;
  onSelect?: (connection: Connection) => void;
}

const getStatusIcon = (status: Connection['status']) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'disconnected':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusVariant = (status: Connection['status']) => {
  switch (status) {
    case 'active':
      return 'default' as const;
    case 'error':
      return 'destructive' as const;
    case 'disconnected':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
};

export const ConnectionCard = React.memo<ConnectionCardProps>(
  ({ connection, isSelected, onSelect }) => {
    const handleSelect = () => {
      onSelect?.(connection);
    };

    return (
      <Card
        className={`cursor-pointer transition-colors hover:bg-muted/50 ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={handleSelect}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {connection.type === 'database' ? (
                <Database className="h-4 w-4 text-blue-500" />
              ) : (
                <Plug className="h-4 w-4 text-purple-500" />
              )}
              <h3 className="font-semibold text-sm">{connection.name}</h3>
            </div>
            {getStatusIcon(connection.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge
              variant={getStatusVariant(connection.status)}
              className="text-xs"
            >
              {connection.status}
            </Badge>
            <span className="text-xs text-muted-foreground uppercase">
              {connection.type}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }
);
