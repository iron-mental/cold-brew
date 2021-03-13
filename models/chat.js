const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    study_id: Number,
    user_id: Number,
    message: String,
    date: Number,
  },
  {
    versionKey: false,
  },
);

const Chat = mongoose.model('Chat', chatSchema);

Chat.getInstance = ({ study_id, message, user_id = 0, nickname = '__SYSTEM__' }) => {
  let chat = new Chat({
    _id: null,
    study_id,
    user_id,
    message,
    date: new Date().getTime(),
  })._doc;

  chat.nickname = nickname;
  delete chat._id;
  return chat;
};

module.exports = Chat;
