// require('dotenv').config();

// var admin = require('firebase-admin');
// var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://terminal-fd69d.firebaseio.com',
// });

// admin
//   .auth()
//   .createUser({
//     email: 'user@example.com',
//     password: 'secretPassword',
//     displayName: 'John Doe',
//   })
//   .then(function (userRecord) {
//     // See the UserRecord reference doc for the contents of userRecord.
//     console.log('Successfully created new user:', userRecord.uid);
//   })
//   .catch(function (error) {
//     console.log('Error creating new user:', error);
//   });

// // admin
// //   .auth()
// //   .getUsers({})
// //   .then(function (getUsersResult) {
// //     console.log('Successfully fetched user data:');
// //     getUsersResult.users.forEach(userRecord => {
// //       console.log(userRecord);
// //     });
// //   })
// //   .catch(function (error) {
// //     console.log('Error fetching user data::', error);
// //   });
