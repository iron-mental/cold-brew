const firebase = require('firebase');

const firebaseDao = require('../dao/firebase');

// 이메일 인증
const emailVerification = async ({ id }, { email, password }) => {
  const email_status = await firebaseDao.verifiedCheck(id);
  if (email_status[0].email_verified === 1) {
    throw { status: 400, message: `${email} 님은 이미 인증이 완료된 사용자입니다` };
  }

  const user = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async () => {
      return firebase.auth().currentUser;
    })
    .catch((error) => {
      throw { status: 400, message: 'Firebase Error: ' + error };
    });

  const actionCodeSettings = {
    url: 'http://localhost:3000/v1/firebase/email-verification?email=' + user.email,
  };

  await user.sendEmailVerification(actionCodeSettings).catch((error) => {
    throw { status: 400, message: 'Firebase Error: ' + error.code };
  });
};

const emailVerificationProcess = async ({ email }) => {
  await firebaseDao.emailVerificationProcess(email);
};

const resetPassword = async ({ email }) => {
  await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {})
    .catch((error) => {
      throw { status: 400, message: error };
    });
};

module.exports = { emailVerification, emailVerificationProcess, resetPassword };
