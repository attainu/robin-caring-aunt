const User = require('../models/User');
const User_dtl = require('../models/User_dtl');

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
      _id: user.data._id
    };
    req.session.save(() => {
      res.redirect('/');
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
      username: user.data.username,
      _id: user.data._id
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
    res.render('home-userDetails',
      {
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

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.userdtl = (req, res) => {
  let user_dtl = new User_dtl(
    req.body,
    req.session.user._id
  );
  user_dtl.details().then(() => {
    res.send('Details embedded');
  }).catch((errors) => {
    res.send(errors);
  });
};
