const Joi = require('joi');

const resetPassword = async (req, res, next) => {
  const paramSchema = Joi.object({
    email: Joi.string().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

module.exports = { resetPassword };
