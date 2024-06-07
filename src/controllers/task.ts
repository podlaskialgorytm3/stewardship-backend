import Task from "../models/task-affilation";

class TaskController {
    public createTable = async () => {
        Task.sync({ alter: true })
            .then(() => {
                console.log('Task Affilation table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the Group table:', error);
            });
    }
}

export default TaskController;