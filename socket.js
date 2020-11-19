const jwt = require('jsonwebtoken');
const socketio = require('socket.io');

const { categoryEnum } = require('./utils/variables/enums');

const User = require('./models/user');
const Room = require('./models/room');
const Chat = require('./models/chat');

const getHexTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000).toString(16) + '0000000000000000';
};

const jwtVerify = (socket, next) => {
  if (socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_secret, (err, decoded) => {
      if (err) {
        next(err); // 인증에러
      }
      socket.decoded = decoded;
      next(); // 성공
    });
  } else {
    next('not exist token'); // 토큰 없으면 나타나는 에러
  }
};

const serverEvent = (socket) => {
  User.findOneAndUpdate(
    { user_id: socket.decoded.id },
    { socket_id: socket.decoded.id, nickname: socket.decoded.nickname },
    { upsert: true, new: true }
  ).then(() => {
    socket.join(socket.handshake.query.room);
    Room.updateMany({ room_number: socket.handshake.query.room }, { $pull: { off_members: socket.decoded.id } });
  });

  socket.on('message', (message) => {
    // msgData 중, room_number, message, data는 클라에게 받을 것
    // user_id, nickname은 내가 알아서 채우기
    const msgData = {
      room_number: 10,
      user_id: socket.decoded.id,
      nickname: socket.decoded.nickname,
      message: message,
      date: Math.floor(new Date().getTime() / 1000),
    };

    // io.of(socket.nsp.name).to(msgData.room_number).emit('message', msgData);
    io.of(socket.nsp.name).to(msgData.room_number).emit('message', JSON.stringify(msgData));

    Chat.create(msgData);
  });

  // disconnected_at 명시 -> 추후 데이터 요청을 위해서
  // join했던 Room - off_members에 추가
  socket.on('disconnect', () => {
    User.findOneAndUpdate({ user_id: socket.decoded.id }, { disconnected_at: getHexTimestamp() }).then((row) => {
      Room.updateOne({ room_number: row.room }, { $addToSet: { off_members: socket.decoded.id } });
    });
  });
};

const listen = (server) => {
  // 소켓서버 실행
  io = socketio.listen(server);

  // category nsp 생성
  Object.keys(categoryEnum).forEach((v, i) => {
    io.of('/' + v)
      .use(jwtVerify)
      .on('connection', serverEvent);
  });

  // On Join  [[ -> chat말고 mvc에서 ]]
  // [처음 스터디를 생성 했을 때 발생]
  // 1.MONGO-Room create { room_number: study_id, room_name: study_title, members: user_id } [[ -> chat말고 mvc에서 ]]

  // [방장이 신청을 allow 했을 때 발생]
  // 1. MONGO-Room UpdateOne({ room_number: study_id }, { members: user_id }).exec(); [[ -> chat말고 mvc에서 ]]
  // 2. MONGO-User UpdateOne({ user_id: socket.user.id }) [[ -> chat말고 mvc에서 ]]
  // 3. 참여 메시지 발생
  // io.of(nsp).to(room_number).emit('system-join', `${nickname}님이 스터디에 참여했습니다`); [[ -> chat말고 mvc에서 트리거]]
  // Chat.create({
  //   room_number: room_number,
  //   user_id: 'system',
  //   nickname: 'system',
  //   message: `${socket.user.nickname}님이 입장했습니다`,
  //   date: Math.floor(new Date().getTime() / 1000),
  // });

  // On Leave  [[ -> chat말고 mvc에서 ]]
  // [스터디원이 탈퇴했을 때 발생]
  // 1. MONGO-Room UpdateOne({ room_number: study_id }, {$pull: { members: user_id, off_members: user_id }}).exec(); [[ -> chat말고 mvc에서 ]]
  // 2. MONGO-User UpdateOne({ user_id: socket.user.id }, {$pull: { rooms: study_id}}).exec(); [[ -> chat말고 mvc에서 ]]
  // 3. 탈퇴 메시지 발생
  // io.of(nsp).to(room_number).emit('system-leave', `${nickname}님이 스터디를 탈퇴했습니다`); [[ -> chat말고 mvc에서 트리거]]

  // 클라이언트가 스터디 생성 or 스터디 참여 시 발생시키는 이벤트
  socket.on('join-test', (joinData) => {
    // joinData = { room_number, room_name }
    console.log('on 조인');
    socket.join(joinData.room_number); // join
    console.log('조인한 리스트: ', socket.rooms);

    terminal.to(joinData.room_number).emit('system-join', `${socket.nickname}님이 입장했습니다`);

    Room.updateOne({ room_number: joinData.room_number }, { $pull: { members: { user_id: socket.user_id } } }, (err, docs) => {
      Room.updateOne({ room_number: joinData.room_number }, { $push: { members: { user_id: socket.user_id } } }, (err, docs) => {
        // 쿼리에 걸린게 없을 때
        if (docs.nModified === 0) {
          joinData.members = [{ user_id: socket.user_id }];
          Room.create(joinData);
        }
      });
    });
    Chat.create({
      room_number: joinData.room_number,
      user_id: 'system',
      nickname: 'system-join',
      message: `${socket.nickname}님이 입장했습니다`,
      date: new Date().toString(),
    });
  });

  // // test command
  // socket.on('chat message', (msg) => {
  //   const temp = msg.split('/');
  //   console.log('temp: ', temp);
  //   const command = temp[0];
  //   const contents1 = temp[1];
  //   const contents2 = temp[2];
  //   console.log('input: ', command, contents1, contents2);
  //   if (command === 'message') {
  //     socket.nickname = 'testNickname';
  //     terminal.to(temp[1]).emit('message', socket.nickname.concat(': ', temp[2]));
  //   } else if (command === 'join') {
  //     socket.join([temp[1], temp[2]]); // join
  //     terminal.to(temp[1]).emit('message', `${socket.id}님이 입장했습니다`); // 해당 룸에만 메시지 전달
  //     terminal.to(temp[2]).emit('message', `${socket.id}님이 입장했습니다`); // 해당 룸에만 메시지 전달
  //     const tt = socket.adapter.rooms;
  //     console.log('tt: ', tt);
  //     // console.log('tt: ', tt[contents].sockets);
  //   } else if (command === 'leave') {
  //     socket.leave(contents); // leave
  //     terminal.to(contents).emit('message', `${socket.id}님이 퇴장했습니다`); // 해당 룸에만 메시지 전달
  //   } else if (command === 'signup') {
  //     // 첨에 접속할때 클라이언트는 user_id, nickname전달, 서버는 socket.nickname을 변경하고 DB에 socket.id와 user_id를 매핑하여 저장한다
  //     console.log('data: ', contents);
  //     console.log('datatype: ', typeof contents);
  //     data = JSON.parse(contents);
  //     socket.nickname = data.nickname;
  //   } else if (command === 'close') {
  //     socket.disconnect(contents);
  //   }
  // });

  return io;
};

module.exports = { listen };
