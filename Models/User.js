const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  old_password: {
    type: String,
  },
  token: {
    type: String,
  },
  status: {
    type: String,
    require: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
}, { timestamps: true });
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = User

