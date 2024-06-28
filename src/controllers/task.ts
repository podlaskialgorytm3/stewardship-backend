import Task from "../models/task";
import { v4 as uuidv4 } from 'uuid';

class TaskController {
    public createTable = async () => {
        Task.sync({ alter: true })
            .then(() => {
                console.log('Task table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the Task table:', error);
            });
    }
    public createTask = async (name: string) => {
        const tasks = await Task.findAll({attributes: ['task']})
        try{
            if(tasks.some((task) => task.task === name)){
                return {
                    message: "Task already exists",
                    type: "info"
                }
            }
            else{
                await Task.create({id: uuidv4(), task: name});
                return {
                    message: "Task created successfully",
                    type: "success"
                }
            }
        }
        catch(error){
            return {
                message: "An error occurred while creating task: " + error,
                type: "error"
            }
        }
    }
    public getTasksByName = async (name: string) => {
        try{
            const tasks = await Task.findAll();
            return {
                message: "Tasks retrieved successfully",
                data: tasks.filter((task) => task.task.includes(name))
            }
        }
        catch(error){
            return {
                message: "An error occurred while getting tasks: " + error,
                type: "error"
            }
        }
    }
    public getTaskById = async (id: number) => {
        try{
            if(!await Task.findByPk(id)){
                return "Task does not exist";
            }
            return await Task.findByPk(id);
        }
        catch(error){
            return "An error occurred while getting task: " + error;
        }
    }
}

export default TaskController;