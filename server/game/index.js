const slopes = [];

// Return the available resorts/slopes
const getSlopes = (req, res) => res.json({ slopes });

/*
test slope
{ name: "Shawnee Peak", type: "Mountain", playerCount: 0 }
*/

// Create a slope given a name and type
const createSlope = (req, res) => {
  if (!req.body.name || !req.body.type) {
    return res.status(400).json({ error: 'Resort name, and type are required!' });
  }

  if (slopes.find((name) => name.name === req.body.name)) {
    return res.status(400).json({ error: 'Resort with that name already exists!' });
  }

  const resort = {
    name: req.body.name,
    type: req.body.type,
    playerCount: 0,
    id: Math.round(Math.random() * 10000).toString(),
    seed: Math.round(Math.random() * 10000).toString(),
    players: [],
  };

  slopes.push(resort);

  return res.status(200).json({ resort });
};

// Retrieve info about a specific slope
const getSlope = (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ error: 'Must have an ID' });
  }

  const slope = slopes.find((id) => id.id === req.query.id);

  if (!slope) {
    return res.status(404).json({ error: 'Could not find this slope!' });
  }

  return res.status(200).json({ slope });
};

// Add a player to a slope
const addPlayer = (slope, player) => {
  const s = slopes.find((room) => room.id === slope);

  if (!s) {
    return;
  }

  if (s.players.find((p) => p.name === player.name)) {
    return;
  }

  s.players.push(player);
};

// Udate a player on the slope
const updatePlayer = (slope, move) => {
  const s = slopes.find((room) => room.id === slope);

  if (!s) {
    return;
  }

  const player = s.players.find((p) => p.name === move.name);

  if (!player) {
    return;
  }

  player.x = move.x;
  player.y = move.y;
  player.angle = move.angle;
};

// Get the array of players on a slope
const getPlayers = (slope) => {
  const s = slopes.find((room) => room.id === slope);

  if (!s) {
    return undefined;
  }
  return s.players;
};

// Check if a given id is a slope
const isSlope = (slopeId) => {
  const s = slopes.find((room) => room.id === slopeId);
  if (!s) {
    return false;
  }
  return true;
};

// Remove a player from a slope
const removePlayer = (player, slope) => {
  const s = slopes.find((room) => room.id === slope);
  if (!s) {
    return;
  }

  const index = s.players.indexOf(s.players.find((p) => p.socketId === player));
  if (index > -1) {
    s.players.splice(index, 1);
  }
};

module.exports.getSlopes = getSlopes;
module.exports.createSlope = createSlope;
module.exports.getSlope = getSlope;
module.exports.addPlayer = addPlayer;
module.exports.updatePlayer = updatePlayer;
module.exports.getPlayers = getPlayers;
module.exports.isSlope = isSlope;
module.exports.removePlayer = removePlayer;
