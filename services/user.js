const fs = require('fs');
const path = require('path');

const userDao = require('../dao/user');
const { rowSplit } = require('../utils/database');

// 닉네임 중복체크
const checkNickname = async ({ nickname }) => {
  const checkRows = await userDao.checkNickname(nickname);
  if (checkRows.length) {
    throw { status: 400, message: '중복된 닉네임이 존재합니다' };
  }
};

// 이메일 중복체크
const checkEmail = async ({ email }) => {
  const checkRows = await userDao.checkEmail(email);
  if (checkRows.length) {
    throw { status: 400, message: `중복된 이메일이 존재합니다` };
  }
};

// 회원가입
const signup = async ({ email, password, nickname }) => {
  const emailCheckRows = await userDao.checkEmail(email);
  if (emailCheckRows.length) {
    throw { status: 400, message: `중복된 이메일이 존재합니다` };
  }

  const nicknameCheckRows = await userDao.checkNickname(nickname);
  if (nicknameCheckRows.length) {
    throw { status: 400, message: '중복된 닉네임이 존재합니다' };
  }

  const createRows = await userDao.signup(email, password, nickname);
  if (createRows.affectedRows === 0) {
    throw { status: 400, message: 'no result' };
  }
};

// 로그인
const login = async ({ email, password }) => {
  const id = await userDao.login(email, password);
  if (id.length === 0) {
    throw { status: 404, message: '조회된 사용자가 없습니다' };
  }
  // JwT 도입시 토큰을 발급할 부분 + 나중엔 login API에서 토큰을 내려줄 생각이라 임시로 user_id를 리턴합니다
  return id[0].id;
};

// 상세 조회
const userDetail = async ({ id }) => {
  const userData = await userDao.userDetail(id);
  if (userData.length === 0) {
    throw { status: 404, message: '조회된 사용자가 없습니다' };
  }
  // return rowSplit(userData, ['project']);
  return rowSplit(userData, ['project']);
};

// 수정 - (이메일, 비밀번호 제외)
const userUpdate = async ({ id }, updateData, { destination, uploadedFile, path: _tmpPath }) => {
  try {
    if (updateData.nickname) {
      const checkRows = await userDao.checkNickname(updateData.nickname);
      if (checkRows.length) {
        throw { status: 400, message: '중복된 닉네임이 존재합니다' };
      }
    }

    const previousPath = await userDao.getImage(id);
    const updateRows = await userDao.userUpdate(id, updateData);
    if (updateRows.affectedRows === 0) {
      throw { status: 404, message: '조회된 사용자가 없습니다' };
    }

    // 기존 이미지 삭제, _tmp 네이밍 변경
    const oldImagePath = path.join(destination, path.basename(previousPath[0].image || 'nullFileName'));
    const newPath = path.join(destination, uploadedFile.basename);
    -fs.rename(_tmpPath, newPath, (err) => {});
    -fs.unlink(oldImagePath, (err) => {});
  } catch (err) {
    fs.unlink(_tmpPath, (err) => {});
    throw err;
  }
};

// 회원탈퇴
const withdraw = async ({ id }, { email, password }) => {
  await userDao.withdraw(id, email, password);
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
