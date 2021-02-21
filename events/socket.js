const broadcast = require('./broadcast');
const push = require('../services/push');

const Chat = require('../models/chat');

const register = (io) => {
  const terminal = io.of(process.env.CHAT_nsp);

  broadcast.on('chat', (study_id, message) => {
    const systemChat = Chat.getInstance({ study_id, message });
    terminal.to(study_id).emit('message', JSON.stringify(systemChat));
    push.chat(study_id, systemChat);
    Chat.create(systemChat);
  });
};

module.exports = {
  register,
};
