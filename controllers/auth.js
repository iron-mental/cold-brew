var authService = require('../services/auth');

const signup = async (req, res, next) => {
  rows = await authService.signup(req.body, next);
  return res.status(201).json({ message: '리디렉션으로 변경예정' });
};

const withdraw = async (req, res, next) => {
  rows = await authService.withdraw(req.body, next);
  return res.status(200).json({ message: 'success' });
};

module.exports = { signup, withdraw };
