import { create } from 'zustand';
import type { RequestDraft, ValidationWarning } from './types';

interface RequestDraftState {
  drafts: RequestDraft[];
  currentDraftId: string | null;
  validationWarnings: ValidationWarning[];
  loading: boolean;
  error: string | null;
}

interface RequestDraftActions {
  createDraft: (
    input: Omit<RequestDraft, 'id' | 'createdAt' | 'updatedAt'>
  ) => string;
  updateDraft: (id: string, input: Partial<RequestDraft>) => void;
  deleteDraft: (id: string) => void;
  selectDraft: (id: string) => void;
  setCurrentDraftId: (id: string | null) => void;
  setValidationWarnings: (warnings: ValidationWarning[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getCurrentDraft: () => RequestDraft | null;
  clearCurrentDraft: () => void;
}

export const useRequestDraftStore = create<
  RequestDraftState & RequestDraftActions
>((set, get) => ({
  drafts: [],
  currentDraftId: null,
  validationWarnings: [],
  loading: false,
  error: null,

  createDraft: input => {
    const now = new Date().toISOString();
    const newDraft: RequestDraft = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    set(state => ({
      drafts: [...state.drafts, newDraft],
      currentDraftId: newDraft.id,
    }));

    return newDraft.id;
  },

  updateDraft: (id, input) => {
    const now = new Date().toISOString();
    set(state => ({
      drafts: state.drafts.map(draft =>
        draft.id === id ? { ...draft, ...input, updatedAt: now } : draft
      ),
    }));
  },

  deleteDraft: id => {
    set(state => ({
      drafts: state.drafts.filter(draft => draft.id !== id),
      currentDraftId: state.currentDraftId === id ? null : state.currentDraftId,
    }));
  },

  selectDraft: id => {
    set({ currentDraftId: id });
  },

  setCurrentDraftId: id => {
    set({ currentDraftId: id });
  },

  setValidationWarnings: warnings => {
    set({ validationWarnings: warnings });
  },

  setLoading: loading => {
    set({ loading });
  },

  setError: error => {
    set({ error });
  },

  getCurrentDraft: () => {
    const { drafts, currentDraftId } = get();
    return currentDraftId
      ? drafts.find(draft => draft.id === currentDraftId) || null
      : null;
  },

  clearCurrentDraft: () => {
    set({ currentDraftId: null });
  },
}));
