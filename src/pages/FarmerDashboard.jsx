import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import DashboardContent from "../components/farmer/DashboardContent";
import CropsContent from "../components/farmer/CropsContent";
import EquipmentContent from "../components/farmer/EquipmentContent";
import AuctionsContent from "../components/farmer/AuctionsContent";
import SchemesContent from "../components/farmer/SchemesContent";
import WeatherContent from "../components/farmer/WeatherContent";
import NewsContent from "../components/farmer/NewsContent";

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent onTabChange={setActiveTab} />;
      case "crops":
        return <CropsContent />;
      case "equipment":
        return <EquipmentContent />;
      case "auctions":
        return <AuctionsContent />;
      case "schemes":
        return <SchemesContent />;
      case "weather":
        return <WeatherContent />;
      case "news":
        return <NewsContent />;
      default:
        return <DashboardContent onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="farmer" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={logout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;