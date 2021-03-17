const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    uuid: String,
    study_id: Number,
    user_id: Number,
    nickname: String,
    message: String,
    date: Number,
  },
  {
    versionKey: false,
  },
);

const Chat = mongoose.model('Chat', chatSchema);

Chat.getInstance = ({ study_id, user_id = 0, nickname = '__SYSTEM__', chatData }) => {
  let chat = new Chat({
    uuid: chatData.uuid || 0,
    study_id,
    user_id,
    nickname,
    message: chatData.message,
    date: new Date().getTime(),
  })._doc;

  chat.study_id = study_id + '';
  delete chat._id;
  return chat;
};

module.exports = Chat;
