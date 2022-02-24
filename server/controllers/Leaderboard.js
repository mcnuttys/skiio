const models = require('../models');

const { Leaderboard } = models;

// Get all the entrys in leaderboard depending on a filter
const getLeaderboard = (req, res) => {
  if (!req.query.filter) {
    Leaderboard.LeaderboardModel.find().sort({ score: -1 }).limit(10).lean()
      .then((docs) => res.json({ leaderboard: docs }));
  } else {
    const { filter } = req.query;
    Leaderboard.LeaderboardModel.findByFilter(filter)
      .then((docs) => res.json({ leaderboard: docs }));
  }
};

// Add an entry to a leaderboard depending on a type
const addLeaderboardEntry = (req, res) => {
  if (!req.body.name || !req.body.type || !req.body.score) {
    return res.status(400).json({ error: 'The name, type, and score are all required!' });
  }

  const entryData = {
    name: req.body.name,
    type: req.body.type,
    score: req.body.score,
  };

  const newEntry = new Leaderboard.LeaderboardModel(entryData);

  newEntry.save().catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured!' });
  });

  return newEntry;
};

module.exports.getLeaderboard = getLeaderboard;
module.exports.addLeaderboardEntry = addLeaderboardEntry;
