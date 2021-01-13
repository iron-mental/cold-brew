const redis = require('redis');
const { EventEmitter } = require('events');
const { RedisEventEnum } = require('../utils/variables/enum.js');

const redisUserModel = require('../models/redis');

const client = redis.createClient();
const redisEvent = new EventEmitter();

const countTotal = (userData) => {
  userData.badge = 0;
  for (let study_id in userData.count) {
    userData.badge += userData.count[study_id];
  }
  return userData;
};

const redisProcess = (userData, event, data) => {
  userData = JSON.parse(userData);

  switch (event) {
    case RedisEventEnum.push_token:
      console.log('푸시토큰 갱신');
      userData.push = data;
      return userData;

    case RedisEventEnum.participate:
      console.log('스터디 가입');
      userData.count[data.study_id] = 0;
      return userData;

    case RedisEventEnum.alert:
      console.log('알림');
      userData.count.alert += 1;
      userData = countTotal(userData);
      return userData;

    case RedisEventEnum.chat:
      console.log('채팅');
      userData.count[data.study_id] += 1;
      userData = countTotal(userData);
      return userData;

    case RedisEventEnum.alert_read:
      console.log('알림 읽음');
      userData.count.alert = 0;
      userData = countTotal(userData);
      return userData;

    case RedisEventEnum.chat_read:
      console.log('채팅 읽음');
      userData.count[data.study_id] = 0;
      userData = countTotal(userData);
      return userData;
  }
};

redisEvent.on('trigger', (event, user_id, data) => {
  if (event === RedisEventEnum.signup) {
    client.set(user_id, JSON.stringify(redisUserModel), (err) => {
      if (err) console.log('## 레디스 set 에러: ', err);
    });
  } else {
    client.get(user_id, (err, userData) => {
      if (err) console.log('## 레디스 get 에러: ', err);
      userData = redisProcess(userData, event, data);
      client.set(user_id, JSON.stringify(userData), (err, v) => {
        if (err) console.log('## 레디스 set 에러: ', err);
      });
    });
  }
});

module.exports = redisEvent;
