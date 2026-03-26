const { User, Jurusan } = require('../models');
const { Op } = require('sequelize');

// GET /api/users  (admin only)
const getAll = async (req, res, next) => {
  try {
    const { search, jurusan_id, role } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { nama: { [Op.like]: `%${search}%` } },
        { nim: { [Op.like]: `%${search}%` } },
      ];
    }
    if (jurusan_id) where.jurusan_id = jurusan_id;
    if (role)       where.role       = role;

    const data = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{ model: Jurusan, as: 'jurusan', attributes: ['id', 'nama_jurusan', 'kode_jurusan'] }],
      order: [['nama', 'ASC']],
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id  (admin only)
const getById = async (req, res, next) => {
  try {
    const data = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Jurusan, as: 'jurusan', attributes: ['id', 'nama_jurusan', 'kode_jurusan'] }],
    });
    if (!data) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// POST /api/users  (admin only) - buat user/admin baru
const create = async (req, res, next) => {
  try {
    const { nim, nama, password, role, jurusan_id, kelas } = req.body;
    if (!nim || !nama || !password) {
      return res.status(400).json({ success: false, message: 'NIM, nama, dan password wajib diisi.' });
    }
    const exists = await User.findOne({ where: { nim } });
    if (exists) return res.status(409).json({ success: false, message: 'NIM sudah terdaftar.' });

    const data = await User.create({ nim, nama, password, role: role || 'mahasiswa', jurusan_id, kelas });
    const result = await User.findByPk(data.id, { attributes: { exclude: ['password'] } });
    return res.status(201).json({ success: true, message: 'User berhasil dibuat.', data: result });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id  (admin only)
const update = async (req, res, next) => {
  try {
    const data = await User.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    const { nama, role, jurusan_id, kelas, is_active } = req.body;
    await data.update({ nama, role, jurusan_id, kelas, is_active });
    const result = await User.findByPk(data.id, { attributes: { exclude: ['password'] } });
    return res.status(200).json({ success: true, message: 'User berhasil diperbarui.', data: result });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id  (admin only)
const remove = async (req, res, next) => {
  try {
    const data = await User.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    await data.destroy();
    return res.status(200).json({ success: true, message: 'User berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
