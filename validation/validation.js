const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(4).required().email()
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;