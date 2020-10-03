const { format } = require('date-fns');

const userDao = require('../dao/user');

// 회원가입
const signup = async ({ email, password, nickname }) => {
  const createUser = await userDao.signup(email, password, nickname); // FB 가입
  if (!createUser.affectedRows) {
    throw {
      status: 400,
      message: 'no result',
    };
  }
  return createUser;
};

// 로그인
const login = async ({ email, password }) => {
  const rows = await userDao.login(email, password);
  rows[0].created_at = format(rows[0].created_at, 'yyyy-MM-dd HH:mm:ss');
  return rows[0];
};

// 상세 조회
const userDetail = async ({ id }) => {
  let rows = await userDao.userDetail(id);
  if (!rows[0]) {
    throw {
      status: 404,
      message: '조회된 사용자가 없습니다',
    };
  }
  rows[0].created_at = format(rows[0].created_at, 'yyyy-MM-dd HH:mm:ss');
  return rows[0];
};

// 수정 - (이메일, 이미지, 비밀번호 제외)
const userUpdate = async ({ id }, updateData) => {
  let rows = await userDao.userUpdate(id, updateData);
  if (!rows[0]) {
    throw {
      status: 404,
      message: '조회된 사용자가 없습니다',
    };
  }
  rows[0].created_at = format(rows[0].created_at, 'yyyy-MM-dd HH:mm:ss');
  return rows[0];
};

// 닉네임 중복체크
const checkNickname = async ({ nickname }) => {
  const rows = await userDao.checkNickname(nickname);
  if (rows.length) {
    throw {
      status: 400,
      message: '중복된 닉네임이 존재합니다',
    };
  }
};

// 이메일 중복체크
const checkEmail = async ({ email }) => {
  const tmp = await userDao.checkEmail(email);
  if (tmp.length) {
    throw {
      status: 400,
      message: `중복된 이메일이 존재합니다`,
    };
  }
  return tmp;
};

// 회원탈퇴
const withdraw = async ({ id }, { email, password }) => {
  const rows = await userDao.withdraw(id, email, password); // FB 삭제
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
  userDetail,
  userUpdate,
  checkNickname,
  checkEmail,
  withdraw,
};
