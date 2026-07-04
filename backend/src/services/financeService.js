const financeRepository = require('../repositories/financeRepository');
const { buildPaginationQuery, buildPaginationMeta } = require('../utils/pagination');
const { HTTP_STATUS, FINANCE_TYPE } = require('../constants');

class FinanceService {
  // Get all finance records with pagination and filter
  async getAllFinances(query) {
    const { page, limit, skip } = buildPaginationQuery(query);
    const filter = {};

    // Filter by type
    if (query.type) {
      filter.type = query.type;
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

    // Search by description
    if (query.search) {
      filter.description = { $regex: query.search, $options: 'i' };
    }

    const [finances, total] = await Promise.all([
      financeRepository.findAll(filter, { skip, limit }),
      financeRepository.count(filter),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);

    return { finances, pagination };
  }

  // Get finance by ID
  async getFinanceById(id) {
    const finance = await financeRepository.findById(id);
    if (!finance) {
      const error = new Error('Data keuangan tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return finance;
  }

  // Create finance record
  async createFinance(data, userId) {
    data.createdBy = userId;
    const finance = await financeRepository.create(data);
    return await financeRepository.findById(finance._id);
  }

  // Update finance record
  async updateFinance(id, data) {
    const finance = await financeRepository.update(id, data);
    if (!finance) {
      const error = new Error('Data keuangan tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return finance;
  }

  // Delete finance record
  async deleteFinance(id) {
    const finance = await financeRepository.findById(id);
    if (!finance) {
      const error = new Error('Data keuangan tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    await financeRepository.delete(id);
    return finance;
  }

  // Get finance summary
  async getSummary(query = {}) {
    const matchStage = {};

    // Optional date filter
    if (query.startDate || query.endDate) {
      matchStage.date = {};
      if (query.startDate) matchStage.date.$gte = new Date(query.startDate);
      if (query.endDate) matchStage.date.$lte = new Date(query.endDate);
    }

    const pipeline = [];
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push({
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    });

    const result = await financeRepository.aggregate(pipeline);

    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    result.forEach((item) => {
      if (item._id === FINANCE_TYPE.INCOME) {
        totalIncome = item.total;
        incomeCount = item.count;
      } else if (item._id === FINANCE_TYPE.EXPENSE) {
        totalExpense = item.total;
        expenseCount = item.count;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeCount,
      expenseCount,
      totalTransactions: incomeCount + expenseCount,
    };
  }

  // Get monthly report
  async getMonthlyReport(year) {
    const targetYear = parseInt(year, 10) || new Date().getFullYear();

    const pipeline = [
      {
        $match: {
          date: {
            $gte: new Date(`${targetYear}-01-01`),
            $lte: new Date(`${targetYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ];

    const result = await financeRepository.aggregate(pipeline);

    // Build monthly data (1-12)
    const months = [];
    for (let m = 1; m <= 12; m++) {
      const incomeData = result.find((r) => r._id.month === m && r._id.type === FINANCE_TYPE.INCOME);
      const expenseData = result.find((r) => r._id.month === m && r._id.type === FINANCE_TYPE.EXPENSE);

      months.push({
        month: m,
        income: incomeData ? incomeData.total : 0,
        expense: expenseData ? expenseData.total : 0,
        balance: (incomeData ? incomeData.total : 0) - (expenseData ? expenseData.total : 0),
        incomeCount: incomeData ? incomeData.count : 0,
        expenseCount: expenseData ? expenseData.count : 0,
      });
    }

    return { year: targetYear, months };
  }

  // Get yearly report
  async getYearlyReport() {
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': -1 },
      },
    ];

    const result = await financeRepository.aggregate(pipeline);

    // Group by year
    const yearMap = {};
    result.forEach((item) => {
      const year = item._id.year;
      if (!yearMap[year]) {
        yearMap[year] = { year, income: 0, expense: 0, incomeCount: 0, expenseCount: 0 };
      }
      if (item._id.type === FINANCE_TYPE.INCOME) {
        yearMap[year].income = item.total;
        yearMap[year].incomeCount = item.count;
      } else {
        yearMap[year].expense = item.total;
        yearMap[year].expenseCount = item.count;
      }
    });

    const years = Object.values(yearMap).map((y) => ({
      ...y,
      balance: y.income - y.expense,
    }));

    years.sort((a, b) => b.year - a.year);

    return { years };
  }
}

module.exports = new FinanceService();
