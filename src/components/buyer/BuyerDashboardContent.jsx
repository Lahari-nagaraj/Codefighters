import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import { 
  TrendingUp, 
  Wheat, 
  Gavel, 
  IndianRupee, 
  ShoppingCart,
  Eye,
  MapPin,
  Calendar,
  Users,
  Star
} from 'lucide-react';

const BuyerDashboardContent = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [cropsResponse, auctionsResponse] = await Promise.all([
        ApiService.getCrops({ limit: 6 }),
        ApiService.getAuctions({ status: 'active', limit: 4 })
      ]);

      setCrops(cropsResponse.crops || []);
      setAuctions(auctionsResponse.auctions || []);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Available Crops',
      value: '245',
      change: '+18 today',
      icon: Wheat,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Active Auctions',
      value: '32',
      change: '8 ending soon',
      icon: Gavel,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Purchases',
      value: '₹8,45,000',
      change: '+25% this month',
      icon: IndianRupee,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Saved on MSP',
      value: '12.5%',
      change: 'Average savings',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentPurchases = [
    { crop: 'Wheat', quantity: '100 quintals', price: '₹2,240/quintal', farmer: 'Rajesh Kumar', date: '2024-01-15' },
    { crop: 'Rice', quantity: '75 quintals', price: '₹1,890/quintal', farmer: 'Suresh Patil', date: '2024-01-14' },
    { crop: 'Sugarcane', quantity: '200 tonnes', price: '₹315/tonne', farmer: 'Manjula Devi', date: '2024-01-13' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {t('welcome')}, {user?.name}! 🛒
        </h2>
        <p className="text-blue-100">
          Discover fresh crops directly from farmers • Compare prices • Make smart purchases
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
        {/* Featured Crops */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Featured Crops</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {crops.slice(0, 4).map((crop, index) => (
              <div key={crop.id || index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Wheat className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{crop.cropName || crop.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{crop.quantity} {crop.unit}</span>
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {crop.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{crop.pricePerUnit || crop.price}</p>
                  <p className="text-xs text-gray-500">per {crop.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Auctions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Auctions</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {auctions.slice(0, 3).map((auction, index) => (
              <div key={auction.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{auction.cropName}</h4>
                    <p className="text-sm text-gray-600">{auction.quantity} {auction.unit}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Live
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Current Bid:</span>
                  <span className="font-semibold text-green-600">₹{auction.currentBid || auction.startingPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Ends in:</span>
                  <span className="text-red-600 font-medium">{auction.timeLeft || '2h 30m'}</span>
                </div>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                  Place Bid
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchases</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Crop</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Farmer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentPurchases.map((purchase, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Wheat className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{purchase.crop}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{purchase.quantity}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-green-600">{purchase.price}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{purchase.farmer}</td>
                  <td className="py-3 px-4 text-gray-600">{purchase.date}</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-green-900 mb-2">Browse Crops</h4>
          <p className="text-sm text-green-700 mb-4">Explore fresh crops from verified farmers</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Browse Now
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Gavel className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h4 className="font-semibold text-blue-900 mb-2">Join Auctions</h4>
          <p className="text-sm text-blue-700 mb-4">Bid on premium crops in live auctions</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            View Auctions
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h4 className="font-semibold text-purple-900 mb-2">Connect Directly</h4>
          <p className="text-sm text-purple-700 mb-4">Message farmers for bulk orders</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Find Farmers
          </button>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-900 mb-4">Market Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Top Selling Crop</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">Wheat</p>
            <p className="text-sm text-gray-600">↑ 15% increase in demand</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Price Alert</span>
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="font-semibold text-gray-900">Rice Below MSP</p>
            <p className="text-sm text-gray-600">Good buying opportunity</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Active Regions</span>
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900">Karnataka</p>
            <p className="text-sm text-gray-600">Most active this week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardContent;