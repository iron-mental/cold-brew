const { EventEmitter } = require('events');

const pushService = require('../services/push');
const push = new EventEmitter();

push.on('chat', async (study_id, chat) => {
  pushService.chat(study_id, chat);
});

// 참여, 탈퇴를 제외한 알람 발생 시 트리거
push.on('alert', async (study_id, message, nickname) => {
  pushService.alert(study_id, message, nickname);
});

module.exports = push;
