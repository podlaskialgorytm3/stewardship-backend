import SubTask from '../models/sub-task';
import { SubTaskCreation } from '../types/sub-task';
import { v4 as uuidv4 } from 'uuid';

class SubTaskController {
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
            const subTask = await SubTask.create({
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
}

export default SubTaskController;