const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Token = require('../models/token');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: 'Your email is required',
    trim: true,
  },
  profileImage: {
    type: String,
    required: false,

  },
  password: {
    type: String,
    required: 'Your password is required',
    max: 100,
  },

  fullName: {
    type: String,
    required: 'First Name is required',
    max: 100,
  },

  phone: {
    type: String,
    required: false,
    max: 255,
  },
  bio: {
    type: String,
    required: false,
    max: 255,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  userRole: {
    type: String,
    default: 'customer',
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },

  resetPasswordExpires: {
    type: Date,
    required: false,
  },
}, {timestamps: true});


UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  const payload = {
    id: this._id,
    _id: this._id,
    email: this.email,
    fullName: this.fullName,
    language: this.language,
    phone: this.phone,
    userRole: this.userRole,
  };

  return jwt.sign(payload, new Buffer.from( process.env.JWT_SECRET, 'base64' ));
};

UserSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

UserSchema.methods.generateVerificationToken = function() {
  const payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString('hex'),
  };

  return new Token(payload);
};

module.exports = mongoose.model('Users', UserSchema);