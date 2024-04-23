const profile = require('express').Router();
const { logRoute } = require('../middleware');

const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/auth/login');
}

// route: /profile

profile.get('/', logRoute, authCheck, (req, res) => {
  res.render('profile', { user: req.user });
});

module.exports = profile;
