import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RouteLoading } from './RouteLoading';
import { RouteSyncer } from './RouteSyncer';
import { Landing } from './Landing';

const App = () => {
  const { authLoading, isAuthenticated, redirect, navigate } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log("Anonymous sign in successful, redirecting to:", redirect);
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  return (
    <BrowserRouter>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-slate-950 z-0 pointer-events-none" />
      <RouteSyncer />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;