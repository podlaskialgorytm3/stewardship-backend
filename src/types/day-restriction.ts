import Joi from "joi";

export const DayRestrictionSchema = Joi.object({
  scheduleRuleId: Joi.string().required(),
  dayOfWeek: Joi.string().required(),
  maxFollowingDay: Joi.number().required(),
});

export const DayRestrictionUpdateSchema = Joi.object({
  dayOfWeek: Joi.string().required(),
  maxFollowingDay: Joi.number().required(),
});

export interface DayRestrictionInterface {
  id: string;
  scheduleRuleId: string;
  dayOfWeek: string;
  maxFollowingDay: number;
}
