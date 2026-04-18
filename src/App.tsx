import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Directory = lazy(() => import('./pages/Directory').then((module) => ({ default: module.Directory })));
const Upload = lazy(() => import('./pages/Upload').then((module) => ({ default: module.Upload })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Detail = lazy(() => import('./pages/Detail').then((module) => ({ default: module.Detail })));
const Settings = lazy(() => import('./pages/Settings').then((module) => ({ default: module.Settings })));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const SearchResults = lazy(() => import('./pages/SearchResults').then((module) => ({ default: module.SearchResults })));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail').then((module) => ({ default: module.VerifyEmail })));

const RouteFallback: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading page...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Login page — standalone, no sidebar/navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* All other pages use the shared Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/directory/:facultyId" element={<Detail />} />
            <Route path="/paper/:paperId" element={<Detail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default App;
