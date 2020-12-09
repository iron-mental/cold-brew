const apn = require('apn');
const admin = require('firebase-admin');

const pushDao = require('../dao/push');
const { apn: options } = require('../configs/config');

const apnProvider = new apn.Provider(options);

const send = (apns_token, fcm_token, chat) => {
  apnProvider.send(getNote(chat), apns_token).then((result) => {
    if (result.failed.length > 0) {
      console.log('## APNs 에러: ', result.failed); // BadDeviceToken
    }
  });

  admin
    .messaging()
    .sendMulticast({
      notification: {
        title: '터미널 푸시',
        body: chat.nickname.concat(' ', chat.message),
      },
      data: { chat: JSON.stringify(chat) },
      tokens: fcm_token,
    })
    .then((response) => {
      console.log(response.successCount + ' messages were sent successfully');
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
};

const division = (memberRows) => {
  const [fcm_token, apns_token] = [[], []];

  memberRows.forEach((v) => {
    if (v.device === 'ios') {
      apns_token.push(v.push_token);
    } else {
      fcm_token.push(v.push_token);
    }
  });

  return [apns_token, fcm_token];
};

const getNote = (chat, badge) => {
  return new apn.Notification({
    topic: process.env.APNS_bundleId,
    sound: 'default',
    badge: 50,
    // badge,
    pay: chat,
    expiry: Math.floor(Date.now() / 1000) + 3600,
    alert: chat.nickname === '__SYSTEM__' ? chat.message : chat.nickname.concat(' ', chat.message),
  });
};

const offMembers = async (study_id, nickname, userChat) => {
  const memberRows = await pushDao.getOffMembers(study_id, nickname);
  const [apns_token, fcm_token] = division(memberRows);
  send(apns_token, fcm_token, userChat);
};

module.exports = {
  offMembers,
};
