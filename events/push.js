const { EventEmitter } = require('events');

const Room = require('../models/room');
const pushService = require('../services/push');

const push = new EventEmitter();

push.on('offMembers', async (study_id, chat) => {
  pushService.offMembers(study_id, chat);
});

// 참여, 탈퇴를 제외한 알람 발생 시 트리거
push.on('members', async (study_id, chat) => {
  const { members } = await Room.findOne({ study_id });
  pushService.send(makeArray(members), chat);
});

module.exports = push;
