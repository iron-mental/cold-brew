const socketDao = require('../dao/socket');
const push = require('../events/push');

const User = require('../models/user');
const Room = require('../models/room');
const Chat = require('../models/chat');

const getHexTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000).toString(16) + '0000000000000000';
};

const connection = (study_id, user_id, socket_id, nickname) => {
  socketDao.updateChatStatus(true, study_id, user_id);
  User.updateOne({ user_id }, { socket_id, nickname }).exec();
  Room.updateOne({ study_id }, { $pull: { off_members: user_id } }).exec();
};

const chat = (terminal, study_id, nickname, message) => {
  const userChat = Chat.getInstance({ study_id, nickname, message });
  terminal.to(study_id).emit('message', JSON.stringify(userChat));
  Chat.create(userChat);

  push.emit('offMembers', study_id, nickname, userChat);
};

const disconnection = (study_id, user_id) => {
  socketDao.updateChatStatus(false, study_id, user_id);
  User.updateOne({ user_id }, { disconnected_at: getHexTimestamp() }).exec();
  Room.updateOne({ study_id }, { $addToSet: { off_members: user_id } }).exec();
};

module.exports = {
  connection,
  disconnection,
  chat,
};
