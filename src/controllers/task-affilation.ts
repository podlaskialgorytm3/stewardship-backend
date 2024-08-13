import TaskAffilation from "../models/task-affilation";
import GroupUserController from "./group-user";
import TaskInfoController from "./task-info";
import { v4 as uuidv4 } from 'uuid';

import { Member } from "../types/member";

class TaskAffilationController {
    public groupUserController = new GroupUserController();
    public taskInfoController = new TaskInfoController();
    public createTable = async () => {
        TaskAffilation.sync({ alter: true })
            .then(() => {
                console.log('Task Affilation table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the Task Affilation table:', error);
            });
    }
    public addTaskAffilation = async (taskInfoId: string, groupUserId: string, role: string) => {
        try{
            const taskAffilationId = uuidv4();
            if(role !== "admin"){
                return {
                    message: "You are not authorized to create task affilation",
                    type: "info"
                }
            }
            else{
                const isTaskAffilation = await TaskAffilation.findOne({
                    where: {
                        taskInfoId,
                        groupUserId
                    }
                });
                if(isTaskAffilation) return {
                    message: "Task affilation already exists",
                    type: "info"
                }
                await TaskAffilation.create({
                    id: taskAffilationId,
                    taskInfoId: taskInfoId,
                    groupUserId: groupUserId
                });
                return {
                    message: "New task affilation created!",
                    type: "success"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while creating a new task affilation: " + error,
                type: "error"
            }
        }
    }
    public getTaskAffilation = async (taskInfoId: string) => {
        try{
            const taskAffilations = await TaskAffilation.findAll({
                where: {
                    taskInfoId
                }
            });

            const groupUsersId = taskAffilations.map((taskAffilation) => taskAffilation.groupUserId)

            const usersInfo = await Promise.all(groupUsersId.map(async (groupUserId) => {
                const userInfo = await this.groupUserController.getUserByGroupUserId(groupUserId);
                return userInfo;
            }))

            return usersInfo
            
        }
        catch(error){
            return {
                message: "An error occurred while fetching task affilation: " + error,
                type: "error"
            }
        }
    }
    private getMembersOffTask = async ({taskInfoId} : {taskInfoId: string}) => {
        try{
            const groupId = await this.taskInfoController.getGroupIdByTaskInfoId({taskInfoId}) as string;
            const groupUsers = await this.groupUserController.getUsersByGroupId({groupId}) as Member[];
            const membersOfTasks = await this.getTaskAffilation(taskInfoId) as Member[];
            return groupUsers.filter((groupUser) => !membersOfTasks.includes(groupUser));
        }   
        catch(error){
            return null;
        }
    }
    public searchMembersAddedToTask = async ({taskInfoId, username} : {taskInfoId: string, username: string}) => {
        try{
            const members = await this.getTaskAffilation(taskInfoId) as Member[];
            return members.filter((member) => username.includes(member.name));
        }
        catch(error){
            return {
                message: "An error occurred while searching task affilation: " + error,
                type: "error"
            }
        }
    }
    public searchMembersOffTask = async ({taskInfoId, username} : {taskInfoId: string, username: string}) => {
        try{
            const members = await this.getMembersOffTask({taskInfoId}) as Member[];
            return members.filter((member) => username.includes(member.name));
        }
        catch(error){
            return {
                message: "An error occurred while searching task affilation: " + error,
                type: "error"
            }
        }
    }

    public deleteTaskAffilation = async (taskInfoId: string, groupUserId: string, role: string) => {
        try{
            if(role !== "admin"){
                return {
                    message: "You are not authorized to delete task affilation",
                    type: "info"
                }
            }
            else{
                await TaskAffilation.destroy({
                    where: {
                        taskInfoId,
                        groupUserId
                    }
                });
                return {
                    message: "Task affilation deleted successfully!",
                    type: "success"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while deleting task affilation: " + error,
                type: "error"
            }
        }
    }
    public deleteTaskAffilationByTaskInfoId = async (taskInfoId: string, role: string) => {
        try{
            if(role !== "admin"){
                return {
                    message: "You are not authorized to delete task affilation",
                    type: "info"
                }
            }
            else{
                await TaskAffilation.destroy({
                    where: {
                        taskInfoId
                    }
                });
                return {
                    message: "Task affilation deleted successfully!",
                    type: "success"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while deleting task affilation: " + error,
                type: "error"
            }
        }
    }
    public deleteTaskAffilationByGroupUserId = async (groupUserId: string) => {
        try{
            await TaskAffilation.destroy({
                where: {
                    groupUserId
                }
            });
        }
        catch(error){
            return null;
        }
    }
    public getTaskInfoIds =  async (groupUserId: string) => {
        try{
            const taskAffilations = await TaskAffilation.findAll({
                where: {
                    groupUserId
                }
            });
            const taskInfoIds = taskAffilations.map((taskAffilation) => taskAffilation.taskInfoId);
            return taskInfoIds;
        }
        catch(error){
            return null;
        }
    }
}

export default TaskAffilationController;