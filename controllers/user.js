const userService = require('../services/user');

const signup = async (req, res) => {
  await userService.signup(req.body);
  return res.status(201).json({ message: '회원가입 되었습니다' });
};

const login = async (req, res) => {
  const data = await userService.login(req.body);
  return res.json(data);
};

const userDetail = async (req, res) => {
  const data = await userService.userDetail(req.params);
  return res.json(data);
};

const userUpdate = async (req, res) => {
  const data = await userService.userUpdate(req.params, req.body);
  return res.json(data);
};

const checkNickname = async (req, res) => {
  await userService.checkNickname(req.params);
  return res.json({ message: '사용 가능한 닉네임입니다' });
};

const checkEmail = async (req, res) => {
  await userService.checkEmail(req.params);
  return res.json({ message: '사용 가능합니다' });
};

const withdraw = async (req, res) => {
  await userService.withdraw(req.params, req.body);
  return res.json({ message: '삭제되었습니다' });
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
