import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo_secret'
});

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload image to Cloudinary
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // For demo purposes, return a mock URL
    const mockImageUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/crop-image.jpg`;
    
    // In production, upload to Cloudinary:
    // const result = await cloudinary.uploader.upload_stream(
    //   { folder: 'agrastra', resource_type: 'image' },
    //   (error, result) => {
    //     if (error) throw error;
    //     return result;
    //   }
    // );

    res.json({
      success: true,
      imageUrl: mockImageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

// Upload multiple images
router.post('/images', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    // For demo purposes, return mock URLs
    const imageUrls = req.files.map((file, index) => 
      `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/crop-image-${index}.jpg`
    );

    res.json({
      success: true,
      imageUrls,
      message: `${req.files.length} images uploaded successfully`
    });
  } catch (error) {
    console.error('Multiple image upload error:', error);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});

export default router;