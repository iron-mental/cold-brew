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
  email_verified: 'email_verified',

  // study
  study_update: 'study_update',
  study_delegate: 'study_delegate',

  study_participate: 'study_participate',
  study_withdraw: 'study_withdraw',

  // apply
  apply_new: 'apply_new',

  // notice
  notice_new: 'notice_new',
  notice_update: 'notice_update',

  //chat
  chat: 'chat',
});

module.exports = {
  AuthEnum,
  ApplyEnum,
  CategoryEnum,
  DeviceEnum,
  PushEventEnum,
};
