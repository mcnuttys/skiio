const game = require('./game');

const setup = (io) => {
  io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('join room', (roomId) => {
      socket.join(roomId);
      io.to(socket.id).emit('resume setup', game.getPlayers(roomId));
    });

    socket.on('spawn player', (player) => {
      game.addPlayer(player.room, {
        name: player.name, avatar: player.avatar, x: 0, y: 0, angle: 0,
      });
      io.to(player.room).emit('spawn player', player);
    });

    socket.on('move player', (move) => {
      game.updatePlayer(move.room, move);
      socket.broadcast.to(move.room).emit('move player', move);
    });

    socket.on('test', (msg) => {
      console.dir(msg);
    });
  });
};

module.exports.setup = setup;
