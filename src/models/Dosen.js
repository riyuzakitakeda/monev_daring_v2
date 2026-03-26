const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dosen = sequelize.define('Dosen', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nidn: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  nama: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: { isEmail: true },
  },
  no_hp: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  jurusan_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'jurusan',
      key: 'id',
    },
  },
}, {
  tableName: 'dosen',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Dosen;
