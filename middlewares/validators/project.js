const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const commonValid = require('./common');

const createProject = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    title: Joi.string().max(20).required(),
    contents: Joi.string().max(200).required(),
    sns_github: Joi.string().allow('').max(40),
    sns_appstore: Joi.string().allow('').custom(commonValid.uriMethod).max(150),
    sns_playstore: Joi.string().allow('').custom(commonValid.uriMethod).max(150),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getProjectList = async (req, res, next) => {
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

const deleteProject = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
    project_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const updateProject = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });

  const projectSchema = Joi.object({
    id: Joi.number(),
    title: Joi.string().max(20),
    contents: Joi.string().max(200),
    sns_github: Joi.string().allow('').max(40),
    sns_appstore: Joi.string().allow('').custom(commonValid.uriMethod).max(150),
    sns_playstore: Joi.string().allow('').custom(commonValid.uriMethod).max(150),
  });

  const projects = Joi.array().items(projectSchema).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await projects.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  createProject,
  getProjectList,
  updateProject,
  deleteProject,
};
