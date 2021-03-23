const broadcast = require('./broadcast');
const push = require('../services/push');
const commonDao = require('../dao/common');

const Chat = require('../models/chat');

const register = (io) => {
  const terminal = io.of(process.env.CHAT_nsp);

  broadcast.on('chat', (study_id, chatData) => {
    const systemChat = Chat.getInstance({ study_id, chatData });
    terminal.to(study_id).emit('message', JSON.stringify(systemChat));
    Chat.create(systemChat);
    push.chat(study_id, systemChat);
  });

  broadcast.on('update_user_list', async (study_id) => {
    const userList = await commonDao.getParticipateLog(study_id);
    terminal.to(study_id).emit('update_user_list', JSON.stringify(userList));
  });
};

module.exports = {
  register,
};
