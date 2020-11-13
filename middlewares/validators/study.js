const Joi = require('joi');
const { validError } = require('../../utils/errors/customError');

const createStudy = async (req, res, next) => {
  const bodySchema = Joi.object({
    user_id: Joi.number().required(),
    category: Joi.string().required(),
    title: Joi.string().required().min(2).max(10),
    introduce: Joi.string().required().max(200),
    progress: Joi.string().required().max(100),
    study_time: Joi.string().required().max(100),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    sido: Joi.string().max(20).required(),
    sigungu: Joi.string().max(20).required(),
    address_name: Joi.string().max(100).required(),
    location_detail: Joi.string().max(30),
    place_name: Joi.string().max(30),
    sns_notion: Joi.string().max(150),
    sns_evernote: Joi.string().max(60),
    sns_web: Joi.string().max(200),
    image: Joi.allow(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    validError(next, err);
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
    validError(next, err);
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
    latitude: Joi.number(),
    longitude: Joi.number(),
    sido: Joi.string().max(20),
    sigungu: Joi.string().max(20),
    address_name: Joi.string().max(100),
    location_detail: Joi.string().max(30),
    place_name: Joi.string().max(30),
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
    validError(next, err);
  }
};

const myStudy = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    validError(next, err);
  }
};

const studyList = async (req, res, next) => {
  const querySchema = Joi.object({
    category: Joi.string().required(),
    sort: Joi.string().required(),
  });
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    validError(next, err);
  }
};

const studyPaging = async (req, res, next) => {
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
  createStudy,
  studyDetail,
  studyUpdate,
  myStudy,
  studyList,
  studyPaging,
};
