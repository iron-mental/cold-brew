require('dotenv').config();

const nodemailer = require('nodemailer');

const { mailer } = require('../configs/config');
const customError = require('./errors/customError');

const transporter = nodemailer.createTransport(mailer);

const sendVerifyEmail = async (email) => {
  try {
    const processUri = process.env.MAILER_processUri.concat(email);
    const message = {
      from: process.env.MAILER_auth_user,
      to: email,
      subject: `Teminal 이메일 주소 인증`,
      html: `
      안녕하세요.<br>
      다음 링크를 통해 이메일 주소를 인증하세요.<br><br>

      <a href='${processUri}'>이메일 주소 인증하기</a> <br><br>

      이 주소의 인증을 요청하지 않았다면 이 이메일을 무시하셔도 됩니다. <br>
      감사합니다.<br>
    
      Terminal 팀`,
    };
    await transporter.sendMail(message);
  } catch (err) {
    customError(500, err);
  }
};

module.exports = { sendVerifyEmail };
