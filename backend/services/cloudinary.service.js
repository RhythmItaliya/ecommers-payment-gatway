const cloudinary = require('cloudinary').v2;
const config = require('../config/config');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'snakshop') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result: result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update image in Cloudinary
const updateImage = async (publicId, newFile, folder = 'snakshop') => {
  try {
    // First delete the old image
    await deleteImage(publicId);
    
    // Then upload the new image
    const uploadResult = await uploadImage(newFile, folder);
    
    if (uploadResult.success) {
      return uploadResult;
    } else {
      throw new Error('Failed to upload new image');
    }
  } catch (error) {
    console.error('Cloudinary update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get image info from Cloudinary
const getImageInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      info: result
    };
  } catch (error) {
    console.error('Cloudinary get info error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  updateImage,
  getImageInfo
};
