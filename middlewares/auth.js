const db = require('../db/db');

module.exports = (req, res, next) => {
  const cookie = req.signedCookies;
  if (!cookie) {
    return res.redirect('/auth/login');
  }
  const user = db
    .get('users')
    .find({ id: cookie.userId })
    .value();

  if (!user) {
    return res.redirect('/auth/login');
  }

  req.user = user;

  next();
};
