const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,        // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET,  // Your Cloudinary API secret
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'property-images',  // Folder in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg'],  // Allowed image formats
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique file name
  },
});

const upload = require('multer')({ storage });

module.exports = { cloudinary, upload };
