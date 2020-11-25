class Chat {
  constructor(room, message, decoded) {
    this.user_id = decoded.id || 0;
    this.nickname = decoded.nickname || 'system';
    this.room_number = room;
    this.message = message;
    this.date = new Date().getTime();
  }
}
const getUserChat = (socket, message) => {
  return new Chat(socket.handshake.query.room, message, socket.decoded);
};

const getSystemChat = (room_number, message) => {
  return new Chat(room_number, message, {});
};

module.exports = {
  getUserChat,
  getSystemChat,
};
