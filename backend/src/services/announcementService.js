const announcementRepository = require('../repositories/announcementRepository');
const { buildPaginationQuery, buildPaginationMeta } = require('../utils/pagination');
const { generateUniqueSlug } = require('../utils/slug');
const { HTTP_STATUS, ANNOUNCEMENT_STATUS } = require('../constants');
const fs = require('fs');
const path = require('path');

class AnnouncementService {

  // Get all announcements with pagination, search, filter, sort
  async getAllAnnouncements(query) {
    const { page, limit, skip } = buildPaginationQuery(query);
    const filter = {};

    // Search by title or content
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { content: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (query.status) {
      filter.status = query.status;
    }

    // Filter by category
    if (query.category) {
      filter.category = query.category;
    }

    // Sort (default: newest first)
    const sort = { createdAt: -1 };
    if (query.sortBy === 'title') sort.title = 1;
    if (query.sortBy === 'publishedAt') {
      delete sort.createdAt;
      sort.publishedAt = -1;
    }

    const [announcements, total] = await Promise.all([
      announcementRepository.findAll(filter, { skip, limit, sort }),
      announcementRepository.count(filter),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);

    return { announcements, pagination };
  }

  // Get announcement by ID
  async getAnnouncementById(id) {
    const announcement = await announcementRepository.findById(id);
    if (!announcement) {
      const error = new Error('Pengumuman tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return announcement;
  }

  // Create announcement
  async createAnnouncement(data, userId) {
    // Generate unique slug
    data.slug = generateUniqueSlug(data.title);
    data.author = userId;

    // Set publishedAt if status is published
    if (data.status === ANNOUNCEMENT_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
    }

    const announcement = await announcementRepository.create(data);
    return await announcementRepository.findById(announcement._id);
  }

  // Update announcement
  async updateAnnouncement(id, data) {
    const existing = await announcementRepository.findById(id);
    if (!existing) {
      const error = new Error('Pengumuman tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Update slug if title changed
    if (data.title && data.title !== existing.title) {
      data.slug = generateUniqueSlug(data.title);
    }

    // Set publishedAt when publishing
    if (data.status === ANNOUNCEMENT_STATUS.PUBLISHED && existing.status !== ANNOUNCEMENT_STATUS.PUBLISHED) {
      data.publishedAt = new Date();
    }

    // If new thumbnail uploaded, delete old one
    if (data.thumbnail && existing.thumbnail) {
      const oldPath = path.join(__dirname, '../../uploads', path.basename(existing.thumbnail));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const announcement = await announcementRepository.update(id, data);
    return announcement;
  }

  // Delete announcement
  async deleteAnnouncement(id) {
    const announcement = await announcementRepository.findById(id);
    if (!announcement) {
      const error = new Error('Pengumuman tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Delete thumbnail file if exists
    if (announcement.thumbnail) {
      const filePath = path.join(__dirname, '../../uploads', path.basename(announcement.thumbnail));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await announcementRepository.delete(id);
    return announcement;
  }
}

module.exports = new AnnouncementService();
