const { Wedding } = require('../models/wedding');
const mongoose = require('mongoose'); 
const { User } = require('../models/user'); 

exports.getAllWeddings = async (req, res) => {
    try {
        const weddingList = await Wedding.find({}, 'name1 weddingDate user');

        if (!weddingList) {
            return res.status(500).json({ success: false });
        }

        res.status(200).send(weddingList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getWeddingById = async (req, res) => {
    try {
        const wedding = await Wedding.findById(req.params.id);

        if (!wedding) {
            return res.status(404).json({ message: 'The wedding with the given ID was not found.' });
        }

        res.status(200).send(wedding);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.submitWeddingForm = async (req, res) => {
    const { userId, weddingData } = req.body;
    if (!userId || !weddingData) {
        return res.status(400).json({ message: "User ID and wedding data are required." });
    }

    try {
        const validUserId = mongoose.Types.ObjectId(userId); 

        const newWedding = new Wedding({
            userId: validUserId, 
            ...weddingData, 
        });
        await newWedding.save(); 
        return res.status(201).json({ message: "Wedding form submitted successfully!", wedding: newWedding });
    } catch (error) {
        console.error("Error saving wedding form:", error);
        return res.status(500).json({ message: "There was an error saving the wedding form." });
    }
};

exports.confirmWedding = async (req, res) => {
    try {
      const wedding = await Wedding.findById(req.params.id);
      if (!wedding) {
        return res.status(404).json({ message: 'Wedding not found' });
      }
      wedding.status = "confirmed";
      await wedding.save();
      res.status(200).json({ message: 'Wedding confirmed' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.declineWedding = async (req, res) => {
    try {
      const wedding = await Wedding.findById(req.params.id);
      if (!wedding) {
        return res.status(404).json({ message: 'Wedding not found' });
      }
      wedding.status = "declined";
      await wedding.save();
      res.status(200).json({ message: 'Wedding declined' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  



