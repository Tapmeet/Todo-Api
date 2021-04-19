const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  filename: {
    type: String,
  },
  originalname: {
    type: String,
  },
  mimetype: {
    type: String,
  },
  path: {
    type: String,
  },
  size: {
    type: String,
  },
}, {timestamps: true});

module.exports = mongoose.model('Upload', UploadSchema);
