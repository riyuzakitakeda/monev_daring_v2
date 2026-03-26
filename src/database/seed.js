/**
 * Seed file: membuat akun admin pertama
 * Jalankan dengan: npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize, User, Jurusan } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database tersambung.');

    // Buat jurusan contoh
    const [jurusan] = await Jurusan.findOrCreate({
      where: { kode_jurusan: 'TI' },
      defaults: { kode_jurusan: 'TI', nama_jurusan: 'Teknik Informatika' },
    });
    console.log(`✅ Jurusan: ${jurusan.nama_jurusan}`);

    // Buat admin
    const [admin, created] = await User.findOrCreate({
      where: { nim: 'ADMIN001' },
      defaults: {
        nim: 'ADMIN001',
        nama: 'Administrator',
        password: 'admin123',
        role: 'admin',
        jurusan_id: jurusan.id,
      },
    });

    if (created) {
      console.log('✅ Akun admin berhasil dibuat:');
      console.log('   NIM      : ADMIN001');
      console.log('   Password : admin123');
    } else {
      console.log('ℹ️  Akun admin sudah ada.');
    }

    console.log('\n🎉 Seeding selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed gagal:', error.message);
    process.exit(1);
  }
};

seed();
