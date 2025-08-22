import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Search, 
  Filter,
  MapPin,
  Calendar,
  Star,
  Truck,
  Settings,
  Clock
} from 'lucide-react';

const EquipmentContent = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');

  const availableEquipment = [
    {
      id: 1,
      name: 'Mahindra 575 DI Tractor',
      type: 'Tractor',
      owner: 'Kumar Equipment Rentals',
      pricePerDay: 800,
      location: 'Dharwad, Karnataka',
      distance: '5 km',
      rating: 4.8,
      reviews: 24,
      availability: 'Available Now',
      features: ['50 HP', 'Diesel', 'Power Steering'],
      image: 'https://images.pexels.com/photos/158028/beluga-whale-whale-sea-water-158028.jpeg'
    },
    {
      id: 2,
      name: 'John Deere Combine Harvester',
      type: 'Harvester',
      owner: 'Agri Solutions',
      pricePerDay: 2500,
      location: 'Belgaum, Karnataka',
      distance: '12 km',
      rating: 4.9,
      reviews: 18,
      availability: 'Available from Jan 20',
      features: ['Self-Propelled', 'Large Capacity', 'GPS Enabled'],
      image: 'https://images.pexels.com/photos/158028/beluga-whale-whale-sea-water-158028.jpeg'
    },
    {
      id: 3,
      name: 'Agricultural Drone (DJI)',
      type: 'Drone',
      owner: 'TechFarm Services',
      pricePerDay: 1200,
      location: 'Hubli, Karnataka',
      distance: '8 km',
      rating: 4.7,
      reviews: 31,
      availability: 'Available Now',
      features: ['Crop Monitoring', '4K Camera', 'Auto Flight'],
      image: 'https://images.pexels.com/photos/158028/beluga-whale-whale-sea-water-158028.jpeg'
    }
  ];

  const myRentals = [
    {
      id: 1,
      equipmentName: 'Mahindra 575 DI Tractor',
      owner: 'Kumar Equipment Rentals',
      rentedDate: '2024-01-15',
      returnDate: '2024-01-17',
      totalCost: 1600,
      status: 'Active',
      daysLeft: 2
    },
    {
      id: 2,
      equipmentName: 'Agricultural Drone',
      owner: 'TechFarm Services',
      rentedDate: '2024-01-10',
      returnDate: '2024-01-12',
      totalCost: 2400,
      status: 'Completed',
      rating: 5
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability) => {
    return availability.includes('Available Now') 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const filteredEquipment = availableEquipment.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('equipment')} Rental</h2>
        <p className="text-gray-600">Rent agricultural equipment from nearby farmers and suppliers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Available Equipment</h3>
          <p className="text-2xl font-bold text-green-600">45</p>
          <p className="text-sm text-gray-500">Within 20 km</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Active Rentals</h3>
          <p className="text-2xl font-bold text-blue-600">2</p>
          <p className="text-sm text-gray-500">Return in 2 days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
          <p className="text-2xl font-bold text-purple-600">₹8,400</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Credits Earned</h3>
          <p className="text-2xl font-bold text-orange-600">45</p>
          <p className="text-sm text-gray-500">From rentals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'browse'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Browse Equipment
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rentals'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Rentals
          </button>
        </nav>
      </div>

      {/* Browse Equipment Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search equipment..."
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

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((equipment) => (
              <div key={equipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={equipment.image}
                    alt={equipment.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(equipment.availability)}`}>
                      {equipment.availability}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                    {equipment.type}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{equipment.name}</h3>
                    <p className="text-sm text-gray-600">{equipment.owner}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {equipment.location} • {equipment.distance} away
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                      {equipment.rating} ({equipment.reviews} reviews)
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-green-600">
                        ₹{equipment.pricePerDay}/day
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {equipment.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      Rent Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Rentals Tab */}
      {activeTab === 'rentals' && (
        <div className="space-y-6">
          {myRentals.map((rental) => (
            <div key={rental.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{rental.equipmentName}</h3>
                  <p className="text-sm text-gray-600">{rental.owner}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                  {rental.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Rented Date</p>
                  <p className="font-medium">{new Date(rental.rentedDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Return Date</p>
                  <p className="font-medium">{new Date(rental.returnDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="font-medium">₹{rental.totalCost}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {rental.status === 'Active' ? 'Days Left' : 'Rating'}
                  </p>
                  <p className="font-medium">
                    {rental.status === 'Active' ? (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {rental.daysLeft} days
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        {rental.rating}/5
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  View Details
                </button>
                {rental.status === 'Active' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Contact Owner
                  </button>
                )}
                {rental.status === 'Completed' && !rental.rating && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Rate Experience
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentContent;