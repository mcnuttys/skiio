const models = require('../models');

const { Market } = models;

const getMarket = (req, res) => {
  if (!req.query.filter) {
    Market.MarketModel.find().lean()
      .then((docs) => res.json({ market: docs }));
  } else {
    const { filter } = req.query;
    Market.MarketModel.findByFilter(filter)
      .then((docs) => res.json({ market: docs }));
  }
};

const addMarketItem = (req, res) => {
  if (!req.body.name || !req.body.type || !req.body.path) {
    return res.status(400).json({ error: 'The name, type, and path are all required!' });
  }

  const entryData = {
    name: req.body.name,
    type: req.body.type,
    path: req.body.path,
  };

  const newEntry = new Market.MarketModel(entryData);

  newEntry.save().catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured!' });
  });

  return newEntry;
};

module.exports.getMarket = getMarket;
module.exports.addMarketItem = addMarketItem;
