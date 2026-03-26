const { Dosen, Jurusan } = require('../models');
const { Op } = require('sequelize');

const includeJurusan = [{ model: Jurusan, as: 'jurusan', attributes: ['id', 'kode_jurusan', 'nama_jurusan'] }];

// GET /api/dosen
const getAll = async (req, res, next) => {
  try {
    const { search, jurusan_id } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [{ nama: { [Op.like]: `%${search}%` } }, { nidn: { [Op.like]: `%${search}%` } }];
    }
    if (jurusan_id) where.jurusan_id = jurusan_id;
    const data = await Dosen.findAll({ where, include: includeJurusan, order: [['nama', 'ASC']] });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/dosen/:id
const getById = async (req, res, next) => {
  try {
    const data = await Dosen.findByPk(req.params.id, { include: includeJurusan });
    if (!data) return res.status(404).json({ success: false, message: 'Dosen tidak ditemukan.' });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// POST /api/dosen
const create = async (req, res, next) => {
  try {
    const { nidn, nama, email, no_hp, jurusan_id } = req.body;
    if (!nidn || !nama) {
      return res.status(400).json({ success: false, message: 'NIDN dan nama wajib diisi.' });
    }
    const created = await Dosen.create({ nidn, nama, email, no_hp, jurusan_id: jurusan_id || null });
    const data = await Dosen.findByPk(created.id, { include: includeJurusan });
    return res.status(201).json({ success: true, message: 'Dosen berhasil ditambahkan.', data });
  } catch (error) {
    next(error);
  }
};

// PUT /api/dosen/:id
const update = async (req, res, next) => {
  try {
    const data = await Dosen.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Dosen tidak ditemukan.' });
    const { nidn, nama, email, no_hp, jurusan_id } = req.body;
    await data.update({ nidn, nama, email, no_hp, jurusan_id });
    const result = await Dosen.findByPk(data.id, { include: includeJurusan });
    return res.status(200).json({ success: true, message: 'Dosen berhasil diperbarui.', data: result });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/dosen/:id
const remove = async (req, res, next) => {
  try {
    const data = await Dosen.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Dosen tidak ditemukan.' });
    await data.destroy();
    return res.status(200).json({ success: true, message: 'Dosen berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
