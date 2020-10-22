require('dotenv').config();

const mongoose = require('mongoose');

module.exports = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }
  const connect = () => {
    const host = process.env.MONGO_host;
    const option = process.env.MONGO_option;

    mongoose.connect(
      host.concat(option),
      {
        dbName: 'chat',
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.log('몽고디비 최초 연결 에러', err);
        }
      }
    );
  };
  connect();
  mongoose.connection.on('err', (err) => {
    console.error('몽고디비 연결 에러', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
  });
};
