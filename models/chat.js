const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    room_number: Number, // study_id
    user_id: Number, // 유저 아이디
    nickname: String, // 유저 닉네임
    message: String, // 내용
    date: String, // unixtime
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Chat', chatSchema);
