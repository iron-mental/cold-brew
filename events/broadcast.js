const { EventEmitter } = require('events');

class Broadcast extends EventEmitter {
  constructor() {
    super();
    if (Broadcast.exists) {
      return Broadcast.instance;
    }
  }

  participate = (study_id, nickname) => {
    const chatData = { message: `${nickname}님이 참여했습니다` };
    this.emit('chat', study_id, chatData);
  };

  leave = (study_id, nickname) => {
    const chatData = { message: `${nickname}님이 탈퇴했습니다` };
    this.emit('chat', study_id, chatData);
  };

  updateUserList = (study_id) => {
    this.emit('update_user_list', study_id);
  };
}

const broadcast = new Broadcast();
broadcast.setMaxListeners(20);

module.exports = broadcast;
