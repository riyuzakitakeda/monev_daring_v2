const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const errorHandler  = require('./middleware/errorHandler');

// Routes
const authRoutes       = require('./routes/auth');
const jurusanRoutes    = require('./routes/jurusan');
const dosenRoutes      = require('./routes/dosen');
const matakuliahRoutes = require('./routes/matakuliah');
const laporanRoutes    = require('./routes/laporan');
const userRoutes       = require('./routes/users');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Monev Kuliah API is running 🚀', version: '1.0.0' });
});

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/jurusan',     jurusanRoutes);
app.use('/api/dosen',       dosenRoutes);
app.use('/api/matakuliah',  matakuliahRoutes);
app.use('/api/laporan',     laporanRoutes);
app.use('/api/users',       userRoutes);

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.` });
});

// ── Global error handler ──────────────────────────────────
app.use(errorHandler);

module.exports = app;
