const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema(
  {
    user_id: Number,
    word: String,
    category: String,
    sigungu: String,
    count: Number,
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('Search', searchSchema);
