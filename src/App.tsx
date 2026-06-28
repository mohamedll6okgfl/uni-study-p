import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlannerProvider } from './context/PlannerContext';
import AppShell from './components/layout/AppShell';

// Lazily load each view — each gets its own chunk for faster initial load
const Dashboard    = lazy(() => import('./views/Dashboard'));
const Kanban       = lazy(() => import('./views/Kanban'));
const ExamScheduler = lazy(() => import('./views/ExamScheduler'));
const Calendar     = lazy(() => import('./views/Calendar'));
const Courses      = lazy(() => import('./views/Courses'));
const Scratchpad   = lazy(() => import('./views/Scratchpad'));

/** Full-page animated skeleton while a lazy chunk is loading */
const PageLoader: React.FC = () => (
  <div className="flex-1 flex items-center justify-center h-full">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-brand-200 dark:border-brand-900" />
        <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin" />
      </div>
      <p className="text-xs font-semibold text-[--text-muted] animate-pulse tracking-wide">Loading…</p>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <PlannerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="kanban" element={
              <Suspense fallback={<PageLoader />}>
                <Kanban />
              </Suspense>
            } />
            <Route path="exams" element={
              <Suspense fallback={<PageLoader />}>
                <ExamScheduler />
              </Suspense>
            } />
            <Route path="calendar" element={
              <Suspense fallback={<PageLoader />}>
                <Calendar />
              </Suspense>
            } />
            <Route path="courses" element={
              <Suspense fallback={<PageLoader />}>
                <Courses />
              </Suspense>
            } />
            <Route path="scratchpad" element={
              <Suspense fallback={<PageLoader />}>
                <Scratchpad />
              </Suspense>
            } />
            {/* Fallback */}
            <Route path="*" element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlannerProvider>
  );
};

export default App;
