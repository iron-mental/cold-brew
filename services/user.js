const { format } = require('date-fns');

const userDao = require('../dao/user');
const userFirebase = require('../dao/firebase');

// 회원가입 -FB
const signup = async body => {
  const createUser = await userFirebase.signup(body.email, body.password); // FB 가입
  createUser.nickname = body.nickname;

  const rows = await userDao.signup(createUser); // DB 가입
  if (!rows.affectedRows) {
    throw {
      status: 400,
      message: 'no result',
    };
  }

  delete createUser.uid;
  createUser.id = rows.insertId;

  return createUser;
};

// 로그인 -FB
const login = async body => {
  const { email, password } = body;
  return await userFirebase.login(email, password);
};

// 상세 조회
const detail = async params => {
  let rows = await userDao.detail(params);
  if (!rows[0]) {
    throw {
      status: 404,
      message: '조회된 사용자가 없습니다',
    };
  }
  rows[0].created_at = format(rows[0].created_at, 'yyyy-MM-dd HH:mm:ss');
  return rows;
};

// 수정 -FB(이메일만!)
const update = async (params, updateData) => {
  const { id } = params;
  let rows = await userDao.update(id, updateData);
  if (!rows[0]) {
    throw {
      status: 404,
      message: '조회된 사용자가 없습니다',
    };
  }
  rows = await userDao.detail({ id });
  rows[0].created_at = format(rows[0].created_at, 'yyyy-MM-dd HH:mm:ss');
  return rows;
};

// // 중복 체크
// const checkNickname = async params => {
//   const rows = await userDao.checkNickname(params);
//   if (rows.length) {
//     throw {
//       status: 400,
//       message: '중복된 닉네임이 존재합니다',
//     };
//   }
// };

// 중복체크 통합
const check = async checkValue => {
  const tmp = await userDao.check(checkValue);
  if (tmp.length) {
    throw {
      status: 400,
      message: `중복된 데이터가 존재합니다`,
    };
  }
  return tmp;
};

// 탈퇴 -FB
const withdraw = async (params, body) => {
  const { id } = params;
  const { email, password } = body;

  await userFirebase.withdraw(email, password); // FB 삭제
  const rows = await userDao.withdraw(id, email); // DB 삭제
  if (!rows.affectedRows) {
    throw {
      status: 404,
      message: '조회된 사용자가 없습니다',
    };
  }
};

module.exports = {
  signup,
  login,
  detail,
  update,
  // checkNickname,
  withdraw,
  check,
};
