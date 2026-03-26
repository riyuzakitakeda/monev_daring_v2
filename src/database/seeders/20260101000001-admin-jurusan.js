'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Seed jurusan
    await queryInterface.bulkInsert('jurusan', [
      { kode_jurusan: 'TI',  nama_jurusan: 'Teknik Informatika',         created_at: new Date(), updated_at: new Date() },
      { kode_jurusan: 'SI',  nama_jurusan: 'Sistem Informasi',           created_at: new Date(), updated_at: new Date() },
      { kode_jurusan: 'TK',  nama_jurusan: 'Teknik Komputer',            created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Ambil id jurusan TI
    const [jurusan] = await queryInterface.sequelize.query(
      `SELECT id FROM jurusan WHERE kode_jurusan = 'TI' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Seed admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('users', [{
      nim:        'ADMIN001',
      nama:       'Administrator',
      password:   hashedPassword,
      role:       'admin',
      jurusan_id: jurusan ? jurusan.id : null,
      kelas:      null,
      is_active:   true,
      created_at: new Date(),
      updated_at: new Date(),
    }], { ignoreDuplicates: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users',   { nim: 'ADMIN001' }, {});
    await queryInterface.bulkDelete('jurusan', { kode_jurusan: ['TI', 'SI', 'TK'] }, {});
  },
};
