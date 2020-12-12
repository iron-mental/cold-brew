const { EventEmitter } = require('events');

const pushService = require('../services/push');
const PushEventEnum = require('../utils/variables/enum');

const push = new EventEmitter();
push.setMaxListeners(15);

// push.on('chat', (study_id, chat) => {
//   pushService.chat(study_id, chat);
// });

// 참여, 탈퇴를 제외한 알람 발생 시 트리거
// push.on('alert', (study_id, message, nickname) => {
//   pushService.alert(study_id, message, nickname);
// });

push.on('send', (user_id, message, data) => {
  pushService.send(user_id, message, data);
});

////////////////////////////////
push.on('toUser', (pushEvent, user_id) => {
  pushService.toUser(pushEvent, user_id);
});

push.on('toHost', async (pushEvent, study_id) => {
  pushService.toHost(pushEvent, study_id);
});

push.on('chat', (study_id, chat) => {
  console.log('## push event');
  pushService.chat(study_id, chat);
});

module.exports = push;
