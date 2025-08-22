import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Common
    welcome: 'Welcome to Agrastra',
    login: 'Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    
    // Navigation
    crops: 'Crops',
    equipment: 'Equipment',
    auctions: 'Auctions',
    schemes: 'Government Schemes',
    weather: 'Weather',
    news: 'News & Alerts',
    chat: 'Chat Support',
    
    // Roles
    selectRole: 'Select Your Role',
    farmer: 'Farmer',
    buyer: 'Buyer',
    admin: 'Government Admin',
    equipmentSeller: 'Equipment Seller',
    consumer: 'Consumer',
    
    // Dashboard
    totalCrops: 'Total Crops',
    activeAuctions: 'Active Auctions',
    earnings: 'Total Earnings',
    credits: 'Credits',
    
    // Crops
    addCrop: 'Add New Crop',
    cropName: 'Crop Name',
    variety: 'Variety',
    quantity: 'Quantity',
    price: 'Price per Quintal',
    location: 'Location',
    
    // Common actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    bid: 'Place Bid'
  },
  hi: {
    // Common
    welcome: 'अग्रास्त्र में आपका स्वागत है',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    
    // Navigation
    crops: 'फसलें',
    equipment: 'उपकरण',
    auctions: 'नीलामी',
    schemes: 'सरकारी योजनाएं',
    weather: 'मौसम',
    news: 'समाचार और अलर्ट',
    chat: 'चैट सहायता',
    
    // Roles
    selectRole: 'अपनी भूमिका चुनें',
    farmer: 'किसान',
    buyer: 'खरीदार',
    admin: 'सरकारी व्यवस्थापक',
    equipmentSeller: 'उपकरण विक्रेता',
    consumer: 'उपभोक्ता',
    
    // Dashboard
    totalCrops: 'कुल फसलें',
    activeAuctions: 'सक्रिय नीलामी',
    earnings: 'कुल कमाई',
    credits: 'क्रेडिट्स',
    
    // Crops
    addCrop: 'नई फसल जोड़ें',
    cropName: 'फसल का नाम',
    variety: 'किस्म',
    quantity: 'मात्रा',
    price: 'प्रति क्विंटल कीमत',
    location: 'स्थान',
    
    // Common actions
    save: 'सेव करें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'मिटाएं',
    view: 'देखें',
    bid: 'बोली लगाएं'
  },
  kn: {
    // Common
    welcome: 'ಅಗ್ರಾಸ್ತ್ರಕ್ಕೆ ಸ್ವಾಗತ',
    login: 'ಲಾಗಿನ್',
    logout: 'ಲಾಗ್‌ಔಟ್',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    profile: 'ಪ್ರೊಫೈಲ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    
    // Navigation
    crops: 'ಬೆಳೆಗಳು',
    equipment: 'ಉಪಕರಣಗಳು',
    auctions: 'ಹರಾಜು',
    schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    weather: 'ಹವಾಮಾನ',
    news: 'ಸುದ್ದಿ ಮತ್ತು ಅಲರ್ಟ್‌ಗಳು',
    chat: 'ಚಾಟ್ ಸಪೋರ್ಟ್',
    
    // Roles
    selectRole: 'ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    farmer: 'ರೈತ',
    buyer: 'ಖರೀದಿದಾರ',
    admin: 'ಸರ್ಕಾರಿ ಆಡಳಿತಗಾರ',
    equipmentSeller: 'ಉಪಕರಣ ಮಾರಾಟಗಾರ',
    consumer: 'ಗ್ರಾಹಕ',
    
    // Dashboard
    totalCrops: 'ಒಟ್ಟು ಬೆಳೆಗಳು',
    activeAuctions: 'ಸಕ್ರಿಯ ಹರಾಜುಗಳು',
    earnings: 'ಒಟ್ಟು ಗಳಿಕೆ',
    credits: 'ಕ್ರೆಡಿಟ್‌ಗಳು',
    
    // Crops
    addCrop: 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ',
    cropName: 'ಬೆಳೆಯ ಹೆಸರು',
    variety: 'ತಳಿ',
    quantity: 'ಪ್ರಮಾಣ',
    price: 'ಪ್ರತಿ ಕ್ವಿಂಟಲ್ ಬೆಲೆ',
    location: 'ಸ್ಥಳ',
    
    // Common actions
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    view: 'ನೋಡಿ',
    bid: 'ಬಿಡ್ ಮಾಡಿ'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
  };

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'हिंदी' },
      { code: 'kn', name: 'ಕನ್ನಡ' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};