import WorkingHoursModal from "../models/working-hours";
import { v4 as uuidv4 } from 'uuid';

class WorkingHoursController {
    public createTable = async () => {
        WorkingHoursModal.sync({ alter: true })
            .then(() => {
                console.log('WorkingHours table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the WorkingHours table:', error);
            });
    }
}

export default WorkingHoursController;