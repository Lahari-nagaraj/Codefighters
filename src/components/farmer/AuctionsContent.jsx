import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Clock, 
  Users, 
  TrendingUp,
  Eye,
  Gavel,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AuctionsContent = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('active');

  const auctions = {
    active: [
      {
        id: 1,
        cropName: 'Wheat',
        variety: 'HD-3086',
        quantity: 50,
        unit: 'quintals',
        startingPrice: 2100,
        currentBid: 2240,
        totalBids: 7,
        timeLeft: '2h 45m',
        status: 'active',
        bidders: ['Priya Industries', 'Karnataka Mills', 'Export Corp']
      },
      {
        id: 2,
        cropName: 'Rice',
        variety: 'Basmati 1121',
        quantity: 30,
        unit: 'quintals',
        startingPrice: 1800,
        currentBid: 1890,
        totalBids: 12,
        timeLeft: '5h 20m',
        status: 'active',
        bidders: ['Rice Traders', 'Agri Export', 'Local Mill']
      }
    ],
    completed: [
      {
        id: 3,
        cropName: 'Sugarcane',
        variety: 'Co 86032',
        quantity: 100,
        unit: 'tonnes',
        startingPrice: 280,
        finalPrice: 315,
        totalBids: 15,
        winner: 'Sugar Factory Ltd',
        status: 'won',
        completedDate: '2024-01-15'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'won':
        return 'bg-blue-100 text-blue-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My {t('auctions')}</h2>
        <p className="text-gray-600">Track your crop auctions and bidding activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Active Auctions</h3>
          <p className="text-2xl font-bold text-green-600">5</p>
          <p className="text-sm text-gray-500">2 ending today</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Bids Received</h3>
          <p className="text-2xl font-bold text-blue-600">47</p>
          <p className="text-sm text-gray-500">+8 today</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Auctions Won</h3>
          <p className="text-2xl font-bold text-purple-600">12</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Avg. Premium</h3>
          <p className="text-2xl font-bold text-orange-600">12.5%</p>
          <p className="text-sm text-gray-500">Above MSP</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Auctions ({auctions.active.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed ({auctions.completed.length})
          </button>
        </nav>
      </div>

      {/* Active Auctions */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {auctions.active.map((auction) => (
            <div key={auction.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {auction.cropName} - {auction.variety}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {auction.quantity} {auction.unit}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auction.status)}`}>
                  Live Auction
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Starting Price</p>
                  <p className="text-lg font-semibold text-gray-900">₹{auction.startingPrice}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Current Highest Bid</p>
                  <p className="text-lg font-semibold text-green-700">₹{auction.currentBid}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Bids</p>
                  <p className="text-lg font-semibold text-blue-700">{auction.totalBids}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600">Time Left</p>
                  <p className="text-lg font-semibold text-orange-700 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {auction.timeLeft}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {auction.bidders.length} bidders
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{((auction.currentBid - auction.startingPrice) / auction.startingPrice * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    <Gavel className="w-4 h-4 mr-1" />
                    Manage Auction
                  </button>
                </div>
              </div>

              {/* Recent Bidders */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Bidders:</h4>
                <div className="flex space-x-2">
                  {auction.bidders.slice(0, 3).map((bidder, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {bidder}
                    </span>
                  ))}
                  {auction.bidders.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{auction.bidders.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Auctions */}
      {activeTab === 'completed' && (
        <div className="space-y-6">
          {auctions.completed.map((auction) => (
            <div key={auction.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {auction.cropName} - {auction.variety}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {auction.quantity} {auction.unit}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Sold Successfully</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Starting Price</p>
                  <p className="text-lg font-semibold text-gray-900">₹{auction.startingPrice}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Final Price</p>
                  <p className="text-lg font-semibold text-green-700">₹{auction.finalPrice}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Bids</p>
                  <p className="text-lg font-semibold text-blue-700">{auction.totalBids}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Premium Earned</p>
                  <p className="text-lg font-semibold text-purple-700">
                    +{((auction.finalPrice - auction.startingPrice) / auction.startingPrice * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Winner: <span className="font-medium text-gray-900">{auction.winner}</span></p>
                  <p className="text-sm text-gray-500">Completed on {new Date(auction.completedDate).toLocaleDateString()}</p>
                </div>
                <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Auction Tips</h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Set competitive starting prices to attract more bidders</li>
              <li>• Provide clear crop quality information and photos</li>
              <li>• Monitor your auctions regularly for best results</li>
              <li>• Consider seasonal demand when timing your auctions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionsContent;