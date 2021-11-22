const models = require('../models');

const { Account, Market } = models;

const loginPage = (req, res) => {
  res.render('login');
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All the fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/main' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      ownedItems: [],
    };

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/main' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const getProfile = async (req, res) => {
  const profile = await Account.AccountModel.findOne({ _id: req.session.account._id }).lean();

  const ownedItems = await Market.MarketModel.find({ _id: { $in: profile.ownedItems } }).lean();

  if (profile === undefined) {
    return res.status(404).json({ error: 'Could not find profile...' });
  }

  return res.status(200).json(
    {
      profile:
      {
        username: profile.username,
        ownedItems,
        createdDate: profile.createdDate,
        equipedAvatar: profile.equipedAvatar,
        equipedTerrain: profile.equipedTerrain,
      },
    },
  );
};

const equipItem = async (req, res) => {
  if (req.body.id === '' || req.body.type === '') return res.status(400).json({ error: 'id and type required' });

  const profile = await Account.AccountModel.findOne({ _id: req.session.account._id });

  switch (req.body.type) {
    case 'terrain':
      profile.equipedTerrain = req.body.id;
      break;

    case 'avatar':
      profile.equipedAvatar = req.body.id;
      break;

    default:
      return res.status(500).json({ error: 'The type was no valid?' });
  }

  await profile.save();

  res.status(200).json({ message: 'Successfully equiped item...' });
  return profile;
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const changePassword = async (req, res) => {
  const pass = req.body.pass;
  const newPass1 = req.body.newPass1;
  const newPass2 = req.body.newPass2;

  if (!pass || !newPass1 || !newPass2) {
    return res.status(400).json({ error: "All password fields required!" });
  }

  if (newPass1 !== newPass2) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  return Account.AccountModel.authenticate(req.session.account.username, pass, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    return Account.AccountModel.generateHash(newPass1, (salt, hash) => {
      account.salt = salt;
      account.password = hash;

      account.save().then(() => {
        return res.status(200).json({ message: "Password changed sucessfully" });
      }).catch((err) => {
        console.dir(err);
        return res.status(500).json({ err });
      });
    });
  });
}

module.exports.loginPage = loginPage;
module.exports.logout = logout;
module.exports.login = login;
module.exports.signup = signup;
module.exports.getProfile = getProfile;
module.exports.equipItem = equipItem;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
