const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Room = require('../models/room');
const Chat = require('../models/chat');

const chatModel = require('../utils/variables/chatModel');

const verifyToken = (socket, next) => {
  if (socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_secret, (err, decoded) => {
      if (err) {
        return next(err);
      }
      socket.decoded = decoded;
      return next();
    });
  } else {
    return next('not exist token');
  }
};

const getHexTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000).toString(16) + '0000000000000000';
};

const socketConfig = (io) => {
  const terminal = io.of('/terminal');

  terminal.use(verifyToken).on('connection', (socket) => {
    User.findOneAndUpdate(
      { user_id: socket.decoded.id },
      { socket_id: socket.decoded.id, nickname: socket.decoded.nickname },
      { upsert: true, new: true }
    ).then(() => {
      socket.join(socket.handshake.query.room);
      Room.updateOne({ room_number: socket.handshake.query.room }, { $pull: { off_members: socket.decoded.id } }).exec();
    });

    socket.on('disconnect', () => {
      User.findOneAndUpdate({ user_id: socket.decoded.id }, { disconnected_at: getHexTimestamp() }).then(() => {
        Room.updateOne({ room_number: socket.handshake.query.room }, { $addToSet: { off_members: socket.decoded.id } }).exec();
      });
    });

    socket.on('chat', (message) => {
      const chatData = chatModel.getUserChat(socket, message);
      terminal.to(socket.handshake.query.room).emit('message', JSON.stringify(chatData));
      Chat.create(chatData);
    });
  });

  require('../events/socket').register(io);

  return io;
};

module.exports = {
  socketConfig,
};
