import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type RequestSource = 'ask' | 'chat' | 'ingest';

interface PendingRequestContextValue {
  isPending: boolean;
  pendingSource: RequestSource | null;
  registerPending: (source: RequestSource, abort: () => void) => void;
  clearPending: (source: RequestSource) => void;
  cancelPending: () => void;
}

const PendingRequestContext = createContext<PendingRequestContextValue | null>(null);

export function PendingRequestProvider({ children }: { children: ReactNode }) {
  const abortRef = useRef<(() => void) | null>(null);
  const [pendingSource, setPendingSource] = useState<RequestSource | null>(null);

  const registerPending = useCallback((source: RequestSource, abort: () => void) => {
    abortRef.current = abort;
    setPendingSource(source);
  }, []);

  const clearPending = useCallback((source: RequestSource) => {
    setPendingSource((current) => {
      if (current !== source) return current;
      abortRef.current = null;
      return null;
    });
  }, []);

  const cancelPending = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    setPendingSource(null);
  }, []);

  const value = useMemo(
    () => ({
      isPending: pendingSource !== null,
      pendingSource,
      registerPending,
      clearPending,
      cancelPending,
    }),
    [pendingSource, registerPending, clearPending, cancelPending],
  );

  return <PendingRequestContext.Provider value={value}>{children}</PendingRequestContext.Provider>;
}

export function usePendingRequest() {
  const ctx = useContext(PendingRequestContext);
  if (!ctx) {
    throw new Error('usePendingRequest must be used within PendingRequestProvider');
  }
  return ctx;
}
