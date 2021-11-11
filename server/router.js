const controllers = require('./controllers');

const router = (app) => {
    app.get('/', controllers.main);
};

module.exports = router;
