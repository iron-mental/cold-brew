const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    user_id: Number, // 유저 아이디
    study_id: Number, // study_id
    nickname: String, // 유저 닉네임
    message: String, // 내용
    date: String, // unixtime
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Chat', chatSchema);
