const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    study_id: Number,
    study_title: String,
    members: Array,
    off_members: Array,
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('Room', roomSchema);
