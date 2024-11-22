const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Unified Cloudinary Storage for images and PDFs
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const fileFormat = file.mimetype.split('/')[1];

        // If file is PDF, it goes to the PDF folder
        if (file.mimetype === 'application/pdf') {
            return {
                folder: 'EParokya_PDFs',  // PDFs go into this folder
                resource_type: 'raw',
                allowed_formats: ['pdf'], // Only allow PDFs
            };
        } 
        // If file is image, it goes to the image folder
        else if (['jpg', 'jpeg', 'png'].includes(fileFormat)) {
            return {
                folder: 'EParokya_Images',  // Images go into this folder
                resource_type: 'image',
                allowed_formats: ['jpg', 'jpeg', 'png'],
            };
        } else {
            throw new Error('Unsupported file type');
        }
    },
});

// Existing Wedding Documents Upload
const weddingStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'WeddingDocuments',
        resource_type: 'auto',
    },
});

const weddingUpload = multer({ storage: weddingStorage });
const upload = multer({ storage });

module.exports = {
    upload,          // For images and PDFs
    cloudinary,
    weddingUpload,   // For Wedding Documents (unchanged)
};
