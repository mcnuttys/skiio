const game = require('./game');

// Handle all the socket IO stuff here!

// When the user exits the game, remove them from all the slopes they are in
const exitGame = (io, socket) => {
  socket.rooms.forEach((room) => {
    if (game.isSlope(room)) {
      game.removePlayer(socket.id, room);
      io.to(room).emit('remove player', socket.id);
    }
  });
};

// Setup all the socket IO behaviours
const setup = (io) => {
  io.on('connection', (socket) => {
    // When the user is disconnecting, remove them from all the rooms the are in
    socket.on('disconnecting', () => {
      exitGame(io, socket);
    });

    // When the user "closes" aka switchs tabs exit the rooms them are in
    socket.on('closed game', () => {
      exitGame(io, socket);
    });

    // Join a player to a room
    socket.on('join room', (roomId) => {
      socket.join(roomId);
      io.to(socket.id).emit('resume setup', game.getPlayers(roomId));
    });

    // Spawn the player then send it to everyone
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

    // Kill a player on a room
    socket.on('kill player', (player) => {
      game.removePlayer(socket.id, player.room);
      io.to(player.room).emit('remove player', socket.id);
    });

    // move a player then update that move to everyone on a slope
    socket.on('move player', (move) => {
      game.updatePlayer(move.room, move);
      socket.broadcast.to(move.room).emit('move player', move);
    });

    // test
    socket.on('test', (msg) => {
      console.dir(msg);
    });
  });
};

module.exports.setup = setup;
