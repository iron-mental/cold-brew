const Joi = require('joi');

const emailVerification = async (req, res, next) => {
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
    next({ status: 422, message: err.details[0].message });
  }
};

const emailVerificationProcess = async (req, res, next) => {
  const paramSchema = Joi.object({
    email: Joi.string() //
      .required(),
  }).min(1);

  try {
    await paramSchema.validateAsync(req.query);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const resetPassword = async (req, res, next) => {
  const paramSchema = Joi.object({
    email: Joi.string() //
      .required(),
  }).min(1);

  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

module.exports = { emailVerification, emailVerificationProcess, resetPassword };
