const { Sequelize } = require('sequelize');
require('dotenv').config();
const pg = require('pg');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  "postgres.waidabpztpmotxjzofxb",
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;
