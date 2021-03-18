const redis = require('redis');
const getRedisUser = require('../models/redis');
const { RedisEventEnum } = require('../utils/variables/enum');

const client = redis.createClient();

const redisSignup = async (user_id) => {
  await setData(user_id, getRedisUser());
};

const redisWithdraw = async (user_id) => {
  await client.DEL(user_id, (err, tmp) => {});
};

const getUser = async (user_id) => {
  return await getData(user_id);
};

const redisTrigger = async (user_id, redisEvent, data) => {
  let userData = await getData(user_id);

  switch (redisEvent) {
    case RedisEventEnum.push_token:
      userData.push = data;
      break;

    case RedisEventEnum.alert:
      userData.alert[data.study_id] = userData.alert[data.study_id] === undefined ? 1 : userData.alert[data.study_id] + 1;
      break;

    case RedisEventEnum.alert_read:
      userData.alert[data.study_id] = userData.alert[data.study_id] <= 0 ? 0 : userData.alert[data.study_id] - 1;
      break;

    case RedisEventEnum.chat:
      userData.chat[data.study_id] += 1;
      break;

    case RedisEventEnum.chat_read:
      userData.chat[data.study_id] = 0;
      break;

    case RedisEventEnum.reset:
      userData = JSON.parse(JSON.stringify(getRedisUser()));
      for (let study of data) {
        userData.chat[study.id] = 0;
        userData.alert[study.id] = 0;
      }
      break;

    default:
      userData.chat[data.study_id] = 0;
      userData.alert[data.study_id] = 0;
      break;
  }

  userData = await totalCount(userData);
  await setData(user_id, userData);

  return userData;
};

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

const totalCount = async (userData) => {
  userData.alert.total = 0;
  userData.chat.total = 0;

  for (let study_id in userData.alert) {
    if (study_id !== 'total') userData.alert.total += userData.alert[study_id];
  }

  for (let study_id in userData.chat) {
    if (study_id !== 'total') userData.chat.total += userData.chat[study_id];
  }

  userData.badge = userData.alert.total + userData.chat.total;
  return userData;
};

module.exports = {
  redisSignup,
  redisTrigger,
  getUser,
  redisWithdraw,
};
