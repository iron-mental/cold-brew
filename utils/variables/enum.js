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

module.exports = {
  AuthEnum,
  ApplyEnum,
  CategoryEnum,
  DeviceEnum,
};
