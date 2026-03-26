'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('matakuliah', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      kode_mk: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      nama_mk: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      sks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      semester: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      jurusan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'jurusan', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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

    await queryInterface.addIndex('matakuliah', ['jurusan_id'], { name: 'idx_matakuliah_jurusan_id' });
    await queryInterface.addIndex('matakuliah', ['semester'],   { name: 'idx_matakuliah_semester' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('matakuliah');
  },
};
