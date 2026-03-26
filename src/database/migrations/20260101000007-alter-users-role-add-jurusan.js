'use strict';

/** Migration: tambah nilai 'jurusan' ke ENUM role di tabel users (PostgreSQL) */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'jurusan';`
    );
  },

  async down() {
    // PostgreSQL tidak mendukung hapus nilai ENUM tanpa recreate
    // Biarkan kosong karena irreversible tanpa drop-recreate
    console.warn('Down migration: nilai jurusan pada enum_users_role tidak dihapus secara otomatis.');
  },
};
