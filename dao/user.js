const firebase = require('firebase');

const pool = require('./db');

const checkNickname = async (nickname) => {
  try {
    var conn = await pool.getConnection();
    const checkSql = 'SELECT nickname FROM user WHERE ?';
    const [checkRows] = await conn.query(checkSql, { nickname });
    return checkRows;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

const checkEmail = async (email) => {
  try {
    var conn = await pool.getConnection();
    const checkSql = 'SELECT email FROM user WHERE ?';
    const [checkRows] = await conn.query(checkSql, { email });
    return checkRows;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
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
    .catch((error) => {
      throw { status: 400, message: 'Firebase Error: ' + error.code };
    });
  try {
    var conn = await pool.getConnection();
    const sql = 'INSERT INTO user SET ?';
    const [rows] = await conn.query(sql, { uid, email, email_verified: emailVerified, nickname });
    return rows;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

const login = async (email, password) => {
  const { uid, emailVerified: email_verified } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      throw { status: 400, message: 'Firebase Error: ' + error.code };
    });

  try {
    var conn = await pool.getConnection();
    const userSql = 'SELECT id FROM user WHERE ?';
    const [rows] = await conn.query(userSql, { uid });
    return rows;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

const userDetail = async (id) => {
  try {
    var conn = await pool.getConnection();
    const userSql = `
    SELECT u.id, u.nickname, u.email, u.image, u.introduce, u.location, u.career_title, u.career_contents, u.sns_github, u.sns_linkedin, u.sns_web, u.email_verified,
    FROM_UNIXTIME(UNIX_TIMESTAMP(u.created_at), '%Y-%m-%d %H:%i:%s') AS created_at,
    p.id AS P_id, p.title AS P_title, p.contents AS P_contents, p.sns_github AS P_sns_github, p.sns_appstore AS P_sns_appstore, p.sns_playstore AS P_sns_playstore,
    FROM_UNIXTIME(UNIX_TIMESTAMP(p.created_at), '%Y-%m-%d %H:%i:%s') AS P_created_at
    FROM user AS u
    LEFT JOIN project AS p
    ON u.id = p.user_id
    WHERE u.id = ?`;
    const [userData] = await conn.query(userSql, id);
    return userData;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

const getImage = async (id) => {
  try {
    var conn = await pool.getConnection();
    const imageSQL = 'SELECT image FROM user WHERE ?';
    const [imageRows] = await conn.query(imageSQL, { id });
    return imageRows;
  } catch (err) {
    console.error('Dao err: ', err);
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

const userUpdate = async (id, updateData) => {
  try {
    var conn = await pool.getConnection();
    const updateSql = 'UPDATE user SET ? WHERE ? ';
    const [updateRows] = await conn.query(updateSql, [updateData, { id }]);
    return updateRows;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
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
      throw {
        status: 404,
        message: '조회된 사용자가 없습니다',
      };
    }
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user.delete();
      })
      .catch(function (error) {
        throw { status: 400, message: 'Firebase Error: ' + error.code };
      });
    await conn.commit();
    return withdrawRows;
  } catch (err) {
    await conn.rollback();
    if (err.status) {
      throw err;
    } else if (err.errno === 1451) {
      throw { status: 400, message: '해당 사용자에게 종속되어있는 데이터가 존재합니다' };
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
};
