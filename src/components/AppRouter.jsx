import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginPage from "../pages/LoginPage";
import AuthPage from "../pages/AuthPage";
import AdminDashboard from "../pages/AdminDashboard";
import FarmerDashboard from "../pages/FarmerDashboard";
import BuyerDashboard from "../pages/BuyerDashboard";
import EquipmentSellerDashboard from "../pages/EquipmentSellerDashboard";
import ConsumerDashboard from "../pages/ConsumerDashboard";
import LoadingSpinner from "./common/LoadingSpinner";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to={`/${user.role}`} replace />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to={`/${user.role}`} replace />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/farmer" 
          element={
            <ProtectedRoute requiredRole="farmer">
              <FarmerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/buyer" 
          element={
            <ProtectedRoute requiredRole="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/equipment" 
          element={
            <ProtectedRoute requiredRole="equipmentSeller">
              <EquipmentSellerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/consumer" 
          element={
            <ProtectedRoute requiredRole="consumer">
              <ConsumerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
