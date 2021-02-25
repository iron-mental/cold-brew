const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_id: Number,
    nickname: String,
    socket_id: String,
    rooms: Array,
    disconnected_at: String,
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('User', userSchema);
