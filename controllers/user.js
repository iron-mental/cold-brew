const userService = require('../services/user');

const signup = async (req, res) => {
  await userService.signup(req.body);
  return res.status(201).json({ message: 'success' });
};

const withdraw = async (req, res) => {
  await userService.withdraw(req.params);
  return res.json({ message: 'success' });
};

module.exports = { signup, withdraw };
