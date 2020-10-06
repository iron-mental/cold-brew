const Joi = require('joi');

const createStudy = async (req, res, next) => {
  const bodySchema = Joi.object({
    userId: Joi.number().required(),
    category: Joi.string().required(),
    title: Joi.string().required(),
    introduce: Joi.string().required(),
    progress: Joi.string().required(),
    studyTime: Joi.string().required(),
    location: Joi.string().required(),
    locationSigungu: Joi.string(),
    locationRo: Joi.string(),
    locationDetail: Joi.string().required(),
    snsNotion: Joi.string(),
    snsEvernote: Joi.string(),
    snsWeb: Joi.string(),
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
    studyId: Joi.number().required(),
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
    studyId: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    category: Joi.string(),
    title: Joi.string(),
    introduce: Joi.string(),
    progress: Joi.string(),
    studyTime: Joi.string(),
    location: Joi.string(),
    locationSigungu: Joi.string(),
    locationRo: Joi.string(),
    locationDetail: Joi.string(),
    snsNotion: Joi.string(),
    snsEvernote: Joi.string(),
    snsWeb: Joi.string(),
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
