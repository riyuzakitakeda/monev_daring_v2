'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('laporan', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      matakuliah_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'matakuliah', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      dosen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'dosen', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      jurusan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'jurusan', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      pertemuan_ke: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('terlaksana_online', 'terlaksana_offline', 'tidak_terlaksana'),
        allowNull: false,
      },
      tanggal_pelaksanaan: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      pokok_bahasan: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      kelas: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      keterangan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      jam_mulai: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      jam_selesai: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      link_online: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      jumlah_hadir: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Index untuk query filtering yang sering dipakai
    await queryInterface.addIndex('laporan', ['jurusan_id'],         { name: 'idx_laporan_jurusan_id' });
    await queryInterface.addIndex('laporan', ['matakuliah_id'],      { name: 'idx_laporan_matakuliah_id' });
    await queryInterface.addIndex('laporan', ['dosen_id'],           { name: 'idx_laporan_dosen_id' });
    await queryInterface.addIndex('laporan', ['mahasiswa_id'],       { name: 'idx_laporan_mahasiswa_id' });
    await queryInterface.addIndex('laporan', ['tanggal_pelaksanaan'],{ name: 'idx_laporan_tanggal' });
    await queryInterface.addIndex('laporan', ['status'],             { name: 'idx_laporan_status' });

    // Unique constraint: 1 kelas hanya boleh lapor 1x per pertemuan per matakuliah
    await queryInterface.addIndex('laporan',
      ['matakuliah_id', 'pertemuan_ke', 'kelas', 'jurusan_id'],
      { unique: true, name: 'unique_laporan_per_pertemuan' }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('laporan');
  },
};
