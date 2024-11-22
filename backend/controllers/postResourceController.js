const PostResource = require('../models/Resource/postResource');
// const cloudinary = require('../config/cloudinary');
const cloudinary = require('cloudinary').v2;
const ResourceCategory = require('../models/Resource/ResourceCategory'); 

exports.createPostResource = async (req, res) => {
    try {
        const { title, description, richDescription, resourceCategory } = req.body;

        // Handle uploaded files
        const imageFile = req.files?.image ? req.files.image[0].path : null;
        const pdfFile = req.files?.file ? req.files.file[0].path : null;

        if (!title || !description || !resourceCategory) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new resource
        const newResource = new PostResource({
            title,
            description,
            richDescription,
            image: imageFile, // Cloudinary URL for image
            file: pdfFile,    // Cloudinary URL for PDF
            resourceCategory,
        });

        const savedResource = await newResource.save();
        res.status(201).json({ message: 'Resource created successfully!', data: savedResource });
    } catch (error) {
        console.error('Error creating post resource:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};



// Get all Post Resources
exports.getPostResources = async (req, res) => {
    try {
        const resources = await PostResource.find().populate('resourceCategory', 'name').exec();
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching post resources:', error);
        res.status(500).json({ error: 'Error fetching post resources', details: error.message });
    }
};

// Get Post Resource by ID
exports.getPostResourceById = async (req, res) => {
    try {
        const resource = await PostResource.findById(req.params.id).populate('resourceCategory', 'name').exec();
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Post resource not found' });
        }
        res.status(200).json({ success: true, data: resource });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to retrieve post resource: ' + error.message });
    }
};

// Update Post Resource
exports.updatePostResource = async (req, res) => {
    try {
        const { title, description, richDescription, resourceCategory } = req.body;

        const updateData = { title, description, richDescription };

        // Handle image upload (if provided)
        if (req.files && req.files.image) {
            const imageUploadResult = await cloudinary.uploader.upload(req.files.image[0].path, { folder: 'EParokya_Images' });
            updateData.image = imageUploadResult.secure_url;
        }

        // Handle file upload (if provided)
        if (req.files && req.files.file) {
            const fileUploadResult = await cloudinary.uploader.upload(req.files.file[0].path, { resource_type: 'raw', folder: 'EParokya_Images' });
            updateData.file = fileUploadResult.secure_url;
        }

        // Update resource category reference
        if (resourceCategory) {
            const resourceCategoryObj = await ResourceCategory.findById(resourceCategory);
            if (!resourceCategoryObj) {
                return res.status(400).json({ error: 'Invalid Resource Category ID' });
            }
            updateData.resourceCategory = resourceCategoryObj._id;
        }

        const updatedResource = await PostResource.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedResource) {
            return res.status(404).json({ success: false, message: 'Post resource not found' });
        }

        res.status(200).json(updatedResource);
    } catch (error) {
        console.error('Error updating post resource:', error);
        res.status(500).json({ success: false, error: 'Failed to update post resource: ' + error.message });
    }
};

// Delete Post Resource
exports.deletePostResource = async (req, res) => {
    try {
        const deletedResource = await PostResource.findByIdAndDelete(req.params.id);
        if (!deletedResource) {
            return res.status(404).json({ success: false, message: 'Post resource not found' });
        }
        res.status(200).json({ success: true, message: 'Post resource deleted successfully' });
    } catch (error) {
        console.error('Error deleting post resource:', error);
        res.status(500).json({ success: false, error: 'Failed to delete post resource: ' + error.message });
    }
};


// Add a rating for a post resource
exports.addRating = async (req, res) => {
    const { resourceId, userId, rating } = req.body;

    try {
        const resource = await PostResource.findById(resourceId);
        if (!resource) {
            return res.status(404).json({ error: 'Post resource not found' });
        }

        // Check if the user already rated this resource
        const existingRating = resource.ratings.find(r => r.userId.toString() === userId.toString());

        if (existingRating) {
            // Update rating if it exists
            existingRating.rating = rating;
        } else {
            // Add new rating
            resource.ratings.push({ userId, rating });
        }

        await resource.save();
        res.status(200).json({ success: true, data: resource });
    } catch (error) {
        console.error('Error adding rating:', error);
        res.status(500).json({ error: 'Failed to add rating: ' + error.message });
    }
};

