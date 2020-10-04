const mysql = require('mysql2/promise');
const config = require('../configs/config');

let pool = mysql.createPool(config.rds.development);

module.exports = pool;
