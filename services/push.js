const apn = require('apn');

const pushDao = require('../dao/push');
const { apn: options } = require('../configs/config');

const apnProvider = new apn.Provider(options);

/*
  FCM 초기화
*/
const send = async (userList, chat) => {
  const pushInfoRows = await pushDao.getPushInfo(userList);

  for (row of pushInfoRows) {
    if (row.device === 'ios') {
      apnProvider.send(getNote(chat, row.badge), row.push_token).then((result) => {
        if (result.failed.length > 0) {
          // apns 에러
        }
        console.log('결과: ', result);
      });
    } else {
      // fcm push
    }
  }
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

module.exports = { send };
