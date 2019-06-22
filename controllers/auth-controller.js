const db = require('../db/db');
const shortid = require('shortid');
const md5 = require('md5');

module.exports.register = (req, res) => {
  res.render('register/index.pug');
};

module.exports.postRegister = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const id = shortid.generate();

  if (password !== confirmPassword) {
    return res.render('register/index.pug', {
      error: 'Mật khẩu không khớp.'
    });
  }

  const isExistEmail = db
    .get('users')
    .find({ email })
    .value();

  if (isExistEmail) {
    return res.render('register/index.pug', {
      error: 'Email đã tồn tại.'
    });
  }

  const hashedPassword = md5(password);

  db.get('users')
    .push({
      email,
      id,
      password: hashedPassword
    })
    .write();

  res.cookie('userId', id, {
    signed: true
  });

  return res.redirect('/');
};

module.exports.login = (req, res) => {
  res.render('login/index.pug');
};

module.exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  const user = db
    .get('users')
    .find({ email })
    .value();

  if (!user) {
    return res.render('login/index.pug', {
      error: 'Email hoặc mật khẩu không đúng'
    });
  }

  if (user.password !== md5(password)) {
    return res.render('login/index.pug', {
      error: 'Email hoặc mật khẩu không đúng'
    });
  }

  res.cookie('userId', user.id, {
    signed: true
  });

  return res.redirect('/');
};
