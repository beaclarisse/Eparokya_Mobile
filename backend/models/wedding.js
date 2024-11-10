const mongoose = require("mongoose");

const weddingSchema = mongoose.Schema(
  {
    bride: {
      type: String,
      required: true,
    },
    BrideAddress: {
      state: String,
      zip: String,
      country: String,
    },
    BrideAge: {
      type: Number,
      required: true,
    },
    BrideGender: {
      type: String,
      required: true,
    },
    BridePhone: {
      type: String,
      required: true,
    },
    GroomName: {
      type: String,
      required: true,
    },
    GroomAddress: {
      state: String,
      zip: String,
      country: String,
    },
    GroomAge: {
      type: Number,
      required: true,
    },
    GroomGender: {
      type: String,
      required: true,
    },
    GroomPhone: {
      type: String,
      required: true,
    },
    BrideFamilyNameRelative: {
      type: String,
      required: false,
    },
    relationship1: {
      type: String,
      required: false,
    },
    GroomFamilyNameRelative: {
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
    venue: {
      type: String,
      required: true,
    },
    officiant: {
      type: String,
      required: true,
    },
    ceremonyDetails: {
      type: String,
      required: true,
    },
    receptionDetails: {
      type: String,
      required: true,
    },
    ceremonyPicture: {
      type: String,
      required: false,
    },
    weddingStatus: {
      type: String,
      required: true,
      default: "Pending",
    },
    // Form 4 fields added
    birthCertificateBride: {
      type: String,
      required: false,
    },
    birthCertificateGroom: {
      type: String,
      required: false,
    },
    pictureBride: {
      type: String,
      required: false,
    },
    pictureGroom: {
      type: String,
      required: false,
    },
    baptismalCertificateBride: {
      type: String,
      required: false,
    },
    baptismalCertificateGroom: {
      type: String,
      required: false,
    },
    comments: [
      {
        priest: String,
        scheduledDate: Date,
        selectedComment: String,
        additionalComment: String,
      },
    ],
    confirmedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

weddingSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

weddingSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Wedding", weddingSchema);
