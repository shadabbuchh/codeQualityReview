import type { PropsWithChildren } from 'react';
import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from '@/shared/lib/query-client';

export const QueryClientProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const queryClient = getQueryClient();

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
};
