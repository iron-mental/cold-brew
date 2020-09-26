const userDao = require('../dao/user');
const { format } = require('date-fns');

// 회원가입
const signup = async body => {
  const rows = await userDao.signup(body);
  if (!rows.affectedRows) {
    throw {
      status: 400,
      message: 'no result',
    };
  }
};

// 상세 조회
const userDetail = async params => {
  let rows = await userDao.userDetail(params);
  if (!rows[0]) {
    throw {
      status: 404,
      message: '조회된 사용자가 없습니다',
    };
  }
  delete rows[0].id;
  rows[0].created_at = format(rows[0].created_at, 'yyyy-MM-dd HH:mm:ss');
  return rows;
};

// 수정
const userUpdate = async (params, body) => {
  let rows = await userDao.userUpdate(params, body);
  if (!rows[0]) {
    throw {
      status: 404,
      message: '조회된 사용자가 없습니다',
    };
  }
  rows[0].created_at = format(rows[0].created_at, 'yyyy-MM-dd HH:mm:ss');
  return rows[0];
};

// 닉네임 체크
const checkNickname = async params => {
  const rows = await userDao.checkNickname(params);
  if (rows.length) {
    throw {
      status: 400,
      message: '중복된 닉네임이 존재합니다',
    };
  }
};

// 탈퇴
const withdraw = async params => {
  const rows = await userDao.withdraw(params);
  if (!rows.affectedRows) {
    throw {
      status: 404,
      message: '조회된 사용자가 없습니다',
    };
  }
};

module.exports = { signup, userDetail, userUpdate, checkNickname, withdraw };
