const { broadcast } = require('./broadcast');

const chatModel = require('../utils/variables/chatModel');

const register = (io) => {
  broadcast.on('participate', (room_number, message) => {
    const systemChat = chatModel.getSystemChat(room_number, message);
    io.of('/terminal').to(room_number).emit('message', JSON.stringify(systemChat));
  });

  broadcast.on('leave', (room_number, message) => {
    const systemChat = chatModel.getSystemChat(room_number, message);
    io.of('/terminal').to(room_number).emit('message', JSON.stringify(systemChat));
  });
};

module.exports = {
  register,
  broadcast,
};
