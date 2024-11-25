const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,        // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET,  // Your Cloudinary API secret
});


const options = {
  cloudinary: cloudinary,
  params: {
    folder:'photos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
    public_id: (req, file) => {
      console.log(file, 'fileisssss');
      const originalname = file.originalname.split('.')
      return `image-${Date.now()}-${originalname[0]}`
    }
  }
}

const store = new CloudinaryStorage(options)
  
const uploadsMulter = multer({ storage: store }).array("image", 10);;

module.exports = uploadsMulter;