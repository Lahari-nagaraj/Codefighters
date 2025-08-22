import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AppRouter from './components/AppRouter';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRouter />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;