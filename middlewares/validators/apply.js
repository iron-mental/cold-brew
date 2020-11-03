const Joi = require('joi');
const { validError } = require('../../utils/errors/customError');

const createApply = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    user_id: Joi.number().required(),
    message: Joi.string().required().max(100),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    validError(next, err);
  }
};

const applyDetail = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    validError(next, err);
  }
};

const applyUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    message: Joi.string().required().max(100),
    rejected_status: Joi.boolean(),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    validError(next, err);
  }
};

const applyDelete = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    validError(next, err);
  }
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
};