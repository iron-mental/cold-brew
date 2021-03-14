const { socketVerify } = require('../utils/jwt');
const socketService = require('../services/socket');

const socketConfig = (io) => {
  const terminal = io.of(process.env.CHAT_nsp);
  terminal.setMaxListeners(20);

  terminal.use(socketVerify).on('connection', (socket) => {
    const {
      decoded: { id: user_id, nickname },
      handshake: {
        query: { study_id },
      },
    } = socket;
    socket.join(study_id);
    socketService.connection(study_id, user_id);

    socket.on('disconnect', () => {
      socketService.disconnection(study_id, user_id);
    });

    socket.on('chat', (message) => {
      socketService.chat(terminal, study_id, user_id, nickname, message);
    });
  });

  require('../events/socket').register(io);

  return io;
};

module.exports = {
  socketConfig,
};
