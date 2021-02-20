const admin = require('firebase-admin');
const apn = require('apn');

const pushDao = require('../dao/push');
const studyDao = require('../dao/study');
const { apn: options } = require('../configs/config');
const { getChatPayload, getPushPayload } = require('../models/push');
const { customError } = require('../utils/errors/custom');
const { RedisEventEnum, PushEventEnum, DeviceEnum } = require('../utils/variables/enum');
const { redisTrigger } = require('./redis');

const apnProvider = new apn.Provider(options);

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

// // 여기서부터 묶을거
// const toHost = async (pushEvent, study_id) => {
//   const tokenRows = await pushDao.getHostToken(study_id);
//   send(tokenRows, pushEvent, study_id);
// };

// const toUser = async (pushEvent, study_id, user_id) => {
//   const tokenRows = await pushDao.getUserToken(user_id);
//   send(tokenRows, pushEvent, study_id);
// };

// const toStudyWithoutHost = async (pushEvent, study_id) => {
//   const tokenRows = await pushDao.getMemberWithoutHostToken(study_id);
//   send(tokenRows, pushEvent, study_id, study_title);
// };

// const toStudyWithoutUser = async (pushEvent, study_id, user_id) => {
//   const tokenRows = await pushDao.getMemberWithoutUserToken(study_id, user_id);
//   send(tokenRows, pushEvent, study_id);
// };

// //////////////

const push = async (pushEvent, study_id, user_id) => {
  const studyRows = Boolean(pushEvent === PushEventEnum.study_delete)
    ? (studyRows = await pushDao.getStudyTitle(study_id))
    : (studyRows = await studyDao.getStudy(study_id));
  const study_title = studyRows[0].title;

  const tokenRows = '';
  const target = {
    toHost: [PushEventEnum.apply_new],
    toUser: [PushEventEnum.push_test, PushEventEnum.study_delete, PushEventEnum.apply_reject],
    chat: [PushEventEnum.chat, PushEventEnum.apply_allow],
    toStudyWithoutHost: [PushEventEnum.study_update, PushEventEnum.notice_new, PushEventEnum.notice_update],
    toStudyWithoutUser: [PushEventEnum.study_delegate],
  };

  if (target.toHost.includes(pushEvent)) {
    tokenRows = await pushDao.getHostToken(study_id);
  } else if (target.toUser.includes(pushEvent)) {
    tokenRows = await pushDao.getUserToken(user_id);
  } else if (target.toStudyWithoutHost.includes(pushEvent)) {
    tokenRows = await pushDao.getMemberWithoutHostToken(study_id);
  } else if (target.toStudyWithoutUser.includes(pushEvent)) {
    tokenRows = await pushDao.getMemberWithoutUserToken(study_id, user_id);
  } else if (target.toStudyWithoutUser.includes(pushEvent)) {
    tokenRows = await pushDao.getOffMemberToken(study_id, chat.nickname);
  }
  console.log('tokenRows, pushEvent, study_id, study_title: ', tokenRows, pushEvent, study_id, study_title);
  send(tokenRows, pushEvent, study_id, study_title);
};

//////////

const send = async (tokenRows, pushEvent, study_id, study_title) => {
  const { apnsPayload, fcmPayload } = getPushPayload(pushEvent, study_id);
  const insertData = {
    user_id: '',
    study_id,
    study_title,
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
  push,
  // toUser,
  // toHost,
  // toStudy,
  // toStudyWithoutHost,
  // toStudyWithoutUser,
};
