const { Wedding } = require('../models/wedding');
const mongoose = require('mongoose'); 
const { User } = require('../models/user'); 
const cloudinary = require('cloudinary').v2;

// Fetch all weddings with basic info
exports.getAllWeddings = async (req, res) => {
    try {
        const weddingList = await Wedding.find({}, 'bride weddingDate userId');

        if (!weddingList) {
            return res.status(500).json({ success: false });
        }

        res.status(200).send(weddingList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fetch a wedding by ID
exports.getWeddingById = async (req, res) => {
  console.log("Request ID:", req.params.id); 
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

// Submit a new wedding form

exports.submitWeddingForm = async (req, res) => {
    const { userId, weddingData } = req.body;
    if (!userId || !weddingData) {
        return res.status(400).json({ message: "User ID and wedding data are required." });
    }

    try {
        // Validate ObjectId
        const validUserId = mongoose.Types.ObjectId(userId);

        let imageUrls = {};
        if (req.files) {
            if (req.files.birthCertificateBride) {
                const result = await cloudinary.uploader.upload(req.files.birthCertificateBride[0].path, { folder: 'WeddingImages' });
                imageUrls.birthCertificateBride = result.secure_url;
            }
            if (req.files.birthCertificateGroom) {
                const result = await cloudinary.uploader.upload(req.files.birthCertificateGroom[0].path, { folder: 'WeddingImages' });
                imageUrls.birthCertificateGroom = result.secure_url;
            }
            // Handle other images similarly...
        }

        // Create a new wedding form document
        const newWedding = new Wedding({
            userId: validUserId,
            ...weddingData,
            images: imageUrls,
        });

        // Save the wedding form in the database
        await newWedding.save();
        return res.status(201).json({ message: "Wedding form submitted successfully!", wedding: newWedding });
    } catch (error) {
        console.error("Error saving wedding form:", error);
        return res.status(500).json({ message: "There was an error saving the wedding form." });
    }
};


// Confirm a wedding
exports.confirmWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    wedding.weddingStatus = "Confirmed";
    wedding.confirmedAt = new Date();
    await wedding.save();

    res.status(200).json({ message: 'Wedding confirmed', wedding });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all confirmed weddings
exports.getConfirmedWeddings = async (req, res) => {
  try {
    const confirmedWeddings = await Wedding.find({ weddingStatus: 'Confirmed' });
    res.status(200).json(confirmedWeddings);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Decline a wedding
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

// Add a comment to a wedding
exports.addComment = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.weddingId);
    if (!wedding) return res.status(404).send('Wedding not found.');

    const newComment = {
      priest: req.body.priest,
      scheduledDate: req.body.scheduledDate,
      selectedComment: req.body.selectedComment,
      additionalComment: req.body.additionalComment,
    };

    wedding.comments.push(newComment);
    await wedding.save();

    res.status(201).json(wedding.comments); 
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Get available dates for weddings
exports.getAvailableDates = async (req, res) => {
  try {
    const bookedDates = await Wedding.find({ isBooked: true }).select('weddingDate');
    res.status(200).json(bookedDates);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Book a wedding date
exports.bookDate = async (req, res) => {
  const { date, userId } = req.body;
  try {
    const weddingDate = await Wedding.findOneAndUpdate(
      { weddingDate: date },
      { isBooked: true, userId: mongoose.Types.ObjectId(userId) },
      { new: true, upsert: true } // Creates the document if it doesn't exist
    );
    res.status(200).json({ message: 'Date booked successfully', weddingDate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin add available date
exports.addAvailableDate = async (req, res) => {
  const { weddingDate } = req.body;
  try {
      const newDate = new Wedding({ weddingDate });
      await newDate.save();
      res.status(201).json({ message: 'Date added successfully', weddingDate: newDate });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Remove an available date
exports.removeAvailableDate = async (req, res) => {
  const { id } = req.params;
  try {
      await Wedding.findByIdAndDelete(id);
      res.json({ message: 'Date removed successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
