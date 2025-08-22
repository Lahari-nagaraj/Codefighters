import express from 'express';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../index.js';

const router = express.Router();

// Simple chatbot responses (for demo)
const botResponses = {
  msp: {
    en: 'Current MSP rates: Wheat ₹2,125/quintal, Rice ₹1,940/quintal, Sugarcane ₹290/quintal. These are updated by the government.',
    hi: 'वर्तमान एमएसपी दरें: गेहूं ₹2,125/क्विंटल, चावल ₹1,940/क्विंटल, गन्ना ₹290/क्विंटल। ये सरकार द्वारा अपडेट की जाती हैं।',
    kn: 'ಪ್ರಸ್ತುತ ಎಂಎಸ್‌ಪಿ ದರಗಳು: ಗೋಧಿ ₹2,125/ಕ್ವಿಂಟಾಲ್, ಅಕ್ಕಿ ₹1,940/ಕ್ವಿಂಟಾಲ್, ಕಬ್ಬು ₹290/ಕ್ವಿಂಟಾಲ್.'
  },
  weather: {
    en: 'Current weather: 28°C, sunny with 65% humidity. Light rainfall expected in 3 days.',
    hi: 'वर्तमान मौसम: 28°C, धूप के साथ 65% नमी। 3 दिनों में हल्की बारिश की संभावना।',
    kn: 'ಪ್ರಸ್ತುತ ಹವಾಮಾನ: 28°C, 65% ತೇವಾಂಶದೊಂದಿಗೆ ಬಿಸಿಲು. 3 ದಿನಗಳಲ್ಲಿ ಲಘು ಮಳೆ ನಿರೀಕ್ಷೆ.'
  },
  schemes: {
    en: 'Available schemes: PM-KISAN (₹6000/year), Crop Insurance, Kisan Credit Card. Would you like details?',
    hi: 'उपलब्ध योजनाएं: पीएम-किसान (₹6000/वर्ष), फसल बीमा, किसान क्रेडिट कार्ड। क्या आपको विवरण चाहिए?',
    kn: 'ಲಭ್ಯ ಯೋಜನೆಗಳು: ಪಿಎಂ-ಕಿಸಾನ್ (₹6000/ವರ್ಷ), ಬೆಳೆ ವಿಮೆ, ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್.'
  },
  default: {
    en: 'I can help with crop prices, weather, government schemes, and farming tips. What would you like to know?',
    hi: 'मैं फसल की कीमतों, मौसम, सरकारी योजनाओं और खेती के टिप्स में मदद कर सकता हूं। आप क्या जानना चाहते हैं?',
    kn: 'ನಾನು ಬೆಳೆ ಬೆಲೆಗಳು, ಹವಾಮಾನ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು.'
  }
};

// Chat with bot
router.post('/chat', async (req, res) => {
  try {
    const { userId, message, language = 'en' } = req.body;
    
    // Simple keyword matching for demo
    const messageLower = message.toLowerCase();
    let response = botResponses.default[language];
    
    if (messageLower.includes('msp') || messageLower.includes('price') || messageLower.includes('दाम') || messageLower.includes('ಬೆಲೆ')) {
      response = botResponses.msp[language];
    } else if (messageLower.includes('weather') || messageLower.includes('मौसम') || messageLower.includes('ಹವಾಮಾನ')) {
      response = botResponses.weather[language];
    } else if (messageLower.includes('scheme') || messageLower.includes('योजना') || messageLower.includes('ಯೋಜನೆ')) {
      response = botResponses.schemes[language];
    }
    
    // Save chat history
    const chatData = {
      userId,
      userMessage: message,
      botResponse: response,
      language,
      timestamp: new Date()
    };
    
    await addDoc(collection(db, 'chats'), chatData);
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Chatbot service unavailable', error: error.message });
  }
});

// Get chat history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limitCount = 20 } = req.query;
    
    const chatQuery = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(parseInt(limitCount))
    );
    
    const snapshot = await getDocs(chatQuery);
    const chats = [];
    
    snapshot.forEach((doc) => {
      chats.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()
      });
    });
    
    res.json({
      success: true,
      chats: chats.reverse() // Show oldest first
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ message: 'Failed to fetch chat history', error: error.message });
  }
});

export default router;