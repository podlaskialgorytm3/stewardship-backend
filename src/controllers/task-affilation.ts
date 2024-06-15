import TaskAffilation from "../models/task-affilation";
import { v4 as uuidv4 } from 'uuid';

class TaskAffilationController {
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
    
}

export default TaskAffilationController;