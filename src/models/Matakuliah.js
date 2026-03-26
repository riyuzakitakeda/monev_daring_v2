const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Matakuliah = sequelize.define('Matakuliah', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  kode_mk: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  nama_mk: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  sks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  jurusan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jurusan',
      key: 'id',
    },
  },
}, {
  tableName: 'matakuliah',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Matakuliah;
