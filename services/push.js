const apn = require('apn');

const pushDao = require('../dao/push');
const { apn: options } = require('../configs/config');

const apnProvider = new apn.Provider(options);

const note = new apn.Notification({
  topic: process.env.APNS_bundleId,
  sound: 'default',
});

/*
  FCM 초기화
*/

const send = async (off_members, chat) => {
  note.pay = chat;
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.alert = chat.nickname === '__SYSTEM__' ? chat.message : chat.nickname.concat(' ', chat.message);

  const pushInfoRows = await pushDao.getPushInfo(off_members);

  for (row of pushInfoRows) {
    if (row.device === 'ios') {
      // note.badge = row.badge;
      note.badge = 50;
      await apnProvider.send(note, row.push_token).then((result) => {
        if (result.failed.length > 0) {
          // apns 에러
        }
        console.log('성공! result: ', result);
      });
    } else {
      // fcm push
    }
  }
};

module.exports = { send };
