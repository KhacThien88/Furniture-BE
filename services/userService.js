// services/userService.js
const User = require('../models/userModel');

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  createUser,
  findUserByEmail,
};
