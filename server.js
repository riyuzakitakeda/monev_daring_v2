require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // Tes koneksi database
    await sequelize.authenticate();
    console.log('✅ Koneksi database berhasil.');

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      console.log(`📋 API Docs tersedia di http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Gagal menjalankan server:', error.message);
    process.exit(1);
  }
};

start();
