const mongoose = require('mongoose');

const weddingSchema = mongoose.Schema({
  name1: {
    type: String,
    required: true,
  },
  address1: {
    state: String,
    zip: String,
    country: String,
  },
  age1: {
    type: Number,
    required: true,
  },
  gender1: {
    type: String,
    required: true,
  },
  phoneNumber1: {
    type: String,
    required: true,
  },
  name2: {
    type: String,
    required: true,
  },
  address2: {
    state: String,
    zip: String,
    country: String,
  },
  age2: {
    type: Number,
    required: true,
  },
  gender2: {
    type: String,
    required: true,
  },
  phoneNumber2: {
    type: String,
    required: true,
  },
  familyNameRelative1: {
    type: String,
    required: false,
  },
  relationship1: {
    type: String,
    required: false,
  },
  familyNameRelative2: {
    type: String,
    required: false,
  },
  relationship2: {
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
  weddingStatus: {
    type: String,
    required: true,
    default: 'Pending',
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
