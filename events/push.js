const { EventEmitter } = require('events');

const Room = require('../models/room');
const pushService = require('../services/push');

const push = new EventEmitter();

push.on('send-offMembers', async (study_id, chat, withTitle) => {
  const { off_members } = await Room.findOne({ study_id });
  const length = off_members.length;
  if (length > 0) {
    pushService.send(fullArray(off_members), chat);
  }
});

// 참여, 탈퇴를 제외한 알람 발생 시 트리거
push.on('send-members', async (study_id, chat) => {
  const { members } = await Room.findOne({ study_id });
  // pushService.send(fullArray(members), chat);
});

const fullArray = (target) => {
  const length = target.length;
  for (i = 0; i < 10 - length; i++) {
    target.push(null);
  }
  return target;
};

module.exports = push;
