import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Customers } from './pages/Customers';
import { Billing } from './pages/Billing';
import { Reports } from './pages/Reports';
import { AdminOrders } from './pages/AdminOrders';
import { CustomerShop } from './pages/CustomerShop';
import { CustomerOrders } from './pages/CustomerOrders';
import { DataProvider, useData } from './context/DataContext';
import { AnimatePresence } from 'framer-motion';

const ProtectedRoute = ({ children, allowedRole }: { children?: React.ReactNode, allowedRole?: 'admin' | 'customer' }) => {
  const { user } = useData();
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/' : '/shop'} />;
  }

  return <Layout>{children}</Layout>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/" element={
          <ProtectedRoute allowedRole="admin"><Dashboard /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute allowedRole="admin"><AdminOrders /></ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute allowedRole="admin"><Products /></ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute allowedRole="admin"><Customers /></ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute allowedRole="admin"><Billing /></ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRole="admin"><Reports /></ProtectedRoute>
        } />

        {/* Customer Routes */}
        <Route path="/shop" element={
          <ProtectedRoute allowedRole="customer"><CustomerShop /></ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute allowedRole="customer"><CustomerOrders /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </DataProvider>
  );
};

export default App;