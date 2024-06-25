import WorkingHours from "../models/working-hours";
import { WorkingHoursInterface } from "../types/working-hours";
import { v4 as uuidv4 } from 'uuid';

class WorkingHoursController {
    public createTable = async () => {
        WorkingHours.sync({ alter: true })
            .then(() => {
                console.log('WorkingHours table has been synchronized');
            })
            .catch((error) => {
                console.error('An error occurred while synchronizing the WorkingHours table:', error);
            });
    }
    public addWorkingHours = async (workingHoursData: WorkingHoursInterface, groupUserId: number) => {
        try{
            const id = uuidv4();
            console.log(
                (workingHoursData.end.getTime() - workingHoursData.start.getTime()) / 3600000
            )
            await WorkingHours.create({
                id: id,
                groupUserId: groupUserId,
                start: workingHoursData.start,
                end: workingHoursData.end,
                totalHours: (workingHoursData.end.getTime() - workingHoursData.start.getTime()) / 3600000
            });
            return "Working hours added successfully";
        }
        catch(error){
            throw "An error occurred while adding working hours: " + error;
        }
    }
}

export default WorkingHoursController;