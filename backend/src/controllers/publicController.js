const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Finance = require('../models/Finance');
const { successResponse, paginatedResponse } = require('../utils/response');
const { ANNOUNCEMENT_STATUS, PAGINATION, FINANCE_TYPE } = require('../constants');

class PublicController {
  // GET /api/public/announcements — paginated published announcements
  async getAnnouncements(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
      const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
      const skip = (page - 1) * limit;

      const filter = { status: ANNOUNCEMENT_STATUS.PUBLISHED };

      if (req.query.category) {
        filter.category = req.query.category;
      }

      if (req.query.search) {
        filter.$or = [
          { title: { $regex: req.query.search, $options: 'i' } },
          { content: { $regex: req.query.search, $options: 'i' } },
        ];
      }

      const [announcements, total] = await Promise.all([
        Announcement.find(filter)
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('author', 'name')
          .lean(),
        Announcement.countDocuments(filter),
      ]);

      return paginatedResponse(res, 'Pengumuman publik berhasil diambil', announcements, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/public/announcements/:id — single published announcement
  async getAnnouncementById(req, res, next) {
    try {
      const announcement = await Announcement.findOne({
        _id: req.params.id,
        status: ANNOUNCEMENT_STATUS.PUBLISHED,
      })
        .populate('author', 'name')
        .lean();

      if (!announcement) {
        return res.status(404).json({ success: false, message: 'Pengumuman tidak ditemukan' });
      }

      return successResponse(res, 'Pengumuman berhasil diambil', announcement);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/public/events — paginated published events
  async getEvents(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
      const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
      const skip = (page - 1) * limit;

      const filter = { isPublished: true };

      if (req.query.category) {
        filter.category = req.query.category;
      }

      if (req.query.upcoming === 'true') {
        filter.date = { $gte: new Date() };
      }

      if (req.query.search) {
        filter.$or = [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
        ];
      }

      const sortField = req.query.upcoming === 'true' ? { date: 1 } : { date: -1 };

      const [events, total] = await Promise.all([
        Event.find(filter)
          .sort(sortField)
          .skip(skip)
          .limit(limit)
          .lean(),
        Event.countDocuments(filter),
      ]);

      return paginatedResponse(res, 'Event publik berhasil diambil', events, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/public/finance-summary — public finance overview
  async getFinanceSummary(req, res, next) {
    try {
      const currentYear = new Date().getFullYear();
      const targetYear = parseInt(req.query.year, 10) || currentYear;
      const startOfYear = new Date(targetYear, 0, 1);
      const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59);

      const [
        incomeResult, 
        expenseResult, 
        categoryBreakdown, 
        recentDonations,
        allTimeIncomeResult,
        allTimeExpenseResult
      ] = await Promise.all([
        Finance.aggregate([
          { $match: { type: 'income', date: { $gte: startOfYear, $lte: endOfYear } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        Finance.aggregate([
          { $match: { type: 'expense', date: { $gte: startOfYear, $lte: endOfYear } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        Finance.aggregate([
          { $match: { type: 'expense', date: { $gte: startOfYear, $lte: endOfYear } } },
          { $group: { _id: '$category', total: { $sum: '$amount' } } },
          { $sort: { total: -1 } },
        ]),
        Finance.find({ 
          type: 'income', 
          category: { $in: ['donasi', 'infaq', 'zakat', 'sedekah'] } 
        }).sort({ date: -1 }).limit(10).lean(),
        Finance.aggregate([
          { $match: { type: 'income' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Finance.aggregate([
          { $match: { type: 'expense' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);

      const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
      const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;
      
      const totalIncomeAllTime = allTimeIncomeResult.length > 0 ? allTimeIncomeResult[0].total : 0;
      const totalExpenseAllTime = allTimeExpenseResult.length > 0 ? allTimeExpenseResult[0].total : 0;

      // Monthly breakdown
      const monthlyData = await Finance.aggregate([
        { $match: { date: { $gte: startOfYear, $lte: endOfYear } } },
        {
          $group: {
            _id: { month: { $month: '$date' }, type: '$type' },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]);

      const months = [];
      for (let m = 1; m <= 12; m++) {
        const inc = monthlyData.find((r) => r._id.month === m && r._id.type === FINANCE_TYPE.INCOME);
        const exp = monthlyData.find((r) => r._id.month === m && r._id.type === FINANCE_TYPE.EXPENSE);
        months.push({
          month: m,
          income: inc ? inc.total : 0,
          expense: exp ? exp.total : 0,
        });
      }

      return successResponse(res, 'Ringkasan keuangan berhasil diambil', {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        totalIncomeAllTime,
        totalExpenseAllTime,
        balanceAllTime: totalIncomeAllTime - totalExpenseAllTime,
        incomeCount: incomeResult.length > 0 ? incomeResult[0].count : 0,
        expenseCount: expenseResult.length > 0 ? expenseResult[0].count : 0,
        year: targetYear,
        categoryBreakdown,
        months,
        recentDonations,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublicController();
