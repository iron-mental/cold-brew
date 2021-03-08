require('dotenv').config();
const nodemailer = require('nodemailer');

const { mailer } = require('../configs/config');
const { customError } = require('./errors/custom');

const transporter = nodemailer.createTransport(mailer);

const sendVerifyEmail = async (email) => {
  try {
    const processUri = process.env.DOMAIN + process.env.MAILER_processUri + email;
    const message = {
      from: process.env.APP_name + process.env.MAILER_auth_user,
      to: email,
      secure: Boolean(process.env.MAILER_secure),
      subject: process.env.APP_name + ' 계정 인증',
      attachments: [
        {
          filename: 'logo_black.png',
          path: process.env.PATH_logo,
          cid: 'logo',
        },
      ],
      html: `
      <div style="background-color:#18171D; width:540px; border-radius: 1em;" align="center">
      <a href='${process.env.DOMAIN}'>
      <img src=${'cid:logo'} style="margin-left:5px; margin-right:10px; margin-top:35px; width:70px; height:60px;" />
      </a>
      <br>
      
      <b>
      <font size="7px" color="#2876F2">
      ${process.env.APP_name}<br>
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
      </b>
      </font></br></div>`,
    };

    await transporter.sendMail(message);
  } catch (err) {
    throw customError(500, err);
  }
};

module.exports = { sendVerifyEmail };
