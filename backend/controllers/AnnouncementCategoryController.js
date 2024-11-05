const { announcementCategory } = require('../models/Announcements/announcementCategory');
const upload = require('../config/cloudinary');

exports.createAnnouncementCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name || !description || !image) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const newCategory = new announcementCategory({
            name,
            description,
            image 
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: 'Error creating announcement category', details: error.message });
    }
};

// Get all announcement categories
exports.getAnnouncementCategories = async (req, res) => {
    try {
        const categories = await announcementCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching announcement categories', details: error.message });
    }
};

// Update announcement category
exports.updateAnnouncementCategory = async (req, res) => {
    try {
        const { id } = req.params;
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: 'Image upload failed', details: err.message });
            }
            const imageUrl = req.file ? req.file.path : req.body.image;
            const updatedCategory = await announcementCategory.findByIdAndUpdate(
                id,
                {
                    name: req.body.name,
                    description: req.body.description,
                    image: imageUrl
                },
                { new: true }
            );
            if (!updatedCategory) {
                return res.status(404).json({ error: 'Announcement category not found' });
            }
            res.status(200).json(updatedCategory);
        });
    } catch (error) {
        res.status(500).json({ error: 'Error updating announcement category', details: error.message });
    }
};

// Delete announcement category
exports.deleteAnnouncementCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await announcementCategory.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Announcement category not found' });
        }

        res.status(200).json({ message: 'Announcement category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting announcement category', details: error.message });
    }
};

