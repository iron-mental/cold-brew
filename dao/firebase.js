const firebase = require('firebase');

const pool = require('./db');

const emailVerification = async (id, email, password) => {
  let email_status = '';
  try {
    var conn = await pool.getConnection();
    const emailSql = 'SELECT email_verified FROM user WHERE ?';
    const [emailRows] = await conn.query(emailSql, { id });
    email_status = emailRows[0].email_verified;
  } catch (err) {
    throw { status: 500, message: 'DB Error' };
  } finally {
    await conn.release();
  }
  if (email_status === 1) {
    throw { status: 400, message: '이미 인증된 사용자입니다' };
  }

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
        .then(function () {})
        .catch(function (error) {
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

module.exports = { emailVerification, emailVerificationProcess };
