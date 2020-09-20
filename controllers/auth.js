var authService = require('../services/auth');

const signup = async (req, res, next) => {
  rows = await authService.signup(req.body);
  // 스터디 목록 데이터 요청하는 API로 리 다이렉션해야함
  return res.status(201).json({ signup: '리디렉션으로 변경예정' });
};

const withdraw = async (req, res, next) => {
  console.log(req.body);
};

module.exports = { signup, withdraw };
