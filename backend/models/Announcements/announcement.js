const mongoose = require('mongoose');

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
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    announcementCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'announcementCategory',
        required:true
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

announcementSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

announcementSchema.set('toJSON', {
    virtuals: true,
});


exports.Announcement = mongoose.model('Announcement', announcementSchema);