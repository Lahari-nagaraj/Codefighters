import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
  MapPin,
  Calendar,
  X
} from 'lucide-react';

const CropsContent = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    cropType: 'all',
    priceRange: 'all'
  });

  // Default crops data
  const defaultCrops = [
    {
      id: 1,
      name: 'Wheat',
      variety: 'HD-3086',
      quantity: 50,
      unit: 'quintals',
      pricePerUnit: 2240,
      msp: 2125,
      location: 'Dharwad, Karnataka',
      status: 'In Auction',
      listedDate: '2024-01-15',
      image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg',
      bids: 3
    },
    {
      id: 2,
      name: 'Rice',
      variety: 'Basmati 1121',
      quantity: 30,
      unit: 'quintals',
      pricePerUnit: 1890,
      msp: 1940,
      location: 'Mysore, Karnataka',
      status: 'In Auction',
      listedDate: '2024-01-12',
      image: 'https://images.pexels.com/photos/33488/delicious-rice-sesame-seed.jpg',
      bids: 7
    },
    {
      id: 3,
      name: 'Sugarcane',
      variety: 'Co 86032',
      quantity: 100,
      unit: 'tonnes',
      pricePerUnit: 310,
      msp: 290,
      location: 'Belgaum, Karnataka',
      status: 'Sold',
      listedDate: '2024-01-10',
      image: 'https://images.pexels.com/photos/8566492/pexels-photo-8566492.jpeg',
      bids: 12
    }
  ];

  // Load crops from localStorage or use default crops
  const [crops, setCrops] = useState(() => {
    const savedCrops = localStorage.getItem('farmerCrops');
    if (savedCrops) {
      return JSON.parse(savedCrops);
    }
    return defaultCrops;
  });

  // Save crops to localStorage whenever crops change
  useEffect(() => {
    localStorage.setItem('farmerCrops', JSON.stringify(crops));
    
    // Update dashboard stats in localStorage for other components to access
    const stats = calculateStats();
    localStorage.setItem('farmerDashboardStats', JSON.stringify(stats));
  }, [crops]);

  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    quantity: '',
    unit: 'quintals',
    price: '',
    location: '',
    description: ''
  });

  // Calculate dynamic stats based on crops data
  const calculateStats = () => {
    const totalListings = crops.length;
    const activeAuctions = crops.filter(crop => crop.status === 'In Auction').length;
    const totalRevenue = crops
      .filter(crop => crop.status === 'Sold')
      .reduce((sum, crop) => sum + (crop.pricePerUnit * crop.quantity), 0);
    
    const avgPriceAboveMSP = crops.length > 0 
      ? crops.reduce((sum, crop) => {
          const percentage = ((crop.pricePerUnit - crop.msp) / crop.msp) * 100;
          return sum + percentage;
        }, 0) / crops.length
      : 0;

    return {
      totalListings,
      activeAuctions,
      totalRevenue,
      avgPriceAboveMSP: avgPriceAboveMSP.toFixed(1)
    };
  };

  const stats = calculateStats();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCrop) {
      // Update existing crop
      const updatedCrops = crops.map(crop => 
        crop.id === editingCrop.id 
          ? { ...crop, ...formData, pricePerUnit: parseFloat(formData.price) }
          : crop
      );
      setCrops(updatedCrops);
      setShowEditForm(false);
      setEditingCrop(null);
    } else {
      // Create new crop object
      const newCrop = {
        id: Date.now(), // Simple ID generation
        name: formData.cropName,
        variety: formData.variety,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.price),
        msp: getMSPForCrop(formData.cropName), // Get MSP based on crop name
        location: formData.location,
        status: 'Listed', // Default status for new crops
        listedDate: new Date().toISOString().split('T')[0], // Today's date
        image: getDefaultImageForCrop(formData.cropName), // Get default image
        bids: 0, // New crops start with 0 bids
        description: formData.description
      };

      // Add new crop to the crops array
      setCrops(prevCrops => [newCrop, ...prevCrops]);
    }
    
    // Reset form and close modal
    setShowAddForm(false);
    setFormData({
      cropName: '',
      variety: '',
      quantity: '',
      unit: 'quintals',
      price: '',
      location: '',
      description: ''
    });

    console.log(editingCrop ? 'Updated crop:' : 'Added new crop:', editingCrop || newCrop);
  };

  // View crop functionality - now navigates to auctions page
  const handleViewCrop = (crop) => {
    // Navigate to auctions page with crop details
    navigate('/farmer', { state: { showAuctions: true, selectedCropId: crop.id } });
  };

  // Edit crop functionality
  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setFormData({
      cropName: crop.name,
      variety: crop.variety,
      quantity: crop.quantity.toString(),
      unit: crop.unit,
      price: crop.pricePerUnit.toString(),
      location: crop.location,
      description: crop.description || ''
    });
    setShowEditForm(true);
  };

  // Delete crop functionality
  const handleDeleteCrop = (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      const updatedCrops = crops.filter(crop => crop.id !== cropId);
      setCrops(updatedCrops);
    }
  };

  // Filter functionality
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      cropType: 'all',
      priceRange: 'all'
    });
  };

  // Helper function to get MSP for different crops
  const getMSPForCrop = (cropName) => {
    const mspData = {
      'Wheat': 2125,
      'Rice': 1940,
      'Sugarcane': 290,
      'Cotton': 5515,
      'Maize': 1850,
      'Pulses': 6400,
      'Oilseeds': 5440
    };
    return mspData[cropName] || 2000; // Default MSP if crop not found
  };

  // Helper function to get default image for crops
  const getDefaultImageForCrop = (cropName) => {
    const imageData = {
      'Wheat': 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg',
      'Rice': 'https://images.pexels.com/photos/33488/delicious-rice-sesame-seed.jpg',
      'Sugarcane': 'https://images.pexels.com/photos/8566492/pexels-photo-8566492.jpeg',
      'Cotton': 'https://images.pexels.com/photos/8566492/pexels-photo-8566492.jpeg',
      'Maize': 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg',
      'Pulses': 'https://images.pexels.com/photos/33488/delicious-rice-sesame-seed.jpg',
      'Oilseeds': 'https://images.pexels.com/photos/8566492/pexels-photo-8566492.jpeg'
    };
    return imageData[cropName] || 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg';
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

  // Apply filters and search
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || crop.status === filters.status;
    const matchesCropType = filters.cropType === 'all' || crop.name === filters.cropType;
    
    let matchesPriceRange = true;
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'low':
          matchesPriceRange = crop.pricePerUnit <= 1000;
          break;
        case 'medium':
          matchesPriceRange = crop.pricePerUnit > 1000 && crop.pricePerUnit <= 3000;
          break;
        case 'high':
          matchesPriceRange = crop.pricePerUnit > 3000;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesCropType && matchesPriceRange;
  });

  // Get unique crop types for filter
  const uniqueCropTypes = [...new Set(crops.map(crop => crop.name))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My {t('crops')}</h2>
          <p className="text-gray-600">Manage your crop listings and track performance</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{t('addCrop')}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
              showFilters ? 'bg-green-50 border-green-300 text-green-700' : 'hover:bg-gray-50'
            }`}
          >
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Filter Options</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="Listed">Listed</option>
                  <option value="In Auction">In Auction</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                <select
                  value={filters.cropType}
                  onChange={(e) => handleFilterChange('cropType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Crops</option>
                  {uniqueCropTypes.map(cropType => (
                    <option key={cropType} value={cropType}>{cropType}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Low (≤ ₹1,000)</option>
                  <option value="medium">Medium (₹1,000 - ₹3,000)</option>
                  <option value="high">High (&gt; ₹3,000)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards - Now Dynamic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Listings</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
          <p className="text-sm text-green-600">+{stats.totalListings - 3} this week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Active Auctions</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.activeAuctions}</p>
          <p className="text-sm text-blue-600">{stats.activeAuctions > 0 ? 'Active now' : 'None active'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-purple-600">From sold crops</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Avg Price Above MSP</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.avgPriceAboveMSP}%</p>
          <p className="text-sm text-orange-600">Better than market</p>
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48">
              <img
                src={crop.image}
                alt={crop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                  {crop.status}
                </span>
              </div>
              {crop.bids > 0 && (
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  {crop.bids} bids
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                  <p className="text-sm text-gray-600">{crop.variety}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {crop.pricePerUnit > crop.msp ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                  )}
                  <span className={crop.pricePerUnit > crop.msp ? 'text-green-600' : 'text-red-600'}>
                    {((crop.pricePerUnit - crop.msp) / crop.msp * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quantity:</span>
                  <span className="text-sm font-medium">{crop.quantity} {crop.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Your Price:</span>
                  <span className="text-sm font-semibold text-green-600">₹{crop.pricePerUnit}/{crop.unit === 'quintals' ? 'quintal' : 'tonne'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">MSP:</span>
                  <span className="text-sm text-gray-600">₹{crop.msp}/{crop.unit === 'quintals' ? 'quintal' : 'tonne'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {crop.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  Listed: {new Date(crop.listedDate).toLocaleDateString()}
                </div>
                {crop.description && (
                  <div className="text-sm text-gray-600">
                    <p className="truncate">{crop.description}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewCrop(crop)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Auction
                </button>
                <button 
                  onClick={() => handleEditCrop(crop)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  {t('edit')}
                </button>
                <button 
                  onClick={() => handleDeleteCrop(crop.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No crops found message */}
      {filteredCrops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No crops found matching your criteria</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{t('addCrop')}</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('cropName')}
                    </label>
                    <input
                      type="text"
                      name="cropName"
                      value={formData.cropName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('variety')}
                    </label>
                    <input
                      type="text"
                      name="variety"
                      value={formData.variety}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('quantity')}
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="quintals">Quintals</option>
                      <option value="tonnes">Tonnes</option>
                      <option value="kg">Kilograms</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('price')} per Unit (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('location')}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Crop Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Crop</h3>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingCrop(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('cropName')}
                    </label>
                    <input
                      type="text"
                      name="cropName"
                      value={formData.cropName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('variety')}
                    </label>
                    <input
                      type="text"
                      name="variety"
                      value={formData.variety}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('quantity')}
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="quintals">Quintals</option>
                      <option value="tonnes">Tonnes</option>
                      <option value="kg">Kilograms</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('price')} per Unit (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('location')}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingCrop(null);
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Crop
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default CropsContent;