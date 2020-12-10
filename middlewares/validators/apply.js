const Joi = require('joi');
const { validError } = require('../../utils/errors/custom');

const createApply = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    message: Joi.string().required().max(100),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getApplyByUser = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    user_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getApplyById = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const applyUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    message: Joi.string().required().max(100),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
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
    next(validError(err));
  }
};

const applyList = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const applyProcess = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    allow: Joi.bool().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  createApply,
  getApplyByUser,
  getApplyById,
  applyUpdate,
  applyDelete,
  applyList,
  applyProcess,
};
