import GroupUserService from "./group-user";
import { PreferenceService } from "./preference";
import { SkillService } from "./skill";
import { GroupSkillService } from "./group-skill";
import { ScheduleRuleService } from "./schedule-rule";
import { ShiftService } from "./shift";
import { EmploymentTypeService } from "./employment-type";
import { UnavailableDayService } from "./unavailable-day";

class ScheduleInformationService {
  groupUserService: GroupUserService;
  preferenceService: PreferenceService;
  skillService: SkillService;
  groupSkillService: GroupSkillService;
  scheduleRuleService: ScheduleRuleService;
  shiftService: ShiftService;
  employmentTypeService: EmploymentTypeService;
  unavailableDayService: UnavailableDayService;

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

    this.month = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
    this.year =
      this.month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
  }
}

export { ScheduleInformationService };
