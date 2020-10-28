require('dotenv').config();

const mongoose = require('mongoose');

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

// 지정 시간이후 채팅내용 조회 테스트
const Chat = require('../models/chat');

Chat.find({ _id: { $gt: objectIdWithTimestamp('2020/10/28 18:44:20') } }, (err, docs) => {
  console.log('docs: ', docs);
});

mongoose.connection.on('err', (err) => {
  console.error('몽고디비 연결 에러', err);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

function objectIdWithTimestamp(timestamp) {
  if (typeof timestamp == 'string') {
    timestamp = new Date(timestamp);
  }
  const hexSeconds = Math.floor(timestamp / 1000).toString(16);
  return hexSeconds + '0000000000000000';
}
