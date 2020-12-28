const userService = require('../services/user');
const response = require('../utils/response');
const { DeviceEnum } = require('../utils/variables/enum');

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
  response(res, 201, '회원가입이 완료되었습니다');
};

const login = async (req, res) => {
  req.body.device = req.headers['user-agent'].indexOf('iOS') === -1 ? DeviceEnum.android : DeviceEnum.ios;
  const tokenSet = await userService.login(req.body);
  response(res, 200, tokenSet);
};

const userDetail = async (req, res) => {
  const userData = await userService.userDetail(req.params);
  response(res, 200, userData);
};

const userImageUpdate = async (req, res) => {
  await userService.userImageUpdate(req.params, req.body, req.file);
  response(res, 200, '회원정보가 수정되었습니다');
};

const userUpdate = async (req, res) => {
  await userService.userUpdate(req.params, req.body);
  response(res, 200, '회원정보가 수정되었습니다');
};

const withdraw = async (req, res) => {
  await userService.withdraw(req.params, req.body);
  response(res, 200, '회원탈퇴 되었습니다');
};

const emailVerification = async (req, res) => {
  await userService.emailVerification(req.params);
  response(res, 200, '인증 이메일이 발송되었습니다');
};

const emailVerificationProcess = async (req, res) => {
  await userService.emailVerificationProcess(req.params);
  response(res, 200, `${req.params.email}님의 이메일인증이 완료되었습니다`);
};

const reissuance = async (req, res) => {
  const expiredAccessToken = req.headers.authorization.split(' ')[1];
  const newToken = await userService.reissuance(expiredAccessToken, req.body);
  response(res, 200, newToken);
};

const resetPassword = async (req, res) => {
  await userService.resetPassword(req.params);
  response(res, 200, '비밀번호 변경 이메일이 발송되었습니다');
};

const updateEmail = async (req, res) => {
  await userService.updateEmail(req.user, req.body);
  response(res, 200, '이메일 변경이 완료되었습니다');
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
};
