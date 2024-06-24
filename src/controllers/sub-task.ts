import SubTask from '../models/sub-task';
import GroupUserController from './group-user';
import { SubTaskCreation } from '../types/sub-task';
import { v4 as uuidv4 } from 'uuid';

class SubTaskController {
    public groupUserController = new GroupUserController();
    public createTable = async () => {
        SubTask.sync({ alter: true })
            .then(() => {
                console.log('SubTask table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the SubTask table:', error);
            });
    }
    public createSubTask = async (subTaskData: SubTaskCreation, groupUserId: number) => {
        const subTaskId = uuidv4();
        try {
            await SubTask.create({
                id: subTaskId,
                taskInfoId: subTaskData.taskInfoId,
                title: subTaskData.title,
                description: subTaskData.description,
                status: subTaskData.status,
                assignedBy: groupUserId
            });
            return "Sub-task created successfully";
        } catch (error) {
            return "An error occurred while creating the sub-task: " + error;
        }
    }
    public getSubTask = async (subTaskId: number) => {
        try {
            const subTask = await SubTask.findByPk(subTaskId);
            return {
                id: subTask?.id,
                taskInfoId: subTask?.taskInfoId,
                title: subTask?.title,
                description: subTask?.description,
                status: subTask?.status,
                assignedBy: await this.groupUserController.getUserByGroupUserId(subTask?.assignedBy as number) 
            }
        } catch (error) {
            return "An error occurred while getting the sub-task: " + error;
        }
    }
    public getSubTasks = async (taskInfoId: number) => {
        try {
            const subTask = await SubTask.findAll({ where: { taskInfoId: taskInfoId } });
            return Promise.all(subTask.map(async (subTask) => {
                return {
                    id: subTask.id,
                    taskInfoId: subTask.taskInfoId,
                    title: subTask.title,
                    description: subTask.description,
                    status: subTask.status,
                    assignedBy: await this.groupUserController.getUserByGroupUserId(subTask.assignedBy as number)
                }
            }))
        } catch (error) {
            return "An error occurred while getting the sub-task ID: " + error;
        }
    }
}

export default SubTaskController;