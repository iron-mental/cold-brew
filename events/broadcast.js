const { EventEmitter } = require('events');

class Broadcast extends EventEmitter {
  constructor() {
    super();
    if (Broadcast.exists) {
      return Broadcast.instance;
    }
  }

  participate = (study_id, nickname) => {
    this.emit('system-notification', study_id, `${nickname}님이 참여했습니다`);
  };

  leave = (study_id, nickname) => {
    this.emit('system-notification', study_id, `${nickname}님이 탈퇴했습니다`);
  };
}

const broadcast = new Broadcast();

module.exports = { broadcast };
