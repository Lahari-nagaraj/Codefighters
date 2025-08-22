import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithPhoneNumber,
  signOut,
  RecaptchaVerifier
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              ...userData
            });
          } else {
            // Create user document if it doesn't exist
            const newUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              phone: firebaseUser.phoneNumber || '',
              role: 'farmer', // Default role
              credits: 50,
              createdAt: new Date(),
              isActive: true
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
            await ApiService.registerUser(newUserData);
            
            setUser({
              ...firebaseUser,
              ...newUserData
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create user document
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          phone: firebaseUser.phoneNumber || '',
          role: 'farmer',
          credits: 50,
          createdAt: new Date(),
          isActive: true
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        await ApiService.registerUser(userData);
      }
      
      return result;
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber, appVerifier) => {
    try {
      setError(null);
      setLoading(true);
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return confirmationResult;
    } catch (err) {
      console.error('Phone sign-in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = (elementId) => {
    return new RecaptchaVerifier(auth, elementId, {
      'size': 'invisible',
      'callback': (response) => {
        console.log('reCAPTCHA solved');
      }
    });
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateUserRole = async (role) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, role };
      await setDoc(doc(db, 'users', user.uid), updatedUser, { merge: true });
      await ApiService.updateUserProfile(user.uid, { role });
      
      setUser(updatedUser);
    } catch (err) {
      console.error('Role update error:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...profileData };
      await setDoc(doc(db, 'users', user.uid), updatedUser, { merge: true });
      await ApiService.updateUserProfile(user.uid, profileData);
      
      setUser(updatedUser);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Mock login for demo (remove in production)
  const login = (role) => {
    const mockUsers = {
      farmer: {
        uid: 'farmer-1',
        role: 'farmer',
        name: 'Rajesh Kumar',
        phone: '+91-9876543210',
        email: 'rajesh@example.com',
        credits: 150,
        location: 'Karnataka, India'
      },
      buyer: {
        uid: 'buyer-1',
        role: 'buyer',
        name: 'Priya Industries',
        phone: '+91-9876543211',
        email: 'priya@industries.com',
        credits: 500,
        location: 'Mumbai, India'
      },
      admin: {
        uid: 'admin-1',
        role: 'admin',
        name: 'Government Admin',
        phone: '+91-9876543212',
        email: 'admin@gov.in',
        credits: 1000,
        department: 'Agriculture Ministry'
      },
      equipmentSeller: {
        uid: 'equipment-1',
        role: 'equipmentSeller',
        name: 'Mahindra Equipment',
        phone: '+91-9876543213',
        email: 'seller@mahindra.com',
        credits: 300,
        location: 'Pune, India'
      },
      consumer: {
        uid: 'consumer-1',
        role: 'consumer',
        name: 'Anjali Sharma',
        phone: '+91-9876543214',
        email: 'anjali@example.com',
        credits: 50,
        location: 'Delhi, India'
      }
    };
    
    setUser(mockUsers[role]);
  };

  const value = {
    user,
    loading,
    error,
    login, // Mock login - remove in production
    signInWithGoogle,
    signInWithPhone,
    setupRecaptcha,
    logout,
    updateUserRole,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};