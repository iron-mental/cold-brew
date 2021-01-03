const admin = require('firebase-admin');
const apn = require('apn');

const { apn: options } = require('../configs/config');
const { getChatPayload, getPushPayload } = require('../models/push');
const pushDao = require('../dao/push');
const { tokenDivision } = require('../utils/query');

const apnProvider = new apn.Provider(options);

const send = (apns_token, fcm_token, pushEvent, destination) => {
  const payload = getPushPayload(pushEvent, destination);
  if (apns_token.length > 0) {
    apnSender(apns_token, payload.apns);
  }
  if (fcm_token.length > 0) {
    fcmSender(fcm_token, payload.fcm);
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
      console.log('Error sending message:', err);
    });
};

const toHost = async (pushEvent, study_id) => {
  const tokenRows = await pushDao.getHostToken(study_id);
  const [apns_token, fcm_token] = tokenDivision(tokenRows);

  send(apns_token, fcm_token, pushEvent, { study_id });
};

const toUser = async (pushEvent, user_id) => {
  const tokenRows = await pushDao.getUserToken(user_id);
  const [apns_token, fcm_token] = tokenDivision(tokenRows);

  send(apns_token, fcm_token, pushEvent, { user_id });
};

const toStudy = async (pushEvent, study_id) => {
  const tokenRows = await pushDao.getMemberToken(study_id);
  const [apns_token, fcm_token] = tokenDivision(tokenRows);

  send(apns_token, fcm_token, pushEvent, { study_id });
};

const toStudyWithoutHost = async (pushEvent, study_id) => {
  const tokenRows = await pushDao.getMemberWithoutHostToken(study_id);
  const [apns_token, fcm_token] = tokenDivision(tokenRows);

  send(apns_token, fcm_token, pushEvent, { study_id });
};

const chat = async (study_id, chat) => {
  const tokenRows = await pushDao.getOffMemberToken(study_id, chat.nickname);
  const [apns_token, fcm_token] = tokenDivision(tokenRows);
  const chatPayload = getChatPayload(chat);

  if (apns_token.length > 0) {
    apnSender(apns_token, chatPayload.apns);
  }
  if (fcm_token.length > 0) {
    fcmSender(fcm_token, chatPayload.fcm);
  }
};

module.exports = {
  chat,
  toUser,
  toHost,
  toStudy,
  toStudyWithoutHost,
};
