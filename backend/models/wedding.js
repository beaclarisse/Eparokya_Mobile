  const mongoose = require('mongoose');

  const weddingSchema = mongoose.Schema({
    bride: { type: String, required: true },
    brideAge: { type: Number, required: true },
    brideGender: { type: String, required: true },
    bridePhone: { type: String, required: true },
    brideAddress: {
      state: String,
      zip: String,
      country: String,
      
    },
    groom: { type: String, required: true },
    groomAge: { type: Number, required: true },
    groomGender: { type: String, required: true },
    groomPhone: { type: String, required: true },
    groomAddress: {
      state: String,
      zip: String,
      country: String,
       
    },
    BrideRelative: {
      type: String,
      required: false,
    },
    BrideRelationship: {
      type: String,
      required: false,
    },
    GroomRelative: {
      type: String,
      required: false,
    },
    GroomRelationship: {
      type: String,
      required: false,
    },
    attendees: {
      type: Number,
      required: false,
    },
    flowerGirl: {
      type: String,
      required: false,
    },
    ringBearer: {
      type: String,
      required: false,
    },
    weddingDate: {
      type: Date,
      required: false,
    },
    // Image Fields
    brideBirthCertificate: {
      type: String,
      default: '',
    },
    groomBirthCertificate: {
      type: String,
      default: '',
    },
    brideBaptismalCertificate: {
      type: String,
      default: '', 
    },
    groomBaptismalCertificate: {
      type: String,
      default: '', 
    },
    weddingStatus: {
      type: String,
      required: false,
      default: 'Pending',
      enum: ['Pending', 'Confirmed', 'Cancelled'], 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confirmedAt: {
      type: Date,
    },
  
    comments: [
      {
        priest: String,
        scheduledDate: Date,
        selectedComment: String,
        additionalComment: String,
        adminRescheduled: {
          date: { type: Date },
          reason: { type: String },
      },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  }, { timestamps: true });

  weddingSchema.virtual('id').get(function () {
    return this._id.toHexString();
  });

  weddingSchema.set('toJSON', {
    virtuals: true,
  });

  exports.Wedding = mongoose.model('Wedding', weddingSchema);
