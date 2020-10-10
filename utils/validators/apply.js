const Joi = require('joi');

const createApply = async (req, res, next) => {
  const paramSchema = Joi.object({
    studyId: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    userId: Joi.number().required(),
    message: Joi.string().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const applyDetail = async (req, res, next) => {
  const paramSchema = Joi.object({
    studyId: Joi.number().required(),
    applyId: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const applyUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    studyId: Joi.number().required(),
    applyId: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    message: Joi.string(),
    rejected: Joi.boolean(),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const applyDelete = async (req, res, next) => {
  const paramSchema = Joi.object({
    studyId: Joi.number().required(),
    applyId: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete
};
