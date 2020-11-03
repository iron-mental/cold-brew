const firebaseService = require('../services/firebase');
const response = require('../utils/response');

const resetPassword = async (req, res) => {
  await firebaseService.resetPassword(req.params);
  response(res, 200, '비밀번호 변경 메일 발송');
};

module.exports = { resetPassword };
