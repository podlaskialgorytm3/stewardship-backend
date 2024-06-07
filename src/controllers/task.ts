import Task from "../models/task";

class TaskController {
    public createTable = async () => {
        Task.sync({ alter: true })
            .then(() => {
                console.log('Task table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the Task table:', error);
            });
    }
}

export default TaskController;