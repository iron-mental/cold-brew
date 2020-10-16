const FBService = require('../services/firebase');

const emailVerification = async (req, res) => {
  await FBService.emailVerification(req.params, req.body);
  return res.status(200).json({ message: '메일전송 성공' });
};

const emailVerificationProcess = async (req, res) => {
  await FBService.emailVerificationProcess(req.query);
  return res.status(200).send(`${req.query.email}님의 이메일인증이 완료되었습니다`);
};

module.exports = { emailVerification, emailVerificationProcess };
