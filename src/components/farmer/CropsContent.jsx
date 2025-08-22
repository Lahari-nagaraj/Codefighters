import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';

const CropsContent = () => {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const crops = [
    {
      id: 1,
      name: 'Wheat',
      variety: 'HD-3086',
      quantity: 50,
      unit: 'quintals',
      pricePerUnit: 2240,
      msp: 2125,
      location: 'Dharwad, Karnataka',
      status: 'Listed',
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

  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    quantity: '',
    unit: 'quintals',
    price: '',
    location: '',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding crop:', formData);
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

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Listings</h3>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-sm text-green-600">+2 this week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Active Auctions</h3>
          <p className="text-2xl font-bold text-gray-900">5</p>
          <p className="text-sm text-blue-600">3 ending soon</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">₹2,45,000</p>
          <p className="text-sm text-purple-600">+15% this month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Avg Price Above MSP</h3>
          <p className="text-2xl font-bold text-gray-900">8.5%</p>
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
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  {t('view')}
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                  <Edit2 className="w-4 h-4 mr-1" />
                  {t('edit')}
                </button>
                <button className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Crop Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('addCrop')}</h3>
              
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
    </div>
  );
};

export default CropsContent;