const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

class AuthController {
  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return successResponse(res, 'Login berhasil', {
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/logout
  async logout(req, res, next) {
    try {
      res.clearCookie('refreshToken');
      return successResponse(res, 'Logout berhasil');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/refresh-token
  async refreshToken(req, res, next) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const result = await authService.refreshToken(token);

      // Update refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, 'Token berhasil diperbarui', {
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/profile
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user._id);
      return successResponse(res, 'Profil berhasil diambil', user);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/auth/profile
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user._id, req.body);
      return successResponse(res, 'Profil berhasil diperbarui', user);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/auth/change-password
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await authService.changePassword(req.user._id, oldPassword, newPassword);
      return successResponse(res, 'Password berhasil diubah');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
