const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const commonValid = require('./common');

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

const updateProject = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });

  const projectSchema = Joi.object({
    id: Joi.allow(),
    title: Joi.string().max(20).required(),
    contents: Joi.string().max(200).required(),
    sns_github: Joi.string().allow('').max(40),
    sns_appstore: Joi.string().allow('').custom(commonValid.uriMethod).max(150),
    sns_playstore: Joi.string().allow('').custom(commonValid.uriMethod).max(150),
  });

  const bodySchema = Joi.object({
    project_list: Joi.array().items(projectSchema),
  });

  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  getProjectList,
  updateProject,
};
