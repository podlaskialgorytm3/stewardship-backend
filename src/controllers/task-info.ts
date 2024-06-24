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
    public createTaskInfo = async (taskInfo: TaskInfoInterface, groupUserId: number, role: string) => {
        const id = uuidv4() as unknown as number;
        try{
            if(role !== "admin"){
                return "You are not authorized to create a new task info";
            }
            else{
                await TaskInfo.create({
                    id: id,
                    taskId: taskInfo.taskId,
                    startDate: taskInfo.startDate,
                    endDate: taskInfo.endDate,
                    status: taskInfo.status,
                    priority: taskInfo.priority,
                    assignedBy: groupUserId,
                    comments: taskInfo.comments
                });
                await this.taskAffilationController.addTaskAffilation(id, groupUserId, role);
                return "New task info created!";
            }
        }
        catch(error){
            return "An error occurred while creating a new task info: " + error;
        }
    }
    public getTaskInfo = async (taskInfoId: number) => {
        try{
            const taskInfo = await TaskInfo.findByPk(taskInfoId);
            const taskAffilations = await this.taskAffilationController.getTaskAffilation(taskInfoId);
            console.log(taskAffilations)
            return {
                taskInfo: taskInfo,
                members: taskAffilations
            };
        }
        catch(error){
            return "An error occurred while getting task info: " + error;
        }
    }
    public editTaskInfo = async (taskInfoId: number, taskInfo: TaskInfoInterface, role: string) => {
        try{
            if(role !== "admin"){
                return "You are not authorized to edit this task info";
            }
            else{
                await TaskInfo.update({
                    taskId: taskInfo.taskId,
                    startDate: taskInfo.startDate,
                    endDate: taskInfo.endDate,
                    status: taskInfo.status,
                    priority: taskInfo.priority,
                    comments: taskInfo.comments
                }, {
                    where: {
                        id: taskInfoId
                    }
                });
                return "Task info updated!";
            }
        }
        catch(error){
            return "An error occurred while updating task info: " + error;
        }
    }
}

export default TaskInfoController;