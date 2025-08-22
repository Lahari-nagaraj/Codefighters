import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Sun, 
  Cloud, 
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  AlertTriangle,
  Calendar,
  MapPin
} from 'lucide-react';

const WeatherContent = () => {
  const { t } = useLanguage();

  const currentWeather = {
    location: 'Dharwad, Karnataka',
    temperature: 28,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    uvIndex: 6,
    visibility: 10
  };

  const forecast = [
    { day: 'Today', high: 30, low: 18, condition: 'Sunny', icon: Sun, rainfall: 0 },
    { day: 'Tomorrow', high: 32, low: 20, condition: 'Partly Cloudy', icon: Cloud, rainfall: 0 },
    { day: 'Wed', high: 28, low: 19, condition: 'Light Rain', icon: CloudRain, rainfall: 5 },
    { day: 'Thu', high: 26, low: 17, condition: 'Rain', icon: CloudRain, rainfall: 15 },
    { day: 'Fri', high: 24, low: 16, condition: 'Heavy Rain', icon: CloudRain, rainfall: 25 },
    { day: 'Sat', high: 27, low: 18, condition: 'Cloudy', icon: Cloud, rainfall: 2 },
    { day: 'Sun', high: 29, low: 19, condition: 'Sunny', icon: Sun, rainfall: 0 }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Heavy Rainfall Alert',
      message: 'Heavy rainfall expected from Thursday to Friday. Consider harvesting ripe crops.',
      issued: '2 hours ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'advisory',
      title: 'Crop Advisory',
      message: 'Ideal weather conditions for wheat harvesting in the next 48 hours.',
      issued: '1 day ago',
      severity: 'medium'
    }
  ];

  const farmingTips = [
    {
      weather: 'Sunny',
      tip: 'Perfect time for harvesting mature crops and field preparation',
      action: 'Consider irrigating crops in the evening to avoid water loss'
    },
    {
      weather: 'Light Rain',
      tip: 'Good for transplanting and seed germination',
      action: 'Avoid heavy machinery use in fields to prevent soil compaction'
    },
    {
      weather: 'Heavy Rain',
      tip: 'Ensure proper drainage in fields to prevent waterlogging',
      action: 'Harvest ready crops before heavy rains if possible'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('weather')} & Climate</h2>
          <div className="flex items-center text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{currentWeather.location}</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Change Location
        </button>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-4">
              <Sun className="w-16 h-16 text-yellow-300" />
              <div>
                <h3 className="text-3xl font-bold">{currentWeather.temperature}°C</h3>
                <p className="text-blue-100">{currentWeather.condition}</p>
                <p className="text-blue-200 text-sm">Feels like 30°C</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-600 bg-opacity-50 rounded-lg p-3">
              <div className="flex items-center">
                <Droplets className="w-5 h-5 mr-2" />
                <span className="text-sm">Humidity</span>
              </div>
              <p className="text-xl font-semibold">{currentWeather.humidity}%</p>
            </div>
            <div className="bg-blue-600 bg-opacity-50 rounded-lg p-3">
              <div className="flex items-center">
                <Wind className="w-5 h-5 mr-2" />
                <span className="text-sm">Wind</span>
              </div>
              <p className="text-xl font-semibold">{currentWeather.windSpeed} km/h</p>
            </div>
            <div className="bg-blue-600 bg-opacity-50 rounded-lg p-3">
              <div className="flex items-center">
                <Thermometer className="w-5 h-5 mr-2" />
                <span className="text-sm">Pressure</span>
              </div>
              <p className="text-xl font-semibold">{currentWeather.pressure} mb</p>
            </div>
            <div className="bg-blue-600 bg-opacity-50 rounded-lg p-3">
              <div className="flex items-center">
                <Sun className="w-5 h-5 mr-2" />
                <span className="text-sm">UV Index</span>
              </div>
              <p className="text-xl font-semibold">{currentWeather.uvIndex}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Weather Alerts</h3>
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm mt-1">{alert.message}</p>
                  <p className="text-xs mt-2 opacity-75">Issued {alert.issued}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {forecast.map((day, index) => {
            const IconComponent = day.icon;
            return (
              <div key={index} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-900 mb-2">{day.day}</p>
                <IconComponent className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-xs text-gray-600 mb-2">{day.condition}</p>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">{day.high}°</p>
                  <p className="text-xs text-gray-500">{day.low}°</p>
                  {day.rainfall > 0 && (
                    <div className="flex items-center justify-center text-xs text-blue-600">
                      <Droplets className="w-3 h-3 mr-1" />
                      <span>{day.rainfall}mm</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Farming Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">Weather-Based Farming Tips</h3>
        <div className="space-y-4">
          {farmingTips.map((tip, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">For {tip.weather} Weather:</h4>
              <p className="text-sm text-green-700 mb-2">{tip.tip}</p>
              <p className="text-sm text-green-600 font-medium">Action: {tip.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Temperature</span>
              <span className="font-medium">26.5°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Rainfall</span>
              <span className="font-medium">45mm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sunny Days</span>
              <span className="font-medium">18 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rainy Days</span>
              <span className="font-medium">7 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Calendar</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Wheat Harvesting</p>
                <p className="text-sm text-blue-600">Optimal period: Jan 15 - Feb 28</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Rice Transplanting</p>
                <p className="text-sm text-green-600">Recommended: Feb 1 - Mar 15</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Cotton Sowing</p>
                <p className="text-sm text-orange-600">Season starts: Apr 1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherContent;