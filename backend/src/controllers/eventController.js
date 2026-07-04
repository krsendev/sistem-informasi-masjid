const eventService = require('../services/eventService');
const { successResponse, paginatedResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

class EventController {
  // GET /api/events
  async getAllEvents(req, res, next) {
    try {
      const { events, pagination } = await eventService.getAllEvents(req.query);
      return paginatedResponse(res, 'Daftar event berhasil diambil', events, pagination);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/events/:id
  async getEventById(req, res, next) {
    try {
      const event = await eventService.getEventById(req.params.id);
      return successResponse(res, 'Event berhasil diambil', event);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/events
  async createEvent(req, res, next) {
    try {
      const data = { ...req.body };

      // Handle image upload
      if (req.file) {
        data.image = `/uploads/${req.file.filename}`;
      }

      const event = await eventService.createEvent(data);
      return successResponse(res, 'Event berhasil dibuat', event, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/events/:id
  async updateEvent(req, res, next) {
    try {
      const data = { ...req.body };

      // Handle image upload
      if (req.file) {
        data.image = `/uploads/${req.file.filename}`;
      }

      const event = await eventService.updateEvent(req.params.id, data);
      return successResponse(res, 'Event berhasil diperbarui', event);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/events/:id
  async deleteEvent(req, res, next) {
    try {
      await eventService.deleteEvent(req.params.id);
      return successResponse(res, 'Event berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
