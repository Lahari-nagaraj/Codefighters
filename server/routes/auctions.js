import express from 'express';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../index.js';

const router = express.Router();

// Get all auctions
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    
    let auctionsQuery = collection(db, 'auctions');
    
    if (status) {
      auctionsQuery = query(auctionsQuery, where('status', '==', status));
    }
    
    auctionsQuery = query(auctionsQuery, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(auctionsQuery);
    const auctions = [];
    
    snapshot.forEach((doc) => {
      auctions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.(),
        endTime: doc.data().endTime?.toDate?.()
      });
    });

    res.json({
      success: true,
      auctions,
      total: auctions.length
    });
  } catch (error) {
    console.error('Auctions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch auctions', error: error.message });
  }
});

// Create auction
router.post('/', async (req, res) => {
  try {
    const auctionData = {
      ...req.body,
      status: 'active',
      bids: [],
      createdAt: new Date(),
      endTime: new Date(req.body.endTime)
    };

    const docRef = await addDoc(collection(db, 'auctions'), auctionData);

    res.status(201).json({
      success: true,
      message: 'Auction created successfully',
      auctionId: docRef.id
    });
  } catch (error) {
    console.error('Auction creation error:', error);
    res.status(500).json({ message: 'Failed to create auction', error: error.message });
  }
});

// Place bid
router.post('/:id/bid', async (req, res) => {
  try {
    const { buyerId, amount, buyerName } = req.body;
    const auctionRef = doc(db, 'auctions', req.params.id);
    const auctionDoc = await getDoc(auctionRef);

    if (!auctionDoc.exists()) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    const auctionData = auctionDoc.data();
    
    if (auctionData.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }

    const newBid = {
      buyerId,
      buyerName,
      amount: parseFloat(amount),
      timestamp: new Date()
    };

    const updatedBids = [...(auctionData.bids || []), newBid];
    const currentHighestBid = Math.max(...updatedBids.map(bid => bid.amount));

    await updateDoc(auctionRef, {
      bids: updatedBids,
      currentHighestBid,
      bidsCount: updatedBids.length,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Bid placed successfully',
      currentHighestBid
    });
  } catch (error) {
    console.error('Bid placement error:', error);
    res.status(500).json({ message: 'Failed to place bid', error: error.message });
  }
});

// Get auction details
router.get('/:id', async (req, res) => {
  try {
    const auctionDoc = await getDoc(doc(db, 'auctions', req.params.id));
    
    if (!auctionDoc.exists()) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    const auction = {
      id: auctionDoc.id,
      ...auctionDoc.data(),
      createdAt: auctionDoc.data().createdAt?.toDate?.(),
      endTime: auctionDoc.data().endTime?.toDate?.()
    };

    res.json({
      success: true,
      auction
    });
  } catch (error) {
    console.error('Auction fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch auction', error: error.message });
  }
});

// Close auction
router.put('/:id/close', async (req, res) => {
  try {
    const { winnerId } = req.body;
    
    await updateDoc(doc(db, 'auctions', req.params.id), {
      status: 'closed',
      winnerId,
      closedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Auction closed successfully'
    });
  } catch (error) {
    console.error('Auction closure error:', error);
    res.status(500).json({ message: 'Failed to close auction', error: error.message });
  }
});

export default router;