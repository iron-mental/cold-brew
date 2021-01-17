const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const commonValid = require('./common');

const checkNickname = async (req, res, next) => {
  const paramSchema = Joi.object({
    nickname: Joi.string().required().min(2).max(8).alphanum(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const checkEmail = async (req, res, next) => {
  const querySchema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    await querySchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const signup = async (req, res, next) => {
  const bodySchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().max(20).alphanum(),
    nickname: Joi.string().required().min(2).max(8).alphanum(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const login = async (req, res, next) => {
  const bodySchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().max(20).alphanum(),
    push_token: Joi.string().required().alphanum(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const userDetail = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const userInfoUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    nickname: Joi.string().min(2).max(8).alphanum(),
    introduce: Joi.string().allow('').max(200),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const userImageUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    image: Joi.string(),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const userCareerUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    career_title: Joi.string().allow('').min(2).max(20),
    career_contents: Joi.string().allow('').max(200),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const userSnsUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    sns_github: Joi.string().allow('').max(40),
    sns_linkedin: Joi.string().allow('').custom(commonValid.uriMethod).max(170),
    sns_web: Joi.string().allow('').custom(commonValid.uriMethod).max(170),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const userLocationUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
    sido: Joi.string().max(20),
    sigungu: Joi.string().max(20),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const withdraw = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });

  const bodySchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().max(20),
  });

  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const emailVerification = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const emailVerificationProcess = async (req, res, next) => {
  const paramSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const reissuance = async (req, res, next) => {
  const bodySchema = Joi.object({
    refresh_token: Joi.string().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const resetPassword = async (req, res, next) => {
  const paramSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const updateEmail = async (req, res, next) => {
  const bodySchema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const updatePushToken = async (req, res, next) => {
  const bodySchema = Joi.object({
    push_token: Joi.string().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getAlert = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  checkNickname,
  checkEmail,
  signup,
  login,
  userDetail,
  userInfoUpdate,
  userImageUpdate,
  userCareerUpdate,
  userSnsUpdate,
  userLocationUpdate,
  withdraw,
  emailVerification,
  emailVerificationProcess,
  reissuance,
  resetPassword,
  updateEmail,
  updatePushToken,
  getAlert,
};
