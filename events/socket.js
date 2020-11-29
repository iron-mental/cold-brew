const { broadcast } = require('./broadcast');
const chatModel = require('./socket/chatModel');
const Chat = require('../models/chat');

const register = (io) => {
  const terminal = io.of(process.env.CHAT_nsp);

  broadcast.on('system-notification', (room_number, message) => {
    const systemChat = chatModel.getSystemChat(room_number, message);
    terminal.to(room_number).emit('message', JSON.stringify(systemChat));
    Chat.create(systemChat);

    // 노티 이벤트 트리거 추가
  });
};

module.exports = {
  register,
};
