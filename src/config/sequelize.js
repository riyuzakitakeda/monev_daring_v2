require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const pg = require('pg');

const sharedConfig = {
  username:       'postgres.waidabpztpmotxjzofxb',
  password:       process.env.DB_PASS,
  database:       process.env.DB_NAME,
  host:           process.env.DB_HOST,
  port:           parseInt(process.env.DB_PORT) || 5432,
  dialect:        'postgres',
  dialectModule:  pg,
  logging:        false,
  dialectOptions: {
    ssl: {
      require:            true,
      rejectUnauthorized: false,
    },
  },
};

module.exports = {
  development: { ...sharedConfig },
  test:        { ...sharedConfig, database: (process.env.DB_NAME || 'monev_kuliah') + '_test' },
  production:  { ...sharedConfig },
};
