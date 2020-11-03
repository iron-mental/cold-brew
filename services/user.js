const fs = require('fs');
const path = require('path');

const userDao = require('../dao/user');
const { rowSplit, toBoolean } = require('../utils/query');
const { sendVerifyEmail } = require('../utils/mailer');
const { customError } = require('../utils/errors/customError');

// 닉네임 중복체크
const checkNickname = async ({ nickname }) => {
  const checkRows = await userDao.checkNickname(nickname);
  if (checkRows.length > 0) {
    throw customError(400, '중복된 닉네임이 존재합니다');
  }
};

// 이메일 중복체크
const checkEmail = async ({ email }) => {
  const checkRows = await userDao.checkEmail(email);
  if (checkRows.length > 0) {
    throw customError(400, '중복된 이메일이 존재합니다');
  }
};

// 회원가입
const signup = async ({ email, password, nickname }) => {
  const nicknameCheckRows = await userDao.checkNickname(nickname);
  if (nicknameCheckRows.length > 0) {
    throw customError(400, '중복된 닉네임이 존재합니다');
  }
  const emailCheckRows = await userDao.checkEmail(email);
  if (emailCheckRows.length > 0) {
    throw customError(400, '중복된 이메일이 존재합니다');
  }
  const createRows = await userDao.signup(email, password, nickname);
  if (createRows.affectedRows === 0) {
    throw customError(400, '회원가입에 실패했습니다'); // 실패 할게 있나? -> 제거 고민중
  }
};

// 로그인
const login = async ({ email, password }) => {
  const idRows = await userDao.login(email, password);
  if (idRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
  // JwT 도입시 토큰을 발급할 부분 + 나중엔 login API에서 토큰을 내려줄 생각이라 임시로 user_id를 리턴합니다
  return idRows[0];
};

// 상세 조회
const userDetail = async ({ id }) => {
  let userDataRows = await userDao.userDetail(id);
  if (userDataRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
  userDataRows = toBoolean(userDataRows, ['email_verified']);
  return rowSplit(userDataRows, ['project']);
};

// 수정 - (이메일, 비밀번호 제외)
const userUpdate = async ({ id }, updateData, filedata) => {
  if (updateData.nickname) {
    const checkRows = await userDao.checkNickname(updateData.nickname);
    if (checkRows.length) {
      throw customError(400, '중복된 닉네임이 존재합니다');
    }
  }
  if (filedata) {
    const { destination, uploadedFile, path: _tmpPath } = filedata;
    const previousPath = await userDao.getImage(id);
    const updateRows = await userDao.userUpdate(id, updateData);
    if (updateRows.affectedRows === 0) {
      throw customError(404, '조회된 사용자가 없습니다');
    }

    const oldImagePath = path.join(destination, path.basename(previousPath[0].image || 'nullFileName'));
    const newPath = path.join(destination, uploadedFile.basename);
    fs.rename(_tmpPath, newPath, (err) => {});
    fs.unlink(oldImagePath, (err) => {});
  } else {
    const updateRows = await userDao.userUpdate(id, updateData);
    if (updateRows.affectedRows === 0) {
      throw customError(404, '조회된 사용자가 없습니다');
    }
  }
};

// 회원탈퇴
const withdraw = async ({ id }, { email, password }) => {
  await userDao.withdraw(id, email, password);
};

// 인증 이메일 전송
const emailVerification = async ({ email }) => {
  const verifyStatus = await userDao.verifiedCheck(email);
  if (verifyStatus[0].email_verified === 1) {
    throw customError(400, `${email} 님은 이미 인증이 완료된 사용자입니다`);
  }
  await sendVerifyEmail(email);
};

// 이메일 인증 처리
const emailVerificationProcess = async ({ email }) => {
  const updateRows = await userDao.emailVerificationProcess(email);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
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
  emailVerification,
  emailVerificationProcess,
};
