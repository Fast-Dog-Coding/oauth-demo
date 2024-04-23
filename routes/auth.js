const auth = require('express').Router();
const passport = require('passport');
const { logRoute } = require('../middleware');

// route: /auth

auth.get('/login', logRoute, (req, res) => {
  res.render('login', { user: req.user });
});

auth.get('/logout', logRoute, (req, res, next) => {
  req.logout(error => {
    if (error) {
      return next(error);
    }
    res.redirect('/');
  });
});

auth.get('/google', logRoute, passport.authenticate('google', {
  scope: [ 'profile' ]
}));

auth.get('/google/redirect', logRoute, passport.authenticate('google'), (req, res) => {
  res.redirect('/profile');

});

module.exports = auth;
