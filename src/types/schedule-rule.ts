import Joi from "joi";

export const ScheduleRuleSchema = Joi.object({
  groupId: Joi.string().required(),
  scheduleRuleName: Joi.string().min(3).required(),
  maxDailyHours: Joi.number().required(),
  maxWeeklyHours: Joi.number().required(),
  minRestBeetwenShifts: Joi.number().required(),
  minWeeklyRest: Joi.number().required(),
}).messages({
  "groupId.required": "Group ID is required",
  "scheduleRuleName.required": "Schedule rule name is required",
  "scheduleRuleName.min":
    "Schedule rule name must be at least 3 characters long",
  "maxDailyHours.required": "Maximum daily hours is required",
  "maxWeeklyHours.required": "Maximum weekly hours is required",
  "minRestBeetwenShifts.required": "Maximum rest between shifts is required",
  "minWeeklyRest.required": "Maximum weekly rest is required",
});

export type ScheduleRuleType = Joi.Schema<typeof ScheduleRuleSchema>;
