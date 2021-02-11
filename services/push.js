const admin = require('firebase-admin');
const apn = require('apn');

const { apn: options } = require('../configs/config');
const { getChatPayload, getPushPayload } = require('../models/push');
const pushDao = require('../dao/push');
const { customError } = require('../utils/errors/custom');
const { RedisEventEnum, PushEventEnum, DeviceEnum } = require('../utils/variables/enum');
const { redisTrigger } = require('./redis');

const apnProvider = new apn.Provider(options);

const toHost = async (pushEvent, study_id) => {
  const tokenRows = await pushDao.getHostToken(study_id);
  send(tokenRows, pushEvent, study_id);
};

const toUser = async (pushEvent, user_id) => {
  const tokenRows = await pushDao.getUserToken(user_id);
  send(tokenRows, pushEvent, user_id);
};

const toStudy = async (pushEvent, study_id) => {
  const tokenRows = await pushDao.getMemberToken(study_id);
  send(tokenRows, pushEvent, study_id);
};

const toStudyWithoutHost = async (pushEvent, study_id) => {
  const tokenRows = await pushDao.getMemberWithoutHostToken(study_id);
  send(tokenRows, pushEvent, study_id);
};

const toStudyWithoutUser = async (pushEvent, study_id, user_id) => {
  const tokenRows = await pushDao.getMemberWithoutUserToken(study_id, user_id);
  send(tokenRows, pushEvent, study_id);
};

const chat = async (study_id, chat) => {
  const { apnsPayload, fcmPayload } = getChatPayload(chat);
  let redisData = '';
  const tokenRows = await pushDao.getOffMemberToken(study_id, chat.nickname);

  for (let row of tokenRows) {
    redisData = await redisTrigger(row.id, RedisEventEnum.chat, { study_id });

    if (row.device === DeviceEnum.ios) {
      apnsPayload.badge = redisData.badge;
      apnSender(row.push_token, apnsPayload);
    } else {
      fcmPayload.notification.badge = redisData.badge;
      fcmPayload.tokens = row.push_token;
      fcmSender(fcmPayload);
    }
  }
};

const send = async (tokenRows, pushEvent, study_id) => {
  const { apnsPayload, fcmPayload } = getPushPayload(pushEvent, study_id);
  const insertData = {
    user_id: '',
    study_id,
    pushEvent,
    message: apnsPayload.aps.alert,
  };
  let redisData = '';

  // Alert Insert to DB
  for (let row of tokenRows) {
    const alertRows = await pushDao.insertAlert({ ...insertData, user_id: row.id });
    redisData = await redisTrigger(row.id, RedisEventEnum.alert, { study_id });

    if (row.device === DeviceEnum.ios) {
      apnsPayload.badge = redisData.badge;
      apnsPayload.payload.alert_id = alertRows.insertId;
      apnSender(row.push_token, apnsPayload);
    } else {
      fcmPayload.payload.alert_id = alertRows.insertId;
      fcmPayload.notification.badge = redisData.badge;
      fcmPayload.tokens = row.push_token;
      fcmSender({ ...fcmPayload, payload: JSON.stringify(fcmPayload.payload) });
    }
  }
};

const apnSender = (apns_token, note) => {
  apnProvider.send(note, apns_token).then((result) => {
    if (result.failed.length > 0) {
      console.log('## APNs 에러: ', result.failed); // BadDeviceToken
    } else {
      console.log('## APNs: ', result);
    }
  });
};

const fcmSender = (payload) => {
  try {
    admin
      .messaging()
      .sendMulticast(payload)
      .catch((err) => {
        console.log('## FCM 에러: ', err);
      });
  } catch (err) {
    console.log('## FCM 에러: ', err);
  }
};

module.exports = {
  chat,
  toUser,
  toHost,
  toStudy,
  toStudyWithoutHost,
  toStudyWithoutUser,
};
