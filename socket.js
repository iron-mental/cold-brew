const jwt = require('jsonwebtoken');
const socketio = require('socket.io');

const { categoryEnum } = require('./utils/variables/enums');

const User = require('./models/user');
const Room = require('./models/room');
const Chat = require('./models/chat');

const getHexTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000).toString(16) + '0000000000000000';
};

const jwtVerify = (socket, next) => {
  if (socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_secret, (err, decoded) => {
      if (err) {
        next(err); // 인증에러
      }
      socket.decoded = decoded;
      next(); // 성공
    });
  } else {
    next('not exist token'); // 토큰 없으면 나타나는 에러
  }
};

const serverEvent = (socket) => {
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
    // msgData 중, message는 클라에게 받을 것
    const msgData = {
      room_number: socket.handshake.query.room,
      user_id: socket.decoded.id,
      nickname: socket.decoded.nickname,
      message: message,
      date: Math.floor(new Date().getTime() / 1000),
    };
    io.of(socket.nsp.name).to(msgData.room_number).emit('message', JSON.stringify(msgData));
    Chat.create(msgData);
  });
};

const listen = (server) => {
  io = socketio.listen(server);

  Object.keys(categoryEnum).forEach((v, i) => {
    io.of('/' + v)
      .use(jwtVerify)
      .on('connection', serverEvent);
  });

  return io;
};

module.exports = { listen };
