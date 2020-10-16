const firebase = require('firebase');

const pool = require('./db');

const alreadyCheck = async (id) => {
  try {
    var conn = await pool.getConnection();
    const emailSql = 'SELECT email_verified FROM user WHERE ?';
    const [emailRows] = await conn.query(emailSql, { id });
    return emailRows;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

const emailVerification = async (email, password) => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async () => {
      const user = firebase.auth().currentUser;
      var actionCodeSettings = {
        url: 'http://localhost:3000/v1/firebase/email-verification?email=' + firebase.auth().currentUser.email,
      };
      await user
        .sendEmailVerification(actionCodeSettings)
        .then(() => {})
        .catch((error) => {
          throw { status: 400, message: 'Firebase Error: ' + error.code };
        });
    })
    .catch((error) => {
      if (!error.status) {
        throw { status: 400, message: 'Firebase Error: ' + error.code };
      }
      throw error;
    });
};

const emailVerificationProcess = async (email) => {
  try {
    var conn = await pool.getConnection();
    const updateSql = 'UPDATE user SET ? WHERE ?';
    const [updateRows] = await conn.query(updateSql, [{ email_verified: true }, { email }]);
    return updateRows;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
};

const resetPassword = async (email) => {
  await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {})
    .catch((error) => {
      throw { status: 400, message: error };
    });
};

module.exports = { alreadyCheck, emailVerification, emailVerificationProcess, resetPassword };
