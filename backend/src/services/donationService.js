const donationRepository = require('../repositories/donationRepository');
const { buildPaginationQuery, buildPaginationMeta } = require('../utils/pagination');
const { HTTP_STATUS } = require('../constants');

class DonationService {
  // Get all donations with pagination and filter
  async getAllDonations(query) {
    const { page, limit, skip } = buildPaginationQuery(query);
    const filter = {};

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

    // Search by donor name
    if (query.search) {
      filter.donorName = { $regex: query.search, $options: 'i' };
    }

    const [donations, total] = await Promise.all([
      donationRepository.findAll(filter, { skip, limit }),
      donationRepository.count(filter),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);

    return { donations, pagination };
  }

  // Get donation by ID
  async getDonationById(id) {
    const donation = await donationRepository.findById(id);
    if (!donation) {
      const error = new Error('Donasi tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return donation;
  }

  // Create donation
  async createDonation(data, userId) {
    data.createdBy = userId;
    const donation = await donationRepository.create(data);
    return await donationRepository.findById(donation._id);
  }

  // Update donation
  async updateDonation(id, data) {
    const donation = await donationRepository.update(id, data);
    if (!donation) {
      const error = new Error('Donasi tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return donation;
  }

  // Delete donation
  async deleteDonation(id) {
    const donation = await donationRepository.findById(id);
    if (!donation) {
      const error = new Error('Donasi tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    await donationRepository.delete(id);
    return donation;
  }

  // Get donation summary
  async getSummary(query = {}) {
    const matchStage = {};

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
        _id: null,
        totalDonations: { $sum: '$amount' },
        donorCount: { $sum: 1 },
        averageDonation: { $avg: '$amount' },
        maxDonation: { $max: '$amount' },
        minDonation: { $min: '$amount' },
      },
    });

    const result = await donationRepository.aggregate(pipeline);

    if (result.length === 0) {
      return {
        totalDonations: 0,
        donorCount: 0,
        averageDonation: 0,
        maxDonation: 0,
        minDonation: 0,
      };
    }

    const summary = result[0];
    delete summary._id;
    summary.averageDonation = Math.round(summary.averageDonation);

    // Category breakdown
    const categoryPipeline = [];
    if (Object.keys(matchStage).length > 0) {
      categoryPipeline.push({ $match: matchStage });
    }
    categoryPipeline.push({
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    });
    categoryPipeline.push({ $sort: { total: -1 } });

    const categoryBreakdown = await donationRepository.aggregate(categoryPipeline);
    summary.categoryBreakdown = categoryBreakdown.map((c) => ({
      category: c._id,
      total: c.total,
      count: c.count,
    }));

    return summary;
  }

  // Get recent donations
  async getRecent(limit = 10) {
    const donations = await donationRepository.findAll(
      {},
      { skip: 0, limit: parseInt(limit, 10), sort: { date: -1 } }
    );
    return donations;
  }
}

module.exports = new DonationService();
