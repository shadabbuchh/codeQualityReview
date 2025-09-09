import { useQuery } from '@tanstack/react-query';
import { get, handleError } from '@/shared/api';
import type { paths } from '@app/shared/generated-types';

type ConnectionsResponse = paths['/connections']['get']['responses'][200]['content']['application/json'];
type ConnectionSchemasResponse = paths['/connections/{id}/schemas']['get']['responses'][200]['content']['application/json'];

export const useConnections = () =>
  useQuery({
    queryKey: ['connections'],
    queryFn: async () => {
      const { data, error } = await get('/connections');

      if (error) handleError(error);

      return data as ConnectionsResponse;
    },
  });

export const useConnectionSchemas = (connectionId: string | null) =>
  useQuery({
    queryKey: ['connection-schemas', connectionId],
    queryFn: async () => {
      if (!connectionId) return [];

      const { data, error } = await get('/connections/{id}/schemas', {
        params: {
          path: { id: connectionId },
        },
      });

      if (error) handleError(error);

      return (data as ConnectionSchemasResponse) || [];
    },
    enabled: !!connectionId,
  });
