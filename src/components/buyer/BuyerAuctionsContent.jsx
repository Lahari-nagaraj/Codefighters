import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import { 
  Clock, 
  Users, 
  TrendingUp,
  Eye,
  Gavel,
  Trophy,
  AlertCircle,
  DollarSign,
  Timer
} from 'lucide-react';

const BuyerAuctionsContent = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const [bidAmount, setBidAmount] = useState('');
  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    fetchAuctions();
  }, [activeTab]);

  const fetchAuctions = async () => {
    try {
      const status = activeTab === 'live' ? 'active' : 'closed';
      const response = await ApiService.getAuctions({ status });
      setAuctions(response.auctions || []);
    } catch (error) {
      console.error('Auctions fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demo
  const mockAuctions = {
    live: [
      {
        id: 1,
        cropName: 'Premium Wheat',
        variety: 'HD-3086',
        quantity: 100,
        unit: 'quintals',
        startingPrice: 2100,
        currentBid: 2280,
        totalBids: 15,
        timeLeft: '2h 45m',
        farmerName: 'Rajesh Kumar',
        farmerLocation: 'Dharwad, Karnataka',
        quality: 'Premium',
        image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg',
        bidders: ['Priya Industries', 'Karnataka Mills', 'Export Corp', 'Grain Traders', 'Local Mill']
      },
      {
        id: 2,
        cropName: 'Organic Basmati Rice',
        variety: '1121',
        quantity: 50,
        unit: 'quintals',
        startingPrice: 1800,
        currentBid: 1950,
        totalBids: 23,
        timeLeft: '5h 20m',
        farmerName: 'Suresh Patil',
        farmerLocation: 'Mysore, Karnataka',
        quality: 'Organic Premium',
        image: 'https://images.pexels.com/photos/33488/delicious-rice-sesame-seed.jpg',
        bidders: ['Rice Exporters', 'Organic Foods', 'Premium Mills']
      },
      {
        id: 3,
        cropName: 'Cotton Bales',
        variety: 'Bt Cotton',
        quantity: 30,
        unit: 'quintals',
        startingPrice: 5200,
        currentBid: 5580,
        totalBids: 8,
        timeLeft: '1h 15m',
        farmerName: 'Ashok Reddy',
        farmerLocation: 'Hubli, Karnataka',
        quality: 'Export Quality',
        image: 'https://images.pexels.com/photos/5625996/pexels-photo-5625996.jpeg',
        bidders: ['Cotton Mills', 'Textile Corp', 'Export House']
      }
    ],
    completed: [
      {
        id: 4,
        cropName: 'Sugarcane',
        variety: 'Co 86032',
        quantity: 200,
        unit: 'tonnes',
        startingPrice: 280,
        finalPrice: 325,
        totalBids: 28,
        winner: 'Sugar Industries Ltd',
        farmerName: 'Manjula Devi',
        farmerLocation: 'Belgaum, Karnataka',
        completedDate: '2024-01-15',
        myBid: 320,
        won: false
      },
      {
        id: 5,
        cropName: 'Organic Wheat',
        variety: 'Sharbati',
        quantity: 75,
        unit: 'quintals',
        startingPrice: 2200,
        finalPrice: 2450,
        totalBids: 19,
        winner: 'Organic Mills Pvt Ltd',
        farmerName: 'Ramesh Yadav',
        farmerLocation: 'Dharwad, Karnataka',
        completedDate: '2024-01-14',
        myBid: 2380,
        won: false
      }
    ]
  };

  const displayAuctions = auctions.length > 0 ? auctions : mockAuctions[activeTab];

  const handlePlaceBid = async (auctionId) => {
    try {
      if (!bidAmount || !user) return;

      await ApiService.placeBid(auctionId, {
        buyerId: user.uid,
        buyerName: user.name,
        amount: parseFloat(bidAmount)
      });

      // Refresh auctions
      fetchAuctions();
      setBidAmount('');
      setSelectedAuction(null);
      
      // Show success message
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Bid placement error:', error);
      alert('Failed to place bid. Please try again.');
    }
  };

  const formatTimeLeft = (timeLeft) => {
    if (!timeLeft) return 'Ending soon';
    return timeLeft;
  };

  const getQualityColor = (quality) => {
    if (quality?.includes('Premium') || quality?.includes('Export')) {
      return 'bg-purple-100 text-purple-800';
    }
    if (quality?.includes('Organic')) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crop {t('auctions')}</h2>
          <p className="text-gray-600">Bid on premium crops and secure the best deals</p>
        </div>
        <div className="flex items-center space-x-2 bg-orange-100 px-3 py-2 rounded-lg">
          <Timer className="w-4 h-4 text-orange-600" />
          <span className="text-sm text-orange-700">3 auctions ending soon</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Live Auctions</h3>
          <p className="text-2xl font-bold text-green-600">12</p>
          <p className="text-sm text-gray-500">Active now</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">My Bids</h3>
          <p className="text-2xl font-bold text-blue-600">8</p>
          <p className="text-sm text-gray-500">This week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Auctions Won</h3>
          <p className="text-2xl font-bold text-purple-600">3</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Average Savings</h3>
          <p className="text-2xl font-bold text-orange-600">15.2%</p>
          <p className="text-sm text-gray-500">Below market</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('live')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'live'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Live Auctions ({mockAuctions.live.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed ({mockAuctions.completed.length})
          </button>
        </nav>
      </div>

      {/* Live Auctions */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          {displayAuctions.map((auction) => (
            <div key={auction.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={auction.image}
                    alt={auction.cropName}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {auction.cropName} - {auction.variety}
                      </h3>
                      <p className="text-gray-600 mb-2">{auction.quantity} {auction.unit}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(auction.quality)}`}>
                          {auction.quality}
                        </span>
                        <span className="text-sm text-gray-600">by {auction.farmerName}</span>
                      </div>
                      <p className="text-sm text-gray-500">{auction.farmerLocation}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatTimeLeft(auction.timeLeft)}
                      </div>
                      <p className="text-sm text-gray-600">Live Auction</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Starting Price</p>
                      <p className="text-lg font-semibold text-gray-900">₹{auction.startingPrice}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-600">Current Highest Bid</p>
                      <p className="text-lg font-semibold text-green-700">₹{auction.currentBid}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600">Total Bids</p>
                      <p className="text-lg font-semibold text-blue-700">{auction.totalBids}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {auction.bidders?.length || 0} bidders
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{((auction.currentBid - auction.startingPrice) / auction.startingPrice * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Bidding Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder={`Min bid: ₹${auction.currentBid + 10}`}
                          value={selectedAuction === auction.id ? bidAmount : ''}
                          onChange={(e) => {
                            setBidAmount(e.target.value);
                            setSelectedAuction(auction.id);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          min={auction.currentBid + 10}
                        />
                      </div>
                      <button
                        onClick={() => handlePlaceBid(auction.id)}
                        disabled={!bidAmount || parseFloat(bidAmount) <= auction.currentBid}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        Place Bid
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Recent Bidders */}
                  {auction.bidders && auction.bidders.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Bidders:</h4>
                      <div className="flex flex-wrap gap-2">
                        {auction.bidders.slice(0, 5).map((bidder, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {bidder}
                          </span>
                        ))}
                        {auction.bidders.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{auction.bidders.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
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
          {displayAuctions.map((auction) => (
            <div key={auction.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {auction.cropName} - {auction.variety}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {auction.quantity} {auction.unit} • by {auction.farmerName}
                  </p>
                  <p className="text-sm text-gray-500">{auction.farmerLocation}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {auction.won ? (
                    <>
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium text-green-600">Won</span>
                    </>
                  ) : (
                    <span className="text-sm font-medium text-gray-600">Lost</span>
                  )}
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
                  <p className="text-sm text-blue-600">Your Bid</p>
                  <p className="text-lg font-semibold text-blue-700">₹{auction.myBid}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Total Bids</p>
                  <p className="text-lg font-semibold text-purple-700">{auction.totalBids}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">
                    Winner: <span className="font-medium text-gray-900">{auction.winner}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed on {new Date(auction.completedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                  {auction.won && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      Complete Purchase
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Auction Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Bidding Tips</h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Set a maximum bid limit before participating</li>
              <li>• Monitor auction closely in the last few minutes</li>
              <li>• Consider quality and location when bidding</li>
              <li>• Factor in transportation costs for your final bid</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upcoming Auctions Preview */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Upcoming Auctions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Premium Maize</h4>
            <p className="text-sm text-gray-600 mb-2">Starting in 4 hours</p>
            <p className="text-sm font-medium text-purple-600">Starting bid: ₹1,800/quintal</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Organic Turmeric</h4>
            <p className="text-sm text-gray-600 mb-2">Starting tomorrow</p>
            <p className="text-sm font-medium text-purple-600">Starting bid: ₹8,500/quintal</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Export Quality Cotton</h4>
            <p className="text-sm text-gray-600 mb-2">Starting in 2 days</p>
            <p className="text-sm font-medium text-purple-600">Starting bid: ₹6,200/quintal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerAuctionsContent;