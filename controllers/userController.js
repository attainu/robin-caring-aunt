const User = require('../models/User');

exports.mustBeLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash('errors', 'You must be logged in to perform this action.');
    req.session.save(() => {
      res.redirect('/');
    });
  }
};

exports.login = (req, res) => {
  let user = new User(req.body);
  user.login().then((result) => {
    req.session.user =
    {
      username: user.data.username,
    };
    req.session.save(() => {
      res.redirect('/home');
    });
  }).catch((err) => {
    req.flash('errors', err);
    req.session.save(() => {
      res.redirect('/');
    });
  });
};

exports.register = (req, res) => {
  let user = new User(req.body);
  user.register().then(() => {
    req.session.user =
    {
      _id: user.data._id,
      username: user.data.username,
      phone_no: user.data.phone_no
    };
    req.session.save(() => {
      res.redirect('/');
    });
  }).catch((regErrors) => {
    regErrors.forEach((error) => {
      req.flash('regErrors', error);
    });
    req.session.save(() => {
      res.redirect('/');
    });
  });
};

exports.home = (req, res) => {
  if (req.session.user) {
    // if(req.session.user.data.phone_no)
    res.render('home-userDetails',
      {
        errors: req.flash('errors'),
        username: req.session.user.username
      });
  } else {
    res.render('home-guest',
      {
        errors: req.flash('errors'),
        regErrors: req.flash('regErrors')
      });
  }
};