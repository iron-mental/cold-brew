const apn = require('apn');

class Note {
  constructor(alert, payload) {
    this.topic = process.env.APNS_bundleId;
    this.sound = 'default';
    this.expiry = Math.floor(Date.now() / 1000) + 3600;
    this.alert = alert;
    this.payload = payload;
  }

  getChat = (chat) => {
    const alert = chat.nickname === '__SYSTEM__' ? chat.message : chat.nickname.concat(' ', chat.message);
    const payload = chat;
    const note = new Note(alert, payload);
    return new apn.Notification(note);
  };

  getAlert = (study_id, message) => {
    const alert = message;
    const payload = { study_id, message };
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
    this.data = {
      payload: payload,
    };
  }

  getChat = (chat) => {
    const body = chat.nickname === '__SYSTEM__' ? chat.message : chat.nickname.concat(' ', chat.message);
    const payload = JSON.stringify(chat);
    return new Payload(body, payload);
  };

  getAlert = (study_id, message) => {
    const body = message;
    const payload = JSON.stringify({ study_id, message });
    return new Payload(body, payload);
  };
}

const note = new Note();
const payload = new Payload();

module.exports = {
  note,
  payload,
};
