const authEnum = Object.freeze({
  host: 'host',
  member: 'member',
  applier: 'applier',
  reject: 'reject',
  none: 'none',
});

const categoryEnum = Object.freeze({
  ai: 'ai',
  etc: 'etc',
  web: 'web',
  ios: 'ios',
  arvr: 'arvr',
  android: 'android',
  backend: 'backend',
  bigdata: 'bigdata',
  embeded: 'embeded',
  security: 'security',
  language: 'language',
  blockchain: 'blockchain',
  systemNetwork: 'systemNetwork',
});

module.exports = {
  authEnum,
  categoryEnum,
};
