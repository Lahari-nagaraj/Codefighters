import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import DashboardContent from "../components/farmer/DashboardContent";
import CropsContent from "../components/farmer/CropsContent";
import SchemesContent from "../components/farmer/SchemesContent";
import NewsContent from "../components/farmer/NewsContent";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <div>Users Management</div>;
      case "schemes":
        return <SchemesContent />;
      case "crops":
        return <CropsContent />;
      case "news":
        return <NewsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={logout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
