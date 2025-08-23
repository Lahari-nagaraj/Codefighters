import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ChatContent from '../components/common/ChatContent';
import { ArrowLeft, MessageCircle } from 'lucide-react';

const ChatPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Chat Support</h1>
                  <p className="text-sm text-gray-600">Get instant help with your questions</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChatContent />
      </div>
    </div>
  );
};

export default ChatPage;
