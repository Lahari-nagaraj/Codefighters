import express from 'express';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../index.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { uid, email, name, phone, role } = req.body;

    const userData = {
      uid,
      email,
      name,
      phone,
      role: role || 'farmer',
      credits: role === 'admin' ? 1000 : 50,
      createdAt: new Date(),
      isActive: true
    };

    await setDoc(doc(db, 'users', uid), userData);

    res.status(201).json({
      message: 'User registered successfully',
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Get user profile
router.get('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: userDoc.data()
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update user profile
router.put('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', uid), updateData, { merge: true });

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

export default router;