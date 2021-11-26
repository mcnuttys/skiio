const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const redis = require('redis');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/SkiIO';

mongoose.connect(dbUrl, (err) => {
  if (err) {
    console.log('Could not connect to the database');
    throw err;
  }
});

let redisURL = {
  hostname: 'redis-15586.c89.us-east-1-3.ec2.cloud.redislabs.com',
  port: '15586',
};

let redisPASS = 'S0hrI1LP3VrCFhhaX43bcZvPKOqUuMaU';

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}

const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

const http = require('http');
const { Server } = require('socket.io');
const router = require('./router.js');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Skiier in IO',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookieParser());

app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing csrf token');
  return false;
});

app.use(express.json());

router(app);

const httpServer = http.createServer(app);

const io = new Server(httpServer);

httpServer.listen(port, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Listening on port ${port}`);
});

const gameServer = require('./gameServer.js');

gameServer.setup(io);
