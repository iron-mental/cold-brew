const jwt = require('jsonwebtoken');
const redisAdapter = require('socket.io-redis');

const User = require('../models/user');
const Room = require('../models/room');
const Chat = require('../models/chat');
const push = require('../events/push');

const jwtVerify = (socket, next) => {
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
  io.adapter(
    redisAdapter({
      host: process.env.REDIS_host,
      port: process.env.REDIS_port,
    })
  );

  const terminal = io.of(process.env.CHAT_nsp);

  terminal.use(jwtVerify).on('connection', (socket) => {
    const {
      id: socket_id,
      decoded: { id: user_id, nickname },
      handshake: {
        query: { study_id },
      },
    } = socket;
    socket.join(study_id);

    User.updateOne({ user_id }, { socket_id, nickname }).exec();
    Room.updateOne({ study_id }, { $pull: { off_members: user_id } }).exec();

    socket.on('disconnect', () => {
      User.updateOne({ user_id }, { disconnected_at: getHexTimestamp() }).exec();
      Room.updateOne({ study_id }, { $addToSet: { off_members: user_id } }).exec();
    });

    socket.on('chat', (message) => {
      const userChat = Chat.getInstance({ study_id, nickname, message });

      terminal.to(study_id).emit('message', JSON.stringify(userChat));
      push.emit('send-offMembers', study_id, userChat);

      Chat.create(userChat);
    });
  });

  require('../events/socket').register(io);

  return io;
};

module.exports = {
  socketConfig,
};
