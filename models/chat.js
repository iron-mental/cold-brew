const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room_number: String, // study_id
  user_id: String, // 유저 아이디
  nickname: String, // 유저 닉네임
  message: String, // 내용
  date: String, // 시간 -> node에서 생성
});

module.exports = mongoose.model('Chat', chatSchema);
