import { create } from 'zustand';
import type { paths } from '@app/shared/generated-types';

type Table =
  paths['/tables/{id}']['get']['responses'][200]['content']['application/json'];
type Schema =
  paths['/connections/{id}/schemas']['get']['responses'][200]['content']['application/json'][0];

interface TableState {
  schemas: Schema[];
  tables: Table[];
  selectedTableId: string | null;
  loading: boolean;
  error: string | null;
}

interface TableActions {
  setSchemas: (schemas: Schema[]) => void;
  setTables: (tables: Table[]) => void;
  selectTable: (tableId: string) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: TableState = {
  schemas: [],
  tables: [],
  selectedTableId: null,
  loading: false,
  error: null,
};

export const useTableStore = create<TableState & TableActions>(set => ({
  ...initialState,

  setSchemas: schemas => set({ schemas }),

  setTables: tables => set({ tables }),

  selectTable: tableId => set({ selectedTableId: tableId }),

  clearSelection: () => set({ selectedTableId: null }),

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  reset: () => set(initialState),
}));
