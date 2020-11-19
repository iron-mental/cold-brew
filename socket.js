const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const Room = require('./models/room');
const Chat = require('./models/chat');

const listen = (server) => {
  io = socketio.listen(server); // 소켓서버 실행

  terminal = io.of('terminal'); // 네임스페이스 지정 => 동적으로 수정 예정

  terminal.use((socket, next) => {
    if (socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, process.env.JWT_secret, (err, decoded) => {
        if (err) {
          next(err); // 인증에러
        }
        socket.user = decoded;
        next(); // 성공
      });
    } else {
      next('not exist token'); // 토큰 없으면 나타나는 에러
    }
  });

  // 유저 접속 시 트리거 -> 앱 부팅 시

  terminal.on('connection', (socket) => {
    User.findOneAndUpdate(
      { user_id: socket.user.id },
      { socket_id: socket.id, nickname: socket.user.nickname },
      { upsert: true, new: true }
    ).then((row) => {
      socket.join(row.rooms);
    });

    socket.on('disconnect', () => {
      const hexTimestamp = Math.floor(new Date().getTime() / 1000).toString(16) + '0000000000000000';
      User.findOneAndUpdate({ user_id: socket.user.id }, { disconnected_at: hexTimestamp }).then((row) => {
        Room.updateMany({ room_number: { $in: row.rooms } }, { $addToSet: { off_members: socket.user.id } });
      });
    });

    socket.on('chat', (chatData) => {
      // chatData = { room, msg }
      terminal.to(chatData.room).emit('message', `${socket.nickname}: ${chatData.msg}`); // 해당 룸에만 메시지 전달

      Chat.create({
        room_number: chatData.room,
        user_id: socket.user_id,
        nickname: socket.nickname,
        message: chatData.msg,
        date: new Date().toString(),
      });
    });

    // On Join  [[ -> chat말고 mvc에서 ]]
    // [처음 스터디를 생성 했을 때 발생]
    // 1.MONGO-Room create { room_number: study_id, room_name: study_title, members: user_id } [[ -> chat말고 mvc에서 ]]

    // [방장이 신청을 allow 했을 때 발생]
    // 1. MONGO-Room UpdateOne({ room_number: study_id }, { members: user_id }).exec(); [[ -> chat말고 mvc에서 ]]
    // 2. MONGO-User UpdateOne({ user_id: socket.user.id }) [[ -> chat말고 mvc에서 ]]
    // 3. 참여 메시지 발생
    // terminal.to(room_number).emit('system-join', `${socket.user.nickname}님이 입장했습니다`); [[ -> chat말고 mvc에서 트리거]]
    // Chat.create({
    //   room_number: room_number,
    //   user_id: 'system',
    //   nickname: 'system',
    //   message: `${socket.user.nickname}님이 입장했습니다`,
    //   date: Math.floor(new Date().getTime() / 1000),
    // });

    // On Leave  [[ -> chat말고 mvc에서 ]]

    // [스터디원이 탈퇴했을 때 발생]
    // 1. MONGO-Room UpdateOne({ room_number: study_id }, { members: user_id }).exec(); [[ -> chat말고 mvc에서 ]]
    // 2. MONGO-User UpdateOne({ user_id: socket.user.id }) [[ -> chat말고 mvc에서 ]]
    // 3. 참여 메시지 발생
    // terminal.to(room_number).emit('system-join', `${socket.nickname}님이 참가했습니다`); [[ -> chat말고 mvc에서 트리거]]

    // test 메뉴얼 출력
    guideMessage(terminal, socket.id);

    // // 연결되면 무조건 한번 날려야함 (레거시)
    // socket.on('signup', (userData) => {
    //   // userData = {user_id, nickname} -> 구조분해 할당 테스트 후 적용
    //   socket.user_id = userData.user_id;
    //   socket.nickname = userData.nickname;

    //   userData.socket_id = socket.id;
    //   User.updateOne({ user_id: userData.user_id }, userData, { upsert: true }).exec();
    // });

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

    // 클라이언트가 스터디 탈퇴, 회원 탈퇴시 발생시키는 이벤트
    socket.on('leave', (leaveData) => {
      // leaveData = { room_number, room_name }
      socket.leave(leaveData.room_number); // join
      terminal.to(leaveData.room_number).emit('system-leave', `${socket.nickname}님이 퇴장했습니다`);

      Room.updateOne({ room_number: leaveData.room_number }, { $pull: { members: { user_id: socket.user_id } } }).exec();

      Chat.create({
        room_number: leaveData.room_number,
        user_id: 'system',
        nickname: 'system-leave',
        message: `${socket.nickname}님이 퇴장했습니다`,
        date: new Date().toString(),
      });
    });

    // // 유저 접속 해제 시 발생
    // socket.on('disconnect', () => {
    //   console.log('disconnected: ', socket.id);
    //   // user - socket.id 삭제
    //   User.updateOne({ socket_id: socket.id }, { socket_id: '' }, (err, docs) => {});
    // });

    // test command
    socket.on('chat message', (msg) => {
      const temp = msg.split('/');
      console.log('temp: ', temp);
      const command = temp[0];
      const contents1 = temp[1];
      const contents2 = temp[2];
      console.log('input: ', command, contents1, contents2);
      if (command === 'message') {
        socket.nickname = 'testNickname';
        terminal.to(temp[1]).emit('message', socket.nickname.concat(': ', temp[2]));
      } else if (command === 'join') {
        socket.join([temp[1], temp[2]]); // join
        terminal.to(temp[1]).emit('message', `${socket.id}님이 입장했습니다`); // 해당 룸에만 메시지 전달
        terminal.to(temp[2]).emit('message', `${socket.id}님이 입장했습니다`); // 해당 룸에만 메시지 전달
        const tt = socket.adapter.rooms;
        console.log('tt: ', tt);
        // console.log('tt: ', tt[contents].sockets);
      } else if (command === 'leave') {
        socket.leave(contents); // leave
        terminal.to(contents).emit('message', `${socket.id}님이 퇴장했습니다`); // 해당 룸에만 메시지 전달
      } else if (command === 'signup') {
        // 첨에 접속할때 클라이언트는 user_id, nickname전달, 서버는 socket.nickname을 변경하고 DB에 socket.id와 user_id를 매핑하여 저장한다
        console.log('data: ', contents);
        console.log('datatype: ', typeof contents);
        data = JSON.parse(contents);
        socket.nickname = data.nickname;
      } else if (command === 'close') {
        socket.disconnect(contents);
      }
    });
  });

  return io;
};

module.exports = { listen };

const guideMessage = (terminal, socket_id) => {
  console.log(`new connection: ${socket_id}`);
  terminal.to(socket_id).emit('message', '-- 테스트 명령어 목록 --');
  terminal.to(socket_id).emit('message', '룸 입장: join/ (roomNumber)');
  terminal.to(socket_id).emit('message', '룸 퇴장: leave/ (roomNumber)');
  terminal.to(socket_id).emit('message', '메시지 전송: message/ (roomNumber) / (message)');
};
