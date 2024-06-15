import TaskInfo from '../models/task-info';
import { TaskInfo as TaskInfoInterface } from '../types/task';

class TaskInfoController {
    public createTable = async () => {
        TaskInfo.sync({ alter: true })
            .then(() => {
                console.log('TaskInfo table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the TaskInfo table:', error);
            });
    }
    public createTaskInfo = async (taskInfo: TaskInfoInterface, creatorId: number) => {
        try{
            await TaskInfo.create({
                id: taskInfo.id,
                taskId: taskInfo.taskId,
                startDate: taskInfo.startDate,
                endDate: taskInfo.endDate,
                status: taskInfo.status,
                priority: taskInfo.priority,
                assignedBy: creatorId,
                comments: taskInfo.comments
            });
            return "New task info created!";
        }
        catch(error){
            return "An error occurred while creating a new task info: " + error;
        }
    }
}

export default TaskInfoController;