const firebaseDao = require('../dao/firebase');

// 이메일 인증
const emailVerification = async ({ id }, { email, password }) => {
  const email_status = await firebaseDao.alreadyCheck(id);
  if (email_status[0].email_verified === 1) {
    throw { status: 400, message: '이미 인증된 사용자입니다' };
  }
  await firebaseDao.emailVerification(id, email, password);
};

const emailVerificationProcess = async ({ email }) => {
  const updateRows = await firebaseDao.emailVerificationProcess(email);
  if (updateRows.changedRows === 0) {
    throw { status: 400, message: `${email} 님은 이미 인증이 완료된 사용자입니다` };
  }
};

module.exports = { emailVerification, emailVerificationProcess };
