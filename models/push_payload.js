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

  getChat = (chat) => {
    chat.pushEvent = PushEventEnum.chat;
    const alert = chat.nickname === '__SYSTEM__' ? chat.message : chat.nickname.concat(' ', chat.message);
    const payload = chat;
    const note = new Note(alert, payload);
    return new apn.Notification(note);
  };

  get = (pushEvent, destination) => {
    const alert = MessageEnum[pushEvent];
    const payload = {
      pushEvent,
      destination,
    };
    const note = new Note(alert, payload);
    return new apn.Notification(note);
  };
}

class Payload {
  constructor(body, payload) {
    this.notification = {
      title: '터미널 title',
      body: body,
    };
    this.payload = payload;
  }

  getChat = (chat) => {
    chat.pushEvent = PushEventEnum.chat;
    const body = chat.nickname === '__SYSTEM__' ? chat.message : chat.nickname.concat(' ', chat.message);
    const payload = JSON.stringify(chat);
    return new Payload(body, payload);
  };

  get = (pushEvent, destination) => {
    const body = MessageEnum[pushEvent];
    const payload = JSON.stringify({
      pushEvent,
      destination,
    });
    return new Payload(body, payload);
  };
}

const note = new Note();
const payload = new Payload();

module.exports = {
  note,
  payload,
};
