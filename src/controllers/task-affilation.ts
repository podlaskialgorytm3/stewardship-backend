import TaskAffilation from "../models/task-affilation";
import GroupUserController from "./group-user";
import { v4 as uuidv4 } from 'uuid';

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

            return {
                message: "Task affilation fetched successfully",
                type: "success",
                data: usersInfo
            }
        }
        catch(error){
            return {
                message: "An error occurred while fetching task affilation: " + error,
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
    
    
}

export default TaskAffilationController;