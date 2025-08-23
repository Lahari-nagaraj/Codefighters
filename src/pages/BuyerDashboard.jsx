import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import BuyerDashboardContent from '../components/buyer/BuyerDashboardContent';
import BuyerCropsContent from '../components/buyer/BuyerCropsContent';
import BuyerAuctionsContent from '../components/buyer/BuyerAuctionsContent';
import NewsContent from '../components/farmer/NewsContent';

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <BuyerDashboardContent />;
      case 'crops':
        return <BuyerCropsContent />;
      case 'auctions':
        return <BuyerAuctionsContent />;
      case 'news':
        return <NewsContent />;
      default:
        return <BuyerDashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole="buyer" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={logout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;