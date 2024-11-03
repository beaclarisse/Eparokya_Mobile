const mongoose = require('mongoose');

const ministryCatgeorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
 
}, {});



exports.ministryCatgeory = mongoose.model('ministryCategory', ministryCatgeorySchema);
