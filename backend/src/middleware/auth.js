const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const { HTTP_STATUS, ROLES } = require('../constants');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Akses ditolak. Token tidak ditemukan', [], HTTP_STATUS.UNAUTHORIZED);
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User tidak ditemukan', [], HTTP_STATUS.UNAUTHORIZED);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Akun telah dinonaktifkan', [], HTTP_STATUS.UNAUTHORIZED);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token tidak valid', [], HTTP_STATUS.UNAUTHORIZED);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token sudah kadaluarsa', [], HTTP_STATUS.UNAUTHORIZED);
    }
    return errorResponse(res, 'Autentikasi gagal', [], HTTP_STATUS.UNAUTHORIZED);
  }
};

// Restrict access to superadmin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === ROLES.SUPERADMIN) {
    return next();
  }
  return errorResponse(
    res,
    'Akses ditolak. Hanya superadmin yang dapat mengakses resource ini',
    [],
    HTTP_STATUS.FORBIDDEN
  );
};

// Restrict access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini',
        [],
        HTTP_STATUS.FORBIDDEN
      );
    }
    next();
  };
};

module.exports = {
  protect,
  adminOnly,
  authorize,
};
