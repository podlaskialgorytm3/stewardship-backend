import Joi from "joi";

export const ScheduleRuleSchema = Joi.object({
  groupId: Joi.string().required(),
  scheduleRoleName: Joi.string().min(3).required(),
  maxDailyHours: Joi.number().required(),
  maxWeeklyHours: Joi.number().required(),
  maxRestBeetwenShifs: Joi.number().required(),
  maxWeeklyRest: Joi.number().required(),
}).messages({
  "groupId.required": "Group ID is required",
  "scheduleRoleName.required": "Schedule rule name is required",
  "scheduleRoleName.min":
    "Schedule rule name must be at least 3 characters long",
  "maxDailyHours.required": "Maximum daily hours is required",
  "maxWeeklyHours.required": "Maximum weekly hours is required",
  "maxRestBeetwenShifs.required": "Maximum rest between shifts is required",
  "maxWeeklyRest.required": "Maximum weekly rest is required",
});

export type ScheduleRule = Joi.Schema<typeof ScheduleRuleSchema>;
