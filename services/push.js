const pushDao = require('../dao/push');
const { tokenDivision } = require('../utils/query');

const { note, payload } = require('../models/push_payload');
const { DeviceEnum } = require('../utils/variables/enum');

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

// const send = async (user_id, message, data) => {
//   const tokenRows = await pushDao.getPushToken(user_id);
//   const { device, push_token } = tokenRows[0];

//   if (device === DeviceEnum.ios) {
//     apnSender([push_token], note.getSend(user_id, message, data));
//   } else {
//     fcmSender([push_token], payload.getSend(user_id, message, data));
//   }
// };

const send = async (pushEvent, destination, data) => {
  const tokenRows = await pushDao.getPushToken(user_id);
  const { device, push_token } = tokenRows[0];

  if (device === DeviceEnum.ios) {
    apnSender([push_token], note.getSend(user_id, message, data));
  } else {
    fcmSender([push_token], payload.getSend(user_id, message, data));
  }
};

/////////////////////////////////////////////////////////////////
const toHost = async (pushEvent, study_id) => {
  const [{ device, push_token }] = await pushDao.getHostToken(study_id);
  if (device === DeviceEnum.ios) {
    apnSender([push_token], note.get(pushEvent, { study_id }));
  } else {
    fcmSender([push_token], payload.get(pushEvent, { study_id }));
  }
};

const toUser = async (pushEvent, user_id) => {
  const [{ device, push_token }] = await pushDao.getUserToken(user_id);
  if (device === DeviceEnum.ios) {
    apnSender([push_token], note.get(pushEvent, { user_id }));
  } else {
    fcmSender([push_token], payload.get(pushEvent, { user_id }));
  }
};

const chat = async (study_id, chat) => {
  console.log('## push S: study_id, chat: ', study_id, chat);
  const memberRows = await pushDao.getOffMembers(study_id, chat.nickname);
  const [apns_token, fcm_token] = tokenDivision(memberRows);

  if (apns_token.length > 0) {
    apnSender(apns_token, note.getChat(chat));
  }
  if (fcm_token.length > 0) {
    fcmSender(fcm_token, payload.getChat(chat));
  }
};

// const toOffMembers = async (pushEvent, study_id, chat) => {
//   const memberRows = await pushDao.getOffMembers(study_id, chat.nickname);
//   const [apns_token, fcm_token] = tokenDivision(memberRows);

//   if (apns_token.length > 0) {
//     apnSender(apns_token, note.getChat(chat));
//   }
//   if (fcm_token.length > 0) {
//     fcmSender(fcm_token, payload.getChat(chat));
//   }
// };

module.exports = {
  chat,
  alert,
  send,
  toHost,
  toUser,
};

//////////////// util로 이동예정 ///////////////////
const apn = require('apn');
const admin = require('firebase-admin');
const { apn: options } = require('../configs/config');

const apnProvider = new apn.Provider(options);

const apnSender = (apns_token, note) => {
  console.log('note: ', note);
  apnProvider
    .send(note, apns_token)
    .then((result) => {
      if (result.failed.length > 0) {
        console.log('## APNs 에러: ', result.failed); // BadDeviceToken
      } else {
        console.log('## APNs: ', result);
      }
    })
    .catch((err) => {
      console.log('err: ', err);
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
