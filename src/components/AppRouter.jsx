import React from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/AdminDashboard";
import FarmerDashboard from "../pages/FarmerDashboard";
import BuyerDashboard from "../pages/BuyerDashboard";
import EquipmentSellerDashboard from "../pages/EquipmentSellerDashboard";
import ConsumerDashboard from "../pages/ConsumerDashboard";
import LoadingSpinner from "./common/LoadingSpinner";

const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginPage />;
  }

  // Route based on user role
  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "farmer":
      return <FarmerDashboard />;
    case "buyer":
      return <BuyerDashboard />;
    case "equipmentSeller":
      return <EquipmentSellerDashboard />;
    case "consumer":
      return <ConsumerDashboard />;
    default:
      return <LoginPage />;
  }
};

export default AppRouter;
