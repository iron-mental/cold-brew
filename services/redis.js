const redis = require('redis');
const redisUserModel = require('../models/redis');
const { RedisEventEnum } = require('../utils/variables/enum');

const client = redis.createClient();

const getData = (user_id) => {
  return new Promise((resolve, reject) => {
    client.get(user_id, (err, userData) => {
      if (err) reject(err);
      else resolve(JSON.parse(userData));
    });
  });
};

const setData = (user_id, userData) => {
  return new Promise((resolve, reject) => {
    client.set(user_id, JSON.stringify(userData), (err) => {
      if (err) reject(err);
      else resolve('ok');
    });
  });
};

const redisSignup = async (user_id) => {
  await setData(user_id, redisUserModel);
};

const redisTrigger = async (user_id, redisEvent, data) => {
  let userData = await getData(user_id);
  userData = await redisProcess(userData, redisEvent, data);
  await setData(user_id, userData);
  return userData;
};

const redisProcess = (userData, redisEvent, data) => {
  switch (redisEvent) {
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

const countTotal = (userData) => {
  userData.badge = 0;
  for (let study_id in userData.count) {
    userData.badge += userData.count[study_id];
  }
  return userData;
};

module.exports = {
  redisSignup,
  redisTrigger,
};
