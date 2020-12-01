require('dotenv').config();

const rds = {
  development: {
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    connectionLimit: process.env.DB_connectionLimit,
    waitForConnections: process.env.DB_waitForConnections,
  },
};

const firebase = {
  apiKey: process.env.FIREBASE_apiKey,
  authDomain: process.env.FIREBASE_authDomain,
  databaseURL: process.env.FIREBASE_databaseURL,
  projectId: process.env.FIREBASE_projectId,
  storageBucket: process.env.FIREBASE_storageBucket,
  messagingSenderId: process.env.FIREBASE_messagingSenderId,
  appId: process.env.FIREBASE_appId,
  measurementId: process.env.FIREBASE_measurementId,
};

const mailer = {
  service: process.env.MAILER_service,
  host: process.env.MAILER_host,
  port: process.env.MAILER_port,
  auth: {
    user: process.env.MAILER_auth_user,
    pass: process.env.MAILER_auth_password,
  },
};

const apn = {
  token: {
    key: process.env.APNS_key,
    keyId: process.env.APNS_keyId,
    teamId: process.env.APNS_teamId,
  },
  production: false, // NODE_ENV 변경되면 같이 변경
};

module.exports = { rds, firebase, mailer, apn };
