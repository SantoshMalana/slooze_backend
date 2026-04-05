const mongoose = require('mongoose');
const { ROLES, COUNTRIES } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.MEMBER,
    },
    country: {
      type: String,
      enum: Object.values(COUNTRIES),
      required: [true, 'Country is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
