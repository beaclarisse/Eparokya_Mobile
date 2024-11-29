const mongoose = require('mongoose');

const BaptismSchema = new mongoose.Schema({
  baptismDate: { type: Date, required: false },
  church: { type: String, required: false },
  priest: { type: String, required: false },
  child: {
    fullName: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    placeOfBirth: { type: String, required: false },
    gender: { type: String, enum: ['Male', 'Female'], required: false },
  },
  parents: {
    fatherFullName: { type: String, required: false },
    motherFullName: { type: String, required: false },
    address: { type: String, required: false },
    contactInfo: { type: String, required: false },
  },
  godparents: [
    {
      name: { type: String },
      contactInfo: { type: String },
    },
  ],
  additionalDocs: {
    birthCertificate: { type: String }, 
    marriageCertificate: { type: String },
    baptismPermit: { type: String },
  },
  specialNotes: {
    fee: { type: String },
    requests: { type: String },
    sponsorCount: { type: Number },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  confirmedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Baptism', BaptismSchema);
