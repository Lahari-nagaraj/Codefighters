import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Send, 
  Bot,
  User,
  MessageCircle,
  Languages,
  HelpCircle
} from 'lucide-react';

const ChatContent = () => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! I\'m your AI farming assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 10000)
    },
    {
      id: 2,
      type: 'user',
      message: 'What is the best time to sow wheat?',
      timestamp: new Date(Date.now() - 8000)
    },
    {
      id: 3,
      type: 'bot',
      message: 'The best time to sow wheat in Karnataka is from October to December (Rabi season). For optimal yield, sow when soil temperature is around 20-25°C. Early sowing (October) generally gives better results.',
      timestamp: new Date(Date.now() - 5000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const quickQuestions = [
    { id: 1, text: 'What is MSP for wheat?', category: 'pricing' },
    { id: 2, text: 'Weather forecast for farming', category: 'weather' },
    { id: 3, text: 'Government schemes available', category: 'schemes' },
    { id: 4, text: 'Pest control for rice', category: 'pest' },
    { id: 5, text: 'Organic farming tips', category: 'organic' },
    { id: 6, text: 'Crop insurance process', category: 'insurance' }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        message: generateBotResponse(newMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setNewMessage('');
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('msp') || message.includes('price')) {
      return 'Current MSP rates: Wheat ₹2,125/quintal, Rice ₹1,940/quintal, Sugarcane ₹290/quintal. Prices are updated regularly based on government announcements.';
    }
    
    if (message.includes('weather')) {
      return 'Current weather in your area: 28°C, sunny with 65% humidity. Light rainfall expected in 3 days. Perfect conditions for harvesting mature crops.';
    }
    
    if (message.includes('scheme') || message.includes('government')) {
      return 'Available schemes: PM-KISAN (₹6000/year), Crop Insurance, Kisan Credit Card, and Soil Health Card. Would you like details about any specific scheme?';
    }
    
    if (message.includes('pest') || message.includes('disease')) {
      return 'For pest management, identify the pest first, then use integrated pest management (IPM). Common solutions include neem-based pesticides, crop rotation, and biological controls. Share crop details for specific advice.';
    }
    
    return 'Thank you for your question. Our AI is learning to provide better responses. For immediate assistance, please contact our support team or visit the nearest agriculture extension office.';
  };

  const handleQuickQuestion = (question) => {
    setNewMessage(question);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('chat')} Assistant</h2>
          <p className="text-gray-600">Get instant help with farming questions in multiple languages</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
          <Languages className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700">
            Language: {currentLanguage.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-green-600 text-white p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Agrastra AI Assistant</h3>
              <p className="text-green-100 text-sm">Online • Ready to help</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your farming question..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <HelpCircle className="w-5 h-5 mr-2" />
          Quick Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickQuestions.map((question) => (
            <button
              key={question.id}
              onClick={() => handleQuickQuestion(question.text)}
              className="text-left p-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-colors"
            >
              <p className="text-sm font-medium text-gray-900">{question.text}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{question.category}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h4 className="font-semibold text-blue-900 mb-2">24/7 Support</h4>
          <p className="text-sm text-blue-700">Get instant answers to your farming questions anytime</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <Languages className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-green-900 mb-2">Multi-language</h4>
          <p className="text-sm text-green-700">Chat in English, Hindi, Kannada and more languages</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <Bot className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h4 className="font-semibold text-purple-900 mb-2">AI Powered</h4>
          <p className="text-sm text-purple-700">Advanced AI trained on agricultural knowledge and data</p>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">How to use the AI Assistant</h4>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• Ask questions about crops, pricing, weather, and government schemes</li>
              <li>• Use simple language for better understanding</li>
              <li>• Include specific details like crop name, location for accurate advice</li>
              <li>• The AI learns from interactions to provide better responses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;