const { Matakuliah, Jurusan } = require('../models');
const { Op } = require('sequelize');

// GET /api/matakuliah
const getAll = async (req, res, next) => {
  try {
    const { search, jurusan_id, semester } = req.query;
    const where = {};
    if (search) where.nama_mk = { [Op.like]: `%${search}%` };
    if (jurusan_id) where.jurusan_id = jurusan_id;
    if (semester) where.semester = semester;

    const data = await Matakuliah.findAll({
      where,
      include: [{ model: Jurusan, as: 'jurusan', attributes: ['id', 'nama_jurusan', 'kode_jurusan'] }],
      order: [['nama_mk', 'ASC']],
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/matakuliah/:id
const getById = async (req, res, next) => {
  try {
    const data = await Matakuliah.findByPk(req.params.id, {
      include: [{ model: Jurusan, as: 'jurusan', attributes: ['id', 'nama_jurusan', 'kode_jurusan'] }],
    });
    if (!data) return res.status(404).json({ success: false, message: 'Matakuliah tidak ditemukan.' });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// POST /api/matakuliah
const create = async (req, res, next) => {
  try {
    const { kode_mk, nama_mk, sks, semester, jurusan_id } = req.body;
    if (!kode_mk || !nama_mk || !jurusan_id) {
      return res.status(400).json({ success: false, message: 'kode_mk, nama_mk, dan jurusan_id wajib diisi.' });
    }
    const data = await Matakuliah.create({ kode_mk, nama_mk, sks: sks || 2, semester, jurusan_id });
    return res.status(201).json({ success: true, message: 'Matakuliah berhasil ditambahkan.', data });
  } catch (error) {
    next(error);
  }
};

// PUT /api/matakuliah/:id
const update = async (req, res, next) => {
  try {
    const data = await Matakuliah.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Matakuliah tidak ditemukan.' });
    const { kode_mk, nama_mk, sks, semester, jurusan_id } = req.body;
    await data.update({ kode_mk, nama_mk, sks, semester, jurusan_id });
    return res.status(200).json({ success: true, message: 'Matakuliah berhasil diperbarui.', data });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/matakuliah/:id
const remove = async (req, res, next) => {
  try {
    const data = await Matakuliah.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Matakuliah tidak ditemukan.' });
    await data.destroy();
    return res.status(200).json({ success: true, message: 'Matakuliah berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
