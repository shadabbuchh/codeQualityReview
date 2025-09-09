import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from '@/app/routing/AppRoutes';

import { QueryClientProvider } from './QueryClientProvider';

export function App() {
  return (
    <QueryClientProvider>
      <HelmetProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
