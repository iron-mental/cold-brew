const Joi = require('joi');

const createStudy = async (req, res, next) => {
  const bodySchema = Joi.object({
    user_id: Joi.number().required(),
    category: Joi.string().required(),
    title: Joi.string().required(),
    introduce: Joi.string().required(),
    progress: Joi.string().required(),
    study_time: Joi.string().required(),
    location: Joi.string().required(),
    // location_last: Joi.string().required(),
    location_detail: Joi.string().required(),
    sns_notion: Joi.string(),
    sns_evernote: Joi.string(),
    sns_web: Joi.string(),
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
    title: Joi.string(),
    introduce: Joi.string(),
    progress: Joi.string(),
    study_time: Joi.string(),
    location: Joi.string(),
    location_last: Joi.string(),
    location_detail: Joi.string(),
    sns_notion: Joi.string(),
    sns_evernote: Joi.string(),
    sns_web: Joi.string(),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

module.exports = { createStudy, studyDetail, studyUpdate };
