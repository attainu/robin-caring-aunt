const User_dtl = require('../models/User_dtl');

exports.insertUserDetail = (req, res) => {
  let user_dtl = new User_dtl(
    req.body,
    req.session.user._id,
    req.session.user.phone_no
  );
  user_dtl.details().then(() => {
    req.session.save(() => res.redirect('/home'));
  }).catch((errors) => {
    errors.forEach(error => req.flash('errors', error));
    req.session.save(() => res.redirect('/'));
  });
};

exports.viewHome = async (req, res) => {
  try {
    let userInfo = await User_dtl.viewHome();
    res.render('userHome', { userInfo: userInfo });
    // console.log('----------------------m here ---------------------');
    // console.log(userInfo);
  } catch{
    res.render('404');
  }
};

