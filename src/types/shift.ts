import Joi from "Joi";

export const ShiftSchema = Joi.object({
  groupId: Joi.string().required(),
  nameOfShift: Joi.string().min(3).required(),
  startFrom: Joi.string().required(),
  startTo: Joi.string().required(),
  endFrom: Joi.string().required(),
  endTo: Joi.string().required(),
  minDailyHours: Joi.number().required(),
  maxDailyHours: Joi.number().required(),
}).messages({
  "groupId.required": "Group ID is required",
  "nameOfShift.required": "Name of shift is required",
  "nameOfShift.min": "Name of shift must be at least 3 characters long",
  "startFrom.required": "Start from is required",
  "startTo.required": "Start to is required",
  "endFrom.required": "End from is required",
  "endTo.required": "End to is required",
  "minDailyHours.required": "Minimum daily hours is required",
  "maxDailyHours.required": "Maximum daily hours is required",
});

export interface ShiftInterface {
  id: string;
  groupId: string;
  nameOfShift: string;
  startFrom: string;
  startTo: string;
  endFrom: string;
  endTo: string;
  minDailyHours: number;
  maxDailyHours: number;
}
