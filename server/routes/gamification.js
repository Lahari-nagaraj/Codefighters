import express from 'express';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../index.js';

const router = express.Router();

// Get user credits and points
router.get('/profile/:userId', async (req, res) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', req.params.userId));
    
    if (!userDoc.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Get user's gamification data
    const gamificationQuery = query(
      collection(db, 'gamification'),
      where('userId', '==', req.params.userId)
    );
    
    const gamificationSnapshot = await getDocs(gamificationQuery);
    let gamificationData = {
      points: 0,
      level: 1,
      badges: [],
      redeemedItems: []
    };
    
    if (!gamificationSnapshot.empty) {
      gamificationData = gamificationSnapshot.docs[0].data();
    }

    res.json({
      success: true,
      profile: {
        credits: userData.credits || 0,
        ...gamificationData
      }
    });
  } catch (error) {
    console.error('Gamification profile error:', error);
    res.status(500).json({ message: 'Failed to fetch gamification profile', error: error.message });
  }
});

// Award points for actions
router.post('/award-points', async (req, res) => {
  try {
    const { userId, action, points } = req.body;
    
    const pointsMap = {
      'crop_listing': 10,
      'auction_participation': 15,
      'equipment_rental': 8,
      'scheme_application': 12,
      'daily_login': 5
    };
    
    const awardedPoints = pointsMap[action] || points || 0;
    
    // Update user's gamification record
    const gamificationQuery = query(
      collection(db, 'gamification'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(gamificationQuery);
    
    if (snapshot.empty) {
      // Create new gamification record
      await addDoc(collection(db, 'gamification'), {
        userId,
        points: awardedPoints,
        level: 1,
        badges: [],
        redeemedItems: [],
        createdAt: new Date()
      });
    } else {
      // Update existing record
      const docRef = snapshot.docs[0].ref;
      const currentData = snapshot.docs[0].data();
      const newPoints = (currentData.points || 0) + awardedPoints;
      const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points
      
      await updateDoc(docRef, {
        points: newPoints,
        level: newLevel,
        updatedAt: new Date()
      });
    }

    res.json({
      success: true,
      message: `Awarded ${awardedPoints} points for ${action}`,
      pointsAwarded: awardedPoints
    });
  } catch (error) {
    console.error('Points award error:', error);
    res.status(500).json({ message: 'Failed to award points', error: error.message });
  }
});

// Redeem items with credits
router.post('/redeem', async (req, res) => {
  try {
    const { userId, itemId, cost } = req.body;
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    if (userData.credits < cost) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }
    
    // Deduct credits
    await updateDoc(userRef, {
      credits: userData.credits - cost,
      updatedAt: new Date()
    });
    
    // Add to redeemed items
    const redemptionData = {
      userId,
      itemId,
      cost,
      redeemedAt: new Date()
    };
    
    await addDoc(collection(db, 'redemptions'), redemptionData);

    res.json({
      success: true,
      message: 'Item redeemed successfully',
      remainingCredits: userData.credits - cost
    });
  } catch (error) {
    console.error('Redemption error:', error);
    res.status(500).json({ message: 'Failed to redeem item', error: error.message });
  }
});

// Get available items for redemption
router.get('/shop', (req, res) => {
  try {
    const shopItems = [
      { id: 1, name: 'Premium Seeds Pack', cost: 50, category: 'seeds', image: 'seeds.jpg' },
      { id: 2, name: 'Organic Fertilizer', cost: 75, category: 'fertilizer', image: 'fertilizer.jpg' },
      { id: 3, name: 'Agricultural Tools Set', cost: 120, category: 'tools', image: 'tools.jpg' },
      { id: 4, name: 'Crop Insurance Discount', cost: 100, category: 'insurance', image: 'insurance.jpg' },
      { id: 5, name: 'Expert Consultation', cost: 80, category: 'consultation', image: 'consultation.jpg' }
    ];

    res.json({
      success: true,
      items: shopItems
    });
  } catch (error) {
    console.error('Shop items error:', error);
    res.status(500).json({ message: 'Failed to fetch shop items', error: error.message });
  }
});

export default router;