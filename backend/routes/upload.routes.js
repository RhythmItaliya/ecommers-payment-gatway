const express = require('express');
const router = express.Router();
const { 
  uploadSingleImage, 
  uploadMultipleImages, 
  deleteImageById, 
  updateImageById, 
  getImageInfoById 
} = require('../controllers/upload.controller');
const { 
  uploadSingle, 
  uploadMultiple, 
  handleUploadError 
} = require('../middlewares/upload');
const { protectedRoute } = require('../middlewares/protectedRoute');

// Test route to verify Cloudinary configuration
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Upload API is working',
    cloudinary: {
      cloud_name: 'ds9ufpxom',
      folder: 'snakshop',
      status: 'configured'
    },
    endpoints: {
      'POST /single': 'Upload single image (protected)',
      'POST /multiple': 'Upload multiple images (protected)',
      'DELETE /:publicId': 'Delete image by public ID (protected)',
      'PUT /:publicId': 'Update image by public ID (protected)',
      'GET /:publicId': 'Get image info by public ID (public)',
      'GET /test': 'Test endpoint (public)'
    }
  });
});

// Upload single image
router.post('/single', 
  protectedRoute, 
  uploadSingle, 
  handleUploadError, 
  uploadSingleImage
);

// Upload multiple images
router.post('/multiple', 
  protectedRoute, 
  uploadMultiple, 
  handleUploadError, 
  uploadMultipleImages
);

// Delete image by public ID
router.delete('/:publicId', 
  protectedRoute, 
  deleteImageById
);

// Update image by public ID
router.put('/:publicId', 
  protectedRoute, 
  uploadSingle, 
  handleUploadError, 
  updateImageById
);

// Get image info by public ID
router.get('/:publicId', 
  getImageInfoById
);

module.exports = router;
