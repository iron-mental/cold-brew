var socketio = require('socket.io');

const listen = (server) => {
  io = socketio.listen(server); // 소켓서버 실행
  terminal = io.of('/terminal'); // 네임스페이스 지정

  // 유저 접속 시 트리거 -> 앱 부팅 시
  terminal.on('connection', (socket) => {
    // 첨에 접속할때 클라이언트는 user_id, nickname전달, 서버는 socket.nickname을 변경하고 DB에 socket.id와 user_id를 매핑하여 저장한다
    socket.on('signup', (data) => {
      // data 정보 mongoDB에 저장
      socket.nickname = data.nickname;
    });

    console.log('connected: ', socket.id);
    terminal.to(socket.id).emit('message', '-- 테스트 명령어 목록 --');
    terminal.to(socket.id).emit('message', '룸 입장: join/ (roomNumber)');
    terminal.to(socket.id).emit('message', '룸 퇴장: leave/ (roomNumber)');
    terminal.to(socket.id).emit('message', '메시지 전송: message/ (roomNumber) / (message)');

    // 클라이언트가 스터디 생성 or 스터디 참여 시 발생시키는 이벤트
    socket.on('join', (data) => {
      // data = { user_id: '유저 아이디', nickname: '닉네임' , room: study_id }
      // DB에 저장 { user_id, nickname, room, socket.id, date }
      socket.join(data.study_id); // join
      terminal.to(data.room).emit('system-join', `${nickname}님이 입장했습니다`); // 해당 룸에만 메시지 전달
    });

    // 채팅 이벤트를 받았을 때 처리
    socket.on('message', (msg) => {
      const division = msg.indexOf('/');
      const room = msg.slice(0, division);
      const message = msg.slice(division + 1);
      terminal.to(room).emit('message', message); // 해당 룸에만 메시지 전달
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
        // console.log('terminal.clients(): ', terminal.clients());
        // console.log('terminal.clients(1): ', terminal.clients('1'));
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

    // 클라이언트가 스터디 탈퇴, 회원 탈퇴시 발생시키는 이벤트
    socket.on('leave', (data) => {
      // data = { user_id: '유저 아이디', nickname: '닉네임' , room: study_id }
      // DB에서 삭제 { user_id, nickname, room, socket.id, date }
      socket.leave(data.study_id); // join
      terminal.to(data.room).emit('system-leave', `${nickname}님이 퇴장했습니다`); // 해당 룸에만 메시지 전달
    });

    // 유저 접속 해제 시 발생
    socket.on('disconnect', () => {
      console.log('disconnected: ', socket.id);
      //가입했던 Room에 브로드캐스트를 통해 채팅방을 나갔다는 메시지 추가
      // DB 삭제
    });
  });

  return io;
};

// socket.broadcast.to('room1').emit('chat message', `system: ${socket.id}}님이 입장했습니다`); // socket의 주체를 제외하고 전달 (나 빼고)
// terminal.to(room).emit('system', `${socket.id}}님이 입장했습니다`); // 해당 룸에만 메시지 전달

module.exports = { listen };
