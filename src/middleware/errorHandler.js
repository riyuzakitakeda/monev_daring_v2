/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.stack || err.message);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(422).json({
      success: false,
      message: 'Validasi gagal',
      errors: messages,
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'field';
    return res.status(409).json({
      success: false,
      message: `Data dengan ${field} tersebut sudah ada.`,
    });
  }

  // Sequelize foreign key constraint
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referensi data tidak valid (foreign key error).',
    });
  }

  // Default
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server.',
  });
};

module.exports = errorHandler;
