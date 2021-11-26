const slopes = [];

const getSlopes = (req, res) => res.json({ slopes });

/*
test slope
{ name: "Shawnee Peak", type: "Mountain", playerCount: 0 }
*/

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

const addPlayer = (slope, player) => {
  const s = slopes.find((room) => room.id === slope);

  if (!s) {
    return;
  }

  s.players.push(player);
};

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

const getPlayers = (slope) => {
  const s = slopes.find((room) => room.id === slope);

  if (!s) {
    return undefined;
  }
  return s.players;
};

module.exports.getSlopes = getSlopes;
module.exports.createSlope = createSlope;
module.exports.getSlope = getSlope;
module.exports.addPlayer = addPlayer;
module.exports.updatePlayer = updatePlayer;
module.exports.getPlayers = getPlayers;
