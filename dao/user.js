const firebase = require('firebase');
const admin = require('firebase-admin');

const pool = require('./db');
const { customError, firebaseError } = require('../utils/errors/customError');

const checkNickname = async (nickname) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = 'SELECT nickname FROM user WHERE ?';
    const [checkRows] = await conn.query(checkSql, { nickname });
    return checkRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const checkEmail = async (email) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = 'SELECT email FROM user WHERE ?';
    const [checkRows] = await conn.query(checkSql, { email });
    return checkRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const signup = async (email, password, nickname) => {
  const { uid, emailVerified } = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((err) => {
      throw firebaseError(err);
    });

  const conn = await pool.getConnection();
  try {
    const sql = 'INSERT INTO user SET ?';
    const [rows] = await conn.query(sql, { uid, email, email_verified: emailVerified, nickname });
    return rows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const login = async (email, password) => {
  const { uid } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((err) => {
      throw firebaseError(err);
    });

  const conn = await pool.getConnection();
  try {
    const userSql = 'SELECT id FROM user WHERE ?';
    const [rows] = await conn.query(userSql, { uid });
    return rows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const userDetail = async (id) => {
  const conn = await pool.getConnection();
  try {
    const userSql = `
      SELECT 
        id, nickname, email, image, introduce, CONCAT(region_1depth_name, ' ', region_2depth_name) address, career_title, career_contents, sns_github, sns_linkedin, sns_web, email_verified,
        DATE_FORMAT(created_at, "%Y-%c-%d %H:%i:%s") created_at
      FROM user 
      WHERE ?`;
    const [userData] = await conn.query(userSql, { id });
    return userData;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getImage = async (id) => {
  const conn = await pool.getConnection();
  try {
    const imageSQL = 'SELECT image FROM user WHERE ?';
    const [imageRows] = await conn.query(imageSQL, { id });
    return imageRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const userUpdate = async (id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSql = 'UPDATE user SET ? WHERE ? ';
    const [updateRows] = await conn.query(updateSql, [updateData, { id }]);
    return updateRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const withdraw = async (id, email, password) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const withdrawSql = `DELETE FROM user WHERE ? AND ?`;
    const [withdrawRows] = await conn.query(withdrawSql, [{ id }, { email }]);
    if (!withdrawRows.affectedRows) {
      throw customError(400, '조회된 사용자가 없습니다');
    }
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user.delete();
      })
      .catch((err) => {
        throw firebaseError(err);
      });
    await conn.commit();
    return withdrawRows;
  } catch (err) {
    await conn.rollback();
    if (err.status) {
      throw err;
    } else if (err.errno === 1451) {
      throw customError(400, '해당 사용자에게 종속되어있는 데이터가 존재합니다');
    }
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const verifiedCheck = async (email) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = 'SELECT email_verified FROM user WHERE ?';
    const [checkRows] = await conn.query(checkSql, { email });
    return checkRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const emailVerificationProcess = async (email) => {
  const conn = await pool.getConnection();
  try {
    const uidSql = 'SELECT uid FROM user WHERE ?';
    const [uidRows] = await conn.query(uidSql, { email });
    const result = await admin
      .auth()
      .updateUser(uidRows[0].uid, {
        emailVerified: true,
      })
      .then(async () => {
        const updateSql = 'UPDATE user SET ? WHERE ?';
        const [updateRows] = await conn.query(updateSql, [{ email_verified: true }, { email }]);
        return updateRows;
      })
      .catch((err) => {
        throw firebaseError(err);
      });
    return result;
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

module.exports = {
  signup,
  login,
  userDetail,
  getImage,
  userUpdate,
  checkNickname,
  checkEmail,
  withdraw,
  verifiedCheck,
  emailVerificationProcess,
};
