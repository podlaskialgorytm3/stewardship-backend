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
            if (!subTask) {
                return "Sub-task not found";
            }
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
    public deleteSubTaskByTaskInfoId = async (taskInfoId: number) => {
        try{
            await SubTask.destroy({ where: { taskInfoId: taskInfoId } });
            return "Sub-task deleted successfully";
        }
        catch(error){
            return "An error occurred while deleting the sub-task: " + error;
        }
    }
    public deleteSubTask = async (subTaskId: number,groupUserId: number) => {
        try{
            const subTask = await SubTask.findByPk(subTaskId);
            if(subTask?.assignedBy !== groupUserId){
                return "You are not authorized to delete this sub-task";
            }
            else{
                await SubTask.destroy({ where: { id: subTaskId } });
                return "Sub-task deleted successfully";
            }
        }
        catch(error){
            return "An error occurred while deleting the sub-task: " + error;
        }
    }
    public updateSubTask = async (subTaskId: number, subTaskData: SubTaskCreation, groupUserId: number) => {
        try{
            const subTask = await SubTask.findByPk(subTaskId);
            if(subTask?.assignedBy !== groupUserId){
                return "You are not authorized to update this sub-task";
            }
            else{
                await SubTask.update({
                    title: subTaskData.title,
                    description: subTaskData.description,
                    status: subTaskData.status
                }, { where: { id: subTaskId } });
                return "Sub-task updated successfully";
            }
        }
        catch(error){
            return "An error occurred while updating the sub-task: " + error;
        }
    }
    public changeStatus = async (subTaskId: number, status: string) => {
        try{
            await SubTask.update({
                status: status
            }, { where: { id: subTaskId } });
            return "Sub-task status updated successfully";
        }
        catch(error){
            return "An error occurred while updating the sub-task status: " + error;
        }
    }
}

export default SubTaskController;