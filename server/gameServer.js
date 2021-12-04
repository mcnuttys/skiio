const game = require('./game');

const exitGame = (io, socket) => {
  socket.rooms.forEach((room) => {
    if (game.isSlope(room)) {
      game.removePlayer(socket.id, room);
      io.to(room).emit('remove player', socket.id);
    }
  });
};

const setup = (io) => {
  io.on('connection', (socket) => {
    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => {
        if (game.isSlope(room)) {
          game.removePlayer(socket.id, room);
          io.to(room).emit('remove player', socket.id);
        }
      });
    });

    socket.on('disconnect', () => {
    });

    socket.on('closed game', () => {
      exitGame(io, socket);
    });

    socket.on('join room', (roomId) => {
      socket.join(roomId);
      io.to(socket.id).emit('resume setup', game.getPlayers(roomId));
    });

    socket.on('spawn player', (player) => {
      game.addPlayer(player.room, {
        name: player.name,
        avatar: player.avatar,
        x: 0,
        y: 0,
        angle: 0,
        socketId: socket.id,
      });
      io.to(player.room).emit('spawn player', player);
    });

    socket.on('kill player', (player) => {
      game.removePlayer(socket.id, player.room);
      io.to(player.room).emit('remove player', socket.id);
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
