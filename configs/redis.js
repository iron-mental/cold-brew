const redis = require('redis');
const client = redis.createClient();

module.exports = () => {
  client.on('error', (err) => {
    throw new Error(err);
  });
};
