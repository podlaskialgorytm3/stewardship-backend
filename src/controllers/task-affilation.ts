import TaskAffilation from "../models/task-affilation";

class TaskAffilationController {
    public createTable = async () => {
        TaskAffilation.sync({ alter: true })
            .then(() => {
                console.log('Task Affilation table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the Group table:', error);
            });
    }
}

export default TaskAffilationController;