const Joi = require('joi');
const GraphemeSplitter = require('grapheme-splitter');

const { validError } = require('../../utils/errors/validation');
const { CategoryEnum, DeviceEnum } = require('../../utils/variables/enum');

const splitter = new GraphemeSplitter();

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

const checkVersion = async (req, res, next) => {
  const querySchema = Joi.object({
    version: Joi.string().required(),
    device: Joi.equal(...Object.values(DeviceEnum)).required(),
  });
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const parseGrapheme = (req) => {
  const targets = ['body', 'params', 'query'];
  const grapheme = {
    body: {},
    params: {},
    query: {},
  };
  let tmp = '';

  targets.forEach((target) => {
    if (Object.keys(req[target]).length) {
      for (let prop in req[target]) {
        tmp = '';
        if (typeof req[target][prop] === 'boolean') {
          tmp = req[target][prop];
        } else {
          splitter.splitGraphemes(req[target][prop]).forEach((char) => {
            char.length > 1 ? (tmp += 'A') : (tmp += char);
          });
        }
        grapheme[target][prop] = tmp;
      }
    }
  });

  return grapheme;
};

const parseRequest = (req, res, next) => {
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

const parseProjectGrapheme = (req) => {
  const parse = {
    body: {},
  };

  if (!req.body.project_list) {
    return parse;
  }
  let tmp = {};

  parse.body.project_list = req.body.project_list.map((project) => {
    tmp = {};
    Object.entries(project).forEach(([key, value]) => {
      if (typeof value === 'number' || value === null) {
        tmp[key] = null;
      } else {
        tmp[key] = '';
        splitter.splitGraphemes(value).forEach((char) => {
          char.length > 1 ? (tmp[key] += 'A') : (tmp[key] += char);
        });
      }
    });
    return tmp;
  });

  return parse;
};

module.exports = {
  categoryValid,
  uriMethod,
  parseRequest,
  checkVersion,
  parseGrapheme,
  parseProjectGrapheme,
};
