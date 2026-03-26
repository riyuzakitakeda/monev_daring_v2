const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware: verifikasi JWT token dari header Authorization
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token tidak ditemukan.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah kadaluarsa. Silakan login kembali.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid.',
    });
  }
};

/**
 * Middleware: hanya izinkan role tertentu
 * @param  {...string} roles - role yang diizinkan, misal: 'admin', 'mahasiswa'
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki hak akses.',
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
