const { EventEmitter } = require('events');

const pushService = require('../services/push');

const push = new EventEmitter();

push.on('chat', (study_id, chat) => {
  pushService.chat(study_id, chat);
});

push.on('toUser', (pushEvent, user_id) => {
  pushService.toUser(pushEvent, user_id);
});

push.on('toHost', (pushEvent, study_id) => {
  pushService.toHost(pushEvent, study_id);
});

push.on('toStudy', (pushEvent, study_id) => {
  pushService.toStudy(pushEvent, study_id);
});

push.on('toStudyWithoutHost', (pushEvent, study_id) => {
  pushService.toStudyWithoutHost(pushEvent, study_id);
});

push.on('toStudyWithoutUser', (pushEvent, study_id, user_id) => {
  pushService.toStudyWithoutUser(pushEvent, study_id, user_id);
});

module.exports = push;
