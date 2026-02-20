import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';

import './App.css';

function App() {
  return (
    <ToastProvider>
      <Router>
    <Routes>

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected Routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>

  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="*" element={<NotFound />} />

</Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;