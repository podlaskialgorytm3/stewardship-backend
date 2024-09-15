import Joi from "Joi";

export const EmploymentTypeSchema = Joi.object({
  groupId: Joi.string().required(),
  employmentName: Joi.string().required(),
  workingHours: Joi.number().required(),
}).messages({
  "groupId.required": "Group ID is required",
  "employmentName.required": "Employment name is required",
  "workingHours.required": "Working hours is required",
});

export interface EmploymentTypeInterface {
  groupId: string;
  employmentName: string;
  workingHours: number;
}
