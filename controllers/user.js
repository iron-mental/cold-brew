const userService = require('../services/user');
const response = require('../utils/response');

const checkNickname = async (req, res) => {
  await userService.checkNickname(req.params);
  response(res, 200, '사용 가능한 닉네임입니다');
};

const checkEmail = async (req, res) => {
  await userService.checkEmail(req.params);
  response(res, 200, '사용 가능한 이메일입니다');
};

const signup = async (req, res) => {
  await userService.signup(req.body);
  response(res, 201, '회원가입 완료');
};

const login = async (req, res) => {
  req.body.device = req.headers['user-agent'].indexOf('iOS') === -1 ? 'android' : 'ios';
  const tokenSet = await userService.login(req.body);
  response(res, 200, tokenSet);
};

const userDetail = async (req, res) => {
  const userData = await userService.userDetail(req.params);
  response(res, 200, userData);
};

const userUpdate = async (req, res) => {
  await userService.userUpdate(req.params, req.body, req.file);
  response(res, 204, '회원정보 수정 완료');
};

const withdraw = async (req, res) => {
  await userService.withdraw(req.params, req.body);
  response(res, 204, '회원 탈퇴 완료');
};

const emailVerification = async (req, res) => {
  await userService.emailVerification(req.params);
  response(res, 200, '인증 이메일 발송');
};

const emailVerificationProcess = async (req, res) => {
  await userService.emailVerificationProcess(req.params);
  response(res, 200, `${req.params.email}님의 이메일인증이 완료되었습니다`);
};

const reissuance = async (req, res) => {
  const oldAccessToken = req.headers.authorization.split(' ')[1];
  const newToken = await userService.reissuance(oldAccessToken, req.body);
  response(res, 200, newToken);
};

const resetPassword = async (req, res) => {
  await userService.resetPassword(req.params);
  response(res, 200, '비밀번호 변경 메일 발송');
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
  reissuance,
  resetPassword,
};
