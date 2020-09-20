const pool = require('./db');

const signup = async userData => {
  console.log('/dao/auth/signup: ', userData);
  const { uid, email, nickname } = userData;
  const sql = `insert into user(uid, email, nickname) values ('${uid}', '${email}', '${nickname}')`;
  try {
    let [rows] = await pool.query(sql);
    pool.releaseConnection; // 좀더 알아보기
    return rows;
  } catch (err) {
    return res.status(400).json({ errors: errors.array() });
    // throw new Error(err);
  }
};

module.exports = { signup };
