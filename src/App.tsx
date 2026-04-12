import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Directory } from './pages/Directory';
import { Upload } from './pages/Upload';
import { Dashboard } from './pages/Dashboard';
import { Detail } from './pages/Detail';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { SearchResults } from './pages/SearchResults';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Login page — standalone, no sidebar/navbar */}
        <Route path="/login" element={<Login />} />

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
    </AuthProvider>
  );
};

export default App;
