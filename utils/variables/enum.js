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
  embedded: 'embedded',
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
  study_update: 'study_update',
  study_delegate: 'study_delegate',
  study_delete: 'study_delete',

  apply_new: 'apply_new',
  apply_allow: 'apply_allow',
  apply_reject: 'apply_reject',

  notice_new: 'notice_new',
  notice_update: 'notice_update',
});

const MessageEnum = Object.freeze({
  study_update: '스터디 내용이 수정되었습니다 - test(방장제외 멤버)',
  study_delegate: '스터디 방장이 위임되었습니다 - test(방장제외 멤버)',
  study_delete: '스터디가 삭제되었습니다 - test(방장제외 멤버)',

  apply_new: '새로운 가입신청이 왔습니다 - test(방장)',
  apply_allow: '가입신청이 수락되었습니다 - test(당사자)',
  apply_reject: '가입신청이 거절되었습니다 - test(당사자)',

  notice_new: '공지사항이 생겼습니다 - test(방장제외 멤버)',
  notice_update: '공지사항이 수정되었습니다 - test(방장제외 멤버)',
});

const DBTableEnum = Object.freeze({
  address: 'address',
  alert: 'alert',
  apply: 'apply',
  category_count: 'category_count',
  participate: 'participate',
  project: 'project',
  study: 'study',
  user: 'user',
});

module.exports = {
  AuthEnum,
  ApplyEnum,
  CategoryEnum,
  DeviceEnum,
  PushEventEnum,
  MessageEnum,
  DBTableEnum,
};
