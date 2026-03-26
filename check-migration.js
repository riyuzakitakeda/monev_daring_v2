require('dotenv').config();
const { Sequelize } = require('sequelize');
const pg = require('pg');

const s = new Sequelize(
  process.env.DB_NAME,
  'postgres.waidabpztpmotxjzofxb',
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  }
);

s.query('SELECT name FROM "SequelizeMeta" ORDER BY name')
  .then(([rows]) => {
    console.log('=== Migrations yang sudah berjalan ===');
    rows.forEach((r) => console.log(' -', r.name));
    return s.query(`
      SELECT column_name, is_nullable, data_type
      FROM information_schema.columns
      WHERE table_name = 'laporan'
        AND column_name IN ('pokok_bahasan','keterangan','jam_mulai','jam_selesai','link_online','jumlah_hadir')
      ORDER BY column_name
    `);
  })
  .then(([cols]) => {
    console.log('\n=== Status kolom di tabel laporan ===');
    cols.forEach((c) => console.log(` - ${c.column_name}: nullable=${c.is_nullable}`));
    process.exit(0);
  })
  .catch((e) => {
    console.error('ERROR:', e.message);
    process.exit(1);
  });
