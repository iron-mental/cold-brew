const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema(
  {
    word: String, // 검색어
    category: String,
    sigungu: String,
    count: Number,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Search', searchSchema);
