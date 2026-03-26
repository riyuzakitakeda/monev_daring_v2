const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Laporan = sequelize.define('Laporan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Mahasiswa yang melaporkan (ketua kelas)
  mahasiswa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  // Matakuliah yang dilaporkan
  matakuliah_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'matakuliah',
      key: 'id',
    },
  },
  // Dosen yang mengajar
  dosen_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'dosen',
      key: 'id',
    },
  },
  // Jurusan
  jurusan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jurusan',
      key: 'id',
    },
  },
  // Pertemuan ke berapa
  pertemuan_ke: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 20,
    },
  },
  // Status perkuliahan
  status: {
    type: DataTypes.ENUM('terlaksana_online', 'terlaksana_offline', 'tidak_terlaksana'),
    allowNull: false,
  },
  // Tanggal pelaksanaan
  tanggal_pelaksanaan: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // Pokok bahasan / materi yang disampaikan
  pokok_bahasan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Kelas yang mengikuti
  kelas: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  // Catatan tambahan jika tidak terlaksana (alasan, dll)
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Jam mulai
  jam_mulai: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  // Jam selesai
  jam_selesai: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  // Link perkuliahan online (jika online)
  link_online: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Jumlah mahasiswa hadir
  jumlah_hadir: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'laporan',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['matakuliah_id', 'pertemuan_ke', 'kelas', 'jurusan_id'],
      name: 'unique_laporan_per_pertemuan',
    },
  ],
});

module.exports = Laporan;
