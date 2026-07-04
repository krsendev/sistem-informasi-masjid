const Donation = require('../models/Donation');

class DonationRepository {
  async findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { date: -1 } } = options;
    return await Donation.find(filter)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findById(id) {
    return await Donation.findById(id).populate('createdBy', 'name email');
  }

  async create(data) {
    const donation = new Donation(data);
    return await donation.save();
  }

  async update(id, data) {
    return await Donation.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');
  }

  async delete(id) {
    return await Donation.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await Donation.countDocuments(filter);
  }

  async aggregate(pipeline) {
    return await Donation.aggregate(pipeline);
  }
}

module.exports = new DonationRepository();
