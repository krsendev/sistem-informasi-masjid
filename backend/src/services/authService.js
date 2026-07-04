const userRepository = require('../repositories/userRepository');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { HTTP_STATUS } = require('../constants');

class AuthService {
  // Login user
  async login(email, password) {
    // Find user with password field
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Email atau password salah');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Akun telah dinonaktifkan. Hubungi administrator');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Email atau password salah');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    // Generate tokens
    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Update last login
    await userRepository.updateLastLogin(user._id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Refresh access token
  async refreshToken(token) {
    if (!token) {
      const error = new Error('Refresh token tidak ditemukan');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    const decoded = verifyRefreshToken(token);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Akun telah dinonaktifkan');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken: newRefreshToken };
  }

  // Get user profile
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return user;
  }

  // Update user profile
  async updateProfile(userId, data) {
    const { name, email, phone } = data;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== userId) {
        const error = new Error('Email sudah digunakan');
        error.statusCode = HTTP_STATUS.CONFLICT;
        throw error;
      }
      updateData.email = email;
    }
    if (phone !== undefined) updateData.phone = phone;

    const user = await userRepository.update(userId, updateData);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    return user;
  }

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      const error = new Error('Password lama salah');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    // Set and save new password
    user.password = newPassword;
    await user.save();

    return true;
  }
}

module.exports = new AuthService();
