const Baptism = require('../models/Binyag');
const mongoose = require('mongoose');

exports.submitBaptismForm = async (req, res) => {
  const { userId, baptismData } = req.body;

  console.log("Received userId:", userId);
  console.log("Received baptismData:", baptismData);

  if (!userId || !baptismData) {
    return res.status(400).json({ message: "User ID and baptism data are required." });
  }

  try {
    const validUserId = mongoose.Types.ObjectId(userId);

    // File uploads if applicable
    const birthCertificate = req.files?.birthCertificate?.[0]?.path || "";
    const marriageCertificate = req.files?.marriageCertificate?.[0]?.path || "";
    const baptismPermit = req.files?.baptismPermit?.[0]?.path || "";

    // Parse and construct new baptism data
    const newBaptismData = {
      userId: validUserId,
      ...JSON.parse(baptismData), // Parse the JSON string if coming from a form-data request
      additionalDocs: {
        birthCertificate,
        marriageCertificate,
        baptismPermit,
      },
    };

    // Debug the final baptism data object
    console.log("Final baptism object to be saved:", newBaptismData);

    // Create and save the new baptism document
    const newBaptism = new Baptism(newBaptismData);
    await newBaptism.save();

    return res.status(201).json({
      message: "Baptism form submitted successfully!",
      baptism: newBaptism,
    });
  } catch (error) {
    console.error("Error saving baptism form:", error);
    return res.status(500).json({
      message: "There was an error saving the baptism form.",
      error: error.message,
    });
  }
};exports.submitBaptismForm = async (req, res) => {
    const { userId, childName, birthDate, baptismDate, fatherName, motherName, address, contactInfo } = req.body;
  
    console.log("Received userId:", userId);
    console.log("Received form data:", req.body);
  
    // Validate required fields
    // if (!userId || !childName || !birthDate || !baptismDate || !fatherName || !motherName || !address || !contactNumber) {
    //   return res.status(400).json({ message: "All fields are required." });
    // }
  
    try {
      // Validate userId format
      const validUserId = mongoose.Types.ObjectId(userId);
  
      // Construct new baptism data object
      const newBaptismData = {
        userId: validUserId,
        childName: req.body.child.fullName,
        birthDate: req.body.child.dateOfBirth,
        baptismDate,
        fatherName: req.body.parents.parents,
        motherName: req.body.parents.parents,
        address: req.body.parents.parents,
        contactInfo: req.body.parents,
      };
  
      // Debug the final baptism data object
      console.log("Final baptism object to be saved:", newBaptismData);
  
      // Create and save the new baptism document
      const newBaptism = new Baptism(req.body);
      await newBaptism.save();
  
      return res.status(201).json({
        message: "Baptism form submitted successfully!",
        baptism: newBaptism,
      });
    } catch (error) {
      console.error("Error saving baptism form:", error);
      return res.status(500).json({
        message: "There was an error saving the baptism form.",
        error: error.message,
      });
    }
  };

  exports.listBaptismForms = async (req, res) => {
    try {
      // Retrieve all baptism forms from the database
      const baptismForms = await Baptism.find().sort({ createdAt: -1 }); // Sorting by newest first
  
      if (baptismForms.length === 0) {
        return res.status(404).json({ message: "No baptism forms found." });
      }
  
      // Send the retrieved baptism forms
      return res.status(200).json({
        message: "Baptism forms retrieved successfully.",
        baptismForms,
      });
    } catch (error) {
      console.error("Error retrieving baptism forms:", error);
      return res.status(500).json({
        message: "There was an error retrieving baptism forms.",
        error: error.message,
      });
    }
  };
  