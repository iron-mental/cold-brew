const firebase = require('firebase');

const { firebaseError } = require('../utils/errors/customError');

const resetPassword = async ({ email }) => {
  await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .catch(async (err) => {
      throw await firebaseError(err);
    });
};

module.exports = { resetPassword };
