require('dotenv').config();
const nodemailer = require('nodemailer');

const { mailer } = require('../configs/config');
const customError = require('./errors/custom');

const transporter = nodemailer.createTransport(mailer);

const sendVerifyEmail = async (email) => {
  try {
    const processUri = process.env.MAILER_processUri.concat(email);
    const message = {
      from: process.env.MAILER_auth_user,
      to: email,
      subject: `Teminal :study 계정인증 이메일`,
      attachments: [
        {
          filename: 'logo.png',
          path: process.env.PATH_logo,
          cid: 'logo',
        },
      ],
      html: `
      <div style="background-color:#18171D; width:540px; border-radius: 1em;" align="center">
      <a href='${process.env.DOMAIN}'>
      <img src=${'cid:logo'} style="margin-left:5px; margin-right:10px; padding-top:25px; width:40px; height:40px" />
      </a>
      
      <b>
      <font size="8px" color="#2876F2">
      Terminal :study<br>
      </font>
      <br>

      <font color="white" size="4px">
      이메일 인증을 완료하고 스터디에 참여해보세요<br><br><br>
      </font>
      <font color="#2876F2" size="4px">
      <a href='${processUri}' style="text-decoration: none; color:white; size=4px;">
      <div style="width:150px; height:30px; background-color:#2876F2; border-radius: 1em; padding-top:5px">
      인증하기
      </div></a>
      
      <br><br>
      
      <div align="right" style="padding-right:20px;">
      Team Iron-mental <br><br>
      </div>
      </font></b></div>`,
    };

    await transporter.sendMail(message);
  } catch (err) {
    throw customError(500, err);
  }
};

module.exports = { sendVerifyEmail };
