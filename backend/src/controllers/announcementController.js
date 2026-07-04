const announcementService = require('../services/announcementService');
const { successResponse, paginatedResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

class AnnouncementController {
  // GET /api/announcements
  async getAllAnnouncements(req, res, next) {
    try {
      const { announcements, pagination } = await announcementService.getAllAnnouncements(req.query);
      return paginatedResponse(res, 'Daftar pengumuman berhasil diambil', announcements, pagination);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/announcements/:id
  async getAnnouncementById(req, res, next) {
    try {
      const announcement = await announcementService.getAnnouncementById(req.params.id);
      return successResponse(res, 'Pengumuman berhasil diambil', announcement);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/announcements
  async createAnnouncement(req, res, next) {
    try {
      const data = { ...req.body };

      // Handle thumbnail upload
      if (req.file) {
        data.thumbnail = `/uploads/${req.file.filename}`;
      }

      const announcement = await announcementService.createAnnouncement(data, req.user._id);
      return successResponse(res, 'Pengumuman berhasil dibuat', announcement, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/announcements/:id
  async updateAnnouncement(req, res, next) {
    try {
      const data = { ...req.body };

      // Handle thumbnail upload
      if (req.file) {
        data.thumbnail = `/uploads/${req.file.filename}`;
      }

      const announcement = await announcementService.updateAnnouncement(req.params.id, data);
      return successResponse(res, 'Pengumuman berhasil diperbarui', announcement);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/announcements/:id
  async deleteAnnouncement(req, res, next) {
    try {
      await announcementService.deleteAnnouncement(req.params.id);
      return successResponse(res, 'Pengumuman berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnnouncementController();
