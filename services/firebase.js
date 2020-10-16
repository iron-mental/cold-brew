const firebaseDao = require('../dao/firebase');

// 이메일 인증
const emailVerification = async ({ id }, { email, password }) => {
  const email_status = await firebaseDao.alreadyCheck(id);
  if (email_status[0].email_verified === 1) {
    throw { status: 400, message: `${email} 님은 이미 인증이 완료된 사용자입니다` };
  }
  await firebaseDao.emailVerification(email, password);
};

const emailVerificationProcess = async ({ email }) => {
  await firebaseDao.emailVerificationProcess(email);
};

const resetPassword = async ({ email }) => {
  await firebaseDao.resetPassword(email);
};

module.exports = { emailVerification, emailVerificationProcess, resetPassword };
