const Finance = require('../models/Finance');

class FinanceRepository {
  async findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { date: -1 } } = options;
    return await Finance.find(filter)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findById(id) {
    return await Finance.findById(id).populate('createdBy', 'name email');
  }

  async create(data) {
    const finance = new Finance(data);
    return await finance.save();
  }

  async update(id, data) {
    return await Finance.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');
  }

  async delete(id) {
    return await Finance.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await Finance.countDocuments(filter);
  }

  async aggregate(pipeline) {
    return await Finance.aggregate(pipeline);
  }
}

module.exports = new FinanceRepository();
