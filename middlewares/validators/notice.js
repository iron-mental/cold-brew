const Joi = require('joi');
const { validError } = require('../../utils/errors/customError');

const createNotice = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    title: Joi.string().required().max(30),
    contents: Joi.string().required().max(200),
    pinned: Joi.boolean().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    validError(next, err);
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
    validError(next, err);
  }
};

const noticeUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    notice_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    title: Joi.string().max(30),
    contents: Joi.string().max(200),
    pinned: Joi.boolean(),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    validError(next, err);
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
    validError(next, err);
  }
};

const noticeList = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    validError(next, err);
  }
};

const noticePaging = async (req, res, next) => {
  const querySchema = Joi.object({
    values: Joi.string().min(1).required(),
  });
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    validError(next, err);
  }
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
  noticeList,
  noticePaging,
};
