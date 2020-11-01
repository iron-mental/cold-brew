const Joi = require('joi');

const createStudy = async (req, res, next) => {
  const bodySchema = Joi.object({
    user_id: Joi.number().required(),
    category: Joi.string().required(),
    title: Joi.string().required().min(2).max(10),
    introduce: Joi.string().required().max(200),
    progress: Joi.string().required().max(100),
    study_time: Joi.string().required().max(100),
    location: Joi.string().required(),
    location_last: Joi.string().required(),
    location_detail: Joi.string().required(),
    sns_notion: Joi.string().max(150),
    sns_evernote: Joi.string().max(60),
    sns_web: Joi.string().max(200),
    image: Joi.allow(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const studyDetail = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const studyUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    category: Joi.string(),
    title: Joi.string().min(2).max(10),
    introduce: Joi.string().max(200),
    progress: Joi.string().max(100),
    study_time: Joi.string().max(100),
    location: Joi.string(),
    location_last: Joi.string(),
    location_detail: Joi.string(),
    sns_notion: Joi.string().max(150),
    sns_evernote: Joi.string().max(60),
    sns_web: Joi.string().max(200),
    image: Joi.allow(),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const myStudy = async (req, res, next) => {
  const paramSchema = Joi.object({
    user_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

const studyList = async (req, res, next) => {
  const paramSchema = Joi.object({
    category: Joi.string().required(),
    sort: Joi.string().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};
module.exports = { createStudy, studyDetail, studyUpdate, myStudy, studyList };
