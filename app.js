require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const session = require('express-session');
// const session = require('cookie-session');
const app = express();
const { logRoute } = require('./middleware');

// set view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: app.get('env') === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));
// app.use(session({
//   name: 'session',
//   keys: [ process.env.SESSION_SECRET ],
//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));
app.use(passport.initialize());
app.use(passport.session());

// connect to database
mongoose.connect(process.env.MONGODB_CONNECTION, { dbName: process.env.MONGODB_DB_NAME })
  .then(data => console.log('MongoDB Connected!'))
  .catch(error => console.error(error));

// create home route
app.get('/', logRoute, (req, res) => {
  res.render('home', { user: req.user });
});

app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));

app.listen(3000, () => console.log('Server started on port 3000'));
