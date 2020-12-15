const apn = require('apn');

class Note {
  constructor(alert, payload) {
    this.topic = process.env.APNS_bundleId;
    this.sound = 'default';
    this.expiry = Math.floor(Date.now() / 1000) + 100;
    this.alert = alert;
    this.payload = payload;
  }

  getChat = (chat) => {
    const alert = chat.nickname === '__SYSTEM__' ? chat.message : chat.nickname.concat(' ', chat.message);
    const payload = chat;
    const note = new Note(alert, payload);
    return new apn.Notification(note);
  };

  // getAlert = (study_id, message) => {
  //   const alert = message;
  //   const payload = { study_id, message };
  //   const note = new Note(alert, payload);
  //   return new apn.Notification(note);
  // };

  // getSend = (user_id, message, data) => {
  //   const alert = message;
  //   const payload = { user_id, message, data };
  //   const note = new Note(alert, payload);
  //   return new apn.Notification(note);
  // };

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

  getSend = (user_id, message, data) => {
    const body = message;
    const payload = JSON.stringify({ user_id, message, data });
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

const MessageEnum = Object.freeze({
  email_verified: '이메일 인증 - 사일런트 적용예정',

  // study
  study_update: '스터디 내용이 수정되었습니다',
  study_delegate: '스터디 방장이 위임되었습니다',

  // apply
  apply_new: '새로운 가입신청이 왔습니다 - test(방장)',

  // notice
  notice_new: '공지사항이 생겼습니다 - test(방장제외 멤버)',
  notice_update: '공지사항이 수정되었습니다 - test(방장제외 멤버)',
});
