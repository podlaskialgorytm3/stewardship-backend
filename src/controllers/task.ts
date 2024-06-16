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
                return "Task already exists";
            }
            else{
                await Task.create({id: uuidv4(), task: name});
                return "Task created successfully";
            }
        }
        catch(error){
            return "An error occurred while creating a new task: " + error;
        }
    }
    public getTasksByName = async (name: string) => {
        try{
            const tasks = await Task.findAll();
            return tasks.filter((task) => task.task.includes(name));
        }
        catch(error){
            return "An error occurred while getting tasks: " + error;
        }
    }
}

export default TaskController;