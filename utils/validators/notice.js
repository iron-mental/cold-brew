const Joi = require('joi');

const createNotice = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    title: Joi.string().required(),
    contents: Joi.string().required(),
    pined: Joi.boolean().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const noticeDetail = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    notice_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const noticeUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    notice_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    title: Joi.string(),
    contents: Joi.string(),
    pined: Joi.boolean(),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const noticeDelete = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    notice_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
};
