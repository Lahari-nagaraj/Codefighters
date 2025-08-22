import express from 'express';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../index.js';

const router = express.Router();

// Get all crops with filters
router.get('/', async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice, limit: queryLimit } = req.query;
    
    let cropsQuery = collection(db, 'crops');
    
    if (category) {
      cropsQuery = query(cropsQuery, where('cropType', '==', category));
    }
    
    if (location) {
      cropsQuery = query(cropsQuery, where('location', '>=', location));
    }
    
    cropsQuery = query(cropsQuery, orderBy('createdAt', 'desc'));
    
    if (queryLimit) {
      cropsQuery = query(cropsQuery, limit(parseInt(queryLimit)));
    }

    const snapshot = await getDocs(cropsQuery);
    const crops = [];
    
    snapshot.forEach((doc) => {
      crops.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()
      });
    });

    // Apply price filters (client-side for MVP)
    let filteredCrops = crops;
    if (minPrice) {
      filteredCrops = filteredCrops.filter(crop => crop.pricePerUnit >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredCrops = filteredCrops.filter(crop => crop.pricePerUnit <= parseFloat(maxPrice));
    }

    res.json({
      success: true,
      crops: filteredCrops,
      total: filteredCrops.length
    });
  } catch (error) {
    console.error('Crops fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch crops', error: error.message });
  }
});

// Get crop by ID
router.get('/:id', async (req, res) => {
  try {
    const cropDoc = await getDoc(doc(db, 'crops', req.params.id));
    
    if (!cropDoc.exists()) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json({
      success: true,
      crop: {
        id: cropDoc.id,
        ...cropDoc.data(),
        createdAt: cropDoc.data().createdAt?.toDate?.()
      }
    });
  } catch (error) {
    console.error('Crop fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch crop', error: error.message });
  }
});

// Add new crop
router.post('/', async (req, res) => {
  try {
    const cropData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      viewCount: 0,
      bidsCount: 0
    };

    const docRef = await addDoc(collection(db, 'crops'), cropData);

    res.status(201).json({
      success: true,
      message: 'Crop added successfully',
      cropId: docRef.id,
      crop: cropData
    });
  } catch (error) {
    console.error('Crop creation error:', error);
    res.status(500).json({ message: 'Failed to add crop', error: error.message });
  }
});

// Update crop
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await updateDoc(doc(db, 'crops', req.params.id), updateData);

    res.json({
      success: true,
      message: 'Crop updated successfully'
    });
  } catch (error) {
    console.error('Crop update error:', error);
    res.status(500).json({ message: 'Failed to update crop', error: error.message });
  }
});

// Delete crop
router.delete('/:id', async (req, res) => {
  try {
    await deleteDoc(doc(db, 'crops', req.params.id));

    res.json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    console.error('Crop deletion error:', error);
    res.status(500).json({ message: 'Failed to delete crop', error: error.message });
  }
});

// Get farmer's crops
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const farmerCropsQuery = query(
      collection(db, 'crops'),
      where('farmerId', '==', req.params.farmerId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(farmerCropsQuery);
    const crops = [];
    
    snapshot.forEach((doc) => {
      crops.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()
      });
    });

    res.json({
      success: true,
      crops,
      total: crops.length
    });
  } catch (error) {
    console.error('Farmer crops fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch farmer crops', error: error.message });
  }
});

export default router;