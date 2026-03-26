const express = require('express');
const cors    = require('cors');
const path = require('path');
require('dotenv').config();

const errorHandler  = require('./middleware/errorHandler');

// Routes
const authRoutes       = require('./routes/auth');
const jurusanRoutes    = require('./routes/jurusan');
const dosenRoutes      = require('./routes/dosen');
const matakuliahRoutes = require('./routes/matakuliah');
const laporanRoutes    = require('./routes/laporan');
const userRoutes       = require('./routes/users');
const db = require('./models');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────
// app.get('/', (req, res) => {
//   res.json({ success: true, message: 'Monev Kuliah API is running 🚀', version: '1.0.0' });
// });


// Serve static files from backend/dist if present
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('/cron/ping-db', async (req, res) => {
	try {
		await db.sequelize.query('SELECT 1');
		res.json({ ok: true, service: 'db', ts: new Date().toISOString() });
	} catch (err) {
		console.error('Cron ping-db failed:', err);
		res.status(500).json({ ok: false, error: 'DB ping failed' });
	}
});

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/jurusan',     jurusanRoutes);
app.use('/api/dosen',       dosenRoutes);
app.use('/api/matakuliah',  matakuliahRoutes);
app.use('/api/laporan',     laporanRoutes);
app.use('/api/users',       userRoutes);


// SPA fallback: for non-API GET routes, serve index.html from dist
app.get('*', (req, res, next) => {
	const apiPrefixes = ['/api/', '/cron/'];
	if (apiPrefixes.some((p) => req.path.startsWith(p))) return next();
	if (req.method !== 'GET') return next();
	return res.sendFile(path.join(distPath, 'index.html'));
});

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.` });
});

// ── Global error handler ──────────────────────────────────
app.use(errorHandler);

module.exports = app;
