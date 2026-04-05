const User = require('../models/user.model');

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email, withPassword = false) {
    const query = User.findOne({ email });
    if (withPassword) query.select('+password');
    return query.exec();
  }

  async findById(id) {
    return User.findById(id).exec();
  }

  async findAll(filter = {}) {
    return User.find(filter).exec();
  }

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
}

module.exports = new UserRepository();
