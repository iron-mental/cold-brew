const firebase = require('firebase');
const { customError } = require('../utils/errors/customError');

const resetPassword = async ({ email }) => {
  await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {})
    .catch((err) => {
      throw customError(err);
    });
};

module.exports = { resetPassword };
