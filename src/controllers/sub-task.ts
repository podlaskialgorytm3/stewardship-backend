import SubTask from '../models/sub-task';
import TaskAffilation from '../models/task-affilation';
import GroupUser from '../models/group-user';

import GroupUserController from './group-user';
import { SubtaskCreation } from '../types/task';
import { v4 as uuidv4 } from 'uuid';
import { SubtaskUpdate } from '../types/sub-task';

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
    public createSubTask = async (subtask: SubtaskCreation, groupUserId: string, taskInfoId: string) => {
        const subTaskId = uuidv4();
        try {
            await SubTask.create({
                id: subTaskId,
                taskInfoId: taskInfoId,
                title: subtask.title,
                description: subtask.description,
                status: subtask.status,
                assignedBy: groupUserId
            });
            return {
                message: "Sub-task created successfully",
                type: "success"
            }
        } catch (error) {
            return {
                message: "An error occurred while creating a new sub-task: " + error,
                type: "error"
            };
        }
    }
    public getSubTask = async (subTaskId: string) => {
        try {
            const subTask = await SubTask.findByPk(subTaskId);
            if (!subTask) {
                return {
                    message: "Sub-task not found",
                    type: "info"
                }
            }
            return {
                message: "Sub-task found",
                type: "success",
                data: {
                    id: subTask?.id,
                    taskInfoId: subTask?.taskInfoId,
                    title: subTask?.title,
                    description: subTask?.description,
                    status: subTask?.status,
                    assignedBy: await this.groupUserController.getUserByGroupUserId(subTask?.assignedBy as string) 
                }
            }
        } catch (error) {
            return {
                message: "An error occurred while getting the sub-task ID: " + error,
                type: "error"
            }
        }
    }
    public getSubTasks = async (taskInfoId: string) => {
        try {
            const subTask = await SubTask.findAll({ where: { taskInfoId: taskInfoId } });
            return Promise.all(subTask.map(async (subTask) => {
                return {
                    id: subTask.id,
                    taskInfoId: subTask.taskInfoId,
                    title: subTask.title,
                    description: subTask.description,
                    status: subTask.status,
                    assignedBy: await this.groupUserController.getUserByGroupUserId(subTask.assignedBy as string)
                }
            }))
        } catch (error) {
            return {
                message: "An error occurred while getting the sub-tasks: " + error,
                type: "error"
            }
        }
    }
    public precentOfDoneSubtask = async (taskInfoId: string) => {
        try{
            const doneSubtask = await SubTask.findAll({
                where: {
                    status: "done",
                    taskInfoId: taskInfoId
                }
            })
            const allSubtask = await SubTask.findAll({
                where: {
                    taskInfoId: taskInfoId
                }
            })
            return Math.round((doneSubtask.length / allSubtask.length) * 100) + "%";
        }
        catch(error){
            return null;
        }
    }
    public deleteSubTaskByTaskInfoId = async (taskInfoId: string) => {
        try{
            await SubTask.destroy({ where: { taskInfoId: taskInfoId } });
            return {
                message: "Sub-task deleted successfully",
                type: "success"
            }
        }
        catch(error){
            return {
                message: "An error occurred while deleting the sub-task: " + error,
                type: "error"
            }
        }
    }
    public deleteSubTask = async ({subtaskId, token} : {subtaskId: string, token: string}) => {
        try{
            const creatorOfSubtask = await this.getCreatorOfSubtask({subTaskId: subtaskId} as {subTaskId: string});
            const groupId = await this.getGroupIdBySubtaskId({subTaskId: subtaskId}) as string; 
            const isAdmin = await this.groupUserController.isAdminOfGroup(token, groupId);
            const member = await this.groupUserController.getUserByTokenGroup(token, groupId) as {id: string, role: string};

            if(creatorOfSubtask !== member.id || !isAdmin){
                return {
                    type: "error",
                    message: "You are not authorized to delete this sub-task"
                }
            }
            else{
                await SubTask.destroy({ where: { id: subtaskId } });
                return {
                    type: "success",
                    message: "Sub-task deleted successfully"
                }
            }
        }
        catch(error){
            return  {
                type: "error",
                message: "An error occurred while deleting the sub-task: " + error
            }
        }
    }



    public updateSubtask = async ({subtask, subtaskId, token} : {subtask: SubtaskUpdate, subtaskId: string, token: string}) => {
        try{
            const creatorOfSubtask = await this.getCreatorOfSubtask({subTaskId: subtaskId} as {subTaskId: string});
            const groupId = await this.getGroupIdBySubtaskId({subTaskId: subtaskId}) as string; 
            const isAdmin = await this.groupUserController.isAdminOfGroup(token, groupId);
            const member = await this.groupUserController.getUserByTokenGroup(token, groupId) as {id: string, role: string};

            if(creatorOfSubtask !== member.id || !isAdmin){
                return {
                    message: "You are not authorized to update this sub-task",
                    type: "error"
                }
            }
            else{
                await SubTask.update({
                    title: subtask.title,
                    description: subtask.description,
                }, { where: { id: subtaskId } });
                return {
                    message: "Sub-task updated successfully",
                    type: "success"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while updating the sub-task: " + error,
                type: "error"
            }
        }
    }
    
    public getGroupIdBySubtaskId= async ({subTaskId}: {subTaskId: string}) => {
        try{
            const groupUser = await GroupUser.findOne({
                where: {
                    id: await this.getGroupUserIdBySubtaskId({subTaskId: subTaskId} as {subTaskId: string})
                },
                attributes: ['groupId']
            });
            return groupUser?.groupId;
        }
        catch(error){
            return null;
        }
    }
    private getTaskIdBySubtaskId = async ({subTaskId}: {subTaskId: string}) => {
        try{
            const subTask = await SubTask.findByPk(subTaskId);
            return subTask?.taskInfoId as string;
        }
        catch(error){
            return null;
        }
    }
    private getGroupUserIdBySubtaskId = async ({subTaskId}: {subTaskId: string}) => {
        try{
            const taskAffilation = await TaskAffilation.findOne({
                where: {
                    taskInfoId: await this.getTaskIdBySubtaskId({subTaskId: subTaskId} as {subTaskId: string})
                }
            });
            return taskAffilation?.groupUserId;
        }
        catch(error){
            return null;
        }
    }
    private getCreatorOfSubtask = async ({subTaskId}: {subTaskId: string}) => {
        try{
            const subTask = await SubTask.findByPk(subTaskId);
            return subTask?.assignedBy as string;
        }
        catch(error){
            return null;
        }
    }


    public changeStatus = async ({subtaskId, status} : {subtaskId: string, status: string}) => {
        try{
            await SubTask.update({
                status: status
            }, { where: { id: subtaskId } });
            return {
                message: "Sub-task status updated successfully",
                type: "success"
            }
        }
        catch(error){
            return {
                message: "An error occurred while updating the sub-task status: " + error,
                type: "error"
            }
        }
    }
}

export default SubTaskController;