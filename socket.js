var socketio = require('socket.io');

const listen = (server) => {
  io = socketio.listen(server);

  terminal = io.of('/terminal');
  // 유저 접속 시 발생
  terminal.on('connection', (socket) => {
    socket.join('room1');
    socket.broadcast.emit('chat message', `system: ${socket.id.split('#')[1]}님이 입장했습니다`); // socket의 주체르 제외하고 전달 (나 빼고)
    // 'chat message'같은 이벤트를 변경해서 처리

    terminal.to('room1').emit('chat message', `${socket.id.split('#')[1]}: 들어오자 마자 날리는 인사`);

    // 이벤트를 받았을 때 처리
    socket.on('chat message', (msg) => {
      // terminal.emit('chat message', msg);
      io.of('/terminal').emit('chat message', msg);
    });

    // 유저 접속 해제 시 발생
    socket.on('disconnect', () => {
      socket.broadcast.emit('chat message', `system: ${socket.id.split('#')[1]}님이 퇴장했습니다`); // socket의 주체르 제외하고 전달 (나 빼고)
    });
  });

  return io;
};

module.exports = { listen };
