const firebaseService = require('../services/firebase');

const resetPassword = async (req, res) => {
  await firebaseService.resetPassword(req.params);
  return res.status(200).json({ message: '메일전송 성공' });
};

module.exports = { resetPassword };
