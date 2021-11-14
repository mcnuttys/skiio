const mongoose = require('mongoose');

let MarketModel = {};

const MarketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

MarketSchema.statics.findByFilter = (filter) => {
  const search = {
    type: filter,
  };

  return MarketModel.find(search).lean();
};

MarketModel = mongoose.model('Market', MarketSchema);

module.exports.MarketModel = MarketModel;
module.exports.MarketSchema = MarketSchema;
