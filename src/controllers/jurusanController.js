const { Jurusan } = require('../models');

// GET /api/jurusan
const getAll = async (req, res, next) => {
  try {
    const data = await Jurusan.findAll({ order: [['nama_jurusan', 'ASC']] });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/jurusan/:id
const getById = async (req, res, next) => {
  try {
    const data = await Jurusan.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Jurusan tidak ditemukan.' });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// POST /api/jurusan
const create = async (req, res, next) => {
  try {
    const { kode_jurusan, nama_jurusan } = req.body;
    if (!kode_jurusan || !nama_jurusan) {
      return res.status(400).json({ success: false, message: 'kode_jurusan dan nama_jurusan wajib diisi.' });
    }
    const data = await Jurusan.create({ kode_jurusan, nama_jurusan });
    return res.status(201).json({ success: true, message: 'Jurusan berhasil ditambahkan.', data });
  } catch (error) {
    next(error);
  }
};

// PUT /api/jurusan/:id
const update = async (req, res, next) => {
  try {
    const data = await Jurusan.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Jurusan tidak ditemukan.' });
    const { kode_jurusan, nama_jurusan } = req.body;
    await data.update({ kode_jurusan, nama_jurusan });
    return res.status(200).json({ success: true, message: 'Jurusan berhasil diperbarui.', data });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jurusan/:id
const remove = async (req, res, next) => {
  try {
    const data = await Jurusan.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Jurusan tidak ditemukan.' });
    await data.destroy();
    return res.status(200).json({ success: true, message: 'Jurusan berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
