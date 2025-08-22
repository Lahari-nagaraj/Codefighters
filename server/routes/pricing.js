import express from 'express';
import axios from 'axios';

const router = express.Router();

// Mock MSP data for demo
const mockMSP = {
  wheat: 2125,
  rice: 1940,
  sugarcane: 290,
  cotton: 5515,
  maize: 1870,
  barley: 1735
};

// Get MSP for crops
router.get('/msp', async (req, res) => {
  try {
    const { crop } = req.query;

    if (crop) {
      const price = mockMSP[crop.toLowerCase()];
      if (price) {
        return res.json({
          success: true,
          crop,
          msp: price,
          unit: 'quintal',
          lastUpdated: new Date().toISOString()
        });
      }
      return res.status(404).json({ message: 'MSP not found for this crop' });
    }

    // Return all MSP data
    res.json({
      success: true,
      mspData: mockMSP,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('MSP fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch MSP data', error: error.message });
  }
});

// Get market trends
router.get('/trends/:crop', async (req, res) => {
  try {
    const { crop } = req.params;
    const { period = '7d' } = req.query;

    // Mock trend data
    const generateTrendData = (basePri, daysBack) => {
      const data = [];
      for (let i = daysBack; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
        const price = Math.round(basePrice * (1 + variance));

        data.push({
          date: date.toISOString().split('T')[0],
          price,
          volume: Math.floor(Math.random() * 1000) + 500
        });
      }
      return data;
    };

    const basePrice = mockMSP[crop.toLowerCase()] || 2000;
    const daysBack = period === '30d' ? 30 : period === '7d' ? 7 : 1;

    const trendData = generateTrendData(basePrice, daysBack);

    res.json({
      success: true,
      crop,
      period,
      trends: trendData,
      currentPrice: trendData[trendData.length - 1].price,
      msp: basePrice
    });
  } catch (error) {
    console.error('Trends fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch trends', error: error.message });
  }
});

// Get weather data
router.get('/weather', async (req, res) => {
  try {
    const { location = 'Karnataka' } = req.query;

    // Mock weather data for demo
    const weatherData = {
      location,
      temperature: 28,
      humidity: 65,
      rainfall: 0,
      windSpeed: 12,
      condition: 'Sunny',
      forecast: [
        { day: 'Today', temp: 28, condition: 'Sunny', rainfall: 0 },
        { day: 'Tomorrow', temp: 30, condition: 'Partly Cloudy', rainfall: 0 },
        { day: 'Day 3', temp: 26, condition: 'Light Rain', rainfall: 5 },
        { day: 'Day 4', temp: 24, condition: 'Rain', rainfall: 15 },
        { day: 'Day 5', temp: 27, condition: 'Cloudy', rainfall: 2 }
      ],
      alerts: [
        {
          type: 'warning',
          message: 'Heavy rainfall expected from day 4-5. Consider harvesting ripe crops.',
          severity: 'high'
        }
      ]
    };

    res.json({
      success: true,
      weather: weatherData
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch weather data', error: error.message });
  }
});

export default router;