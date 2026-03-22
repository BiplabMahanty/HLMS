// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from "./Sidebar"
import SuperAdminSidebar from "./SuperAdminSidebar"
import {SellerRouter} from "./router/sellerRouter"
import {SuperAdminRouter} from "./router/superAdminRouter"
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
            {SellerRouter}
          </Route>
          <Route path="/superadmin" element={<ProtectedRoute><SuperAdminSidebar /></ProtectedRoute>}>
            {SuperAdminRouter}
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
