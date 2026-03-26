const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jurusan = sequelize.define('Jurusan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  kode_jurusan: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  nama_jurusan: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'jurusan',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Jurusan;
