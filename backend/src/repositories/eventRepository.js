const Event = require('../models/Event');

class EventRepository {
  async findAll(filter = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { date: -1 } } = options;
    return await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findById(id) {
    return await Event.findById(id);
  }

  async create(data) {
    const event = new Event(data);
    return await event.save();
  }

  async update(id, data) {
    return await Event.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Event.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await Event.countDocuments(filter);
  }
}

module.exports = new EventRepository();
