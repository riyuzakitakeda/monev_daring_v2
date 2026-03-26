'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dosen', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nidn: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      nama: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      no_hp: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      jurusan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'jurusan', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.addIndex('dosen', ['jurusan_id'], { name: 'idx_dosen_jurusan_id' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('dosen');
  },
};
