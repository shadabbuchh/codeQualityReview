import { create } from 'zustand';
import type { paths } from '@app/shared/generated-types';

type Connection = paths['/connections']['get']['responses'][200]['content']['application/json'][0];

interface ConnectionState {
  connections: Connection[];
  selectedConnectionId: string | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

interface ConnectionActions {
  setConnections: (connections: Connection[]) => void;
  selectConnection: (id: string) => void;
  setStatus: (status: ConnectionState['status']) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: ConnectionState = {
  connections: [],
  selectedConnectionId: null,
  status: 'idle',
  error: null,
};

export const useConnectionStore = create<ConnectionState & ConnectionActions>(
  set => ({
    ...initialState,

    setConnections: connections => set({ connections }),

    selectConnection: id => set({ selectedConnectionId: id }),

    setStatus: status => set({ status }),

    setError: error => set({ error }),

    reset: () => set(initialState),
  })
);
