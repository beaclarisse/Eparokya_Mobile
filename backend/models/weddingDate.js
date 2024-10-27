const mongoose = require('mongoose');

const weddingDateSchema = mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        default: 'wedding', 
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isBooked: {
        type: Boolean,
        required: true,
        default: false,  
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: false,  
    },
}, { timestamps: true });

weddingDateSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

weddingDateSchema.set('toJSON', {
    virtuals: true,
});

exports.weddingDate = mongoose.model('weddingDate', weddingDateSchema);
