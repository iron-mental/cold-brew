const socketio = require('socket.io');

const User = require('./models/user');
const Room = require('./models/room');
const Chat = require('./models/chat');

const listen = (server) => {
  io = socketio.listen(server); // 소켓서버 실행
  terminal = io.of('terminal'); // 네임스페이스 지정

  // 유저 접속 시 트리거 -> 앱 부팅 시
  terminal.on('connection', (socket) => {
    // test 메뉴얼 출력
    guideMessage(terminal, socket.id);

    // 연결되면 무조건 한번 날려야함
    socket.on('signup', (userData) => {
      // userData = {user_id, nickname} -> 구조분해 할당 테스트 후 적용
      socket.user_id = userData.user_id;
      socket.nickname = userData.nickname;

      userData.socket_id = socket.id;
      User.updateOne({ user_id: userData.user_id }, { userData }, { upsert: true }).exec();
    });

    // 클라이언트가 스터디 생성 or 스터디 참여 시 발생시키는 이벤트
    socket.on('join', (joinData) => {
      // joinData = { room_number, room_name }
      socket.join(joinData.room_number); // join
      terminal.to(joinData.room_number).emit('system-join', `${nickname}님이 입장했습니다`);

      Room.updateOne(
        { room_number: joinData.room_number },
        { $push: { members: { user_id: socket.user_id } } },
        (err, docs) => {
          // 쿼리에 걸린게 없을 때
          if (docs.nModified === 0) {
            joinData.members = [memberData];
            Room.create(joinData);
          }
        }
      );

      Chat.create({
        room_number: joinData.room_number,
        user_id: 'system',
        nickname: 'system-join',
        message: `${socket.nickname}님이 입장했습니다`,
        date: new Data().toString(),
      });
    });

    // 클라이언트가 스터디 탈퇴, 회원 탈퇴시 발생시키는 이벤트
    socket.on('leave', (leaveData) => {
      // leaveData = { room_number, room_name }
      socket.leave(leaveData.room_number); // join
      terminal.to(leaveData.room_number).emit('system-leave', `${socket.nickname}님이 퇴장했습니다`);

      Room.updateOne({ room_number: joinData.room_number }, { $pull: { members: { user_id: socket.user_id } } }).exec();

      Chat.create({
        room_number: leaveData.room_number,
        user_id: 'system',
        nickname: 'system-leave',
        message: `${socket.nickname}님이 퇴장했습니다`,
        date: new Data().toString(),
      });
    });

    // 채팅 이벤트를 받았을 때 처리
    socket.on('message', (chatData) => {
      // chatData = { room, msg }
      terminal.to(chatData.room).emit('message', chatData.msg); // 해당 룸에만 메시지 전달

      Chat.create({
        room_number: chatData.room,
        user_id: socket.user_id,
        nickname: socket.nickname,
        message: chatData.msg,
        date: new Data().toString(),
      });
    });

    // 유저 접속 해제 시 발생
    socket.on('disconnect', () => {
      console.log('disconnected: ', socket.id);
      // user - socket.id 삭제
      User.updateOne({ socket_id: socket.id }, { socket_id: '' }, (err, docs) => {});
    });

    // test command
    socket.on('chat message', (msg) => {
      const division = msg.indexOf('/');
      const command = msg.slice(0, division);
      const contents = msg.slice(division + 1);
      console.log('input: ', command, contents);
      if (command === 'message') {
        socket.nickname = 'testNickname';
        const division = contents.indexOf('/');
        const room = contents.slice(0, division);
        const message = contents.slice(division + 1);
        terminal.to(room).emit('message', socket.nickname.concat(': ', message));
      } else if (command === 'join') {
        socket.join(contents); // join
        terminal.to(contents).emit('message', `${socket.id}님이 입장했습니다`); // 해당 룸에만 메시지 전달
        const tt = socket.adapter.rooms;
        console.log('tt: ', tt[contents].sockets);
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
