const User = require('../models/User');

class UserRepository {
  async findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    return await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  async findByIdWithPassword(id) {
    return await User.findById(id).select('+password');
  }

  async create(data) {
    const user = new User(data);
    return await user.save();
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await User.countDocuments(filter);
  }

  async updateLastLogin(id) {
    return await User.findByIdAndUpdate(id, { lastLogin: new Date() });
  }
}

module.exports = new UserRepository();
