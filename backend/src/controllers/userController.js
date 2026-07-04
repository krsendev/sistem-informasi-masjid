const userService = require('../services/userService');
const { successResponse, paginatedResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

class UserController {
  // GET /api/users
  async getAllUsers(req, res, next) {
    try {
      const { users, pagination } = await userService.getAllUsers(req.query);
      return paginatedResponse(res, 'Daftar user berhasil diambil', users, pagination);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return successResponse(res, 'User berhasil diambil', user);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      return successResponse(res, 'User berhasil dibuat', user, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/users/:id
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return successResponse(res, 'User berhasil diperbarui', user);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id, req.user._id.toString());
      return successResponse(res, 'User berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
