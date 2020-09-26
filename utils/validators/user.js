const Joi = require('joi');

const signup = async (req, res, next) => {
  const signupSchema = Joi.object({
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
    await signupSchema.validateAsync(req.body);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

const withdraw = async (req, res, next) => {
  const signupSchema = Joi.object({
    uid: Joi.string() //
      .alphanum()
      .required(),
  });
  try {
    await signupSchema.validateAsync(req.params);
    next();
  } catch (err) {
    const error = { status: 422, message: err.details[0].message };
    next(error);
  }
};

module.exports = { signup, withdraw };
