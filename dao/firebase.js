const firebase = require('firebase');
const config = require('../configs/config');
firebase.initializeApp(config.firebase);

const signup = async (email, password) => {
  return await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const { uid, email, emailVerified } = userCredential.user;
      return { uid, email, emailVerified };
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error('errorCode: ', errorCode);
      console.error('Firebase Error: ', errorMessage);
      throw { status: 400, message: 'Firebase Error: ' + errorMessage };
    });
};

const login = async (email, password) => {
  return await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      return userCredential.user.uid;
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error('errorCode: ', errorCode);
      console.error('Firebase Error: ', errorMessage);
      throw { status: 400, message: 'Firebase Error: ' + errorMessage };
    });
};

const withdraw = async (email, password) => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      var user = firebase.auth().currentUser;
      user.delete();
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error('errorCode: ', errorCode);
      console.error('Firebase Error: ', errorMessage);
      throw { status: 400, message: 'Firebase Error: ' + errorMessage };
    });
};

module.exports = { signup, login, withdraw };
