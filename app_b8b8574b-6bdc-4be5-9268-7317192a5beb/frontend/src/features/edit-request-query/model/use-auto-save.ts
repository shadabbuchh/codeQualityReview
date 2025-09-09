import { useEffect, useRef } from 'react';
import { useRequestDraftStore } from '@/entities/request-draft';

interface UseAutoSaveProps {
  draftId: string | null;
  content: string;
  enabled?: boolean;
  delay?: number;
}

export const useAutoSave = ({
  draftId,
  content,
  enabled = true,
  delay = 1000,
}: UseAutoSaveProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateDraft = useRequestDraftStore(state => state.updateDraft);
  const lastSavedContentRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !draftId || content === lastSavedContentRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      updateDraft(draftId, { content });
      lastSavedContentRef.current = content;
    }, delay);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [draftId, content, enabled, delay, updateDraft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
