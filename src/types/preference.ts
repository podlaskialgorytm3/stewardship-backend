import Joi from "joi";

export const PreferenceSchema = Joi.object({
  shiftId: Joi.string().required(),
  preferedDays: Joi.string().required(),
  employmentTypeId: Joi.string().required(),
}).messages({
  "any.required": "{{#label}} is required",
  "string.empty": "{{#label}} is required",
  "string.base": "{{#label}} must be a string",
});
