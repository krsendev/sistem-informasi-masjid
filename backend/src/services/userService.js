const userRepository = require('../repositories/userRepository');
const { buildPaginationQuery, buildPaginationMeta } = require('../utils/pagination');
const { HTTP_STATUS } = require('../constants');

class UserService {
  // Get all users with pagination and search
  async getAllUsers(query) {
    const { page, limit, skip } = buildPaginationQuery(query);
    const filter = {};

    // Search by name or email
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Filter by role
    if (query.role) {
      filter.role = query.role;
    }

    // Filter by active status
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    const [users, total] = await Promise.all([
      userRepository.findAll(filter, { skip, limit }),
      userRepository.count(filter),
    ]);

    const pagination = buildPaginationMeta(total, page, limit);

    return { users, pagination };
  }

  // Get user by ID
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return user;
  }

  // Create new user
  async createUser(data) {
    // Check duplicate email
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      const error = new Error('Email sudah terdaftar');
      error.statusCode = HTTP_STATUS.CONFLICT;
      throw error;
    }

    const user = await userRepository.create(data);
    return user;
  }

  // Update user
  async updateUser(id, data) {
    // If email is being changed, check for duplicates
    if (data.email) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser && existingUser._id.toString() !== id) {
        const error = new Error('Email sudah digunakan');
        error.statusCode = HTTP_STATUS.CONFLICT;
        throw error;
      }
    }

    // Don't allow password update via this method
    delete data.password;

    const user = await userRepository.update(id, data);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    return user;
  }

  // Delete user
  async deleteUser(id, currentUserId) {
    if (id === currentUserId) {
      const error = new Error('Tidak dapat menghapus akun sendiri');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    const user = await userRepository.delete(id);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    return user;
  }
}

module.exports = new UserService();
