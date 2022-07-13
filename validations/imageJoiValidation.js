const Joi = require("@hapi/joi");

module.exports = function (data) {
  const details = Joi.object({
    description: Joi.string().required(),
    lastModifiedOn: Joi.date().required(),
    uploadedOn: Joi.date().required(),
  });
  const imageSchema = Joi.object({
    imageDetails: details,
    imageName: Joi.string().required(),
    imageURL: Joi.string().required(),
  });
  return imageSchema.validate(data);
};
