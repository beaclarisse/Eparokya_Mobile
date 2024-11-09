const { ministryCategory } = require('../models/ministryCategory'); 
const mongoose = require('mongoose');

exports.createMinistry = async (req, res) => {
    try {
        const ministry = new ministryCategory({ 
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
        const ministries = await ministryCategory.find();
        console.log('Fetched Ministries:', ministries);
        res.status(200).json(ministries);
    } catch (error) {
        console.error('Error fetching ministries:', error); 
        res.status(500).json({ message: 'Server error' });
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

exports.updateMinistryCategory = async (req, res) => {
    const { id } = req.params; 
    const { name, description } = req.body; 
    try {
      const updatedCategory = await ministryCategory.findByIdAndUpdate(
        id,
        { name, description },
        { new: true, runValidators: true } 
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ message: "Ministry category not found." });
      }
  
      res.status(200).json(updatedCategory); 
    } catch (error) {
      console.error("Error updating ministry category:", error);
      res.status(500).json({ message: "Error updating ministry category." });
    }
  };
