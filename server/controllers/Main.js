const mainPage = (req, res) => {
  res.render('main');
};

const adminPage = (req, res) => {
  res.render('admin');
};

module.exports.mainPage = mainPage;
module.exports.adminPage = adminPage;
