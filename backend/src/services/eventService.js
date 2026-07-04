const eventRepository = require('../repositories/eventRepository');
const { buildPaginationQuery, buildPaginationMeta } = require('../utils/pagination');
const { HTTP_STATUS } = require('../constants');
const fs = require('fs');
const path = require('path');

class EventService {
  // Get all events with pagination, search, filter
  async getAllEvents(query) {
    const { page, limit, skip } = buildPaginationQuery(query);
    const filter = {};
    let sort = { date: -1 };

    // Search by title
    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    // Filter by category
    if (query.category) {
      filter.category = query.category;
    }

    // Filter by date range
    if (query.startDate || query.endDate) {
      filter.date = {};
      if (query.startDate) filter.date.$gte = new Date(query.startDate);
      if (query.endDate) filter.date.$lte = new Date(query.endDate);
    }

    // Upcoming events (date >= today)
    if (query.upcoming === 'true') {
      filter.date = { ...filter.date, $gte: new Date() };
      filter.isPublished = true;
      sort = { date: 1 }; // Nearest first
    }

    // Past events (date < today)
    if (query.past === 'true') {
      filter.date = { ...filter.date, $lt: new Date() };
      sort = { date: -1 }; // Most recent first
    }

    // Filter published only
    if (query.isPublished !== undefined) {
      filter.isPublished = query.isPublished === 'true';
    }

    const [events, total] = await Promise.all([
      eventRepository.findAll(filter, { skip, limit, sort }),
      eventRepository.count(filter),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);

    return { events, pagination };
  }

  // Get event by ID
  async getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      const error = new Error('Event tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return event;
  }

  // Create event
  async createEvent(data) {
    const event = await eventRepository.create(data);
    return event;
  }

  // Update event
  async updateEvent(id, data) {
    const existing = await eventRepository.findById(id);
    if (!existing) {
      const error = new Error('Event tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // If new image uploaded, delete old one
    if (data.image && existing.image) {
      const oldPath = path.join(__dirname, '../../uploads', path.basename(existing.image));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const event = await eventRepository.update(id, data);
    return event;
  }

  // Delete event
  async deleteEvent(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      const error = new Error('Event tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Delete image file if exists
    if (event.image) {
      const filePath = path.join(__dirname, '../../uploads', path.basename(event.image));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await eventRepository.delete(id);
    return event;
  }
}

module.exports = new EventService();
