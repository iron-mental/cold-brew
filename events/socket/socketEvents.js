const { EventEmitter } = require('events');

const chatModel = require('./chatModel');

class Broadcast extends EventEmitter {
  constructor() {
    super();
    if (Broadcast.exists) {
      return Broadcast.instance;
    }
  }

  participate = (room_number, nickname) => {
    this.emit('participate', room_number, `${nickname}님이 참여했습니다`);
  };

  leave = (room_number, nickname) => {
    this.emit('leave', room_number, `${nickname}님이 탈퇴했습니다`);
  };
}

const broadcast = new Broadcast();

const register = (io) => {
  broadcast.on('participate', (room_number, message) => {
    const systemChat = chatModel.getSystemChat(room_number, message);
    io.of('/terminal').to(room_number).emit('message', JSON.stringify(systemChat));
  });

  broadcast.on('leave', (room_number, message) => {
    const systemChat = chatModel.getSystemChat(room_number, message);
    io.of('/terminal').to(room_number).emit('message', JSON.stringify(systemChat));
  });
};

module.exports = {
  register,
  broadcast,
};
