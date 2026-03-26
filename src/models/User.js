const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nim: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  nama: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('mahasiswa', 'admin', 'jurusan'),
    allowNull: false,
    defaultValue: 'mahasiswa',
  },
  jurusan_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'jurusan',
      key: 'id',
    },
  },
  kelas: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Contoh: A, B, C - kelas mahasiswa',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
