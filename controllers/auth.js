var authService = require('../services/auth');

const signup = async (req, res, next) => {
  await authService.signup(req.body, next);
  return res.status(201).json({ message: 'success' });
};

const withdraw = async (req, res, next) => {
  await authService.withdraw(req.body, next);
  return res.status(200).json({ message: 'success' });
};

module.exports = { signup, withdraw };
