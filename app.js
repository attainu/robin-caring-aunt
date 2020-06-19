const express = require('express');
const session = require('express-session');
const sessInDb = require('connect-mongo')(session);
const flash = require('connect-flash');
const app = express();

let sess = session({
  secret: process.env.SESS_SECRET,
  store: new sessInDb({ client: require('./db') }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

app.use(sess);
app.use(flash());

const routes = require('./routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

// setting up view engine
app.set('views', 'views');
app.set('view engine', 'ejs');


app.use('/', routes);

module.exports = app;