const apn = require('apn');
const admin = require('firebase-admin');

const pushDao = require('../dao/push');
const { tokenDivision } = require('../utils/query');
const { apn: options } = require('../configs/config');
const { note, payload } = require('../utils/variables/push_payload');

const apnProvider = new apn.Provider(options);

const apnSender = (apns_token, note) => {
  apnProvider.send(note, apns_token).then((result) => {
    if (result.failed.length > 0) {
      console.log('## APNs 에러: ', result.failed); // BadDeviceToken
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

const chat = async (study_id, chat) => {
  const memberRows = await pushDao.getOffMembers(study_id, chat.nickname);
  const [apns_token, fcm_token] = tokenDivision(memberRows);

  if (apns_token.length > 0) {
    apnSender(apns_token, note.getChat(chat));
  }
  if (fcm_token.length > 0) {
    fcmSender(fcm_token, payload.getChat(chat));
  }
};

const alert = async (study_id, message, nickname) => {
  const memberRows = await pushDao.getMembers(study_id, nickname);
  const [apns_token, fcm_token] = tokenDivision(memberRows);

  if (apns_token.length > 0) {
    apnSender(apns_token, note.getAlert(study_id, message));
  }
  if (fcm_token.length > 0) {
    fcmSender(fcm_token, payload.getAlert(study_id, message));
  }
};

module.exports = {
  chat,
  alert,
};
