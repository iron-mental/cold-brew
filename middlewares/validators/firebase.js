const Joi = require('joi');
const { validError } = require('../../utils/errors/customError');

const resetPassword = async (req, res, next) => {
  const paramSchema = Joi.object({
    email: Joi.string().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    validError(next, err);
  }
};

module.exports = { resetPassword };
