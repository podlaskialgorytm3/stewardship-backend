import { v4 as uuidv4 } from 'uuid';
import TaskInfo from '../models/task-info';
import { TaskInfoCreation as TaskInfoInterface } from '../types/task';
import TaskAffilationController from './task-affilation';

class TaskInfoController {
    public taskAffilationController = new TaskAffilationController();
    public createTable = async () => {
        TaskInfo.sync({ alter: true })
            .then(() => {
                console.log('TaskInfo table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the TaskInfo table:', error);
            });
    }
    public createTaskInfo = async (taskInfo: TaskInfoInterface, groupUserId: number) => {
        try{
            await TaskInfo.create({
                id: uuidv4(),
                taskId: taskInfo.taskId,
                startDate: taskInfo.startDate,
                endDate: taskInfo.endDate,
                status: taskInfo.status,
                priority: taskInfo.priority,
                assignedBy: groupUserId,
                comments: taskInfo.comments
            });
            await this.taskAffilationController.addTaskAffilation(taskInfo.taskId, groupUserId);
            return "New task info created!";
        }
        catch(error){
            return "An error occurred while creating a new task info: " + error;
        }
    }
}

export default TaskInfoController;