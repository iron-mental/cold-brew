class RedisUser {
  constructor() {
    this.push = {
      push_token: '',
      device: '',
    };
    this.badge = 0;
    this.chat = { total: 0 };
    this.alert = { total: 0 };
  }
}

const getRedisUser = () => {
  return new RedisUser();
};

module.exports = getRedisUser;
