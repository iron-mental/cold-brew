require('dotenv').config();

const rds = {
  development: {
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    connectionLimit: process.env.DB_connectionLimit,
    waitForConnections: process.env.DB_waitForConnections,
  },
};

module.exports = { rds };
