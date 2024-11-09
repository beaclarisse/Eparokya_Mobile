const mongoose = require('mongoose');
const { User } = require('./../user');

const announcementSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: '',
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    videos: [{
        type: String, 
    }],
    announcementCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'announcementCategory',
    },
    tags: [{
        type: String, 
        required: true
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        dateCreated: { type: Date, default: Date.now }
    }],  
    likedBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

announcementSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

announcementSchema.set('toJSON', {
    virtuals: true,
});

exports.Announcement = mongoose.model('Announcement', announcementSchema);
