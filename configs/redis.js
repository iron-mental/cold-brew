const redis = require('redis');
const client = redis.createClient();

module.exports = () => {
  client.on('error', (err) => {
    console.log('### 레디스에러: ', err);
  });
};
