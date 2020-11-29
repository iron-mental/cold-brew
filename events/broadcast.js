const { EventEmitter } = require('events');

class Broadcast extends EventEmitter {
  constructor() {
    super();
    if (Broadcast.exists) {
      return Broadcast.instance;
    }
  }

  participate = (room_number, nickname) => {
    this.emit('system-notification', room_number, `${nickname}님이 참여했습니다`);
  };

  leave = (room_number, nickname) => {
    this.emit('system-notification', room_number, `${nickname}님이 탈퇴했습니다`);
  };
}

const broadcast = new Broadcast();

module.exports = { broadcast };
