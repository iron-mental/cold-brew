const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_number: String, // study_id
  room_name: String, // 스터디 이름
  members: Array, // 각 원소는 object형태 { user_id, socket_id }
});

module.exports = mongoose.model('Room', roomSchema);
