const { EventEmitter } = require('events');

const pushService = require('../services/push');
const push = new EventEmitter();

push.on('chat', (study_id, chat) => {
  pushService.chat(study_id, chat);
});

// 참여, 탈퇴를 제외한 알람 발생 시 트리거
push.on('alert', (study_id, message, nickname) => {
  pushService.alert(study_id, message, nickname);
});

push.on('send', (user_id, message, data) => {
  pushService.send(user_id, message, data);
});

module.exports = push;
