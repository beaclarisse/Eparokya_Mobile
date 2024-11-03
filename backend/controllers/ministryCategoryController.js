const { ministryCategory } = require('../models/ministryCategory'); // Ensure correct model import
const mongoose = require('mongoose');

exports.createMinistry = async (req, res) => {
    try {
        const ministry = new ministryCategory({ // Ensure you are using the model correctly
            name: req.body.name,
            description: req.body.description,
        });

        const savedMinistry = await ministry.save();
        res.status(201).json({ success: true, data: savedMinistry });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create ministry: ' + error.message });
    }
};


exports.getMinistry = async (req, res) => {
    try {
        const ministryList = await ministryCategory.find();
        if (!ministryList || ministryList.length === 0) {
            return res.status(404).json({ success: false, message: 'No ministries found' });
        }
        res.status(200).json({ success: true, data: ministryList });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to retrieve ministries: ' + error.message });
    }
};

exports.getMinistryId = async (req, res) => {
    try {
        const ministry = await ministryCategory.findById(req.params.id);
        if (!ministry) {
            return res.status(404).json({ success: false, message: 'The ministry with the given ID was not found.' });
        }
        res.status(200).json({ success: true, data: ministry });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to retrieve ministry: ' + error.message });
    }
};

exports.deleteMinistry = async (req, res) => {
    try {
        const ministry = await ministryCategory.findByIdAndRemove(req.params.id);
        if (!ministry) {
            return res.status(404).json({ success: false, message: "Ministry not found!" });
        }
        res.status(200).json({ success: true, message: 'Ministry deleted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete ministry: ' + error.message });
    }
};
