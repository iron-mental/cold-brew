const { EventEmitter } = require('events');

class Broadcast extends EventEmitter {
  constructor() {
    super();
    if (Broadcast.exists) {
      return Broadcast.instance;
    }
  }

  participate = (study_id, nickname) => {
    this.emit('chat', study_id, `${nickname}님이 참여했습니다`);
  };

  leave = (study_id, nickname) => {
    this.emit('chat', study_id, `${nickname}님이 탈퇴했습니다`);
  };

  updateUserList = (study_id) => {
    this.emit('update_user_list', study_id);
  };
}

module.exports = new Broadcast();
