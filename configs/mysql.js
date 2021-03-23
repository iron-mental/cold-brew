const mysql = require('mysql2/promise');

const rdsConfig = {
  development: {
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    connectionLimit: process.env.DB_connectionLimit,
    waitForConnections: Boolean(process.env.DB_waitForConnections),
  },
};

const pool = mysql.createPool(rdsConfig.development);

module.exports = pool;
