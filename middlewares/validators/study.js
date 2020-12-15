const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const commonValid = require('./common');

const createStudy = async (req, res, next) => {
  const bodySchema = Joi.object({
    category: Joi.string().custom(commonValid.categoryValid).required(),
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
    sns_notion: Joi.string().allow('').custom(commonValid.uriMethod).max(170),
    sns_evernote: Joi.string().allow('').custom(commonValid.uriMethod).max(170),
    sns_web: Joi.string().allow('').custom(commonValid.uriMethod).max(170),
    image: Joi.allow(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
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
    next(validError(err));
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
    sns_notion: Joi.string().allow('').custom(commonValid.uriMethod).max(170),
    sns_evernote: Joi.string().allow('').custom(commonValid.uriMethod).max(170),
    sns_web: Joi.string().allow('').custom(commonValid.uriMethod).max(170),
    image: Joi.allow(),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const studyDelete = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().min(1).required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
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
    next(validError(err));
  }
};

const studyList = async (req, res, next) => {
  const querySchema = Joi.object({
    category: Joi.string().custom(commonValid.categoryValid).required(),
    sort: Joi.string().required(),
  });
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    next(validError(err));
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
    next(validError(err));
  }
};

const leaveStudy = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.string().min(1).required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const delegate = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().min(1).required(),
  });
  const bodySchema = Joi.object({
    new_leader: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const search = async (req, res, next) => {
  const querySchema = Joi.object({
    word: Joi.string().max(30).required(),
    category: Joi.string(),
    sigungu: Joi.string().max(20),
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
  studyDelete,
  myStudy,
  studyList,
  studyPaging,
  leaveStudy,
  delegate,
  search,
};
