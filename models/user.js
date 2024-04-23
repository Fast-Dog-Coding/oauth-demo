const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  subject: String,
  name: String,
  given_name: String,
  family_name: String,
  picture: String,
  provider: String
});
const User = mongoose.model('user', userSchema);

module.exports = User;
