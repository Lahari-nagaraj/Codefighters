import express from 'express';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../index.js';

const router = express.Router();

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const { type, location, available } = req.query;
    
    let equipmentQuery = collection(db, 'equipment');
    
    if (type) {
      equipmentQuery = query(equipmentQuery, where('type', '==', type));
    }
    
    if (available === 'true') {
      equipmentQuery = query(equipmentQuery, where('available', '==', true));
    }
    
    equipmentQuery = query(equipmentQuery, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(equipmentQuery);
    const equipment = [];
    
    snapshot.forEach((doc) => {
      equipment.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()
      });
    });

    res.json({
      success: true,
      equipment,
      total: equipment.length
    });
  } catch (error) {
    console.error('Equipment fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch equipment', error: error.message });
  }
});

// Add equipment
router.post('/', async (req, res) => {
  try {
    const equipmentData = {
      ...req.body,
      available: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      rentCount: 0
    };

    const docRef = await addDoc(collection(db, 'equipment'), equipmentData);

    res.status(201).json({
      success: true,
      message: 'Equipment added successfully',
      equipmentId: docRef.id
    });
  } catch (error) {
    console.error('Equipment creation error:', error);
    res.status(500).json({ message: 'Failed to add equipment', error: error.message });
  }
});

// Rent equipment
router.post('/:id/rent', async (req, res) => {
  try {
    const { renterId, startDate, endDate, renterName } = req.body;
    
    const equipmentRef = doc(db, 'equipment', req.params.id);
    const equipmentDoc = await getDoc(equipmentRef);

    if (!equipmentDoc.exists()) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (!equipmentDoc.data().available) {
      return res.status(400).json({ message: 'Equipment not available' });
    }

    // Create rental record
    const rentalData = {
      equipmentId: req.params.id,
      renterId,
      renterName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'active',
      createdAt: new Date()
    };

    const rentalRef = await addDoc(collection(db, 'rentals'), rentalData);

    // Update equipment availability
    await updateDoc(equipmentRef, {
      available: false,
      currentRenterId: renterId,
      rentCount: (equipmentDoc.data().rentCount || 0) + 1,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Equipment rented successfully',
      rentalId: rentalRef.id
    });
  } catch (error) {
    console.error('Equipment rental error:', error);
    res.status(500).json({ message: 'Failed to rent equipment', error: error.message });
  }
});

// Return equipment
router.put('/:id/return', async (req, res) => {
  try {
    const equipmentRef = doc(db, 'equipment', req.params.id);
    
    await updateDoc(equipmentRef, {
      available: true,
      currentRenterId: null,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Equipment returned successfully'
    });
  } catch (error) {
    console.error('Equipment return error:', error);
    res.status(500).json({ message: 'Failed to return equipment', error: error.message });
  }
});

export default router;