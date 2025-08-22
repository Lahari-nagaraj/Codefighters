import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Search, 
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

const SchemesContent = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');

  const schemes = {
    available: [
      {
        id: 1,
        title: 'PM-KISAN Samman Nidhi',
        description: 'Income support scheme providing ₹6000 per year to farmer families',
        department: 'Ministry of Agriculture',
        amount: '₹6,000/year',
        eligibility: 'Small & marginal farmers',
        deadline: '2024-03-31',
        status: 'Open',
        applied: false,
        documents: ['Aadhaar', 'Land Records', 'Bank Account']
      },
      {
        id: 2,
        title: 'Pradhan Mantri Crop Insurance Scheme',
        description: 'Comprehensive crop insurance against natural calamities',
        department: 'Ministry of Agriculture',
        amount: 'Up to ₹2 Lakh',
        eligibility: 'All farmers',
        deadline: '2024-02-28',
        status: 'Open',
        applied: false,
        documents: ['Land Records', 'Crop Details', 'Aadhaar']
      },
      {
        id: 3,
        title: 'Kisan Credit Card',
        description: 'Easy credit access for agricultural needs',
        department: 'NABARD',
        amount: 'Based on crop area',
        eligibility: 'Landholding farmers',
        deadline: 'Ongoing',
        status: 'Open',
        applied: false,
        documents: ['Land Records', 'Income Certificate', 'Photos']
      }
    ],
    applied: [
      {
        id: 4,
        title: 'PM-KISAN Samman Nidhi',
        description: 'Income support scheme providing ₹6000 per year to farmer families',
        department: 'Ministry of Agriculture',
        amount: '₹6,000/year',
        appliedDate: '2024-01-10',
        status: 'Under Review',
        applicationId: 'PMK2024001234'
      },
      {
        id: 5,
        title: 'Soil Health Card Scheme',
        description: 'Free soil testing and nutrient recommendations',
        department: 'Department of Agriculture',
        amount: 'Free Service',
        appliedDate: '2024-01-05',
        status: 'Approved',
        applicationId: 'SHC2024005678',
        cardIssued: true
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSchemes = schemes[activeTab].filter(scheme =>
    scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Government {t('schemes')}</h2>
        <p className="text-gray-600">Access government schemes and subsidies for farmers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Available Schemes</h3>
          <p className="text-2xl font-bold text-green-600">15</p>
          <p className="text-sm text-gray-500">Currently open</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Applied Schemes</h3>
          <p className="text-2xl font-bold text-blue-600">3</p>
          <p className="text-sm text-gray-500">In process</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Benefits Received</h3>
          <p className="text-2xl font-bold text-purple-600">₹12,000</p>
          <p className="text-sm text-gray-500">This year</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Credits Earned</h3>
          <p className="text-2xl font-bold text-orange-600">25</p>
          <p className="text-sm text-gray-500">From applications</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'available'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Available Schemes ({schemes.available.length})
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'applied'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Applications ({schemes.applied.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes..."
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

      {/* Available Schemes */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          {filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{scheme.title}</h3>
                  <p className="text-gray-600 mb-3">{scheme.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {scheme.department}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Deadline: {scheme.deadline}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scheme.status)}`}>
                  {scheme.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Benefit Amount</p>
                  <p className="text-lg font-semibold text-green-700">{scheme.amount}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Eligibility</p>
                  <p className="text-sm font-medium text-blue-700">{scheme.eligibility}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Required Documents</p>
                  <p className="text-sm font-medium text-purple-700">{scheme.documents.length} documents</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Required Documents:</h4>
                <div className="flex flex-wrap gap-2">
                  {scheme.documents.map((doc, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applied Schemes */}
      {activeTab === 'applied' && (
        <div className="space-y-6">
          {filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{scheme.title}</h3>
                  <p className="text-gray-600 mb-2">{scheme.description}</p>
                  <p className="text-sm text-gray-600">Applied on: {new Date(scheme.appliedDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scheme.status)} mb-2 inline-block`}>
                    {scheme.status}
                  </span>
                  <p className="text-sm text-gray-600">ID: {scheme.applicationId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{scheme.department}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Benefit Amount</p>
                  <p className="font-medium">{scheme.amount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="flex items-center">
                    {scheme.status === 'Approved' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                    )}
                    <span className="font-medium">{scheme.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  View Application
                </button>
                {scheme.status === 'Under Review' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Track Status
                  </button>
                )}
                {scheme.cardIssued && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Download Card
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Need Help with Applications?</h4>
            <p className="text-sm text-blue-700 mt-1 mb-3">
              Contact our support team or visit your nearest agriculture office for assistance.
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                Call Support
              </button>
              <button className="px-3 py-2 bg-white text-blue-600 border border-blue-300 rounded-md text-sm hover:bg-blue-50 transition-colors">
                Find Office
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemesContent;