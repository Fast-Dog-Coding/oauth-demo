const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user');

// Set Google OAuth options
const options = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/auth/google/redirect'
};

// Register Google OAuth Strategy
const strategy = new GoogleStrategy(options, verify);
passport.use('google', strategy);

/**
 * Serialize user id to session
 */
passport.serializeUser((user, done) => {
  console.log('passport.serializeUser: user = ', JSON.stringify(user, null, 2));
  console.log('user.id = ', user.id)
  return done(null, user.id);
});

/**
 * Deserialize user from session
 */
passport.deserializeUser((id, done) => {
  console.log('passport.deserializeUser: id = ', id);
  User.findById(id)
    .then(user => {
      console.log('User.findById.then: user = ', JSON.stringify(user, null, 2));
      return done(null, user);

    })
    .catch(error => {
      console.log('User.findById.catch: error = ', JSON.stringify(error, null, 2));
      return done(error);
    });
});

/**
 * Verify callback for Google OAuth
 */
function verify(accessToken, refreshToken, profile, done) {
  console.log('verify: profile = ', JSON.stringify(profile, null, 2));
  User.findOne({ subject: profile.id, provider: profile.provider })
    .then(user => {
      if (user) {
        console.log('User.findOne.then: user = ', JSON.stringify(user, null, 2));
        return done(null, user);

      } else {
        const newUser = new User(parseProfile(profile));
        return newUser.save()
          .then(user => {
            console.log('newUser.save.then: user = ', JSON.stringify(user, null, 2));
            return done(null, user);

          })
          .catch(error => {
            console.log('newUser.save.catch: error = ', JSON.stringify(error, null, 2));
            return done(error);
          });
      }
    })
    .catch(error => {
      console.log('User.findOne.catch: error = ', JSON.stringify(error, null, 2));
      return done(error);
    });
}

/**
 * Parse Google profile into a user object
 */
function parseProfile(profile) {
  return {
    subject: profile.id,
    name: profile.displayName,
    given_name: profile.name.givenName,
    family_name: profile.name.familyName,
    picture: profile.photos[0].value,
    provider: profile.provider
  };
}

module.exports = passport;
