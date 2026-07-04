const financeService = require('../services/financeService');
const { successResponse, paginatedResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

class FinanceController {
  // GET /api/finances
  async getAllFinances(req, res, next) {
    try {
      const { finances, pagination } = await financeService.getAllFinances(req.query);
      return paginatedResponse(res, 'Daftar keuangan berhasil diambil', finances, pagination);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/finances/:id
  async getFinanceById(req, res, next) {
    try {
      const finance = await financeService.getFinanceById(req.params.id);
      return successResponse(res, 'Data keuangan berhasil diambil', finance);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/finances
  async createFinance(req, res, next) {
    try {
      const finance = await financeService.createFinance(req.body, req.user._id);
      return successResponse(res, 'Data keuangan berhasil dibuat', finance, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/finances/:id
  async updateFinance(req, res, next) {
    try {
      const finance = await financeService.updateFinance(req.params.id, req.body);
      return successResponse(res, 'Data keuangan berhasil diperbarui', finance);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/finances/:id
  async deleteFinance(req, res, next) {
    try {
      await financeService.deleteFinance(req.params.id);
      return successResponse(res, 'Data keuangan berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/finances/summary
  async getSummary(req, res, next) {
    try {
      const summary = await financeService.getSummary(req.query);
      return successResponse(res, 'Ringkasan keuangan berhasil diambil', summary);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/finances/monthly
  async getMonthlyReport(req, res, next) {
    try {
      const report = await financeService.getMonthlyReport(req.query.year);
      return successResponse(res, 'Laporan bulanan berhasil diambil', report);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/finances/yearly
  async getYearlyReport(req, res, next) {
    try {
      const report = await financeService.getYearlyReport();
      return successResponse(res, 'Laporan tahunan berhasil diambil', report);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FinanceController();
