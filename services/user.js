const fs = require('fs');
const path = require('path');
const firebase = require('firebase');

const userDao = require('../dao/user');
const studyDao = require('../dao/study');
const { toBoolean, parsingAddress } = require('../utils/query');
const { sendVerifyEmail } = require('../utils/mailer');
const { verify, getAccessToken, getRefreshToken } = require('../utils/jwt.js');
const { customError } = require('../utils/errors/custom');
const { firebaseError } = require('../utils/errors/firebase');

const push = require('../events/push');

const User = require('../models/user');
const Chat = require('../models/chat');
const { RedisEventEnum, PushEventEnum } = require('../utils/variables/enum');
const { redisTrigger, redisSignup, redisWithdraw } = require('./redis');

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
    throw customError(400, '중복된 닉네임이 존재합니다', 101);
  }
  const emailCheckRows = await userDao.checkEmail(email);
  if (emailCheckRows.length > 0) {
    throw customError(400, '중복된 이메일이 존재합니다', 102);
  }
  const createRows = await userDao.signup(email, password, nickname);
  if (createRows.affectedRows === 0) {
    throw customError(400, '회원가입에 실패했습니다', 103);
  }
  user_id = createRows.insertId;

  User.create({ user_id, nickname });
  redisSignup(user_id);
};

// 로그인
const login = async ({ email, password, device, push_token }) => {
  const loginRows = await userDao.login(email, password);
  if (loginRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }

  const { id, nickname } = loginRows[0];
  const access_token = await getAccessToken({ id, email, nickname });
  const refresh_token = await getRefreshToken({ id });

  userDao.userUpdate(id, {
    device,
    access_token,
    refresh_token,
    push_token,
  });

  redisTrigger(id, RedisEventEnum.push_token, {
    device,
    push_token,
  });

  return { id, access_token, refresh_token };
};

// 상세 조회
const userDetail = async ({ id }) => {
  const userDataRows = await userDao.userDetail(id);
  if (userDataRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
  return toBoolean(userDataRows, ['email_verified'])[0];
};

// 이미지 수정
const userImageUpdate = async ({ id }, updateData, { destination, uploadedFile, path: _tmpPath }) => {
  const previousPath = await userDao.getImage(id);
  const oldImagePath = path.join(destination, path.basename(previousPath[0].image || 'nullFileName'));
  try {
    fs.unlink(oldImagePath, (err) => {});
  } catch (err) {}

  const updateRows = await userDao.userUpdate(id, updateData);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
  const newPath = path.join(destination, uploadedFile.basename);
  fs.rename(_tmpPath, newPath, (err) => {});
};

// 유저정보 수정
const userUpdate = async ({ id }, updateData) => {
  const checkRows = await userDao.checkNickname(updateData.nickname, id);
  if (checkRows.length) {
    throw customError(400, '중복된 닉네임이 존재합니다');
  }

  User.updateOne({ user_id: id }, { nickname: updateData.nickname }).exec();
  Chat.updateMany({ user_id: id }, { nickname: updateData.nickname }).exec();

  const updateRows = await userDao.userUpdate(id, updateData);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
};

// 회원탈퇴
const withdraw = async ({ id }, { email, password }) => {
  const studyList = await studyDao.getMyStudy(id);
  if (studyList.length > 0) {
    throw customError(400, '가입한 스터디를 탈퇴하고 다시 시도하세요');
  }

  try {
    await userDao.withdraw(id, email, password);
    User.deleteOne({ user_id: id }).exec();
    Chat.updateMany({ user_id: id }, { nickname: '(알수없음)' }).exec();
    redisWithdraw(id);
  } catch (err) {
    throw err;
  }
};

// 인증 이메일 전송
const emailVerification = async ({ id }) => {
  const verifyRows = await userDao.verifiedCheck({ id });
  if (verifyRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
  if (verifyRows[0].email_verified === 1) {
    throw customError(400, `${verifyRows[0].email} 님은 이미 인증이 완료된 사용자입니다`);
  }
  await sendVerifyEmail(verifyRows[0].email);
};

// 이메일 인증 처리
const emailVerificationProcess = async ({ email }) => {
  const verifyRows = await userDao.verifiedCheck({ email });
  if (verifyRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다', 201);
  } else if (verifyRows[0].email_verified === 1) {
    throw customError(400, `${verifyRows[0].email} 님은 이미 인증이 완료된 사용자입니다`, 202);
  }

  const [{ nickname }] = await userDao.emailVerificationProcess(email);
  return nickname;
};

// 검증 후 accessToken 발급
const reissuance = async (expiredAccessToken, { refresh_token }) => {
  const refreshDecoded = verify(refresh_token, 'refresh');

  const [userData] = await userDao.checkToken(refresh_token);
  if (!userData) {
    throw customError(400, 'Refresh Token이 일치하지 않습니다. 다시 로그인 하세요', 101);
  }
  if (userData.access_token !== expiredAccessToken) {
    throw customError(400, 'Access Token이 일치하지 않습니다. 다시 로그인 하세요', 102);
  }

  const newTokenSet = { access_token: getAccessToken(userData) };

  if (refreshDecoded.exp - Math.floor(new Date().getTime() / 1000) < process.env.JWT_refreshCycle) {
    newTokenSet.refresh_token = getRefreshToken(userData);
  }

  await userDao.userUpdate(userData.id, newTokenSet);
  return newTokenSet;
};

// 비밀번호 수정
const resetPassword = async ({ email }) => {
  await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .catch((err) => {
      throw firebaseError(err);
    });
};

// 이메일 수정
const updateEmail = async ({ id }, { email }) => {
  const userDataRows = await userDao.updateEmail(id, email);
  if (userDataRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
};

// 푸시토큰 갱신
const updatePushToken = async ({ id }, updateData) => {
  const updateRows = await userDao.userUpdate(id, updateData);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
  redisTrigger(id, RedisEventEnum.push_token, { updateData });
};

// 주소 데이터
const getAddress = async () => {
  const addressRows = await userDao.getAddress();
  return parsingAddress(addressRows);
};

// 알림 조회
const getAlert = async ({ id: user_id }) => {
  const alertRows = await userDao.getAlert(user_id);
  return alertRows;
};

// 푸시 테스트
const pushTest = async ({ id: user_id }) => {
  push.emit('toUser', PushEventEnum.push_test, user_id);
};

module.exports = {
  signup,
  login,
  userDetail,
  userImageUpdate,
  userUpdate,
  checkNickname,
  checkEmail,
  withdraw,
  emailVerification,
  emailVerificationProcess,
  reissuance,
  resetPassword,
  updateEmail,
  updatePushToken,
  getAddress,
  getAlert,
  pushTest,
};
