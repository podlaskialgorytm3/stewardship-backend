import GroupUserService from "../services/group-user";
import GroupService from "../services/group";
import UserService from "../services/user";
import TaskAffilationService from "../services/task-affilation";
import GroupUserRequestService from "../services/group-user-request";
import TaskInfoService from "../services/task-info";
import SubTaskService from "../services/sub-task";

const groupUser = new GroupUserService();
const group = new GroupService();
const user = new UserService();
const taskAffilation = new TaskAffilationService();
const groupUserRequest = new GroupUserRequestService();
const taskInfo = new TaskInfoService();
const subTask = new SubTaskService();

const createTables = async () => {
  groupUser.createTable();
  group.createTable();
  user.createTable();
  taskAffilation.createTable();
  groupUserRequest.createTable();
  taskInfo.createTable();
  subTask.createTable();
};

export default createTables;
