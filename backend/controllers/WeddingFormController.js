const { Wedding } = require('../models/wedding');
const mongoose = require('mongoose');
const { User } = require('../models/user');

exports.getAllWeddings = async (req, res) => {
  try {
    const weddingList = await Wedding.find({}, 'bride groom weddingDate user');
    console.log("Fetched Weddings:", weddingList);
    if (!weddingList) {
      return res.status(500).json({ success: false });
    }
    res.status(200).send(weddingList);
  } catch (error) {
    console.error("Error fetching weddings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWeddingById = async (req, res) => {
  console.log("Request ID:", req.params.id);
  try {
    const wedding = await Wedding.findById(req.params.id).populate('userId');

    if (!wedding) {
      return res.status(404).json({ message: 'The wedding with the given ID was not found.' });
    }

    res.status(200).json(wedding);
  } catch (error) {
    console.error("Error fetching wedding by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.submitWeddingForm = async (req, res) => {
  const { userId, weddingData } = req.body;

  console.log("Received userId:", userId);
  console.log("Received weddingData:", weddingData);

  if (!userId || !weddingData) {
    return res.status(400).json({ message: "User ID and wedding data are required." });
  }

  try {
    const validUserId = mongoose.Types.ObjectId(userId);
    const brideCertificate = req.files['brideBirthCertificate']?.[0]?.path || "";
    const groomCertificate = req.files['groomBirthCertificate']?.[0]?.path || "";
    const brideBaptismalCertificate = req.files['brideBaptismalCertificate']?.[0]?.path || "";
    const groomBaptismalCertificate = req.files['groomBaptismalCertificate']?.[0]?.path || "";

    const newWeddingData = {
      userId: validUserId,
      weddingStatus: "Pending",  
      ...JSON.parse(weddingData),
      brideBirthCertificate: brideCertificate,
      groomBirthCertificate: groomCertificate,
      brideBaptismalCertificate,
      groomBaptismalCertificate,
    };

    if (req.files?.brideBirthCertificate?.[0]) {
      newWeddingData.brideBirthCertificateUrl = req.files.brideBirthCertificate[0].path;
    }

    if (req.files?.groomBirthCertificate?.[0]) {
      newWeddingData.groomBirthCertificateUrl = req.files.groomBirthCertificate[0].path;
    }

    if (req.files?.brideBaptismalCertificate?.[0]) {
      newWeddingData.brideBaptismalCertificate = req.files.brideBaptismalCertificate[0].path;
    }

    if (req.files?.groomBaptismalCertificate?.[0]) {
      newWeddingData.groomBaptismalCertificate = req.files.groomBaptismalCertificate[0].path;
    }

    console.log("Final wedding object to be saved:", newWeddingData);

    const newWedding = new Wedding(newWeddingData);
    await newWedding.save();

    return res.status(201).json({
      message: "Wedding form submitted successfully!",
      wedding: newWedding,
    });
  } catch (error) {
    console.error("Error saving wedding form:", error);
    return res.status(500).json({
      message: "There was an error saving the wedding form.",
      error: error.message,
    });
  }
};


//with image:
// exports.submitWeddingForm = async (req, res) => {
//   const { userId, weddingData } = req.body;

//   console.log("Received userId:", userId);
//   console.log("Received weddingData:", weddingData);

//   if (!userId || !weddingData) {
//     return res.status(400).json({ message: "User ID and wedding data are required." });
//   }

//   try {
//     const validUserId = mongoose.Types.ObjectId(userId);
//     const brideCertificate = req.files['brideBirthCertificate']?.[0]?.path || "";
//     const groomCertificate = req.files['groomBirthCertificate']?.[0]?.path || "";
//     const brideBaptismalCertificate = req.files['brideBaptismalCertificate']?.[0]?.path || "";
//     const groomBaptismalCertificate = req.files['groomBaptismalCertificate']?.[0]?.path || "";

//     const newWeddingData = {
//       userId: validUserId,
//       ...JSON.parse(weddingData),
//       brideBirthCertificate: brideCertificate,
//       groomBirthCertificate: groomCertificate,
//       brideBaptismalCertificate,
//       groomBaptismalCertificate,
//     };

//     if (req.files?.brideBirthCertificate?.[0]) {
//       newWeddingData.brideBirthCertificateUrl = req.files.brideBirthCertificate[0].path;
//     }

//     if (req.files?.groomBirthCertificate?.[0]) {
//       newWeddingData.groomBirthCertificateUrl = req.files.groomBirthCertificate[0].path;
//     }

//     if (req.files?.brideBaptismalCertificate?.[0]) {
//       newWeddingData.brideBaptismalCertificate = req.files.brideBaptismalCertificate[0].path;
//     }

//     if (req.files?.groomBaptismalCertificate?.[0]) {
//       newWeddingData.groomBaptismalCertificate = req.files.groomBaptismalCertificate[0].path;
//     }

//     console.log("Final wedding object to be saved:", newWeddingData);

//     const newWedding = new Wedding(newWeddingData);
//     await newWedding.save();

//     return res.status(201).json({
//       message: "Wedding form submitted successfully!",
//       wedding: newWedding,
//     });
//   } catch (error) {
//     console.error("Error saving wedding form:", error);
//     return res.status(500).json({
//       message: "There was an error saving the wedding form.",
//       error: error.message,
//     });
//   }
// };

//First Working Wedding Controller
// exports.submitWeddingForm = async (req, res) => {
//   const { userId, weddingData } = req.body;

//   console.log("Received userId:", userId);
//   console.log("Received weddingData:", weddingData);

//   if (!userId || !weddingData) {
//       return res.status(400).json({ message: "User ID and wedding data are required." });
//   }

//   try {
//       const validUserId = mongoose.Types.ObjectId(userId); 

//       const newWedding = new Wedding({
//           userId: validUserId, 
//           ...weddingData, 
//       });

//       console.log("New wedding object to be saved:", newWedding);

//       await newWedding.save(); 

//       return res.status(201).json({ message: "Wedding form submitted successfully!", wedding: newWedding });
//   } catch (error) {
//       console.error("Error saving wedding form:", error);
//       return res.status(500).json({ message: "There was an error saving the wedding form.", error: error.message });
//   }
// };

//curent
// exports.confirmWedding = async (req, res) => {
//   try {
//     const wedding = await Wedding.findById(req.params.id);
//     if (!wedding) {
//       return res.status(404).json({ message: 'Wedding not found' });
//     }

//     wedding.weddingStatus = "Confirmed";
//     wedding.confirmedAt = new Date();
//     await wedding.save();

//     res.status(200).json({ message: 'Wedding confirmed', wedding });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

exports.confirmWedding = async (req, res) => {
  const weddingId = req.params.id;
  const wedding = await Wedding.findById(weddingId);
  if (!wedding) {
    return res.status(404).json({ message: "Wedding not found" });
  }
  wedding.weddingStatus = "Confirmed";  

  await wedding.save();
  res.status(200).json({ message: "Wedding confirmed" });
};


exports.declineWedding = async (req, res) => {
  const weddingId = req.params.weddingId;
  const wedding = await Wedding.findById(weddingId);
  if (!wedding) {
    return res.status(404).json({ message: "Wedding not found" });
  }
  wedding.status = "declined";
  await wedding.save();
  res.status(200).json({ message: "Wedding declined" });
};



exports.getConfirmedWeddings = async (req, res) => {
  try {
    const confirmedWeddings = await Wedding.find({ weddingStatus: 'Confirmed' });
    res.status(200).json(confirmedWeddings);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.declineWedding = async (req, res) => {
  const weddingId = req.params.weddingId;
  const wedding = await Wedding.findById(weddingId);
  if (!wedding) {
    return res.status(404).json({ message: "Wedding not found" });
  }
  wedding.status = "declined";
  await wedding.save();
  res.status(200).json({ message: "Wedding declined" });
};

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


//Dates

exports.getAvailableDates = async (req, res) => {
  try {
    const bookedDates = await Wedding.find({ isBooked: true }).select('date');
    res.status(200).json(bookedDates);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.bookDate = async (req, res) => {
  const { date, userId } = req.body;
  try {
    const weddingDate = await Wedding.findOneAndUpdate(
      { date },
      { isBooked: true, userId: mongoose.Types.ObjectId(userId) },
      { new: true, upsert: true } // Creates the document if it doesn't exist
    );
    res.status(200).json({ message: 'Date booked successfully', weddingDate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//AdminDates
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

exports.removeAvailableDate = async (req, res) => {
  const { id } = req.params;
  try {
    await Wedding.findByIdAndDelete(id);
    res.json({ message: 'Date removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};