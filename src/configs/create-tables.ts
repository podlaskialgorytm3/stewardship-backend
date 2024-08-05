import GroupUserController from '../controllers/group-user';
import GroupController from '../controllers/group';
import UserController from '../controllers/user';
import TaskAffilationController from '../controllers/task-affilation';
import GroupUserRequestController from '../controllers/group-user-request';
import TaskInfoController from '../controllers/task-info';
import SubTaskController from '../controllers/sub-task';
import WorkingHoursController from '../controllers/working-hours';

const groupUser = new GroupUserController();
const group = new GroupController();
const user = new UserController();
const taskAffilation = new TaskAffilationController();
const groupUserRequest = new GroupUserRequestController();
const taskInfo = new TaskInfoController();
const subTask = new SubTaskController();
const workingHours = new WorkingHoursController();

const createTables = async () => {
    groupUser.createTable();
    group.createTable();
    user.createTable();
    taskAffilation.createTable();
    groupUserRequest.createTable();
    taskInfo.createTable();
    subTask.createTable();
    workingHours.createTable();
}

export default createTables;