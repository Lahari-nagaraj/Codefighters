import React, { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import DashboardContent from '../components/farmer/DashboardContent';
import CropsContent from '../components/farmer/CropsContent';
import EquipmentContent from '../components/farmer/EquipmentContent';
import AuctionsContent from '../components/farmer/AuctionsContent';
import SchemesContent from '../components/farmer/SchemesContent';
import WeatherContent from '../components/farmer/WeatherContent';
import NewsContent from '../components/farmer/NewsContent';
import ChatContent from '../components/common/ChatContent';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'crops':
        return <CropsContent />;
      case 'equipment':
        return <EquipmentContent />;
      case 'auctions':
        return <AuctionsContent />;
      case 'schemes':
        return <SchemesContent />;
      case 'weather':
        return <WeatherContent />;
      case 'news':
        return <NewsContent />;
      case 'chat':
        return <ChatContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`${t('farmer')} ${t('dashboard')} - ${user?.name}`} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userRole="farmer"
        />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;