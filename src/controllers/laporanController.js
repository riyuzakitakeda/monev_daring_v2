const { Laporan, User, Matakuliah, Dosen, Jurusan } = require('../models');
const { Op } = require('sequelize');

const includeRelations = [
  { model: User,       as: 'pelapor',    attributes: ['id', 'nim', 'nama', 'kelas'] },
  { model: Matakuliah, as: 'matakuliah', attributes: ['id', 'kode_mk', 'nama_mk', 'sks', 'semester'] },
  { model: Dosen,      as: 'dosen',      attributes: ['id', 'nidn', 'nama'] },
  { model: Jurusan,    as: 'jurusan',    attributes: ['id', 'kode_jurusan', 'nama_jurusan'] },
];

// GET /api/laporan
const getAll = async (req, res, next) => {
  try {
    const { jurusan_id, matakuliah_id, dosen_id, status, tanggal_mulai, tanggal_akhir, kelas, pertemuan_ke, page = 1, limit = 20 } = req.query;
    const where = {};

    if (jurusan_id)    where.jurusan_id    = jurusan_id;
    if (matakuliah_id) where.matakuliah_id = matakuliah_id;
    if (dosen_id)      where.dosen_id      = dosen_id;
    if (status)        where.status        = status;
    if (kelas)         where.kelas         = kelas;
    if (pertemuan_ke)  where.pertemuan_ke  = pertemuan_ke;

    if (tanggal_mulai || tanggal_akhir) {
      where.tanggal_pelaksanaan = {};
      if (tanggal_mulai) where.tanggal_pelaksanaan[Op.gte] = tanggal_mulai;
      if (tanggal_akhir) where.tanggal_pelaksanaan[Op.lte] = tanggal_akhir;
    }

    // Mahasiswa & akun jurusan hanya melihat laporan dari jurusan mereka sendiri
    if ((req.user.role === 'mahasiswa' || req.user.role === 'jurusan') && req.user.jurusan_id) {
      where.jurusan_id = req.user.jurusan_id;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Laporan.findAndCountAll({
      where,
      include: includeRelations,
      order: [['tanggal_pelaksanaan', 'DESC'], ['pertemuan_ke', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/laporan/:id
const getById = async (req, res, next) => {
  try {
    const data = await Laporan.findByPk(req.params.id, { include: includeRelations });
    if (!data) return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan.' });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// POST /api/laporan
const create = async (req, res, next) => {
  try {
    const {
      matakuliah_id, dosen_id, jurusan_id, pertemuan_ke,
      status, tanggal_pelaksanaan, pokok_bahasan,
      kelas, keterangan, jam_mulai, jam_selesai, link_online, jumlah_hadir,
    } = req.body;

    // Validasi field wajib
    const required = { matakuliah_id, dosen_id, jurusan_id, pertemuan_ke, status, tanggal_pelaksanaan };
    const missing = Object.entries(required).filter(([, v]) => v === undefined || v === null || v === '').map(([k]) => k);
    if (missing.length > 0) {
      return res.status(400).json({ success: false, message: `Field berikut wajib diisi: ${missing.join(', ')}` });
    }

    const validStatus = ['terlaksana_online', 'terlaksana_offline', 'tidak_terlaksana'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ success: false, message: `Status harus salah satu dari: ${validStatus.join(', ')}` });
    }

    const data = await Laporan.create({
      mahasiswa_id: req.user.id,
      matakuliah_id, dosen_id, jurusan_id, pertemuan_ke,
      status, tanggal_pelaksanaan, pokok_bahasan,
      kelas: kelas || req.user.kelas || null,
      keterangan, jam_mulai, jam_selesai, link_online, jumlah_hadir,
    });

    const result = await Laporan.findByPk(data.id, { include: includeRelations });
    return res.status(201).json({ success: true, message: 'Laporan berhasil disimpan.', data: result });
  } catch (error) {
    next(error);
  }
};

// PUT /api/laporan/:id
const update = async (req, res, next) => {
  try {
    const data = await Laporan.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan.' });

    // Hanya pelapor atau admin yang boleh edit
    if (req.user.role !== 'admin' && data.mahasiswa_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki akses untuk mengubah laporan ini.' });
    }

    const {
      matakuliah_id, dosen_id, jurusan_id, pertemuan_ke,
      status, tanggal_pelaksanaan, pokok_bahasan,
      kelas, keterangan, jam_mulai, jam_selesai, link_online, jumlah_hadir,
    } = req.body;

    if (status) {
      const validStatus = ['terlaksana_online', 'terlaksana_offline', 'tidak_terlaksana'];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ success: false, message: `Status tidak valid.` });
      }
    }

    await data.update({
      matakuliah_id, dosen_id, jurusan_id, pertemuan_ke,
      status, tanggal_pelaksanaan, pokok_bahasan,
      kelas, keterangan, jam_mulai, jam_selesai, link_online, jumlah_hadir,
    });

    const result = await Laporan.findByPk(data.id, { include: includeRelations });
    return res.status(200).json({ success: true, message: 'Laporan berhasil diperbarui.', data: result });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/laporan/:id
const remove = async (req, res, next) => {
  try {
    const data = await Laporan.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan.' });

    if (req.user.role !== 'admin' && data.mahasiswa_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki akses untuk menghapus laporan ini.' });
    }

    await data.destroy();
    return res.status(200).json({ success: true, message: 'Laporan berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/laporan/rekap/matakuliah/:matakuliah_id
// Rekap pertemuan yang sudah & belum tercatat untuk satu matakuliah
const rekapMatakuliah = async (req, res, next) => {
  try {
    const { matakuliah_id } = req.params;
    const { kelas, jurusan_id } = req.query;
    const where = { matakuliah_id };
    if (kelas) where.kelas = kelas;
    if (jurusan_id) where.jurusan_id = jurusan_id;

    const laporan = await Laporan.findAll({
      where,
      include: [
        { model: Dosen,   as: 'dosen',      attributes: ['id', 'nidn', 'nama'] },
        { model: Jurusan, as: 'jurusan',     attributes: ['id', 'nama_jurusan'] },
        { model: User,    as: 'pelapor',     attributes: ['id', 'nim', 'nama'] },
      ],
      order: [['pertemuan_ke', 'ASC']],
    });

    const mk = await Matakuliah.findByPk(matakuliah_id, {
      include: [{ model: Jurusan, as: 'jurusan', attributes: ['id', 'nama_jurusan'] }],
    });

    const totalTerlaksana = laporan.filter((l) => l.status !== 'tidak_terlaksana').length;
    const totalTidakTerlaksana = laporan.filter((l) => l.status === 'tidak_terlaksana').length;

    return res.status(200).json({
      success: true,
      data: {
        matakuliah: mk,
        total_pertemuan_terlaksana: totalTerlaksana,
        total_tidak_terlaksana: totalTidakTerlaksana,
        total_laporan: laporan.length,
        detail: laporan,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, rekapMatakuliah };
