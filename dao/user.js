const firebase = require('firebase');
const admin = require('firebase-admin');

const pool = require('../configs/mysql');
const { customError } = require('../utils/errors/custom');
const { firebaseError } = require('../utils/errors/firebase');
const { databaseError } = require('../utils/errors/database');

const checkNickname = async (nickname, user_id) => {
  if (!user_id) {
    user_id = 0;
  }
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT nickname
      FROM user
      WHERE BINARY nickname = ?
        AND NOT id = ?`;
    const [checkRows] = await conn.query(checkSql, [nickname, user_id]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const checkEmail = async (email) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT email
      FROM user
      WHERE BINARY email = ?`;
    const [checkRows] = await conn.query(checkSql, [email]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
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
    conn.beginTransaction();

    const signupSql = `
      INSERT INTO user
      SET ?`;
    const [signupRows] = await conn.query(signupSql, { uid, email, email_verified: emailVerified, nickname });

    const categorySql = `
      INSERT INTO category_count
      SET ?`;
    await conn.query(categorySql, { user_id: signupRows.insertId });

    conn.commit();
    return signupRows;
  } catch (err) {
    conn.rollback();
    throw databaseError(err);
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
    const userSql = `
      SELECT id, email storedEmail, nickname
      FROM user
      WHERE uid = ?`;
    const [rows] = await conn.query(userSql, [uid]);
    return rows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getUser = async (id) => {
  const conn = await pool.getConnection();
  try {
    const userSql = `
      SELECT 
        id, nickname, email, image, introduce, sido, sigungu, career_title, career_contents, sns_github, sns_linkedin, sns_web, email_verified,
        DATE_FORMAT(created_at, "%Y-%c-%d %H:%i:%s") created_at
      FROM user 
      WHERE id = ?`;
    const [userData] = await conn.query(userSql, [id]);
    return userData;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getImage = async (id) => {
  const conn = await pool.getConnection();
  try {
    const imageSQL = `
      SELECT image
      FROM user
      WHERE ?`;
    const [imageRows] = await conn.query(imageSQL, [id]);
    return imageRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateUser = async (id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSql = `
      UPDATE user
      SET ?
      WHERE id = ?`;
    const [updateRows] = await conn.query(updateSql, [updateData, [id]]);
    return updateRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const withdraw = async (id, email, password) => {
  const conn = await pool.getConnection();
  try {
    conn.beginTransaction();

    const withdrawSql = `
      DELETE FROM user
      WHERE id = ?
        AND BINARY email = ?`;
    const [withdrawRows] = await conn.query(withdrawSql, [id, email]);

    if (!withdrawRows.affectedRows) {
      throw customError(404, '조회된 사용자가 없습니다');
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
    conn.commit();
    return withdrawRows;
  } catch (err) {
    conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }
};

const verifiedCheck = async (userData) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT email, email_verified
      FROM user
      WHERE ?`;
    const [checkRows] = await conn.query(checkSql, [userData]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const emailVerificationHandler = async (email) => {
  const conn = await pool.getConnection();
  try {
    const uidSql = `
      SELECT uid
      FROM user
      WHERE BINARY email =?`;
    const [uidRows] = await conn.query(uidSql, [email]);
    const result = admin
      .auth()
      .updateUser(uidRows[0].uid, {
        emailVerified: true,
      })
      .then(async () => {
        const updateSql = `
          UPDATE user
          SET email_verified = ?
          WHERE BINARY email = ?`;
        await conn.query(updateSql, [true, email]);

        const userSql = `
          SELECT nickname
          FROM user
          WHERE ?`;
        const [userRows] = await conn.query(userSql, [email]);
        return userRows;
      })
      .catch((err) => {
        throw firebaseError(err);
      });
    return result;
  } catch (err) {
    if (err.status) {
      throw firebaseError(err);
    } else {
      throw databaseError(err);
    }
  } finally {
    await conn.release();
  }
};

const checkRefreshToken = async (refreshToken) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT id, email, nickname, access_token
      FROM user
      WHERE refresh_token = ?`;
    const [checkRows] = await conn.query(checkSql, [refreshToken]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateEmail = async (id, email) => {
  const conn = await pool.getConnection();
  try {
    conn.beginTransaction();
    const uidSql = `
      SELECT uid
      FROM user
      WHERE id = ?`;
    const [uidRows] = await conn.query(uidSql, [id]);
    const { uid } = uidRows[0];

    await admin
      .auth()
      .updateUser(uid, {
        email,
        emailVerified: false,
      })
      .catch((err) => {
        throw firebaseError(err);
      });

    const updateSql = `
      UPDATE user
      SET ?
      WHERE id = ?`;
    const [updateRows] = await conn.query(updateSql, [{ email, email_verified: false }, id]);

    conn.commit();
    return updateRows;
  } catch (err) {
    conn.rollback();
    if (err.status) {
      throw err;
    }
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getAddress = async () => {
  const conn = await pool.getConnection();
  try {
    const addressSql = `
      SELECT *
      FROM address`;
    const [addressRows] = await conn.query(addressSql);
    return addressRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const clearPushToken = async (push_token) => {
  const conn = await pool.getConnection();
  try {
    const clearSql = `
      UPDATE user
      SET push_token = ?
      WHERE push_token = ?`;
    await conn.query(clearSql, ['', push_token]);
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  signup,
  login,
  getUser,
  getImage,
  updateUser,
  checkNickname,
  checkEmail,
  withdraw,
  verifiedCheck,
  emailVerificationHandler,
  checkRefreshToken,
  updateEmail,
  getAddress,
  clearPushToken,
};
