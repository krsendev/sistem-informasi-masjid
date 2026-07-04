const Announcement = require('../models/Announcement');

class AnnouncementRepository {
  async findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    return await Announcement.find(filter)
      .populate('author', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findById(id) {
    return await Announcement.findById(id).populate('author', 'name email');
  }

  async findBySlug(slug) {
    return await Announcement.findOne({ slug }).populate('author', 'name email');
  }

  async create(data) {
    const announcement = new Announcement(data);
    return await announcement.save();
  }

  async update(id, data) {
    return await Announcement.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('author', 'name email');
  }

  async delete(id) {
    return await Announcement.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await Announcement.countDocuments(filter);
  }
}

module.exports = new AnnouncementRepository();
