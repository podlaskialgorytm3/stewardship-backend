import GroupUserService from "../services/group-user";
import GroupService from "../services/group";
import UserService from "../services/user";
import TaskAffilationService from "../services/task-affilation";
import GroupUserRequestService from "../services/group-user-request";
import TaskInfoService from "../services/task-info";
import SubTaskService from "../services/sub-task";
import { SkillService } from "../services/skill";
import { GroupSkillService } from "../services/group-skill";
import { ScheduleRuleService } from "../services/schedule-rule";
import { ShiftService } from "../services/shift";
import { DayRestrictionService } from "../services/day-restriction";
import { PreferenceService } from "../services/preference";

const groupUser = new GroupUserService();
const group = new GroupService();
const user = new UserService();
const taskAffilation = new TaskAffilationService();
const groupUserRequest = new GroupUserRequestService();
const taskInfo = new TaskInfoService();
const subTask = new SubTaskService();
const skill = new SkillService();
const groupSkill = new GroupSkillService();
const scheduleRule = new ScheduleRuleService();
const shift = new ShiftService();
const dayRestriction = new DayRestrictionService();
const preference = new PreferenceService();

const createTables = async () => {
  groupUser.createTable();
  group.createTable();
  user.createTable();
  taskAffilation.createTable();
  groupUserRequest.createTable();
  taskInfo.createTable();
  subTask.createTable();
  skill.createTable();
  groupSkill.createTable();
  scheduleRule.createTable();
  shift.createTable();
  dayRestriction.createTable();
  preference.createTable();
};

export default createTables;
