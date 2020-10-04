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
    await conn.release();
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

  let userData = {};
  try {
    const conn = await pool.getConnection();
    const userSQL =
      'SELECT id, nickname, email, image, introduce, location, careerTitle, careerContents, snsGithub, snsLinkedin, snsWeb, emailVerified, createdAt FROM user WHERE ?';
    let [rows] = await conn.query(userSQL, { uid });
    userData = rows;

    const projectSQL =
      'SELECT title, contents, snsGithub, snsAppstore, snsPlaystore FROM project WHERE (SELECT id FROM user WHERE ?)';
    const [projects] = await conn.query(projectSQL, { uid });
    userData[0].project = projects;
    await conn.release();
    return userData;
  } catch (err) {
    console.error('Dao err: ', err);
    throw { status: 500, message: 'DB Error' };
  }
};

const userDetail = async id => {
  let userData = {};
  try {
    const conn = await pool.getConnection();
    const userSQL =
      'SELECT nickname, email, image, introduce, location, careerTitle, careerContents, snsGithub, snsLinkedin, snsWeb, emailVerified, createdAt FROM user WHERE ?';
    let [rows] = await conn.query(userSQL, { id });
    userData = rows;

    const projectSQL =
      'SELECT p.title, p.contents, p.snsGithub, p.snsAppstore, p.snsPlaystore FROM project AS p LEFT JOIN user ON user.id = p.userId WHERE ?';
    const [projects] = await conn.query(projectSQL, { userId: id });
    userData[0].project = projects;
    await conn.release();
    return userData;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  }
};

const userUpdate = async (id, updateData) => {
  let userData = {};
  try {
    const conn = await pool.getConnection();
    let sql = 'UPDATE user SET ? WHERE ? ';
    await conn.query(sql, [updateData, { id }]);

    const userSQL =
      'SELECT nickname, email, image, introduce, location, careerTitle, careerContents, snsGithub, snsLinkedin, snsWeb, emailVerified, createdAt FROM user WHERE ?';
    let [rows] = await conn.query(userSQL, { id });
    userData = rows;

    const projectSQL =
      'SELECT p.title, p.contents, p.snsGithub, p.snsAppstore, p.snsPlaystore FROM project AS p LEFT JOIN user ON user.id = p.userId WHERE ?';
    const [projects] = await conn.query(projectSQL, { userId: id });
    userData[0].project = projects;
    await conn.release();
    return userData;
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
    await conn.release();
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
    await conn.release();
    return rows;
  } catch (err) {
    console.error('Dao err: ', err);
    throw { status: 500, message: 'DB Error' };
  }
};

const withdraw = async (id, email, password) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const sql = `DELETE FROM user WHERE id = ? and email = ?`;
    const [rows] = await conn.query(sql, [id, email]);
    if (!rows.affectedRows) {
      throw {
        status: 404,
        message: '조회된 사용자가 없습니다',
      };
    }
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        let user = firebase.auth().currentUser;
        user.delete();
      })
      .catch(function (error) {
        console.error('Firebase Error: ', error);
        throw { status: 400, message: 'Firebase Error: ' + error.code };
      });

    await conn.commit();
    return rows;
  } catch (err) {
    await conn.rollback();
    console.error('Dao err: ', err);
    if (err.status) {
      throw err;
    } else if (err.errno === 1451) {
      throw {
        status: 400,
        message: '해당 사용자에게 종속되어있는 데이터가 존재합니다',
      };
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
  userUpdate,
  checkNickname,
  checkEmail,
  withdraw,
};
