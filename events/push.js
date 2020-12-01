const { EventEmitter } = require('events');

const Room = require('../models/room');
const pushService = require('../services/push');

const push = new EventEmitter();

push.on('send-offMembers', async (study_id, chat) => {
  const { off_members } = await Room.findOne({ study_id });
  const length = off_members.length;

  if (length > 0) {
    for (i = 0; i < 10 - length; i++) {
      off_members.push(undefined);
    }
    pushService.send(off_members, chat);
  }
});

push.on('system-notification', (study_id, chat) => {
  console.log('study_id, chat: ', study_id, chat);
  pushService.send(study_id, chat);
});

module.exports = push;
