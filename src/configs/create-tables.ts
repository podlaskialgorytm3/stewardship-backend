import GroupUserController from '../controllers/group-user';
import GroupController from '../controllers/group';
import UserController from '../controllers/user';
import TaskController from '../controllers/task';
import TaskAffilationController from '../controllers/task-affilation';

const groupUser = new GroupUserController();
const group = new GroupController();
const user = new UserController();
const task = new TaskController();
const taskAffilation = new TaskAffilationController();

const createTables = async () => {
    groupUser.createTable();
    group.createTable();
    user.createTable();
    task.createTable();
    taskAffilation.createTable();
}

export default createTables;