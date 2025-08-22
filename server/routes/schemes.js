import express from 'express';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../index.js';

const router = express.Router();

// Get all schemes
router.get('/', async (req, res) => {
  try {
    const schemesQuery = query(collection(db, 'schemes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(schemesQuery);
    const schemes = [];
    
    snapshot.forEach((doc) => {
      schemes.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.(),
        startDate: doc.data().startDate?.toDate?.(),
        endDate: doc.data().endDate?.toDate?.()
      });
    });

    res.json({
      success: true,
      schemes,
      total: schemes.length
    });
  } catch (error) {
    console.error('Schemes fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch schemes', error: error.message });
  }
});

// Add scheme (admin only)
router.post('/', async (req, res) => {
  try {
    const schemeData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      isActive: true
    };

    const docRef = await addDoc(collection(db, 'schemes'), schemeData);

    res.status(201).json({
      success: true,
      message: 'Scheme added successfully',
      schemeId: docRef.id
    });
  } catch (error) {
    console.error('Scheme creation error:', error);
    res.status(500).json({ message: 'Failed to add scheme', error: error.message });
  }
});

// Update scheme
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    if (req.body.startDate) {
      updateData.startDate = new Date(req.body.startDate);
    }
    if (req.body.endDate) {
      updateData.endDate = new Date(req.body.endDate);
    }

    await updateDoc(doc(db, 'schemes', req.params.id), updateData);

    res.json({
      success: true,
      message: 'Scheme updated successfully'
    });
  } catch (error) {
    console.error('Scheme update error:', error);
    res.status(500).json({ message: 'Failed to update scheme', error: error.message });
  }
});

export default router;