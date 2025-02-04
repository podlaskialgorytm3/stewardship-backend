import Joi from "joi";

export const WorkScheduleSchema = Joi.object({
  day: Joi.number().required(),
  isWorkingDay: Joi.boolean().required(),
  start: Joi.string().required(),
  end: Joi.string().required(),
}).messages({
  "any.required": "{{#label}} is required",
  "string.empty": "{{#label}} is not allowed to be empty",
  "number.base": "{{#label}} should be a number",
  "boolean.base": "{{#label}} should be a boolean",
  "string.base": "{{#label}} should be a string",
});
