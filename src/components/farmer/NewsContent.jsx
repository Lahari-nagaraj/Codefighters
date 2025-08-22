import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Calendar, 
  MapPin,
  TrendingUp,
  AlertTriangle,
  FileText,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';

const NewsContent = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const newsItems = [
    {
      id: 1,
      title: 'New MSP Rates Announced for Rabi Crops 2024',
      content: 'Government announces increased minimum support prices for wheat, barley, and other rabi crops. Wheat MSP increased to ₹2,125 per quintal.',
      category: 'government',
      date: '2024-01-16',
      location: 'New Delhi',
      urgent: false,
      source: 'Ministry of Agriculture'
    },
    {
      id: 2,
      title: 'Weather Alert: Heavy Rainfall Expected in Karnataka',
      content: 'IMD issues yellow alert for heavy rainfall in coastal and interior Karnataka from January 18-20. Farmers advised to take necessary precautions.',
      category: 'weather',
      date: '2024-01-16',
      location: 'Karnataka',
      urgent: true,
      source: 'India Meteorological Department'
    },
    {
      id: 3,
      title: 'Digital Agriculture Mission Launched',
      content: 'Government launches comprehensive digital agriculture mission to provide technology solutions to farmers including AI-based crop advisory and market linkages.',
      category: 'technology',
      date: '2024-01-15',
      location: 'India',
      urgent: false,
      source: 'PIB India'
    },
    {
      id: 4,
      title: 'Crop Insurance Claims Processing Accelerated',
      content: 'PMFBY announces faster processing of crop insurance claims with new digital platform. Claims to be settled within 60 days of assessment.',
      category: 'insurance',
      date: '2024-01-14',
      location: 'India',
      urgent: false,
      source: 'PMFBY'
    },
    {
      id: 5,
      title: 'Export Opportunity: Increased Demand for Organic Rice',
      content: 'International markets show 30% increase in demand for organic rice exports. Export facilitation centers set up in major rice producing states.',
      category: 'market',
      date: '2024-01-13',
      location: 'India',
      urgent: false,
      source: 'APEDA'
    },
    {
      id: 6,
      title: 'Pest Alert: Locust Swarms Spotted in Rajasthan',
      content: 'Desert locust swarms spotted in Rajasthan border areas. Control measures activated, farmers advised to report sightings immediately.',
      category: 'pest',
      date: '2024-01-13',
      location: 'Rajasthan',
      urgent: true,
      source: 'Locust Warning Organization'
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', count: newsItems.length },
    { id: 'government', name: 'Government', count: newsItems.filter(item => item.category === 'government').length },
    { id: 'weather', name: 'Weather', count: newsItems.filter(item => item.category === 'weather').length },
    { id: 'market', name: 'Market', count: newsItems.filter(item => item.category === 'market').length },
    { id: 'technology', name: 'Technology', count: newsItems.filter(item => item.category === 'technology').length },
    { id: 'pest', name: 'Pest/Disease', count: newsItems.filter(item => item.category === 'pest').length }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'government':
        return 'bg-blue-100 text-blue-800';
      case 'weather':
        return 'bg-green-100 text-green-800';
      case 'market':
        return 'bg-purple-100 text-purple-800';
      case 'technology':
        return 'bg-indigo-100 text-indigo-800';
      case 'pest':
        return 'bg-red-100 text-red-800';
      case 'insurance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNews = newsItems
    .filter(item => activeCategory === 'all' || item.category === activeCategory)
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const urgentNews = newsItems.filter(item => item.urgent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('news')} & Alerts</h2>
        <p className="text-gray-600">Stay updated with latest agricultural news and alerts</p>
      </div>

      {/* Urgent Alerts */}
      {urgentNews.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Urgent Alerts</h3>
          </div>
          <div className="space-y-3">
            {urgentNews.map((item) => (
              <div key={item.id} className="bg-white border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-red-900">{item.title}</h4>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    URGENT
                  </span>
                </div>
                <p className="text-sm text-red-700 mb-2">{item.content}</p>
                <div className="flex items-center space-x-4 text-xs text-red-600">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Total News Today</h3>
          <p className="text-2xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-500">2 urgent alerts</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Weather Updates</h3>
          <p className="text-2xl font-bold text-blue-600">3</p>
          <p className="text-sm text-gray-500">This week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Government Schemes</h3>
          <p className="text-2xl font-bold text-purple-600">5</p>
          <p className="text-sm text-gray-500">New announcements</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Market Updates</h3>
          <p className="text-2xl font-bold text-orange-600">12</p>
          <p className="text-sm text-gray-500">Price changes</p>
        </div>
      </div>

      {/* News Items */}
      <div className="space-y-6">
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  {item.urgent && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      URGENT
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3 leading-relaxed">{item.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.location}
                  </span>
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {item.source}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-3 border-t border-gray-200">
              <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                <ExternalLink className="w-4 h-4 mr-1" />
                Read Full Article
              </button>
              <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm">
                Share
              </button>
              <button className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm">
                Save
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Stay Updated</h3>
          <p className="text-green-700 mb-4">Subscribe to our newsletter for daily agricultural updates</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-green-300 rounded-l-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button className="px-6 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsContent;