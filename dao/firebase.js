const firebase = require('firebase');

const pool = require('./db');

const verifiedCheck = async (id) => {
  try {
    var conn = await pool.getConnection();
    const emailSql = 'SELECT email_verified FROM user WHERE ?';
    const [emailRows] = await conn.query(emailSql, { id });
    return emailRows;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

const emailVerificationProcess = async (email) => {
  try {
    var conn = await pool.getConnection();
    const updateSql = 'UPDATE user SET ? WHERE ?';
    const [updateRows] = await conn.query(updateSql, [{ email_verified: true }, { email }]);
    return updateRows;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

module.exports = { verifiedCheck, emailVerificationProcess };
