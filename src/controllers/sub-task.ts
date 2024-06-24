import SubTask from '../models/sub-task';
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
}

export default SubTaskController;