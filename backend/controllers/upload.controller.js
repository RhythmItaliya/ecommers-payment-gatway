const { uploadImage, deleteImage, updateImage, getImageInfo } = require('../services/cloudinary.service');
const { bufferToBase64, validateImageDimensions, isImageFile } = require('../utils/imageUtils');

// Upload single image
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { buffer, mimetype, originalname, size } = req.file;

    // Validate file type
    if (!isImageFile(mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only images are allowed.'
      });
    }

    // Validate file size (5MB limit)
    if (size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }

    // Convert buffer to base64
    const base64Image = bufferToBase64(buffer, mimetype);

    // Upload to Cloudinary
    const uploadResult = await uploadImage(base64Image, 'snakshop');

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image to Cloudinary',
        error: uploadResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        filename: originalname,
        size: uploadResult.size,
        format: uploadResult.format,
        dimensions: {
          width: uploadResult.width,
          height: uploadResult.height
        }
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during upload',
      error: error.message
    });
  }
};

// Upload multiple images
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const { buffer, mimetype, originalname, size } = file;

      // Validate file type
      if (!isImageFile(mimetype)) {
        return {
          success: false,
          filename: originalname,
          error: 'Invalid file type'
        };
      }

      // Validate file size
      if (size > 5 * 1024 * 1024) {
        return {
          success: false,
          filename: originalname,
          error: 'File size too large'
        };
      }

      try {
        const base64Image = bufferToBase64(buffer, mimetype);
        const uploadResult = await uploadImage(base64Image, 'snakshop');

        if (uploadResult.success) {
          return {
            success: true,
            filename: originalname,
            data: {
              url: uploadResult.url,
              public_id: uploadResult.public_id,
              size: uploadResult.size,
              format: uploadResult.format,
              dimensions: {
                width: uploadResult.width,
                height: uploadResult.height
              }
            }
          };
        } else {
          return {
            success: false,
            filename: originalname,
            error: uploadResult.error
          };
        }
      } catch (error) {
        return {
          success: false,
          filename: originalname,
          error: error.message
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);

    res.status(200).json({
      success: true,
      message: `Upload completed. ${successful.length} successful, ${failed.length} failed.`,
      data: {
        successful,
        failed
      }
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during multiple upload',
      error: error.message
    });
  }
};

// Delete image
const deleteImageById = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const deleteResult = await deleteImage(publicId);

    if (!deleteResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: deleteResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: deleteResult.result
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during deletion',
      error: error.message
    });
  }
};

// Update image
const updateImageById = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No new image file provided'
      });
    }

    const { buffer, mimetype, originalname, size } = req.file;

    // Validate file type and size
    if (!isImageFile(mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only images are allowed.'
      });
    }

    if (size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }

    // Convert buffer to base64
    const base64Image = bufferToBase64(buffer, mimetype);

    // Update image in Cloudinary
    const updateResult = await updateImage(publicId, base64Image, 'snakshop');

    if (!updateResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update image',
        error: updateResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: {
        url: updateResult.url,
        public_id: updateResult.public_id,
        filename: originalname,
        size: updateResult.size,
        format: updateResult.format,
        dimensions: {
          width: updateResult.width,
          height: updateResult.height
        }
      }
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during update',
      error: error.message
    });
  }
};

// Get image info
const getImageInfoById = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const infoResult = await getImageInfo(publicId);

    if (!infoResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get image info',
        error: infoResult.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image info retrieved successfully',
      data: infoResult.info
    });

  } catch (error) {
    console.error('Get info error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while getting image info',
      error: error.message
    });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImageById,
  updateImageById,
  getImageInfoById
};
