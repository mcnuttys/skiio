const models = require('../models');

const { Market } = models;
const { Account } = models;

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

  res.status(200).json({ message: 'Successfully added item...' });
  return newEntry;
};

const purchaseMarketItem = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'The ID of the item purchased is required!' });
  }

  const account = await Account.AccountModel.findOne({ _id: req.session.account._id });

  if (account.ownedItems === undefined) account.ownedItems = [];

  if (account.ownedItems.find((id) => id === req.body.id)) return res.status(400).json({ error: 'The user already owns this item!' });

  account.ownedItems.push(req.body.id);

  await account.save();

  res.status(200).json({ message: 'Successfully added item...' });
  return account;
};

module.exports.getMarket = getMarket;
module.exports.addMarketItem = addMarketItem;
module.exports.purchaseMarketItem = purchaseMarketItem;
