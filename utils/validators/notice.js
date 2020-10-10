const Joi = require('joi');

const createNotice = async (req, res, next) => {
  const paramSchema = Joi.object({
    studyId: Joi.number().required(),
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
    studyId: Joi.number().required(),
    noticeId: Joi.number().required(),
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
    studyId: Joi.number().required(),
    noticeId: Joi.number().required(),
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

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate
};
