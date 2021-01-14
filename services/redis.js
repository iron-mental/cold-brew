const redis = require('redis');
const redisUserModel = require('../models/redis');

const client = redis.createClient();

const redisTrigger = async (user_id, redisEvent, data) => {
  if (redisEvent === RedisEventEnum.signup) {
    // 비동기 작업 가능
    client.set(user_id, JSON.stringify(redisUserModel), (err) => {
      if (err) console.log('## 레디스 set 에러: ', err);
    });
  } else {
    client.get(user_id, (err, userData) => {
      if (err) console.log('## 레디스 get 에러: ', err);
      userData = redisProcess(userData, redisEvent, data);
      client.set(user_id, JSON.stringify(userData), (err, v) => {
        if (err) console.log('## 레디스 set 에러: ', err);
        console.log('## 레디스 연산 완료');
      });
    });
  }
};

const redisProcess = (userData, redisEvent, data) => {
  userData = JSON.parse(userData);

  switch (redisEvent) {
    case RedisEventEnum.push_token:
      // 비동기 작업 가능
      console.log('푸시토큰 갱신');
      userData.push = data;
      return userData;

    case RedisEventEnum.participate:
      // 비동기 작업 가능
      console.log('스터디 가입');
      userData.count[data.study_id] = 0;
      return userData;

    ////// 실제 데이터 저장부 S
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
    ////// 실제 데이터 저장부 E

    case RedisEventEnum.alert_read:
      // 비동기 작업 가능
      console.log('알림 읽음');
      userData.count.alert = 0;
      userData = countTotal(userData);
      return userData;

    case RedisEventEnum.chat_read:
      // 비동기 작업 가능
      console.log('채팅 읽음');
      userData.count[data.study_id] = 0;
      userData = countTotal(userData);
      return userData;
  }
};

const countTotal = (userData) => {
  userData.badge = 0;
  for (let study_id in userData.count) {
    userData.badge += userData.count[study_id];
  }
  return userData;
};

module.exports = {
  redisTrigger,
};
