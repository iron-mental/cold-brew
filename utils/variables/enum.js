const AuthEnum = Object.freeze({
  host: 'host',
  member: 'member',
  applier: 'applier',
  reject: 'reject',
  none: 'none',
});

const ApplyEnum = Object.freeze({
  apply: 'apply',
  allow: 'allow',
  reject: 'reject',
});

const CategoryEnum = Object.freeze({
  ai: 'ai',
  etc: 'etc',
  web: 'web',
  ios: 'ios',
  arvr: 'arvr',
  server: 'server',
  android: 'android',
  backend: 'backend',
  bigdata: 'bigdata',
  embeded: 'embeded',
  security: 'security',
  language: 'language',
  blockchain: 'blockchain',
  systemNetwork: 'systemNetwork',
});

const DeviceEnum = Object.freeze({
  ios: 'ios',
  android: 'android',
});

const PushEventEnum = Object.freeze({
  chat: 'chat',
  apply_new: 'apply_new',
  email_verified: 'email_verified',
  notice_new: 'notice_new',
  notice_update: 'notice_update',
  study_update: 'study_update',
  study_delegate: 'study_delegate',
});

const MessageEnum = Object.freeze({
  apply_new: '새로운 가입신청이 왔습니다 - test(방장)',
  email_verified: '이메일 인증 - 사일런트 적용예정',
  notice_new: '공지사항이 생겼습니다 - test(방장제외 멤버)',
  notice_update: '공지사항이 수정되었습니다 - test(방장제외 멤버)',
  study_update: '스터디 내용이 수정되었습니다 - test(방장제외 멤버)',
  study_delegate: '스터디 방장이 위임되었습니다 - test(방장제외 멤버)',
});

module.exports = {
  AuthEnum,
  ApplyEnum,
  CategoryEnum,
  DeviceEnum,
  PushEventEnum,
  MessageEnum,
};
