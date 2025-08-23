import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import ApiService from '../../services/api';
import BiddingModal from './BiddingModal';
import { 
  Search, 
  Filter,
  MapPin,
  Calendar,
  Eye,
  ShoppingCart,
  TrendingUp,
  Star,
  Phone,
  MessageSquare,
  Gavel,
  RefreshCw
} from 'lucide-react';

const BuyerCropsContent = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  });
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadCrops();
  }, [refreshKey]);

  const loadCrops = () => {
    setLoading(true);
    
    // Load API crops first
    fetchCrops();
    
    // Then load farmer's crops from localStorage
    const savedCrops = localStorage.getItem('farmerCrops');
    if (savedCrops) {
      const farmerCrops = JSON.parse(savedCrops);
      // Filter only crops that are in auction or listed
      const availableCrops = farmerCrops.filter(crop => 
        crop.status === 'In Auction' || crop.status === 'Listed'
      );
      
      // Merge with existing crops, avoiding duplicates
      setCrops(prevCrops => {
        const existingIds = new Set(prevCrops.map(c => c.id));
        const newCrops = availableCrops.filter(crop => !existingIds.has(crop.id));
        return [...prevCrops, ...newCrops];
      });
    }
    
    setLoading(false);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const fetchCrops = async () => {
    try {
      const response = await ApiService.getCrops();
      setCrops(response.crops || []);
    } catch (error) {
      console.error('Crops fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCropClick = (crop) => {
    setSelectedCrop(crop);
    setShowBiddingModal(true);
  };

  const handleBidPlaced = (bid) => {
    // Show success message or update UI
    console.log('Bid placed successfully:', bid);
    // Refresh crops to show updated bid count
    handleRefresh();
  };

  const handleCloseBiddingModal = () => {
    setShowBiddingModal(false);
    setSelectedCrop(null);
  };

  const filteredCrops = crops.filter(crop => {
    // Handle both API crops (cropName) and farmer crops (name)
    const cropName = crop.cropName || crop.name;
    const variety = crop.variety;
    
    const matchesSearch = cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variety?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || crop.cropType === filters.category;
    const matchesLocation = !filters.location || crop.location?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesMinPrice = !filters.minPrice || crop.pricePerUnit >= parseFloat(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || crop.pricePerUnit <= parseFloat(filters.maxPrice);
    
    return matchesSearch && matchesCategory && matchesLocation && matchesMinPrice && matchesMaxPrice;
  });

  const mockCrops = [
    {
      id: 1,
      cropName: 'Wheat',
      variety: 'HD-3086',
      quantity: 50,
      unit: 'quintals',
      pricePerUnit: 2240,
      msp: 2125,
      location: 'Dharwad, Karnataka',
      farmerName: 'Rajesh Kumar',
      farmerRating: 4.8,
      listedDate: '2024-01-15',
      image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg',
      quality: 'Premium',
      organic: false
    },
    {
      id: 2,
      cropName: 'Rice',
      variety: 'Basmati 1121',
      quantity: 30,
      unit: 'quintals',
      pricePerUnit: 1890,
      msp: 1940,
      location: 'Mysore, Karnataka',
      farmerName: 'Suresh Patil',
      farmerRating: 4.6,
      listedDate: '2024-01-14',
      image: 'https://images.pexels.com/photos/33488/delicious-rice-sesame-seed.jpg',
      quality: 'Standard',
      organic: true
    },
    {
      id: 3,
      cropName: 'Sugarcane',
      variety: 'Co 86032',
      quantity: 100,
      unit: 'tonnes',
      pricePerUnit: 315,
      msp: 290,
      location: 'Belgaum, Karnataka',
      farmerName: 'Manjula Devi',
      farmerRating: 4.9,
      listedDate: '2024-01-13',
      image: 'https://images.pexels.com/photos/8566492/pexels-photo-8566492.jpeg',
      quality: 'Premium',
      organic: false
    },
    {
      id: 4,
      cropName: 'Cotton',
      variety: 'Bt Cotton',
      quantity: 25,
      unit: 'quintals',
      pricePerUnit: 5680,
      msp: 5515,
      location: 'Hubli, Karnataka',
      farmerName: 'Ashok Reddy',
      farmerRating: 4.7,
      listedDate: '2024-01-12',
      image: 'https://images.pexels.com/photos/5625996/pexels-photo-5625996.jpeg',
      quality: 'Premium',
      organic: false
    }
  ];

  const displayCrops = filteredCrops.length > 0 ? filteredCrops : mockCrops;

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'Premium':
        return 'bg-purple-100 text-purple-800';
      case 'Standard':
        return 'bg-blue-100 text-blue-800';
      case 'Basic':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriceStatus = (price, msp) => {
    const diff = ((price - msp) / msp) * 100;
    if (diff > 0) {
      return { text: `+${diff.toFixed(1)}% above MSP`, color: 'text-orange-600', icon: '↗' };
    } else {
      return { text: `${diff.toFixed(1)}% below MSP`, color: 'text-green-600', icon: '↘' };
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Browse {t('crops')}</h2>
          <p className="text-gray-600">Discover fresh crops directly from verified farmers</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
          <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Market trending up 5.2%</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search crops, varieties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Categories</option>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="cotton">Cotton</option>
              <option value="maize">Maize</option>
            </select>
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Advanced
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-4">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-24 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-24 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
              Organic Only
            </button>
            <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200">
              Premium Quality
            </button>
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
              Below MSP
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Available Crops</h3>
          <p className="text-2xl font-bold text-green-600">{filteredCrops.length}</p>
          <p className="text-sm text-gray-500">In your area</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Live Auctions</h3>
          <p className="text-2xl font-bold text-orange-600">{filteredCrops.filter(c => c.status === 'In Auction').length}</p>
          <p className="text-sm text-gray-500">Active now</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Bids</h3>
          <p className="text-2xl font-bold text-purple-600">{filteredCrops.reduce((sum, c) => sum + (c.bids || 0), 0)}</p>
          <p className="text-sm text-gray-500">Across all crops</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Fresh Listings</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredCrops.filter(c => {
            const today = new Date();
            const listedDate = new Date(c.listedDate);
            return today.toDateString() === listedDate.toDateString();
          }).length}</p>
          <p className="text-sm text-gray-500">Added today</p>
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => {
          const priceStatus = getPriceStatus(crop.pricePerUnit, crop.msp);
          const cropName = crop.cropName || crop.name;
          
          return (
            <div 
              key={crop.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCropClick(crop)}
            >
              <div className="relative h-48">
                <img
                  src={crop.image}
                  alt={crop.cropName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(crop.quality || 'Standard')}`}>
                    {crop.quality || 'Standard'}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex space-x-1">
                  {crop.status === 'In Auction' && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      Live Auction
                    </span>
                  )}
                  {crop.organic && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Organic
                    </span>
                  )}
                  {crop.bids > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {crop.bids} bids
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  {crop.quantity} {crop.unit}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cropName}</h3>
                    <p className="text-sm text-gray-600">{crop.variety}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">₹{crop.pricePerUnit}</p>
                    <p className="text-xs text-gray-500">per {crop.unit === 'quintals' ? 'quintal' : 'tonne'}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <span className={`${priceStatus.color} font-medium`}>
                      {priceStatus.icon} {priceStatus.text}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {crop.location}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                      {crop.farmerRating || 4.5} • {crop.farmerName || 'Verified Farmer'}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(crop.listedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => handleCropClick(crop)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {t('view')}
                  </button>
                  {crop.status === 'In Auction' ? (
                    <button 
                      onClick={() => handleCropClick(crop)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      <Gavel className="w-4 h-4 mr-1" />
                      Place Bid
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleCropClick(crop)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Buy Now
                    </button>
                  )}
                </div>
                
                <div className="flex justify-center space-x-4 mt-3 pt-3 border-t border-gray-200">
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </button>
                  <button className="flex items-center text-sm text-green-600 hover:text-green-700">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCrops.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: '', location: '', minPrice: '', maxPrice: '' });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Quick Buy Options */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Purchase Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Bulk Orders</h4>
            <p className="text-sm text-gray-600">Order 100+ quintals for better prices</p>
            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
              Request Quote
            </button>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Contract Farming</h4>
            <p className="text-sm text-gray-600">Pre-book harvest for better rates</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              Learn More
            </button>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Price Alerts</h4>
            <p className="text-sm text-gray-600">Get notified when prices drop</p>
            <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
              Set Alert
            </button>
          </div>
        </div>
      </div>

      {/* Bidding Modal */}
      <BiddingModal
        crop={selectedCrop}
        isOpen={showBiddingModal}
        onClose={handleCloseBiddingModal}
        onBidPlaced={handleBidPlaced}
      />
    </div>
  );
};

export default BuyerCropsContent;