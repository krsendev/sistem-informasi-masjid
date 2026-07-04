const donationService = require('../services/donationService');
const { successResponse, paginatedResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

class DonationController {
  // GET /api/donations
  async getAllDonations(req, res, next) {
    try {
      const { donations, pagination } = await donationService.getAllDonations(req.query);
      return paginatedResponse(res, 'Daftar donasi berhasil diambil', donations, pagination);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/donations/:id
  async getDonationById(req, res, next) {
    try {
      const donation = await donationService.getDonationById(req.params.id);
      return successResponse(res, 'Donasi berhasil diambil', donation);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/donations
  async createDonation(req, res, next) {
    try {
      const donation = await donationService.createDonation(req.body, req.user._id);
      return successResponse(res, 'Donasi berhasil dibuat', donation, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/donations/:id
  async updateDonation(req, res, next) {
    try {
      const donation = await donationService.updateDonation(req.params.id, req.body);
      return successResponse(res, 'Donasi berhasil diperbarui', donation);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/donations/:id
  async deleteDonation(req, res, next) {
    try {
      await donationService.deleteDonation(req.params.id);
      return successResponse(res, 'Donasi berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/donations/summary
  async getSummary(req, res, next) {
    try {
      const summary = await donationService.getSummary(req.query);
      return successResponse(res, 'Ringkasan donasi berhasil diambil', summary);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/donations/recent
  async getRecent(req, res, next) {
    try {
      const donations = await donationService.getRecent(req.query.limit);
      return successResponse(res, 'Donasi terbaru berhasil diambil', donations);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DonationController();
