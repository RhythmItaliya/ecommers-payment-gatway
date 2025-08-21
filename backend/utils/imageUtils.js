// Convert buffer to base64 string for Cloudinary
const bufferToBase64 = (buffer, mimetype) => {
  try {
    const base64String = buffer.toString('base64');
    const dataURI = `data:${mimetype};base64,${base64String}`;
    return dataURI;
  } catch (error) {
    console.error('Error converting buffer to base64:', error);
    throw new Error('Failed to process image data');
  }
};

// Validate image dimensions
const validateImageDimensions = (width, height, maxWidth = 2000, maxHeight = 2000) => {
  if (width > maxWidth || height > maxHeight) {
    return {
      valid: false,
      message: `Image dimensions must be less than ${maxWidth}x${maxHeight} pixels`
    };
  }
  return { valid: true };
};

// Generate unique filename
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
};

// Check if file is an image
const isImageFile = (mimetype) => {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return imageTypes.includes(mimetype);
};

module.exports = {
  bufferToBase64,
  validateImageDimensions,
  generateUniqueFilename,
  isImageFile
};
