const Joi = require('joi');

const createStudy = async (req, res, next) => {
  const bodySchema = Joi.object({
    userId: Joi.number().required(),
    category: Joi.string().required(),
    title: Joi.string().required(),
    introduce: Joi.string().required(),
    image: Joi.string().required(),
    progress: Joi.string().required(),
    studyTime: Joi.string().required(),
    location: Joi.string().required(),
    locationSigungu: Joi.string().required(),
    locationRo: Joi.string().required(),
    locationDetail: Joi.string().required(),
    snsNotion: Joi.string().required(),
    snsEvernote: Joi.string().required(),
    snsWeb: Joi.string().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next({ status: 422, message: err.details[0].message });
  }
};

module.exports = { createStudy };
