'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nim: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      nama: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('mahasiswa', 'admin'),
        allowNull: false,
        defaultValue: 'mahasiswa',
      },
      jurusan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'jurusan', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      kelas: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'Contoh: A, B, C - kelas mahasiswa',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex('users', ['jurusan_id'], { name: 'idx_users_jurusan_id' });
    await queryInterface.addIndex('users', ['role'],       { name: 'idx_users_role' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
