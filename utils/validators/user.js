const Joi = require('joi');

const signup = async (req, res, next) => {
  const bodySchema = Joi.object({
    email: Joi.string() //
      .email()
      .required(),
    password: Joi.string() //
      .required(),
    nickname: Joi.string() //
      .min(2)
      .max(8)
      .required(),
  }).min(1);
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

const login = async (req, res, next) => {
  const bodySchema = Joi.object({
    email: Joi.string() //
      .email()
      .required(),
    password: Joi.string() //
      .required(),
  }).min(1);
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

const detail = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number() //
      .required(),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

const update = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number() //
      .required(),
  }).min(1);

  const bodySchema = Joi.object({
    email: Joi.string() //
      .email(),
    nickname: Joi.string() //
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
  }).min(1);

  try {
    await paramSchema.validateAsync(req.paramSchema);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

// const checkNickname = async (req, res, next) => {
//   const paramSchema = Joi.object({
//     nickname: Joi.string() //
//       .min(2)
//       .max(8)
//       .required(),
//   }).min(1);
//   try {
//     await paramSchema.validateAsync(req.params);
//     next();
//   } catch (err) {
//     const error = { status: 422, message: err.details[0].message };
//     next(error);
//   }
// };

// 중복체크 통합
const check = async (req, res, next) => {
  const querySchema = Joi.object({
    nickname: Joi.string() //
      .min(2)
      .max(8),
    email: Joi.string() //
      .email(),
  })
    .min(1)
    .max(1);
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

const withdraw = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number() //
      .required(),
  }).min(1);

  const bodySchema = Joi.object({
    email: Joi.string() //
      .email()
      .required(),
    password: Joi.string() //
      .required(),
  }).min(1);

  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

module.exports = {
  signup,
  login,
  detail,
  update,
  // checkNickname,
  withdraw,
  check,
};
