import TaskAffilation from "../models/task-affilation";
import GroupUserController from "./group-user";
import { v4 as uuidv4 } from 'uuid';

import {UserInfo} from "../types/group-user";

class TaskAffilationController {
    public groupUserController = new GroupUserController();
    public createTable = async () => {
        TaskAffilation.sync({ alter: true })
            .then(() => {
                console.log('Task Affilation table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the Task Affilation table:', error);
            });
    }
    public addTaskAffilation = async (taskInfoId: number, groupUserId: number) => {
        try{
            await TaskAffilation.create({
                id: uuidv4(),
                taskInfoId: taskInfoId,
                groupUserId: groupUserId
            });
            return "New task affilation created!";
        }
        catch(error){
            return "An error occurred while creating a new task affilation: " + error;
        }
    }
    public getTaskAffilation = async (taskInfoId: number) => {
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

            return {
                message: "Task affilation retrieved successfully",
                data: usersInfo
            };
        }
        catch(error){
            return "An error occurred while getting task affilation: " + error;
        }
    }
    
    
}

export default TaskAffilationController;