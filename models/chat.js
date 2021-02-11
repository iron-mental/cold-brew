const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    study_id: Number,
    nickname: String,
    message: String,
    date: String,
  },
  {
    versionKey: false,
  },
);

const Chat = mongoose.model('Chat', chatSchema);

Chat.getInstance = ({ study_id, nickname = '__SYSTEM__', message }) => {
  let chat = new Chat({
    _id: null,
    study_id,
    nickname,
    message,
    date: new Date().getTime(),
  })._doc;

  delete chat._id;
  return chat;
};

module.exports = Chat;
