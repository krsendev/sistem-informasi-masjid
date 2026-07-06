const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Finance = require('../models/Finance');
const Donation = require('../models/Donation');
const { successResponse } = require('../utils/response');
const { ANNOUNCEMENT_STATUS } = require('../constants');

class PublicController {
  // GET /api/public/announcements
  async getLatestAnnouncements(req, res, next) {
    try {
      const announcements = await Announcement.find({
        status: ANNOUNCEMENT_STATUS.PUBLISHED,
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .populate('author', 'name')
        .lean();

      return successResponse(res, 'Pengumuman publik berhasil diambil', announcements);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/public/events
  async getUpcomingEvents(req, res, next) {
    try {
      const events = await Event.find({
        isPublished: true,
        date: { $gte: new Date() },
      })
        .sort({ date: 1 })
        .limit(5)
        .lean();

      return successResponse(res, 'Event publik berhasil diambil', events);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/public/finance-summary
  async getFinanceSummary(req, res, next) {
    try {
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

      const [incomeResult, expenseResult] = await Promise.all([
        Finance.aggregate([
          {
            $match: {
              type: 'income',
              date: { $gte: startOfYear, $lte: endOfYear },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Finance.aggregate([
          {
            $match: {
              type: 'expense',
              date: { $gte: startOfYear, $lte: endOfYear },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
      ]);

      const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
      const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;

      // Get recent donations
      const recentDonations = await Donation.find()
        .sort({ date: -1 })
        .limit(5)
        .lean();

      return successResponse(res, 'Ringkasan keuangan berhasil diambil', {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        year: currentYear,
        recentDonations,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublicController();
