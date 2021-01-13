const apn = require('apn');
const { MessageEnum, PushEventEnum } = require('../utils/variables/enum');

class Note {
  constructor(alert, payload) {
    this.topic = process.env.APNS_bundleId;
    this.sound = 'default';
    this.expiry = Math.floor(Date.now() / 1000) + 100;
    this.alert = alert;
    this.payload = payload;
  }
}

class Payload {
  constructor(alert, payload) {
    this.notification = {
      title: '터미널 title',
      body: alert,
    };
    this.payload = payload;
  }
}

getChatPayload = (chat) => {
  chat.pushEvent = PushEventEnum.chat;
  const alert = chat.nickname === '__SYSTEM__' ? chat.message : chat.nickname.concat(' ', chat.message);
  const note = new Note(alert, chat);

  return {
    apns: new apn.Notification(note),
    fcm: new Payload(alert, JSON.stringify(chat)),
  };
};

getPushPayload = (pushEvent, study_id) => {
  const alert = MessageEnum[pushEvent];
  const payload = {
    pushEvent,
    study_id,
  };
  const note = new Note(alert, payload);

  return {
    apns: new apn.Notification(note),
    fcm: new Payload(alert, JSON.stringify(payload)),
  };
};

module.exports = {
  getChatPayload,
  getPushPayload,
};
