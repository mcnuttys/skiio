const controllers = require('./controllers');
const mid = require('./middleware');
const game = require('./game');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  app.get('/slopes', mid.requiresSecure, game.getSlopes);

  app.get('/leaderboard', mid.requiresSecure, controllers.Leaderboard.getLeaderboard);
  app.post('/leaderboard', mid.requiresSecure, controllers.Leaderboard.addLeaderboardEntry);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/main', mid.requiresSecure, mid.requiresLogin, controllers.Main.mainPage);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/', mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
