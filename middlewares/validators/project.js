const Joi = require('joi');

const { validError } = require('../../utils/errors/customError');

const createProject = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    title: Joi.string().max(20).required(),
    contents: Joi.string().max(200).required(),
    sns_github: Joi.string().max(40),
    sns_appstore: Joi.string().max(100),
    sns_playstore: Joi.string().max(100),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    validError(next, err);
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
    validError(next, err);
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
    validError(next, err);
  }
};

const updateProject = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
    project_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    title: Joi.string().max(20),
    contents: Joi.string().max(200),
    sns_github: Joi.string().max(40),
    sns_appstore: Joi.string().max(100),
    sns_playstore: Joi.string().max(100),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    validError(next, err);
  }
};

module.exports = {
  createProject,
  getProjectList,
  updateProject,
  deleteProject,
};
