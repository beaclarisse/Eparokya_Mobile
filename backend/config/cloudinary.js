const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const fileFormat = file.mimetype.split('/')[1];
        const isVideo = ['mp4', 'mov', 'avi'].includes(fileFormat);

        return {
            folder: 'EParokya_Images',  
            resource_type: isVideo ? 'video' : 'image',  
            allowedFormats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi'],  
        };
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
