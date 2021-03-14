const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    uuid: Number,
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
  chatData = JSON.parse(chatData);
  let chat = new Chat({
    uuid: chatData.uuid,
    study_id,
    user_id,
    nickname,
    message: chatData.message,
    date: new Date().getTime(),
  })._doc;

  delete chat._id;
  console.log('chat: ', chat);
  return chat;
};

module.exports = Chat;
