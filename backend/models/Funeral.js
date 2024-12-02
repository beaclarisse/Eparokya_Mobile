const mongoose = require('mongoose');

const FuneralSchema = new mongoose.Schema({
    name: {
        firstName: { type: String, required: true },
        middleName: { type: String, required: false },
        lastName: { type: String, required: true },
        suffix: { type: String, required: false },
    },
    gender: { type: String, required: true },
    age: { type: String, required: true },
    numberOfSons: { type: String, required: false },
    sons: { type: String, required: false },
    numberOfDaughters: { type: String, required: false },
    daughters: { type: String, required: false },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
    },
    funeralDate: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        enum: ['Mass', 'Word Service'],
        required: true
    },
    entranceSong: {
        type: String,
        required: false
    },
    placingOfPall: {
        by: { type: String, enum: ['Priest', 'Family Member'], required: true },
        familyMembers: { type: [String], required: function () { return this.placingOfPall.by === 'Family Member'; } }
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
    confirmedAt: {
        type: Date,
    },
    funeralStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Cancelled'],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
    { timestamps: true }
);

module.exports = mongoose.model('Funeral', FuneralSchema);
