const userService = require('../services/user');

const signup = async (req, res) => {
  await userService.signup(req.body);
  return res.status(201).json({ message: '회원가입 성공' });
};

const login = async (req, res) => {
  const uid = await userService.login(req.body); // 로그인
  const data = await userService.userDetail({ uid }); // 성공시 유저 디테일 검색해서 전달
  const now = new Date();
  console.log(now.toLocaleString());
  return res.json(data);
};

const userDetail = async (req, res) => {
  const data = await userService.userDetail(req.params);
  return res.json(data);
};

const userUpdate = async (req, res) => {
  if (req.body.nickname) {
    await userService.checkNickname({ nickname: req.body.nickname });
  }
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
