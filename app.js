const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const app = express();

let sess = session({
  secret: 'shhhh',
  store: new MongoStore({ client: require('./db') }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

app.use(sess);
app.use(flash());

const routes = require('./routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// setting up view engine
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', routes);

module.exports = app;