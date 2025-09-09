import { useQuery } from '@tanstack/react-query';
import { get, handleError } from '@/shared/api';
import type { paths } from '@app/shared/generated-types';

type TablesForSchemaResponse =
  paths['/schemas/{id}/tables']['get']['responses'][200]['content']['application/json'];
type TableByIdResponse =
  paths['/tables/{id}']['get']['responses'][200]['content']['application/json'];
type CrudTemplatesResponse =
  paths['/tables/{id}/crud-templates']['get']['responses'][200]['content']['application/json'];

export const useTablesForSchema = (schemaId: string) =>
  useQuery({
    queryKey: ['schemas', schemaId, 'tables'],
    queryFn: async (): Promise<TablesForSchemaResponse> => {
      const { data, error } = await get('/schemas/{id}/tables', {
        params: { path: { id: schemaId } },
      });

      if (error) handleError(error);
      return data as TablesForSchemaResponse;
    },
    enabled: !!schemaId,
  });

export const useTableById = (tableId: string) =>
  useQuery({
    queryKey: ['tables', tableId],
    queryFn: async (): Promise<TableByIdResponse> => {
      const { data, error } = await get('/tables/{id}', {
        params: { path: { id: tableId } },
      });

      if (error) handleError(error);
      return data as TableByIdResponse;
    },
    enabled: !!tableId,
  });

export const useCrudTemplates = (tableId: string) =>
  useQuery({
    queryKey: ['tables', tableId, 'crud-templates'],
    queryFn: async (): Promise<CrudTemplatesResponse> => {
      const { data, error } = await get('/tables/{id}/crud-templates', {
        params: { path: { id: tableId } },
      });

      if (error) handleError(error);
      return data as CrudTemplatesResponse;
    },
    enabled: !!tableId,
  });
