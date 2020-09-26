const pool = require('./db');

const signup = async body => {
  try {
    const conn = await pool.getConnection();
    try {
      const sql = 'INSERT INTO user SET ?';
      const [rows] = await conn.query(sql, body);
      return rows;
    } catch (err) {
      console.error('err: ', err.sqlMessage);
      throw { status: 500, message: 'DB Query Error' };
    } finally {
      conn.release();
    }
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw { status: 500, message: 'DB Connection Error' };
  }
};

const userDetail = async params => {
  try {
    const conn = await pool.getConnection();
    try {
      const userSQL =
        'SELECT id, nickname, email, image, introduce, location, career_title, career_contents, sns_github, sns_linkedin, sns_web, email_verified, created_at FROM user WHERE ?';
      let [rows] = await conn.query(userSQL, params);
      result = rows;
      const projectSQL =
        'SELECT title, contents,sns_github, sns_appstore, sns_playstore FROM project WHERE ?';
      [rows] = await conn.query(projectSQL, { user_id: result[0].id });
      result[0].project = rows;
      return result;
    } catch (err) {
      console.error('err: ', err);
      throw { status: 404, message: '조회된 사용자가 없습니다' }; // 상단쿼리 결과 없을 시
    } finally {
      conn.release();
    }
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw { status: 500, message: 'DB Connection Error' };
  }
};

const userUpdate = async (params, body) => {
  try {
    const conn = await pool.getConnection();
    try {
      let sql = 'UPDATE user SET ? WHERE ? '; // 수정
      await conn.query(sql, [body, params]);

      sql =
        'SELECT nickname, email, image, introduce, location, career_title, career_contents, sns_github, sns_linkedin, sns_web, email_verified, created_at FROM user WHERE ?';
      const [rows] = await conn.query(sql, params);
      return rows;
    } catch (err) {
      console.error('err: ', err.sqlMessage);
      throw { status: 500, message: 'DB Query Error' };
    } finally {
      conn.release();
    }
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw { status: 500, message: 'DB Connection Error' };
  }
};

const checkNickname = async params => {
  try {
    const conn = await pool.getConnection();
    try {
      const sql = 'SELECT nickname FROM user WHERE ?';
      const [rows] = await conn.query(sql, params);
      return rows;
    } catch (err) {
      console.error('err: ', err.sqlMessage);
      throw { status: 500, message: 'DB Query Error' };
    } finally {
      conn.release();
    }
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw { status: 500, message: 'DB Connection Error' };
  }
};

const withdraw = async params => {
  try {
    const conn = await pool.getConnection();
    try {
      const sql = `DELETE FROM user WHERE ?`;
      const [rows] = await conn.query(sql, params);
      return rows;
    } catch (err) {
      console.error('DAO err: ', err);
      if (err.errno === 1451) {
        throw {
          status: 400,
          message: '해당 사용자와 의존성있는 데이터가 존재합니다',
        };
      }
      throw { status: 400, message: '사용자x?' };
    } finally {
      conn.release();
    }
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw { status: 400, message: 'DB Connection Error' };
  }
};

module.exports = { signup, userDetail, userUpdate, checkNickname, withdraw };
