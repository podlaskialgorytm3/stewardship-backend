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
    public addTaskAffilation = async (taskInfoId: number, groupUserId: number, role: string) => {
        try{
            if(role !== "admin"){
                return "You are not authorized to create a new task affilation";
            }
            else{
                const isTaskAffilation = await TaskAffilation.findOne({
                    where: {
                        taskInfoId,
                        groupUserId
                    }
                });
                if(isTaskAffilation) return "Task affilation already exists!";
                await TaskAffilation.create({
                    id: uuidv4(),
                    taskInfoId: taskInfoId,
                    groupUserId: groupUserId
                });
                return "New task affilation created!";
            }
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

            return usersInfo
        }
        catch(error){
            return "An error occurred while getting task affilation: " + error;
        }
    }
    public deleteTaskAffilation = async (taskInfoId: number, groupUserId: number, role: string) => {
        try{
            if(role !== "admin"){
                return "You are not authorized to delete task affilation";
            }
            else{
                await TaskAffilation.destroy({
                    where: {
                        taskInfoId,
                        groupUserId
                    }
                });
                return "Task affilation deleted successfully!";
            }
        }
        catch(error){
            return "An error occurred while deleting task affilation: " + error;
        }
    }
    
    
}

export default TaskAffilationController;