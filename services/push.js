const admin = require('firebase-admin');
const apn = require('apn');

const { apn: options } = require('../configs/config');
const { getChatPayload, getPushPayload } = require('../models/push');
const pushDao = require('../dao/push');
const { tokenDivision } = require('../utils/query');
const { customError } = require('../utils/errors/custom');
const { RedisEventEnum, PushEventEnum } = require('../utils/variables/enum');
const { redisTrigger, getUser } = require('./redis');

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
  const tokenRows = await pushDao.getOffMemberToken(study_id, chat.nickname);

  for (let row of tokenRows) {
    let redisData = await redisTrigger(row.id, RedisEventEnum.chat, { study_id });
    row.badge = redisData.badge;
  }

  const [userList, apns_token, fcm_token] = tokenDivision(tokenRows);
  const chatPayload = getChatPayload(chat);

  // sender를 하나씩으로 변경
  for (let token of apns_token) {
    chatPayload.apns.badge = token[1];
    apnSender(token[0], chatPayload.apns);
  }

  for (let token in fcm_token) {
    chatPayload.fcm.notification.badge = token[1];
    fcmSender(token[0], chatPayload.fcm);
  }
};

const send = async (tokenRows, pushEvent, study_id) => {
  if (pushEvent === PushEventEnum.push_test) {
    for (let row of tokenRows) {
      let redisData = await getUser(row.id);
      row.badge = redisData.badge;
    }
  } else {
    for (let row of tokenRows) {
      let redisData = await redisTrigger(row.id, RedisEventEnum.alert, { study_id });
      row.badge = redisData.badge;
    }
  }

  const [userList, apns_token, fcm_token] = tokenDivision(tokenRows);
  let payload = getPushPayload(pushEvent, study_id);

  if (userList.length > 0) {
    const alertInsertData = userList.map((user_id) => {
      return {
        user_id,
        study_id,
        pushEvent,
        message: payload.apns.aps.alert,
      };
    });

    const insertRows = await pushDao.insertAlert(alertInsertData);
    if (!insertRows.affectedRows) {
      throw customError(500, 'Alert Insert Error(알람 적재 에러)');
    }
  }
  // sender를 하나씩으로 변경
  for (let token of apns_token) {
    payload.apns.badge = token[1];
    apnSender(token[0], payload.apns);
  }

  for (let token in fcm_token) {
    payload.fcm.notification.badge = token[1];
    fcmSender(token[0], payload.fcm);
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

const fcmSender = (fcm_token, payload) => {
  payload.tokens = fcm_token;
  admin
    .messaging()
    .sendMulticast(payload)
    .catch((err) => {
      console.log('## FCM 에러: ', err);
    });
};

module.exports = {
  chat,
  toUser,
  toHost,
  toStudy,
  toStudyWithoutHost,
  toStudyWithoutUser,
};
