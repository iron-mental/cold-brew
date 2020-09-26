const Joi = require('joi');

const signup = async (req, res, next) => {
  const bodySchema = Joi.object({
    uid: Joi.string() //
      .alphanum()
      .required(),
    email: Joi.string() //
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    nickname: Joi.string() //
      .min(2)
      .max(8)
      .required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

const userDetail = async (req, res, next) => {
  const paramSchema = Joi.object({
    uid: Joi.string() //
      .alphanum()
      .required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

const userUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    uid: Joi.string() //
      .alphanum()
      .required(),
  });
  const bodySchema = Joi.object({
    email: Joi.string() //
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    nickname: Joi.string() //
      .alphanum()
      .min(2)
      .max(8),
    introduce: Joi.string(),
    location: Joi.string(),
    location_sigungu: Joi.string(),
    career_title: Joi.string(),
    career_contents: Joi.string(),
    sns_git: Joi.string(),
    sns_linked: Joi.string(),
    sns_web: Joi.string(),
  });
  try {
    await paramSchema.validateAsync(req.paramSchema);
    await bodySchema.validateAsync(req.body);
    if (!req.body) {
      console.log('req.body.length: ', req.body.length);
      next({ status: 422, message: '수정할 파라미터가 없습니다' });
    }
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

const checkNickname = async (req, res, next) => {
  const paramSchema = Joi.object({
    nickname: Joi.string() //
      .alphanum()
      .min(2)
      .max(8)
      .required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

const withdraw = async (req, res, next) => {
  const paramSchema = Joi.object({
    uid: Joi.string() //
      .alphanum()
      .required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

module.exports = { signup, userDetail, userUpdate, checkNickname, withdraw };
