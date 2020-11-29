require('dotenv').config();
const apn = require('apn');

const options = {
  token: {
    key: process.env.APNS_key,
    keyId: process.env.APNS_keyId,
    teamId: process.env.APNS_teamId,
  },
  production: false, // NODE_ENV 변경되면 같이 변경
};
const apnProvider = new apn.Provider(options);

let pushDeviceToken = ['token1', 'token2'];

let note = new apn.Notification();

note.expiry = Math.floor(Date.now() / 1000) + 3600;
note.badge = 50;
note.sound = 'default';
note.alert = 'Hello world';
note.pay = { messageFrom: 'Terminal Server' };
note.topic = process.env.APNS_bundleId;

apnProvider.send(note, pushDeviceToken).then((result) => {
  console.log('## result: ', result);
});
