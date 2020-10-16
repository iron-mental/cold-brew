const FBDao = require('../dao/firebase');

// 이메일 인증
const emailVerification = async ({ id }, { email, password }) => {
  await FBDao.emailVerification(id, email, password);
};

const emailVerificationProcess = async ({ email }) => {
  const updateRows = await FBDao.emailVerificationProcess(email);
  if (updateRows.changedRows === 0) {
    throw { status: 400, message: `${email} 님은 이미 인증이 완료된 사용자입니다` };
  }
};

module.exports = { emailVerification, emailVerificationProcess };
