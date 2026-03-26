const jwt = require('jsonwebtoken');
const { User, Jurusan } = require('../models');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, nim: user.nim, nama: user.nama, role: user.role, jurusan_id: user.jurusan_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { nim, nama, password, jurusan_id, kelas } = req.body;

    if (!nim || !nama || !password) {
      return res.status(400).json({ success: false, message: 'NIM, nama, dan password wajib diisi.' });
    }

    const existing = await User.findOne({ where: { nim } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'NIM sudah terdaftar.' });
    }

    const user = await User.create({ nim, nama, password, jurusan_id: jurusan_id || null, kelas: kelas || null, role: 'mahasiswa' });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil.',
      data: {
        id: user.id, nim: user.nim, nama: user.nama, role: user.role, kelas: user.kelas, jurusan_id: user.jurusan_id,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { nim, password } = req.body;

    if (!nim || !password) {
      return res.status(400).json({ success: false, message: 'NIM dan password wajib diisi.' });
    }

    const user = await User.findOne({
      where: { nim, is_active: true },
      include: [{ model: Jurusan, as: 'jurusan', attributes: ['id', 'nama_jurusan', 'kode_jurusan'] }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'NIM atau password salah.' });
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'NIM atau password salah.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: {
        id: user.id, nim: user.nim, nama: user.nama, role: user.role, kelas: user.kelas,
        jurusan_id: user.jurusan_id, jurusan: user.jurusan,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Jurusan, as: 'jurusan', attributes: ['id', 'nama_jurusan', 'kode_jurusan'] }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { password_lama, password_baru } = req.body;

    if (!password_lama || !password_baru) {
      return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi.' });
    }

    const user = await User.findByPk(req.user.id);
    const isValid = await user.validatePassword(password_lama);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Password lama tidak sesuai.' });
    }

    user.password = password_baru;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password berhasil diubah.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me, changePassword };
