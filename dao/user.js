const firebase = require('firebase');

const pool = require('./db');
const config = require('../configs/config');

firebase.initializeApp(config.firebase);

const signup = async (email, password, nickname) => {
  const { uid, emailVerified } = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      return userCredential.user;
    })
    .catch(error => {
      console.error('Firebase Error: ', error);
      throw { status: 400, message: 'Firebase Error: ' + error.code };
    });

  try {
    const conn = await pool.getConnection();
    const sql = 'INSERT INTO user SET ?';
    const [rows] = await conn.query(sql, { uid, email, emailVerified, nickname });
    conn.release();
    return rows;
  } catch (err) {
    console.error('Dao err: ', err);
    throw { status: 500, message: 'DB Error' };
  }
};

const login = async (email, password) => {
  const uid = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      return userCredential.user.uid;
    })
    .catch(error => {
      console.error('Firebase Error: ', error);
      throw { status: 400, message: 'Firebase Error: ' + error.code };
    });

  try {
    const conn = await pool.getConnection();
    const sql = // 조인 쿼리 수정 예정
      'SELECT id, nickname, email, image, introduce, location, career_title, career_contents, sns_github, sns_linkedin, sns_web, emailVerified, created_at FROM user WHERE ?';
    const [rows] = await conn.query(sql, { uid });
    conn.release();
    return rows;
  } catch (err) {
    console.error('Dao err: ', err);
    throw { status: 500, message: 'DB Error' };
  }
};

const userDetail = async id => {
  try {
    const conn = await pool.getConnection();
    const userSQL = // 조인 쿼리 수정 예정
      'SELECT id, nickname, email, image, introduce, location, career_title, career_contents, sns_github, sns_linkedin, sns_web, emailVerified, created_at FROM user WHERE ?';
    let [rows] = await conn.query(userSQL, { id });
    result = rows;

    const projectSQL = 'SELECT id, title, contents,sns_github, sns_appstore, sns_playstore FROM project WHERE ?';
    [rows] = await conn.query(projectSQL, { user_id: result[0].id });
    result[0].project = rows;
    conn.release();
    return result;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  }
};

const userUpdate = async (id, updateData) => {
  try {
    const conn = await pool.getConnection();
    let sql = 'UPDATE user SET ? WHERE ? ';
    await conn.query(sql, [updateData, { id }]);
    sql =
      'SELECT nickname, email, image, introduce, location, career_title, career_contents, sns_github, sns_linkedin, sns_web, emailVerified, created_at FROM user WHERE ?';
    const [rows] = await conn.query(sql, { id });
    conn.release();
    return rows;
  } catch (err) {
    console.error('Dao err: ', err);
    throw { status: 500, message: 'DB Error' };
  }
};

const checkNickname = async nickname => {
  try {
    const conn = await pool.getConnection();
    const sql = 'SELECT * FROM user WHERE ?';
    const [rows] = await conn.query(sql, { nickname });
    conn.release();
    return rows;
  } catch (err) {
    console.error('Dao err: ', err);
    throw { status: 500, message: 'DB Error' };
  }
};

const checkEmail = async email => {
  try {
    const conn = await pool.getConnection();
    const sql = 'SELECT * FROM user WHERE ?';
    const [rows] = await conn.query(sql, { email });
    conn.release();
    return rows;
  } catch (err) {
    console.error('Dao err: ', err);
    throw { status: 500, message: 'DB Error' };
  }
};

const withdraw = async (id, email, password) => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      var user = firebase.auth().currentUser;
      user.delete();
    })
    .catch(function (error) {
      console.error('Firebase Error: ', error);
      throw { status: 400, message: 'Firebase Error: ' + error.code };
    });

  try {
    const conn = await pool.getConnection();
    const sql = `DELETE FROM user WHERE id = ? and email = ?`;
    const [rows] = await conn.query(sql, [id, email]);
    conn.release();
    return rows;
  } catch (err) {
    console.error('Dao err: ', err);
    if (err.errno === 1451) {
      throw {
        status: 400,
        message: '해당 사용자에게 종속되어있는 데이터가 존재합니다',
      };
    }
    throw { status: 500, message: 'DB Error' };
  }
};

module.exports = {
  signup,
  login,
  userDetail,
  userUpdate,
  checkNickname,
  checkEmail,
  withdraw,
};
