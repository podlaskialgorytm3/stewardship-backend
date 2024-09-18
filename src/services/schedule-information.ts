import GroupUserService from "./group-user";
import { PreferenceService } from "./preference";
import { SkillService } from "./skill";
import { GroupSkillService } from "./group-skill";
import { ScheduleRuleService } from "./schedule-rule";
import { ShiftService } from "./shift";
import { EmploymentTypeService } from "./employment-type";
import { UnavailableDayService } from "./unavailable-day";
import { DayRestrictionService } from "./day-restriction";

import { ShiftInterface } from "../types/shift";

class ScheduleInformationService {
  groupUserService: GroupUserService;
  preferenceService: PreferenceService;
  skillService: SkillService;
  groupSkillService: GroupSkillService;
  scheduleRuleService: ScheduleRuleService;
  shiftService: ShiftService;
  employmentTypeService: EmploymentTypeService;
  unavailableDayService: UnavailableDayService;
  dayRestrictionService: DayRestrictionService;

  month: number;
  year: number;

  constructor() {
    this.groupUserService = new GroupUserService();
    this.preferenceService = new PreferenceService();
    this.skillService = new SkillService();
    this.groupSkillService = new GroupSkillService();
    this.scheduleRuleService = new ScheduleRuleService();
    this.shiftService = new ShiftService();
    this.employmentTypeService = new EmploymentTypeService();
    this.unavailableDayService = new UnavailableDayService();
    this.dayRestrictionService = new DayRestrictionService();

    this.month = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
    this.year =
      this.month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
  }

  public getScheduleInfomationByGroupId = async ({
    groupId,
    month,
    year,
    token,
  }: {
    groupId: string;
    month: number;
    year: number;
    token: string;
  }) => {
    try {
      const role = (await this.groupUserService.getRole({
        groupId,
        token,
      })) as string;
      if (role !== "admin") {
        return {
          type: "error",
          message: "You do not have permission to access this information",
        };
      }
      const groupUsers = await this.groupUserService.getUsersByGroupId({
        groupId,
      });
      if (!groupUsers) {
        return {
          type: "error",
          message: "No group users found",
        };
      }
      const scheduleInformation = Promise.all(
        groupUsers.map(async (groupUser) => {
          const preferences = (await this.preferenceService.getPreference({
            groupId,
            groupUserId: groupUser.id,
            token,
            month,
            year,
          })) as {
            id: string;
            preferedDays: string;
            shiftId: string;
            employmentTypeId: string;
          };
          const userSkills = (await this.groupSkillService.getBelongingSkills({
            groupUserId: groupUser.id,
          })) as { id: string; skillName: string }[];
          const scheduleRule =
            await this.scheduleRuleService.getScheduleRuleById({
              scheduleRuleId: groupUser.scheduleRuleId,
            });
          const dayRestriction =
            await this.dayRestrictionService.getDayRestrictions({
              scheduleRuleId: groupUser.scheduleRuleId,
            });

          const shift = (await this.shiftService.getShiftById({
            shiftId: preferences?.shiftId,
          })) as ShiftInterface;
          const employmentType =
            await this.employmentTypeService.getEmploymentType({
              employmentTypeId: preferences?.employmentTypeId,
            });
          const unavialableDays =
            await this.unavailableDayService.getUnavailableDaysByPreferenceId({
              preferenceId: preferences?.id,
            });
          return {
            groupUserId: groupUser.id,
            name: groupUser.name,
            month: month,
            year: year,
            position: groupUser.position,
            preferedDays: preferences?.preferedDays || "",
            skils:
              userSkills.map((userSkill) => {
                return {
                  id: userSkill.id,
                  skillName: userSkill.skillName,
                };
              }) || [],
            scheduleRule: {
              ...scheduleRule,
              dayRestriction: dayRestriction?.map((dayRestriction) => {
                return {
                  id: dayRestriction.id,
                  dayOfWeek: dayRestriction.dayOfWeek,
                  maxFollowingDay: dayRestriction.maxFollowingDay,
                };
              }),
            },
            shift: shift,
            employmentType: employmentType,
            unavialableDays: unavialableDays || [],
          };
        })
      );
      return scheduleInformation;
    } catch (error) {
      return {
        type: "error",
        message:
          "An error occurred while fetching schedule information: " + error,
      };
    }
  };
}

export { ScheduleInformationService };
