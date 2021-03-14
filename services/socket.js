const socketDao = require('../dao/socket');
const push = require('./push');

const Chat = require('../models/chat');

const connection = (study_id, user_id) => {
  socketDao.updateChatStatus(true, study_id, user_id);
};

const disconnection = (study_id, user_id) => {
  socketDao.updateChatStatus(false, study_id, user_id);
};

const chat = (terminal, study_id, user_id, nickname, message) => {
  const userChat = Chat.getInstance({ study_id, user_id, nickname, message });
  terminal.to(study_id).emit('message', JSON.stringify(userChat));
  Chat.create(userChat);
  push.chat(study_id, userChat);
};

module.exports = {
  connection,
  disconnection,
  chat,
};
