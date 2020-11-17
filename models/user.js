const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_id: String, // user_id
    nickname: String, // nickname
    socket_id: String, // socket.id
    rooms: Array, // 가입한 Room 목록
    disconnected_at: String, // unixtime
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('User', userSchema);
