const mongoose = require('mongoose');

let LeaderboardModel = {};

const LeaderboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

LeaderboardSchema.statics.findByFilter = (filter) => {
  const search = {
    type: filter,
  };

  return LeaderboardModel.find(search).lean().sort({ score: -1 }).limit(10);
};

LeaderboardModel = mongoose.model('Leaderboard', LeaderboardSchema);

module.exports.LeaderboardModel = LeaderboardModel;
module.exports.LeaderboardSchema = LeaderboardSchema;
