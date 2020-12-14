const socketDao = require('../dao/socket');
const push = require('../events/push');

const Chat = require('../models/chat');

const connection = (study_id, user_id, socket_id, nickname) => {
  socketDao.updateChatStatus(true, study_id, user_id);
};

const chat = (terminal, study_id, nickname, message) => {
  const userChat = Chat.getInstance({ study_id, nickname, message });
  terminal.to(study_id).emit('message', JSON.stringify(userChat));
  Chat.create(userChat);
  push.emit('chat', study_id, userChat);
};

const disconnection = (study_id, user_id) => {
  socketDao.updateChatStatus(false, study_id, user_id);
};

module.exports = {
  connection,
  disconnection,
  chat,
};
