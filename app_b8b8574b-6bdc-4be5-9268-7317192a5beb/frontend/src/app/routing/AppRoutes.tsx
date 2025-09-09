import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts';
import { WorkspacePage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Default redirect to main page */}
        <Route path="/" element={<Navigate to="/workspace" replace />} />

        {/* Main application page */}
        <Route path="/workspace" element={<WorkspacePage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/workspace" replace />} />
      </Route>
    </Routes>
  );
};
