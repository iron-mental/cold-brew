const jwt = require('jsonwebtoken');

const { jwtVerify } = require('../utils/jwt');
const socketService = require('../services/socket');

const socketConfig = (io) => {
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
    socketService.connection(study_id, user_id, socket_id, nickname);

    socket.on('chat', (message) => {
      socketService.chat(terminal, study_id, nickname, message);
    });

    socket.on('disconnect', () => {
      socketService.disconnection(study_id, user_id);
    });
  });

  require('../events/socket').register(io);

  return io;
};

module.exports = {
  socketConfig,
};
