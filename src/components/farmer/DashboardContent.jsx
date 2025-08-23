import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  TrendingUp, 
  Wheat, 
  Gavel, 
  IndianRupee, 
  Users,
  AlertTriangle,
  Cloud,
  Calendar
} from 'lucide-react';

const DashboardContent = ({ onTabChange }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [cropsCount, setCropsCount] = useState(3); // Default count

  // Read crops count from localStorage
  useEffect(() => {
    const updateCropsCount = () => {
      const savedCrops = localStorage.getItem('farmerCrops');
      if (savedCrops) {
        const crops = JSON.parse(savedCrops);
        setCropsCount(crops.length);
      }
    };

    // Initial load
    updateCropsCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCropsCount);
    
    // Also check periodically for changes
    const interval = setInterval(updateCropsCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCropsCount);
      clearInterval(interval);
    };
  }, []);

  // Dynamic stats based on user data (starting with zero)
  const stats = [
    {
      title: t('totalCrops'),
      value: cropsCount.toString(),
      change: `+${cropsCount - 3} this week`,
      icon: Wheat,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: t('activeAuctions'),
      value: user?.activeAuctions || '0',
      change: '0 ending soon',
      icon: Gavel,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: t('earnings'),
      value: `₹${user?.totalEarnings || '0'}`,
      change: '+0% from last month',
      icon: IndianRupee,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Market Price Alert',
      value: `${user?.marketPriceAlerts || '0'} crops`,
      change: 'Above MSP today',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Dynamic recent activity based on user data
  const recentActivity = user?.recentActivity || [
    { type: 'welcome', message: 'Welcome to Agrastra! Start by adding your first crop.', time: 'Just now' }
  ];

  // Market prices with MSP (keeping same for now as requested)
  const marketPrices = [
    { crop: 'Wheat', msp: '₹2,125', market: '₹2,240', trend: 'up' },
    { crop: 'Rice', msp: '₹1,940', market: '₹1,890', trend: 'down' },
    { crop: 'Sugarcane', msp: '₹290', market: '₹310', trend: 'up' },
    { crop: 'Cotton', msp: '₹5,515', market: '₹5,680', trend: 'up' }
  ];

  // Navigation functions
  const navigateToCrops = () => {
    if (onTabChange) {
      onTabChange('crops');
    }
  };

  const navigateToAuctions = () => {
    if (onTabChange) {
      onTabChange('auctions');
    }
  };

  const navigateToSchemes = () => {
    if (onTabChange) {
      onTabChange('schemes');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {t('welcome')}, {user?.name || 'Farmer'}! 🌾
        </h2>
        <p className="text-green-100">
          Today's weather: 28°C, Sunny ☀️ • Best time for harvesting
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Prices */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Market Prices vs MSP
          </h3>
          <div className="space-y-4">
            {marketPrices.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.crop}</p>
                  <p className="text-sm text-gray-600">MSP: {item.msp}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.market}
                  </p>
                  <div className="flex items-center">
                    <TrendingUp className={`w-4 h-4 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
                    <span className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.trend === 'up' ? '+5.4%' : '-2.6%'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'auction' ? 'bg-green-500' :
                    activity.type === 'listing' ? 'bg-blue-500' :
                    activity.type === 'equipment' ? 'bg-purple-500' :
                    activity.type === 'scheme' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type === 'welcome' ? activity.message : 
                       `${activity.crop} - ${activity.status}`}
                    </p>
                    {activity.amount && (
                      <p className="text-sm text-gray-600">{activity.amount}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No recent activity</p>
                <p className="text-sm">Start by adding your first crop!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <Wheat className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-green-900 mb-2">List New Crop</h4>
          <p className="text-sm text-green-700 mb-4">Add your harvest to the marketplace</p>
          <button 
            onClick={navigateToCrops}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {t('addCrop')}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Gavel className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h4 className="font-semibold text-blue-900 mb-2">Join Auctions</h4>
          <p className="text-sm text-blue-700 mb-4">Participate in live crop auctions</p>
          <button 
            onClick={navigateToAuctions}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View {t('auctions')}
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-purple-900 mb-2">Government Schemes</h4>
          <p className="text-sm text-purple-700 mb-4">Apply for subsidies and benefits</p>
          <button 
            onClick={navigateToSchemes}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Explore {t('schemes')}
          </button>
        </div>
      </div>

      {/* Weather Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <div>
            <h4 className="font-medium text-orange-900">Weather Advisory</h4>
            <p className="text-sm text-orange-700">
              Light rainfall expected in next 3 days. Consider harvesting ripe crops early.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;