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
        const id = uuidv4();
        try{
            const newTask = await Task.create({
                id: id,
                task: name
            });
            return "New task created: " + newTask.task;
        }
        catch(error){
            return "An error occurred while creating a new task: " + error;
        }
    }
    
}

export default TaskController;