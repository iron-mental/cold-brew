const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: String, // user_id
  nickname: String, // nickname
  socket_id: String, // socket.id
});

module.exports = mongoose.model('User', userSchema);
