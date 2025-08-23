import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Clock, 
  Users, 
  TrendingUp,
  Eye,
  Gavel,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Package,
  MapPin,
  Calendar,
  IndianRupee,
  User,
  MessageCircle
} from 'lucide-react';

const AuctionsContent = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showBidDetails, setShowBidDetails] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [crops, setCrops] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Mock bid data - in real app this would come from API
  const mockBids = [
    {
      id: 1,
      bidderName: 'Agro Traders Ltd',
      bidAmount: 2350,
      bidQuantity: 50,
      bidDate: '2024-01-20T10:30:00',
      bidderRating: 4.8,
      bidderLocation: 'Mumbai, Maharashtra',
      bidderType: 'Wholesaler',
      message: 'Interested in bulk purchase. Can arrange transport.'
    },
    {
      id: 2,
      bidderName: 'Fresh Harvest Co',
      bidAmount: 2280,
      bidQuantity: 30,
      bidDate: '2024-01-20T09:15:00',
      bidderRating: 4.6,
      bidderLocation: 'Pune, Maharashtra',
      bidderType: 'Processor',
      message: 'Looking for quality wheat for flour production.'
    },
    {
      id: 3,
      bidderName: 'Local Market Hub',
      bidAmount: 2200,
      bidQuantity: 25,
      bidDate: '2024-01-20T08:45:00',
      bidderRating: 4.4,
      bidderLocation: 'Dharwad, Karnataka',
      bidderType: 'Retailer',
      message: 'Local market demand. Quick payment.'
    }
  ];

  useEffect(() => {
    // Load crops from localStorage
    const savedCrops = localStorage.getItem('farmerCrops');
    if (savedCrops) {
      setCrops(JSON.parse(savedCrops));
    }
  }, []);

  useEffect(() => {
    // Calculate time remaining for auction
    if (selectedCrop && selectedCrop.status === 'In Auction') {
      const endTime = new Date(selectedCrop.listedDate);
      endTime.setDate(endTime.getDate() + 7); // 7 days auction period
      
      const timer = setInterval(() => {
        const now = new Date();
        const remaining = endTime - now;
        
        if (remaining <= 0) {
          setTimeRemaining('Auction Ended');
          clearInterval(timer);
          // Auto-update crop status if auction ended
          if (selectedCrop.status === 'In Auction') {
            const updatedCrop = { ...selectedCrop, status: 'Listed' };
            setSelectedCrop(updatedCrop);
            // Update in localStorage
            const savedCrops = localStorage.getItem('farmerCrops');
            if (savedCrops) {
              const crops = JSON.parse(savedCrops);
              const updatedCrops = crops.map(c => 
                c.id === selectedCrop.id ? updatedCrop : c
              );
              localStorage.setItem('farmerCrops', JSON.stringify(updatedCrops));
              setCrops(updatedCrops);
            }
          }
        } else {
          const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
          const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedCrop]);

  const handleViewDetails = (crop) => {
    setSelectedCrop(crop);
    setShowBidDetails(true);
  };

  const handleAcceptBid = (bid) => {
    setSelectedBid(bid);
    setShowAcceptModal(true);
  };

  const confirmAcceptBid = () => {
    if (!selectedBid || !selectedCrop) return;

    // Update crop status to sold
    const updatedCrop = {
      ...selectedCrop,
      status: 'Sold',
      soldDate: new Date().toISOString().split('T')[0],
      soldPrice: selectedBid.bidAmount,
      soldTo: selectedBid.bidderName,
      finalBid: selectedBid
    };

    // Update crops in localStorage
    const savedCrops = localStorage.getItem('farmerCrops');
    if (savedCrops) {
      const crops = JSON.parse(savedCrops);
      const updatedCrops = crops.map(c => 
        c.id === selectedCrop.id ? updatedCrop : c
      );
      localStorage.setItem('farmerCrops', JSON.stringify(updatedCrops));
      setCrops(updatedCrops);
    }

    // Update dashboard stats
    const stats = localStorage.getItem('farmerDashboardStats');
    if (stats) {
      const currentStats = JSON.parse(stats);
      const newStats = {
        ...currentStats,
        totalRevenue: currentStats.totalRevenue + (selectedBid.bidAmount * selectedBid.bidQuantity),
        activeAuctions: Math.max(0, currentStats.activeAuctions - 1)
      };
      localStorage.setItem('farmerDashboardStats', JSON.stringify(newStats));
    }

    setShowAcceptModal(false);
    setSelectedBid(null);
    setShowBidDetails(false);
    setSelectedCrop(null);
  };

  const goBack = () => {
    setShowBidDetails(false);
    setSelectedCrop(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Listed':
        return 'bg-blue-100 text-blue-800';
      case 'In Auction':
        return 'bg-green-100 text-green-800';
      case 'Sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBidderTypeColor = (type) => {
    switch (type) {
      case 'Wholesaler':
        return 'bg-purple-100 text-purple-800';
      case 'Processor':
        return 'bg-blue-100 text-blue-800';
      case 'Retailer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter crops by status
  const activeAuctions = crops.filter(crop => crop.status === 'In Auction');
  const completedAuctions = crops.filter(crop => crop.status === 'Sold');

  // If showing bid details, render the detailed view
  if (showBidDetails && selectedCrop) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={goBack}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="ml-2">Back to Auctions</span>
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Bidding Details</h1>
                  <p className="text-sm text-gray-600">{selectedCrop.name} - {selectedCrop.variety}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCrop.status)}`}>
                  {selectedCrop.status}
                </span>
                {selectedCrop.status === 'In Auction' && timeRemaining && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{timeRemaining}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Crop Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Crop Information</h2>
                
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={selectedCrop.image}
                    alt={selectedCrop.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCrop.status)}`}>
                      {selectedCrop.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium">{selectedCrop.quantity} {selectedCrop.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Your Price</p>
                      <p className="font-medium text-green-600">₹{selectedCrop.pricePerUnit}/{selectedCrop.unit === 'quintals' ? 'quintal' : 'tonne'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">MSP</p>
                      <p className="font-medium">₹{selectedCrop.msp}/{selectedCrop.unit === 'quintals' ? 'quintal' : 'tonne'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedCrop.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Listed Date</p>
                      <p className="font-medium">{new Date(selectedCrop.listedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {selectedCrop.description && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-sm">{selectedCrop.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bids Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="w-6 h-6 text-gray-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Bids Received</h2>
                        <p className="text-sm text-gray-600">{mockBids.length} bids so far</p>
                        {mockBids.length > 0 && (
                          <p className="text-sm text-green-600 font-medium">
                            Highest Bid: ₹{Math.max(...mockBids.map(b => b.bidAmount))}/{selectedCrop.unit === 'quintals' ? 'quintal' : 'tonne'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {selectedCrop.status === 'In Auction' && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Auction ends in</p>
                        <p className="text-lg font-semibold text-green-600">{timeRemaining}</p>
                        <p className="text-xs text-gray-500">Started: {new Date(selectedCrop.listedDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">Ends: {new Date(new Date(selectedCrop.listedDate).getTime() + (7 * 24 * 60 * 60 * 1000)).toLocaleDateString()}</p>
                        
                        {/* Auction Progress Bar */}
                        <div className="mt-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.max(0, Math.min(100, ((new Date().getTime() - new Date(selectedCrop.listedDate).getTime()) / (7 * 24 * 60 * 60 * 1000)) * 100))}%`
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.max(0, Math.min(100, ((new Date().getTime() - new Date(selectedCrop.listedDate).getTime()) / (7 * 24 * 60 * 60 * 1000)) * 100)).toFixed(0)}% Complete
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {/* Auction Statistics */}
                  {mockBids.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-blue-900 mb-3">Auction Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-blue-600">Total Bids</p>
                          <p className="font-semibold text-blue-900">{mockBids.length}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">Highest Bid</p>
                          <p className="font-semibold text-green-600">₹{Math.max(...mockBids.map(b => b.bidAmount))}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">Lowest Bid</p>
                          <p className="font-semibold text-red-600">₹{Math.min(...mockBids.map(b => b.bidAmount))}</p>
                        </div>
                        <div>
                          <p className="text-blue-600">Avg Bid</p>
                          <p className="font-semibold text-blue-900">₹{(mockBids.reduce((sum, b) => sum + b.bidAmount, 0) / mockBids.length).toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {mockBids.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Bids Yet</h3>
                      <p className="text-gray-600">Your crop is listed and waiting for bids from buyers.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockBids
                        .sort((a, b) => b.bidAmount - a.bidAmount) // Sort by highest bid first
                        .map((bid, index) => (
                          <div key={bid.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                            {/* Bid Rank Badge */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                                  index === 1 ? 'bg-gray-100 text-gray-800' : 
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `#${index + 1}`}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{bid.bidderName}</h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBidderTypeColor(bid.bidderType)}`}>
                                    {bid.bidderType}
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-sm text-gray-600">★</span>
                                    <span className="text-sm font-medium">{bid.bidderRating}</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                  <div>
                                    <p className="text-sm text-gray-600">Bid Amount</p>
                                    <p className="text-lg font-semibold text-green-600">₹{bid.bidAmount}/{selectedCrop.unit === 'quintals' ? 'quintal' : 'tonne'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Quantity</p>
                                    <p className="font-medium">{bid.bidQuantity} {selectedCrop.unit}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Total Value</p>
                                    <p className="font-medium">₹{(bid.bidAmount * bid.bidQuantity).toLocaleString()}</p>
                                  </div>
                                </div>
                                
                                {/* Profit Analysis */}
                                <div className="bg-green-50 p-3 rounded-md mb-3">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-600">Your Price:</p>
                                      <p className="font-medium">₹{selectedCrop.pricePerUnit}/{selectedCrop.unit === 'quintals' ? 'quintal' : 'tonne'}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Profit per Unit:</p>
                                      <p className="font-semibold text-green-600">₹{bid.bidAmount - selectedCrop.pricePerUnit}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Total Profit:</p>
                                      <p className="font-semibold text-green-600">₹{((bid.bidAmount - selectedCrop.pricePerUnit) * bid.bidQuantity).toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Profit Margin:</p>
                                      <p className="font-semibold text-green-600">{(((bid.bidAmount - selectedCrop.pricePerUnit) / selectedCrop.pricePerUnit) * 100).toFixed(1)}%</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{bid.bidderLocation}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(bid.bidDate).toLocaleDateString()}</span>
                                  </div>
                                </div>

                                {bid.message && (
                                  <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm text-gray-700">{bid.message}</p>
                                  </div>
                                )}
                              </div>

                              {selectedCrop.status === 'In Auction' && (
                                <div className="ml-4">
                                  <button
                                    onClick={() => handleAcceptBid(bid)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Accept Bid</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accept Bid Confirmation Modal */}
        {showAcceptModal && selectedBid && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Sale</h3>
                <p className="text-gray-600">
                  Are you sure you want to sell your crop to <strong>{selectedBid.bidderName}</strong>?
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Bid Amount:</p>
                    <p className="font-semibold text-green-600">₹{selectedBid.bidAmount}/{selectedCrop.unit === 'quintals' ? 'quintal' : 'tonne'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quantity:</p>
                    <p className="font-semibold">{selectedBid.bidQuantity} {selectedCrop.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Value:</p>
                    <p className="font-semibold">₹{(selectedBid.bidAmount * selectedBid.bidQuantity).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Profit:</p>
                    <p className="font-semibold text-green-600">
                      ₹{((selectedBid.bidAmount - selectedCrop.pricePerUnit) * selectedBid.bidQuantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAcceptBid}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Confirm Sale
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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
          <p className="text-2xl font-bold text-green-600">{activeAuctions.length}</p>
          <p className="text-sm text-gray-500">Currently running</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Bids Received</h3>
          <p className="text-2xl font-bold text-blue-600">{activeAuctions.length * 3}</p>
          <p className="text-sm text-gray-500">Across all auctions</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Completed Sales</h3>
          <p className="text-2xl font-bold text-purple-600">{completedAuctions.length}</p>
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
            Active Auctions ({activeAuctions.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed ({completedAuctions.length})
          </button>
        </nav>
      </div>

      {/* Active Auctions */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {activeAuctions.length === 0 ? (
            <div className="text-center py-12">
              <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Auctions</h3>
              <p className="text-gray-600">You don't have any active auctions at the moment.</p>
            </div>
          ) : (
            activeAuctions.map((auction) => (
              <div key={auction.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {auction.name} - {auction.variety}
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
                    <p className="text-lg font-semibold text-gray-900">₹{auction.pricePerUnit}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Current Highest Bid</p>
                    <p className="text-lg font-semibold text-green-700">₹{auction.pricePerUnit + 150}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Bids</p>
                    <p className="text-lg font-semibold text-blue-700">3</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600">Time Left</p>
                    <p className="text-lg font-semibold text-orange-700 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      5d 12h
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      3 bidders
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +7.1%
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewDetails(auction)}
                      className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
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
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Agro Traders Ltd
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Fresh Harvest Co
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Local Market Hub
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Completed Auctions */}
      {activeTab === 'completed' && (
        <div className="space-y-6">
          {completedAuctions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Auctions</h3>
              <p className="text-gray-600">You haven't completed any auctions yet.</p>
            </div>
          ) : (
            completedAuctions.map((auction) => (
              <div key={auction.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {auction.name} - {auction.variety}
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
                    <p className="text-lg font-semibold text-gray-900">₹{auction.pricePerUnit}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Final Price</p>
                    <p className="text-lg font-semibold text-green-700">₹{auction.soldPrice || auction.pricePerUnit + 200}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Bids</p>
                    <p className="text-lg font-semibold text-blue-700">3</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Premium Earned</p>
                    <p className="text-lg font-semibold text-purple-700">
                      +{(((auction.soldPrice || auction.pricePerUnit + 200) - auction.pricePerUnit) / auction.pricePerUnit * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Winner: <span className="font-medium text-gray-900">{auction.soldTo || 'Agro Traders Ltd'}</span></p>
                    <p className="text-sm text-gray-500">Completed on {new Date(auction.soldDate || auction.listedDate).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(auction)}
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
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