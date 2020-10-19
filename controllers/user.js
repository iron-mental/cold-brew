const path = require('path');

const userService = require('../services/user');

const USER_PATH = '/images/user';

const checkNickname = async (req, res) => {
  await userService.checkNickname(req.params);
  return res.status(201).json({ message: '사용 가능한 닉네임입니다' });
};

const checkEmail = async (req, res) => {
  await userService.checkEmail(req.params);
  return res.status(201).json({ message: '사용 가능합니다' });
};

const signup = async (req, res) => {
  await userService.signup(req.body);
  return res.status(201).json({ message: '회원가입 되었습니다' });
};

const login = async (req, res) => {
  const id = await userService.login(req.body);
  return res.redirect(303, `/v1/user/${id}`); // 추후 jwt 적용하면 수정
};

const userDetail = async (req, res) => {
  const userData = await userService.userDetail(req.params);
  return res.status(200).json(userData);
};

const userUpdate = async (req, res) => {
  if (req.file) {
    req.body.image = path.join(USER_PATH, req.file.uploadedFile.basename);
    await userService.userUpdate(req.params, req.body, req.file);
  } else {
    await userService.userUpdate(req.params, req.body);
  }
  return res.redirect(303, `/v1/user/${req.params.id}`);
};

const withdraw = async (req, res) => {
  await userService.withdraw(req.params, req.body);
  return res.status(200).json({ message: '삭제되었습니다' });
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
