const firebase = require('firebase');

const resetPassword = async ({ email }) => {
  await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {})
    .catch((error) => {
      throw { status: 400, message: error };
    });
};

module.exports = { resetPassword };
