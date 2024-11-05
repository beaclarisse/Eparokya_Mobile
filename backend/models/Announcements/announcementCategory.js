const mongoose = require('mongoose');

const announcementCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '',
    },
});

const announcementCategory = mongoose.model('announcementCategory', announcementCategorySchema);
module.exports = { announcementCategory };
