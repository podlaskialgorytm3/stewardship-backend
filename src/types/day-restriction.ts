import Joi from "Joi";

export const DayRestrictionSchema = Joi.object({
  scheduleRuleId: Joi.string().required(),
  dayOfWeek: Joi.string().required(),
  maxFollowingDay: Joi.number().required(),
});

export interface DayRestriction {
  id: string;
  scheduleRuleId: string;
  dayOfWeek: string;
  maxFollowingDay: number;
}
