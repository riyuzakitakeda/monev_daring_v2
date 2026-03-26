const sequelize = require('../config/database');
const Jurusan = require('./Jurusan');
const Dosen = require('./Dosen');
const Matakuliah = require('./Matakuliah');
const User = require('./User');
const Laporan = require('./Laporan');

// ── Associations ──────────────────────────────────────────

// Jurusan <-> Dosen
Jurusan.hasMany(Dosen, { foreignKey: 'jurusan_id', as: 'dosen' });
Dosen.belongsTo(Jurusan, { foreignKey: 'jurusan_id', as: 'jurusan' });

// Jurusan <-> Matakuliah
Jurusan.hasMany(Matakuliah, { foreignKey: 'jurusan_id', as: 'matakuliah' });
Matakuliah.belongsTo(Jurusan, { foreignKey: 'jurusan_id', as: 'jurusan' });

// Jurusan <-> User (mahasiswa)
Jurusan.hasMany(User, { foreignKey: 'jurusan_id', as: 'mahasiswa' });
User.belongsTo(Jurusan, { foreignKey: 'jurusan_id', as: 'jurusan' });

// Laporan -> User (pelapor)
User.hasMany(Laporan, { foreignKey: 'mahasiswa_id', as: 'laporan' });
Laporan.belongsTo(User, { foreignKey: 'mahasiswa_id', as: 'pelapor' });

// Laporan -> Matakuliah
Matakuliah.hasMany(Laporan, { foreignKey: 'matakuliah_id', as: 'laporan' });
Laporan.belongsTo(Matakuliah, { foreignKey: 'matakuliah_id', as: 'matakuliah' });

// Laporan -> Dosen
Dosen.hasMany(Laporan, { foreignKey: 'dosen_id', as: 'laporan' });
Laporan.belongsTo(Dosen, { foreignKey: 'dosen_id', as: 'dosen' });

// Laporan -> Jurusan
Jurusan.hasMany(Laporan, { foreignKey: 'jurusan_id', as: 'laporan' });
Laporan.belongsTo(Jurusan, { foreignKey: 'jurusan_id', as: 'jurusan' });

module.exports = { sequelize, Jurusan, Dosen, Matakuliah, User, Laporan };
