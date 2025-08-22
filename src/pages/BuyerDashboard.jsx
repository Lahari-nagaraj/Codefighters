import React, { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import BuyerDashboardContent from '../components/buyer/BuyerDashboardContent';
import BuyerCropsContent from '../components/buyer/BuyerCropsContent';
import BuyerAuctionsContent from '../components/buyer/BuyerAuctionsContent';
import NewsContent from '../components/farmer/NewsContent';
import ChatContent from '../components/common/ChatContent';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const { t } = useLanguage();

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
      case 'chat':
        return <ChatContent />;
      default:
        return <BuyerDashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`${t('buyer')} ${t('dashboard')} - ${user?.name}`} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userRole="buyer"
        />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;