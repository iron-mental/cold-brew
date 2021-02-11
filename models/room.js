const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    study_id: Number,
    study_title: String,
    members: Array, // 각 원소는 object형태 { user_id, socket_id }
    off_members: Array, // 소켓연결이 끊겨있는 user_id만 저장
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('Room', roomSchema);
