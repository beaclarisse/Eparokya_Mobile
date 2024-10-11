const { AUPage } = require('../models/AUPage'); 
const mongoose = require('mongoose');


exports.createUpdate = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }

        const update = new AUPage({
            title,
            content,
            createdAt: new Date(),
        });

        const savedUpdate = await update.save();
        res.status(201).send(savedUpdate);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



exports.getUpdates = async (req, res) => {
    try {
        const updates = await AUPage.find();
        res.send(updates);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getUpdateById = async (req, res) => {
    try {
        const update = await AUPage.findById(req.params.id);
        if (!update) {
            return res.status(404).json({ success: false, message: 'Update not found' });
        }
        res.send(update);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createUpdate = async (req, res) => {
    try {
        const update = new AUPage({
            title: req.body.title,
            content: req.body.content,
            createdAt: new Date(),
        });

        const savedUpdate = await update.save();
        res.status(201).send(savedUpdate);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateUpdate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('Invalid Update Id');
        }

        const updatedUpdate = await AUPage.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUpdate) {
            return res.status(404).send('Update not found');
        }

        res.send(updatedUpdate);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteUpdate = async (req, res) => {
    try {
        const deletedUpdate = await AUPage.findByIdAndRemove(req.params.id);
        if (!deletedUpdate) {
            return res.status(404).json({ success: false, message: 'Update not found' });
        }
        res.status(200).json({ success: true, message: 'The update is deleted!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getUpdateCount = async (req, res) => {
    try {
        const count = await AUPage.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = exports;
