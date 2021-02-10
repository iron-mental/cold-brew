const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const { CategoryEnum } = require('../../utils/variables/enum');

const categoryValid = (value, helpers) => {
  const category = CategoryEnum[value];

  if (!category) {
    return helpers.error('category.invalidCategory');
  }
  return category;
};

const uriMethod = (value, helpers) => {
  const target = uriList[helpers.state.path.slice(-1)[0]];
  if (target !== value.slice(0, target.length)) {
    return helpers.error('uri.invalidUri');
  }
  return value;
};

const uriList = {
  sns_appstore: 'https://apps.apple.com/',
  sns_playstore: 'https://play.google.com/',
  sns_notion: 'https://www.notion.so/',
  sns_evernote: 'https://evernote.com/',
  sns_linkedin: 'https://linkedin.com/',
  sns_web: 'https://',
};

const setTrim = (req, res, next) => {
  for (let prop in req.params) {
    req.params[prop] = typeof req.params[prop] === 'String' ? req.params[prop].trim() : req.params[prop];
  }

  for (let prop in req.body) {
    req.body[prop] = typeof req.body[prop] === 'String' ? req.body[prop].trim() : req.body[prop];
  }

  for (let prop in req.query) {
    req.query[prop] = typeof req.query[prop] === 'String' ? req.query[prop].trim() : req.query[prop];
  }

  return next();
};

const checkVersion = async (req, res, next) => {
  const querySchema = Joi.object({
    version: Joi.string().required(),
  });
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  categoryValid,
  uriMethod,
  setTrim,
  checkVersion,
};
