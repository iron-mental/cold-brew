const { broadcast } = require('./broadcast');

const Chat = require('../models/chat');

const register = (io) => {
  const terminal = io.of(process.env.CHAT_nsp);

  broadcast.on('system-notification', (study_id, message) => {
    const systemChat = Chat.getInstance({ study_id, message });
    terminal.to(study_id).emit('message', JSON.stringify(systemChat));
    Chat.create(systemChat);

    // 노티 이벤트 트리거 추가
  });
};

module.exports = {
  register,
};
